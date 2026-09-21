"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import styles from "./Story.module.css";

type Page = {
  variant?: "title";
  paragraphs: string[];
  image: { src: string; width: number; height: number };
  audio: string;
};

const PAGES: Page[] = [
  {
    variant: "title",
    paragraphs: ["Little Nutbrown Hare, who was going to bed, held on tight to Big Nutbrown Hare’s very long ears."],
    image: { src: "/images/1.png", width: 1151, height: 959 },
    audio: "/audio/1.m4a",
  },
  {
    paragraphs: [
      "He wanted to be sure that Big Nutbrown Hare was listening.\n“Guess how much I love you,” he said.",
      "“Oh I don’t think I could guess that,”\nsaid Big Nutbrown Hare.",
    ],
    image: { src: "/images/3.png", width: 1192, height: 1342 },
    audio: "/audio/2.m4a",
  },
  {
    paragraphs: ["“This much,” said Little Nutbrown Hare, stretching out his arms as wide as they could go."],
    image: { src: "/images/4.png", width: 1192, height: 1084 },
    audio: "/audio/3.m4a",
  },
  {
    paragraphs: [
      "Big Nutbrown Hare had even longer arms. “But I love you this much,” he said.",
      "Hmm, that is a lot, thought Little Nutbrown Hare.",
    ],
    image: { src: "/images/5.png", width: 1192, height: 1405 },
    audio: "/audio/4.m4a",
  },
  {
    paragraphs: ["“I love you as high as I can reach,” said Little Nutbrown Hare."],
    image: { src: "/images/6.png", width: 936, height: 670 },
    audio: "/audio/5.m4a",
  },
  {
    paragraphs: ["“I love you as high as I can reach,” said Big Nutbrown Hare."],
    image: { src: "/images/7.png", width: 1192, height: 1462 },
    audio: "/audio/6.m4a",
  },
  {
    paragraphs: ["That is quite high, thought Little Nutbrown Hare. I wish I had arms like that."],
    image: { src: "/images/8.png", width: 1192, height: 1462 },
    audio: "/audio/7.m4a",
  },
  {
    paragraphs: ["Then Little Nutbrown Hare had a good idea. He tumbled upside down and reached up the tree trunk with his feet."],
    image: { src: "/images/9.png", width: 912, height: 1333 },
    audio: "/audio/8.m4a",
  },
  {
    paragraphs: ["“I love you all the way up my toes!” he said."],
    image: { src: "/images/10.png", width: 932, height: 1435 },
    audio: "/audio/9.m4a",
  },
  {
    paragraphs: ["“And I love you all the way up to your toes,” said Big Nutbrown Hare, swinging him up over his head."],
    image: { src: "/images/11.png", width: 1167, height: 1462 },
    audio: "/audio/10.m4a",
  },
  {
    paragraphs: ["“I love you as high as I can hop!” laughed Little Nutbrown Hare,"],
    image: { src: "/images/12.png", width: 1099, height: 1329 },
    audio: "/audio/11.m4a",
  },
  {
    paragraphs: ["bouncing up and down."],
    image: { src: "/images/13.png", width: 1161, height: 1317 },
    audio: "/audio/12.m4a",
  },
  {
    paragraphs: ["“But I love you as high as I can hop,” smiled Big Nutbrown Hare -- and he hopped so high that his ears touched the branches above."],
    image: { src: "/images/14.png", width: 1149, height: 1462 },
    audio: "/audio/13.m4a",
  },
  {
    paragraphs: ["That’s good hopping, thought Little Nutbrown Hare. I wish I could hop like that."],
    image: { src: "/images/15.png", width: 1192, height: 1462 },
    audio: "/audio/14.m4a",
  },
  {
    paragraphs: ["“I love you all the way down the lane as far as the river,” cried Little Nutbrown Hare."],
    image: { src: "/images/16.png", width: 1192, height: 1090 },
    audio: "/audio/15.m4a",
  },
  {
    paragraphs: ["“I love you across the river and over the hills,” cried Big Nutbrown Hare."],
    image: { src: "/images/17.png", width: 1192, height: 1097 },
    audio: "/audio/16.m4a",
  },
  {
    paragraphs: ["That’s very far, thought Little Nutbrown Hare. He was almost too sleepy to think anymore."],
    image: { src: "/images/18.png", width: 632, height: 353 },
    audio: "/audio/17.m4a",
  },
  {
    paragraphs: ["Then he looked beyond the thornbushes, out into the big dark night. Nothing could be farther than the sky."],
    image: { src: "/images/19.png", width: 654, height: 363 },
    audio: "/audio/18.m4a",
  },
  {
    paragraphs: [
      "“I love you right up to the moon,” he said, and closed his eyes.",
      "“Oh, that’s far,” said Big Nutbrown Hare. “That’s very, very far.”",
    ],
    image: { src: "/images/20.png", width: 1154, height: 1423 },
    audio: "/audio/19.m4a",
  },
  {
    paragraphs: ["Big Nutbrown Hare settled Little Nutbrown Hare into his bed of leaves."],
    image: { src: "/images/21.png", width: 645, height: 311 },
    audio: "/audio/20.m4a",
  },
  {
    paragraphs: ["He leaned over and kissed him good night."],
    image: { src: "/images/22.png", width: 1192, height: 1350 },
    audio: "/audio/21.m4a",
  },
  {
    paragraphs: [
      "Then he lay down close by and whispered with a smile, “I love you right up to the moon --",
      "and back.”",
    ],
    image: { src: "/images/23.png", width: 1184, height: 1090 },
    audio: "/audio/22.m4a",
  },
];

