"use client";

import styles from "./Claim.module.css";
import { useState } from "react";
import { Claim } from "@/database/queries.ts";
import { updateClaimTag } from "@/app/actions/updateClaimTag";

interface ClaimProps {
  claim: Claim;
  isSelected: boolean;
  onClick: () => void;
  onTagClick?: (tag: string) => void;
  onTagUpdate?: (claimId: number, tag: string) => void;
}

export default function ClaimComponent({
  claim,
  isSelected,
  onClick,
  onTagClick,
  onTagUpdate,
}: ClaimProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [autoTag, setAutoTag] = useState<string | null>(claim.tag || null);

  const handleAutoTag = async () => {
    setIsLoading(true);

    try {
      // 1️⃣ Appel POST vers l'API FastAPI
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_claim: claim.content }),
      });

      const data = await res.json();

      if (data.prediction) {
        setAutoTag(data.prediction);

        // 2️⃣ Mise à jour côté parent
        if (onTagUpdate) onTagUpdate(claim.id, data.prediction);

        // 3️⃣ Mise à jour DB via votre API Next.js
        await updateClaimTag(claim.id, data.prediction);
      } else {
        setAutoTag("erreur");
        console.error("Erreur API FastAPI :", data.error);
      }
    } catch (err) {
      console.error("Erreur fetch API FastAPI :", err);
      setAutoTag("erreur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className={styles.content}>
        <p className={styles.text}>{claim.content}</p>

        {autoTag && (
          <button
            className={styles.tag}
            onClick={(e) => {
              e.stopPropagation();
              if (onTagClick) onTagClick(autoTag);
            }}
          >
            {autoTag}
          </button>
        )}

        <button onClick={handleAutoTag} disabled={isLoading}>
          {isLoading ? "Analyse..." : "Auto-taguer"}
        </button>
      </div>
    </div>
  );
}
