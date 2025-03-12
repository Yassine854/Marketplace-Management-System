import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("📥 Requête reçue");

    const { comment } = await req.json();
    console.log("📝 Commentaire reçu:", comment);

    if (!comment) {
      console.error("⚠️ Aucun commentaire reçu !");
      return NextResponse.json(
        { message: "Commentaire vide" },
        { status: 400 },
      );
    }

    const dirPath = path.join(process.cwd(), "public/data");
    const filePath = path.join(dirPath, "comments.json");

    console.log("📂 Vérification du dossier:", dirPath);
    if (!fs.existsSync(dirPath)) {
      console.log("📂 Dossier introuvable, création...");
      fs.mkdirSync(dirPath, { recursive: true });
    }

    console.log("📂 Chemin du fichier JSON:", filePath);
    if (!fs.existsSync(filePath)) {
      console.log("❌ Fichier JSON introuvable, création...");
      fs.writeFileSync(filePath, JSON.stringify([])); // Créer un fichier JSON vide
    }

    let comments = [];
    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      comments = JSON.parse(fileData);

      if (!Array.isArray(comments)) {
        console.warn(
          "⚠️ Le fichier JSON ne contient pas un tableau. Réinitialisation...",
        );
        comments = [];
      }
    } catch (error) {
      console.error("❌ Erreur de lecture du fichier JSON:", error);
      return NextResponse.json(
        { message: "Erreur de lecture du fichier" },
        { status: 500 },
      );
    }

    comments.push({ id: Date.now(), text: comment });

    try {
      fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    } catch (error) {
      console.error("❌ Erreur d'écriture du fichier JSON:", error);
      return NextResponse.json(
        { message: "Erreur d'écriture du fichier" },
        { status: 500 },
      );
    }

    console.log("✅ Commentaire enregistré avec succès !");
    return NextResponse.json(
      { message: "Comment saved!", comments },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Erreur inattendue API:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