const BLANK_MS = 350;
const IMAGE_FADE_MS = 1100;
const LETTER_STAGGER_MS = 52;
const LETTER_FADE_MS = 760;
const WORD_GAP_STEPS = 2;
const FADE_OUT_MS = 500;

function holdDurationMs(wordCount: number) {
  return Math.min(8000, Math.max(2800, 1800 + wordCount * 220));
}

function countWords(page: Page) {
  return page.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
}

function countLetterSteps(page: Page) {
  let steps = 0;
  for (const paragraph of page.paragraphs) {
    for (const line of paragraph.split("\n")) {
      for (const word of line.split(" ")) {
        steps += word.length + WORD_GAP_STEPS;
      }
    }
  }
  return steps;
}

function renderParagraphs(page: Page, stepMs: number): { nodes: ReactNode; totalRevealMs: number } {
  let step = 0;
  let maxDelay = 0;
  let isFirstLetter = true;

  const nodes = page.paragraphs.map((paragraph, pIdx) => {
    const lines = paragraph.split("\n");
    return (
      <p key={pIdx} className={page.variant === "title" ? styles.title : styles.text}>
        {lines.map((line, lIdx) => {
          const words = line.split(" ").map((word, wIdx) => {
            const letters = word.split("").map((char, cIdx) => {
              const delay = step * stepMs;
              maxDelay = Math.max(maxDelay, delay);
              step += 1;
              const isDropCap = page.variant === "title" && isFirstLetter;
              isFirstLetter = false;
              return (
                <span
                  key={cIdx}
                  className={isDropCap ? `${styles.letter} ${styles.dropCap}` : styles.letter}
                  style={{ "--letter-delay": `${delay}ms` } as React.CSSProperties}
                >
                  {char}
                </span>
              );
            });
            step += WORD_GAP_STEPS;
            return (
              <span key={wIdx} className={styles.wordGroup}>
                {letters}
              </span>
            );
          });
          const spaced = words.reduce<ReactNode[]>(
            (acc, el, i) => (i === 0 ? [el] : [...acc, " ", el]),
            []
          );
          return (
            <span key={lIdx}>
              {lIdx > 0 && <br />}
              {spaced}
            </span>
          );
        })}
      </p>
    );
  });

  return { nodes, totalRevealMs: maxDelay + LETTER_FADE_MS };
}

type Phase = "blank" | "image" | "words" | "hold" | "fadeOut";

function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const requestLock = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          lock.release().catch(() => { });
          return;
        }
        sentinel = lock;
      } catch {
        console.error("Failed to acquire wake lock");
        // Wake lock not available (unsupported, denied, or tab hidden) - degrade silently.
      }
    };

    const handleVisibilityChange = () => {
      if (!cancelled && document.visibilityState === "visible") {
        requestLock();
      }
    };

    requestLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      sentinel?.release().catch(() => { });
    };
  }, [active]);
}

