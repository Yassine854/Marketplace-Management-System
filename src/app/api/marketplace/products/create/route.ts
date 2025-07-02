import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new product
export async function POST(req: Request) {
  try {
    //Session Authorization
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    //Permission Check
    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      userType?: string;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Product" },
          { status: 403 },
        );
      }
    }

    // 🟢 Handle FormData instead of req.json()
    const formData = await req.formData();

    const existingData = await prisma.product.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Product",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Product",
          },
        });
      }
    }

    const barcode = formData.get("barcode") as string | null;
    if (barcode) {
      // Use findFirst instead of findUnique since barcode is no longer a unique field
      const existingProduct = await prisma.product.findFirst({
        where: { barcode },
      });

      if (existingProduct) {
        return NextResponse.json(
          { message: "Barcode already exists" },
          { status: 400 },
        );
      }
    }

    // Check if SKU already exists
    const sku = formData.get("sku") as string;
    if (sku) {
      const existingProductWithSku = await prisma.product.findUnique({
        where: { sku },
      });

      if (existingProductWithSku) {
        return NextResponse.json(
          { message: "SKU already exists" },
          { status: 400 },
        );
      }
    }

    // Validate required fields
    const requiredFields = [
      { key: "sku", label: "SKU" },
      { key: "name", label: "Product Name" },
      { key: "price", label: "Price" },
      { key: "brandId", label: "Brand" },
      { key: "supplierId", label: "Manufacturer" },
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field.key),
    );
    // Activities is an array
    const activities = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("activities["))
      .map(([_, value]) => value as string);
    if (activities.length === 0) {
      missingFields.push({ key: "activities", label: "Product Activity" });
    }
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: " +
            missingFields.map((f) => f.label).join(", "),
        },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const randomComponent = Math.floor(Math.random() * 1000000);
    const uniqueProductId = parseInt(`${timestamp}${randomComponent}`);

    let accepted = true;
    let hasPartner = false;
    let partnerId;

    if (user.userType === "partner") {
      accepted = false;
      hasPartner = true;
      partnerId = user.id;
    }

    const newProduct = await prisma.product.create({
      data: {
        product_id: uniqueProductId,
        name: formData.get("name") as string,
        barcode: (formData.get("barcode") as string) || "", // Use empty string instead of null
        sku: sku,
        price: parseFloat(formData.get("price") as string),
        special_price: parseFloat(formData.get("special_price") as string),
        cost: formData.get("cost")
          ? parseFloat(formData.get("cost") as string)
          : null,
        stock: parseInt(formData.get("stock") as string),
        promo: formData.get("promo") === "true",
        minimumQte: formData.get("minimumQte")
          ? parseInt(formData.get("minimumQte") as string)
          : null,
        maximumQte: formData.get("maximumQte")
          ? parseInt(formData.get("maximumQte") as string)
          : null,
        sealable: formData.get("sealable")
          ? parseInt(formData.get("sealable") as string)
          : null,
        alertQte: formData.get("alertQte")
          ? parseInt(formData.get("alertQte") as string)
          : null,
        loyaltyPointsPerProduct: formData.get("loyaltyPointsPerProduct")
          ? parseFloat(formData.get("loyaltyPointsPerProduct") as string)
          : null,
        loyaltyPointsPerUnit: formData.get("loyaltyPointsPerUnit")
          ? parseFloat(formData.get("loyaltyPointsPerUnit") as string)
          : null,
        loyaltyPointsBonusQuantity: formData.get("loyaltyPointsBonusQuantity")
          ? parseInt(formData.get("loyaltyPointsBonusQuantity") as string)
          : null,
        loyaltyPointsThresholdQty: formData.get("loyaltyPointsThresholdQty")
          ? parseInt(formData.get("loyaltyPointsThresholdQty") as string)
          : null,
        pcb: formData.get("pcb") as string,
        weight: formData.get("weight")
          ? parseFloat(formData.get("weight") as string)
          : null,
        description: formData.get("description")
          ? (formData.get("description") as string)
          : null,
        typePcbId: formData.get("typePcbId") as string,
        productTypeId: formData.get("productTypeId") as string,
        productStatusId: formData.get("productStatusId") as string,
        supplierId: formData.get("supplierId") as string,
        taxId: formData.get("taxId") as string,
        promotionId:
          formData.get("promo") === "true" && formData.get("promotionId")
            ? (formData.get("promotionId") as string)
            : null,
        brandId: (formData.get("brandId") as string) || null,
        accepted: accepted,
        partnerId: partnerId,
        hasPartner: hasPartner,
        // Get activities from formData
        activities: Array.from(formData.entries())
          .filter(([key]) => key.startsWith("activities["))
          .map(([_, value]) => value as string),
      },
    });

    // Create notification for admin if product is added by a partner
    if (partnerId) {
      await prisma.notification.create({
        data: {
          title: "New Product Pending Approval",
          message: `A new product "${newProduct.name}" has been added by partner "${user.username}" and is waiting for approval.`,
          isRead: false,
          link: "/marketplace/products/PendingProducts",
          recipientType: "admin",
          partnerId: null,
        },
      });
    }

    // Return the product data immediately
    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A product with this SKU or barcode already exists" },
          { status: 400 },
        );
      }
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            error:
              "Invalid reference to related entity (supplier, category, etc.)",
          },
          { status: 400 },
        );
      }
      if (error.message.includes("Required")) {
        return NextResponse.json(
          { error: "Missing required fields. Please check your input." },
          { status: 400 },
        );
      }
    }

    // Log the full error for debugging
    console.error("Full error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });

    return NextResponse.json(
      {
        error:
          "Failed to create product. Please check your input and try again.",
      },
      { status: 500 },
    );
  }
}
