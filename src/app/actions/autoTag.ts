"use server";

export async function getAutoTag(text: string): Promise<string> {
  try {
    const prompt = `
Analyse le message suivant et renvoie un seul mot ou une courte étiquette décrivant sa catégorie.
Exemple : "Le colis est arrivé endommagé" → "dommage".
Message : "${text}"
    `;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant qui crée des tags courts et pertinents.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Mistral:", errorText);
      return "erreur";
    }

    const data = await response.json();
    const tag = data.choices?.[0]?.message?.content?.trim() || "inconnu";
    return tag;
  } catch (error) {
    console.error("Erreur Mistral:", error);
    return "erreur";
  }
}
