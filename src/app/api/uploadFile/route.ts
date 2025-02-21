import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier fourni" },
        { status: 400 },
      );
    }

    // Sanitize filename
    const originalFileName = file.name;
    const sanitizedFileName = originalFileName
      .replace(/[^a-zA-Z0-9_.-]/g, "")
      .toLowerCase();
    const finalFileName = `${Date.now()}-${sanitizedFileName}`;

    // Setup directories
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, finalFileName);
    fs.writeFileSync(filePath, buffer);

    // DB entry
    const dbFile = await prisma.file.create({
      data: { url: `/uploads/${finalFileName}` },
    });

    return NextResponse.json({
      success: true,
      fileId: dbFile.id,
      fileName: finalFileName,
      url: dbFile.url,
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ message: "Échec de l'upload" }, { status: 500 });
  }
}
