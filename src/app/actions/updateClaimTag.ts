"use server";

import { setClaimTag } from "@/database/queries.ts";

/**
 * Met à jour le tag d'une réclamation dans la base de données.
 * @param claimId - ID de la réclamation
 * @param tag - Nouveau tag
 */
export async function updateClaimTag(claimId: number, tag: string) {
  if (!tag) throw new Error("Tag is required");
  if (isNaN(claimId)) throw new Error("Invalid claim ID");

  try {
    await setClaimTag(claimId, tag);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tag :", error);
    throw error;
  }
}
