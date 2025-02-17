import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser pour gérer le fichier manuellement
  },
};

// Fonction pour gérer l'upload de fichier via POST
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Méthode non autorisée" },
      { status: 405 },
    );
  }

  // Lire le FormData depuis la requête
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json(
      { message: "Aucun fichier fourni" },
      { status: 400 },
    );
  }

  // Obtenir le nom original du fichier
  const fileName = (formData.get("fileName") as string) || "uploaded-file";

  // Définir le dossier où stocker les fichiers
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Convertir Blob en Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Sauvegarder le fichier avec son nom et extension
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    message: "Fichier sauvegardé avec succès!",
    filePath,
  });
}
