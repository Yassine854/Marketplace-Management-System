import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reservation = await prisma.reservation.findUnique({
      where: { id: body.reservationId },
      include: {
        reservationItems: {
          include: {
            product: true,
            source: true,
            partner: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        {
          error: {
            message: `La réservation #${body.reservationId} est introuvable.`,
            code: "RESERVATION_NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    const stateName = body.isActive ? "new" : "canceled";
    const state = await prisma.state.findUnique({ where: { name: stateName } });

    if (!state) {
      return NextResponse.json(
        {
          error: {
            message: `L'état '${stateName}' n'existe pas.`,
            code: "STATE_NOT_FOUND",
          },
        },
        { status: 400 },
      );
    }

    let status = await prisma.status.findUnique({
      where: { name: "open", stateId: state.id },
    });

    if (!status) {
      status = await prisma.status.create({
        data: { name: "open", stateId: state.id },
      });
    }

    // Vérification supplémentaire pour s'assurer que le statut existe
    if (!status) {
      return NextResponse.json(
        {
          error: {
            message:
              "Impossible de créer ou trouver le statut 'open' pour la commande.",
            code: "STATUS_CREATION_FAILED",
          },
        },
        { status: 500 },
      );
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const orderItemsData = await Promise.all(
        reservation.reservationItems.map(async (item) => {
          if (item.sourceId) {
            const skuPartnerWhere: any = { productId: item.productId };
            if (item.partnerId) skuPartnerWhere.partnerId = item.partnerId;

            const stock = await tx.stock.findFirst({
              where: {
                skuPartner: skuPartnerWhere,
                sourceId: item.sourceId,
              },
              include: {
                skuPartner: true,
              },
            });
            console.log("stock", stock);
            if (!stock) {
              throw {
                type: "BUSINESS",
                code: "STOCK_NOT_FOUND",
                message: `Stock indisponible pour le produit '${
                  item.product.name
                }' (SKU: ${item.sku}) dans '${
                  item.source?.name || "source inconnue"
                }'.`,
              };
            }

            if (stock.sealable == null || stock.sealable < item.qteReserved) {
              throw {
                type: "BUSINESS",
                code: "STOCK_INSUFFICIENT",
                message: `Stock insuffisant pour '${item.product.name}' (${
                  item.sku
                }) à '${item.source?.name}'. Disponible: ${
                  stock.sealable ?? 0
                }, Requis: ${item.qteReserved}.`,
              };
            }

            await tx.stock.update({
              where: { id: stock.id },
              data: {
                sealable: {
                  decrement: item.qteReserved,
                },
              },
            });
          }

          const itemData: any = {
            qteOrdered: item.qteReserved,
            qteRefunded: 0,
            qteShipped: 0,
            qteCanceled: 0,
            weight: item.weight,
            sku: item.sku,
            product: { connect: { id: item.productId } },
            source: item.sourceId
              ? { connect: { id: item.sourceId } }
              : undefined,
            partner: item.partnerId
              ? { connect: { id: item.partnerId } }
              : undefined,
          };
          if (typeof item.discountedPrice === "number") {
            itemData.discountedPrice = item.discountedPrice;
          }
          return itemData;
        }),
      );

      const newOrder = await tx.order.create({
        data: {
          amountTTC: body.amountTTC,
          amountRefunded: body.amountRefunded || 0,
          amountCanceled: body.amountCanceled || 0,
          amountOrdered: body.amountOrdered,
          amountShipped: body.amountShipped || 0,
          shippingMethod: body.shippingMethod,
          shippingAmount: body.shippingAmount,
          loyaltyPtsValue: body.loyaltyPtsValue || 0,
          fromMobile: body.fromMobile,
          weight: body.weight,
          isActive: body.isActive,
          status: { connect: { id: status?.id } },
          state: { connect: { id: state.id } },
          paymentMethod: { connect: { id: body.paymentMethodId } },
          customer: { connect: { id: body.customerId } },
          reservation: body.reservationId
            ? { connect: { id: body.reservationId } }
            : undefined,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
        },
      });

      let vendorOrderPermission = await prisma.permission.findFirst({
        where: { resource: "VendorOrder" },
      });
      if (!vendorOrderPermission) {
        vendorOrderPermission = await prisma.permission.create({
          data: { resource: "VendorOrder" },
        });
      }
      // Find the KamiounPartnerMaster role
      const partnerMasterRole = await prisma.role.findFirst({
        where: { name: "KamiounPartnerMaster" },
      });
      if (partnerMasterRole && vendorOrderPermission) {
        // Check if the role already has this permission
        const existingRolePermission = await prisma.rolePermission.findFirst({
          where: {
            roleId: partnerMasterRole.id,
            permissionId: vendorOrderPermission.id,
          },
        });
        if (!existingRolePermission) {
          // Assign the permission to the role with 'read' and 'write' actions
          await prisma.rolePermission.create({
            data: {
              roleId: partnerMasterRole.id,
              permissionId: vendorOrderPermission.id,
              actions: ["read", "update", "delete"],
            },
          });
        }
      }

      // Create OrderPartner for each unique partnerId in orderItems
      const uniquePartnerIds = Array.from(
        new Set(
          newOrder.orderItems
            .map((item) => item.partnerId)
            .filter((id) => id !== null),
        ),
      );

      console.log("uniquePartnerIds", uniquePartnerIds);

      for (const partnerId of uniquePartnerIds) {
        // Get orderItems for this partner
        const partnerOrderItems = newOrder.orderItems.filter(
          (item) => item.partnerId === partnerId,
        );
        // Generate a unique orderCode (e.g., orderId-partnerId)
        const orderCode = `${newOrder.id}-${partnerId}`;
        // Always fetch state and status for each partner
        const orderPartnerState = await tx.state.findFirst({
          where: { name: "new" },
        });
        const orderPartnerStatus = orderPartnerState
          ? await tx.status.findFirst({
              where: { name: "open", stateId: orderPartnerState.id },
            })
          : null;

        console.log("partnerOrderItems", partnerOrderItems);
        console.log("orderPartnerState", orderPartnerState);
        console.log("orderPartnerStatus", orderPartnerStatus);
        const itemsSnapshot = partnerOrderItems.map((item) => ({
          id: item.id,
          sku: item.sku,
          qteOrdered: item.qteOrdered,
          qteRefunded: item.qteRefunded,
          qteShipped: item.qteShipped,
          qteCanceled: item.qteCanceled,
          weight: item.weight,
          discountedPrice: item.discountedPrice,
          productId: item.productId,
          sourceId: item.sourceId,
          partnerId: item.partnerId,
        }));

        // Generate next orderCode as CMD-<increment>
        const lastOrderPartner = await tx.vendorOrder.findMany({
          where: { orderCode: { startsWith: "CMD-" } },
          orderBy: { createdAt: "desc" },
          take: 1,
        });
        let nextOrderCode = "CMD-1";
        if (lastOrderPartner.length > 0) {
          const lastCode = lastOrderPartner[0].orderCode;
          if (lastCode) {
            const lastNumber = parseInt(lastCode.replace("CMD-", ""), 10);
            nextOrderCode = `CMD-${lastNumber + 1}`;
          }
        }

        try {
          await tx.vendorOrder.create({
            data: {
              orderCode: nextOrderCode,
              order: { connect: { id: newOrder.id } },
              partner: { connect: { id: partnerId as string } },
              state: orderPartnerState
                ? { connect: { id: orderPartnerState.id } }
                : undefined,
              status: orderPartnerStatus
                ? { connect: { id: orderPartnerStatus.id } }
                : undefined,
              itemsSnapshot,
            },
          });
        } catch (e) {
          console.error("Error creating OrderPartner:", e);
          // Optionally, re-throw the error to be caught by the transaction
          throw e;
        }
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        message: "Commande créée avec succès, les stocks ont été mis à jour.",
        order: newOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);

    if (
      typeof error === "object" &&
      error &&
      (error as any).type === "BUSINESS"
    ) {
      return NextResponse.json(
        {
          error: {
            message: (error as any).message,
            code: (error as any).code,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "Une erreur inattendue est survenue.",
          code: "INTERNAL_SERVER_ERROR",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