function StoryPage({
  page,
  onFinished,
}: {
  page: Page;
  onFinished: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("blank");
  const [audioDurationMs, setAudioDurationMs] = useState<number | null>(null);
  const wordCount = useMemo(() => countWords(page), [page]);
  const totalSteps = useMemo(() => countLetterSteps(page), [page]);

  const letterStepMs = useMemo(() => {
    if (!audioDurationMs) return LETTER_STAGGER_MS;
    // Letters start revealing once the image has faded in, after audio has
    // already been playing for IMAGE_FADE_MS - shrink the reveal window by
    // that head start so the last letter lands right as the narration ends.
    // totalRevealMs is maxDelay + LETTER_FADE_MS, so back that tail fade out too.
    const revealWindowMs = Math.max(500, audioDurationMs - IMAGE_FADE_MS - LETTER_FADE_MS);
    const perStep = revealWindowMs / Math.max(1, totalSteps);
    return Math.min(220, Math.max(15, perStep));
  }, [audioDurationMs, totalSteps]);

  const { nodes, totalRevealMs } = useMemo(
    () => renderParagraphs(page, letterStepMs),
    [page, letterStepMs]
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("image"), BLANK_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "image") return;
    audioRef.current?.play().catch(() => {
      // Autoplay blocked (no user gesture yet) or the file failed to load -
      // the visual animation carries on regardless, using the reading-time fallback below.
    });
    const t = setTimeout(() => setPhase("words"), IMAGE_FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "words") return;
    const t = setTimeout(() => setPhase("hold"), totalRevealMs);
    return () => clearTimeout(t);
  }, [phase, totalRevealMs]);

  useEffect(() => {
    if (phase !== "hold") return;

    const advance = () => setPhase("fadeOut");
    const audio = audioRef.current;

    if (audio && audio.ended) {
      // Narration already finished before the letter reveal caught up - move on right away.
      const t = setTimeout(advance, 0);
      return () => clearTimeout(t);
    }

    if (audio && !audio.paused) {
      audio.addEventListener("ended", advance);
      // Safety net in case 'ended' never fires (e.g. a decode error mid-playback).
      const safetyMs =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration * 1000 + 3000
          : holdDurationMs(wordCount);
      const t = setTimeout(advance, safetyMs);
      return () => {
        audio.removeEventListener("ended", advance);
        clearTimeout(t);
      };
    }

    // No audio playing (blocked, missing, or errored) - fall back to a reading-time estimate.
    const t = setTimeout(advance, holdDurationMs(wordCount));
    return () => clearTimeout(t);
  }, [phase, wordCount]);

  useEffect(() => {
    if (phase !== "fadeOut") return;
    const t = setTimeout(onFinished, FADE_OUT_MS);
    return () => clearTimeout(t);
  }, [phase, onFinished]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  return (
    <div className={styles.container} data-phase={phase}>
      <audio
        ref={audioRef}
        src={page.audio}
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setAudioDurationMs(d * 1000);
        }}
      />

      <div className={styles.textWrap}>{nodes}</div>

      <div className={styles.imageWrap}>
        <Image src={page.image.src} alt="Story illustration" width={page.image.width} height={page.image.height} />
      </div>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <button type="button" className={styles.startScreen} onClick={onStart}>
      <span className={styles.startEyebrow}>GUESS HOW MUCH I LOVE YOU</span>
      <span className={styles.startPrompt}>Tap to start</span>
    </button>
  );
}

const GOODNIGHT_LINES = ["Goodnight!", "Welterusten!", "Shab bakhir!"];

function EndScreen() {
  return (
    <div className={styles.endScreen}>
      {GOODNIGHT_LINES.map((line, i) => (
        <span
          key={line}
          className={styles.endLine}
          style={{ animationDelay: `${i * 220}ms` }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}

export function Story() {
  const [started, setStarted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useWakeLock(started && !finished);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  if (finished) {
    return <EndScreen />;
  }

  const isLastPage = pageIndex === PAGES.length - 1;

  return (
    <StoryPage
      key={pageIndex}
      page={PAGES[pageIndex]}
      onFinished={() => {
        if (isLastPage) {
          setFinished(true);
        } else {
          setPageIndex((i) => i + 1);
        }
      }}
    />
  );
}
