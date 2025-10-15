import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const claimData = await request.json();

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_claim: claimData.user_claim }),
    });

    if (!response.ok) {
      throw new Error("Erreur API Python");
    }

    const data = await response.json();

    return NextResponse.json({ prediction: data.prediction });
  } catch (error) {
    console.error("Erreur POST /predict:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la prédiction" },
      { status: 500 }
    );
  }
}
