// A rough speech plan for a line: when each word is spoken inside the VO file.
// Used for placeholder lip-sync (8 Hz flaps that pause at commas and "...") and to time
// subtitle chunks to the speech (with or without the real recording).

export type Word = { word: string; start: number; end: number };

const pauseAfter = (w: string): number => (w.endsWith('...') ? 0.55 : /[.?!]$/.test(w) ? 0.38 : w.endsWith(',') ? 0.28 : 0.06);

/** Seconds relative to the start of the VO file. Files start and end with ~0.3 s of silence. */
export const planSpeech = (text: string, duration: number, lead = 0.3, tail = 0.3): Word[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 1.5);
  const pauses = words.map((w, i) => (i === words.length - 1 ? 0 : pauseAfter(w)));
  const avail = Math.max(0.5, duration - lead - tail);
  const pauseTotal = pauses.reduce((a, b) => a + b, 0);
  const wordTotal = weights.reduce((a, b) => a + b, 0);
  // Keep pauses natural; if the line is too tight, squeeze the pauses as well.
  const pScale = pauseTotal > avail * 0.45 ? (avail * 0.45) / pauseTotal : 1;
  const wScale = (avail - pauseTotal * pScale) / wordTotal;
  let t = lead;
  return words.map((word, i) => {
    const start = t;
    const end = start + weights[i] * wScale;
    t = end + pauses[i] * pScale;
    return { word, start, end };
  });
};

/** Placeholder mouth: opens and closes at ~8 Hz while a word is spoken, closed in pauses. */
export const placeholderMouth = (plan: Word[], t: number) => {
  const w = plan.find((p) => t >= p.start && t <= p.end);
  if (!w) return 0;
  const phase = (t - w.start) * 8;
  const flap = 0.5 - 0.5 * Math.cos(phase * 2 * Math.PI);
  const edge = Math.min(1, (t - w.start) / 0.05, (w.end - t) / 0.05);
  return flap * 0.75 * edge;
};

/** Time each subtitle chunk to the words it contains. Returns [start, end) in seconds. */
export const chunkTimes = (plan: Word[], chunks: readonly string[], duration: number) => {
  const out: { text: string; start: number; end: number }[] = [];
  let wi = 0;
  chunks.forEach((text) => {
    const n = text.split(/\s+/).filter(Boolean).length;
    const first = plan[wi];
    const last = plan[Math.min(plan.length - 1, wi + n - 1)];
    out.push({ text, start: first.start - 0.1, end: last.end });
    wi += n;
  });
  // Each chunk stays up until the next one; the last one until the file ends.
  for (let i = 0; i < out.length; i++) out[i].end = i + 1 < out.length ? out[i + 1].start : Math.max(out[i].end + 0.4, duration - 0.1);
  return out;
};
