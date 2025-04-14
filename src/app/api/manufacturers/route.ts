import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
  try {
    const manufacturers = await prisma.manufacturer.findMany();
    return NextResponse.json(
      manufacturers.map(
        (m: {
          manufacturerId: any;
          companyName: any;
          code: any;
          email: any;
          address: any;
          contactName: any;
          phoneNumber: any;
          postalCode: any;
          city: any;
          country: any;
          capital: any;
        }) => ({
          manufacturer_id: m.manufacturerId,
          company_name: m.companyName,
          code: m.code,
          email: m.email,
          address: m.address,
          contact_name: m.contactName,
          phone_number: m.phoneNumber,
          postal_code: m.postalCode,
          city: m.city,
          country: m.country,
          capital: m.capital,
        }),
      ),
    );
  } catch (error) {
    console.error("Erreur API manufacturers:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des fournisseurs" },
      { status: 500 },
    );
  }
}
