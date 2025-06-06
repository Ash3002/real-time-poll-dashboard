import { QuerySnapshot, DocumentData, Timestamp } from "firebase/firestore";

export function countVotes(
  snapshot: QuerySnapshot<DocumentData>,
  options: string[]
): { name: string; value: number }[] {
  // Initialize counts to zero
  const counts: Record<string, number> = {};
  options.forEach((opt) => {
    counts[opt] = 0;
  });
  // Count votes
  snapshot.docs.forEach((doc) => {
    const { choice } = doc.data() as { choice: string };
    if (counts.hasOwnProperty(choice)) {
      counts[choice]++;
    }
  });
  // Build array
  return options.map((opt) => ({
    name: opt,
    value: counts[opt] || 0,
  }));
}

export function formatRemainingTime(expiresAt: Timestamp): string {
  const now = new Date().getTime();
  const expiresMs = expiresAt.toDate().getTime();
  let delta = Math.floor((expiresMs - now) / 1000);
  if (delta < 0) delta = 0;
  const minutes = Math.floor(delta / 60);
  const seconds = delta % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
} 