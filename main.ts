// Make the AI Judge Laugh: the Office Joke Open — make.fun entry.
//
// The program writes one line to /output/entry.txt: a single funny sentence
// of at most 200 characters about office life. No network, no input,
// deterministic: the same joke every run.
//
// REVISION 1 — candidate: the office plant.
// Why this joke, against the judge's brief (most important first):
//   1. It IS about office life and IS a joke, not a complaint: a plant,
//      layoffs, CEOs, a merger, HR — every noun belongs to the office.
//   2. The laugh is earned by escalation plus a turn in the last four
//      words: the plant does not just survive, it gets promoted. The
//      payoff ("mentor the new hires") reframes everything before it.
//   3. The detail is specific: three rounds of layoffs, two CEOs, one
//      merger — a career history, for a plant.
//   4. It is fresh: the field is full of printers, meetings and reply-all
//      jokes; nobody's plant has been promoted to mentor anyone.
//   5. It reads cleanly in one pass at 127 of the 200 characters, and no
//      word can be cut without losing either the escalation or the payoff.
//
// Candidates weighed and set aside (kept in the session, not the entry):
//   - the lift ("be more visible" taken literally) — vivid, but the laugh
//     leans on creepiness rather than surprise;
//   - the laptop ("my boss believes the laptop") — clean twist, but the
//     out-of-office setup is a familiar one;
//   - the fridge lunch ("HR called it 'setting boundaries'") — good
//     payoff, but the threat label does the work, not the office detail.
//
// REVISION 2 — same joke, sharper payoff verb.
// Head-to-head, "asked it to mentor" vs "promoted it to mentor": the
// joke's spine is the plant's career — it outlasted layoffs, CEOs and a
// merger while humans came and went. "Promoted" completes that arc: the
// plant did not just get asked a favour, it got the promotion the humans
// wanted. One verb change, 124 to 127 characters, stronger last four words.
// The lift challenger ("be more visible" taken literally in the lift)
// loses the head-to-head: its payoff leans on creepiness, and "be more
// visible" is a familiar performance-review trope, where no other entry
// in the field is telling a plant joke at all.
//
// REVISION 3 — final verification pass.
// Ran the program twice and diffed /output/entry.txt: byte-identical both
// times, so the entry is deterministic. No further wording change: every
// alternative tested trades away either the escalation (the plant's three
// survivals), the career arc ("promoted"), or the last-four-words payoff.
// Final line, 127 characters, one sentence, single line.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

// One beat per job the line has to do, in reading order.
const BEATS: ReadonlyArray<{ role: string; text: string }> = [
  {
    role: "setup",
    text: "The office plant has survived three rounds of layoffs,",
  },
  {
    role: "escalation",
    text: "two CEOs and one merger,",
  },
  {
    role: "payoff",
    text: "so HR just promoted it to mentor the new hires.",
  },
];

const MAX_CHARS = 200;

function charCount(text: string): number {
  // Count characters as code points, so any non-ASCII would count once.
  return [...text].length;
}

function buildLine(): string {
  return BEATS.map((beat) => beat.text).join(" ");
}

function checkLine(text: string): void {
  // The gate: UTF-8 text of 1 to 200 characters, not only white space,
  // and a single sentence, as the brief requires.
  const chars = charCount(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`line must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("line must be a single line");
  }
  // A single sentence: exactly one sentence-ending mark, at the end.
  const terminators = text.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !text.endsWith(".")) {
    throw new Error("line must be exactly one sentence ending in a period");
  }
  // The last beat must be the payoff: the line may not trail off after it.
  const lastBeat = BEATS[BEATS.length - 1];
  if (!text.endsWith(lastBeat.text)) {
    throw new Error("line must end on its payoff beat");
  }
}

function main(): void {
  const line = buildLine();
  checkLine(line);
  for (const beat of BEATS) {
    console.log(`beat ${beat.role}: ${charCount(beat.text)} chars`);
  }
  console.log(`line: ${charCount(line)} chars`);
  console.log(line);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line, "utf8");
  chmodSync("/output/entry.txt", 0o644);
}

main();
