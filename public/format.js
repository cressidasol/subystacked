// Turn Whisper chunks [{timestamp:[start,end], text}] into subtitle files.
const pad = (n, w = 2) => String(n).padStart(w, '0');

export function stamp(sec, sep = ',') {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms % 1000, 3)}`;
}

// Whisper can leave the last end null; fall back to next start or media duration.
export function toCues(chunks, duration = 0) {
  return chunks
    .map((c, i) => {
      const start = c.timestamp[0] ?? 0;
      const end = c.timestamp[1] ?? chunks[i + 1]?.timestamp[0] ?? Math.max(duration, start + 2);
      return { start, end, text: c.text.trim() };
    })
    .filter(c => c.text);
}

export const toSRT = cues =>
  cues.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n');

export const toVTT = cues =>
  'WEBVTT\n\n' + cues.map(c => `${stamp(c.start, '.')} --> ${stamp(c.end, '.')}\n${c.text}\n`).join('\n');

export const toTXT = cues => cues.map(c => c.text).join('\n') + '\n';
