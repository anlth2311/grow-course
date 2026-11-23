import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { JUDGE_INTRO, WELCOME } from '../data/constants';
import { SCREENS, SCREEN_BY_ID } from '../data/screens';
import type { Screen, Step } from '../data/types';
import { sendStatement, type CourseStatement } from './lms';

/** Everything a learner can do on a screen. Each screen only uses the fields it needs. */
export interface ScreenUI {
  // dialogues
  shown?: number;
  hl?: Step | null;
  // timed reveals (2.1, 3.1, 7.1)
  setStep?: number;
  // reflection
  text?: string;
  revealed?: boolean;
  boxOpen?: boolean;
  // takeaway
  tkOpen?: boolean;
  // single-choice knowledge check
  picked?: number | null;
  checked?: boolean;
  done?: boolean;
  // branching (4.4)
  tried?: number[];
  best?: boolean;
  playing?: number | null;
  playStep?: number;
  // scenario map (2.2)
  open?: Record<number, boolean>;
  // GROW tabs (3.2)
  tab?: Step;
  seen?: Partial<Record<Step, boolean>>;
  // ask-or-tell slider (3.3)
  place?: Record<string, string>;
  pick?: string | null;
  // backfire comic and cards (3.4)
  flags?: Record<number, boolean>;
  acc?: Record<number, boolean>;
  flips?: Record<number, boolean>;
  // rebuild (3.5)
  rwLine?: number;
  rw?: Partial<Record<'O' | 'I' | 'Q', string>>;
  rwDone?: boolean;
  // scenario quiz (3.7)
  attempt?: number;
  qi?: number;
  ans?: Record<number, number>;
  scSel?: number | null;
  // checklist, commitment (7.2, 7.3)
  ck?: Record<number, boolean>;
  cmPick?: number;
  cmDate?: string;
  cmDone?: boolean;
  // final assessment (7.4)
  aq?: number;
  aans?: Record<number, AssessAnswer>;
  asel?: AssessAnswer | null;
  amPick?: string | null;
  adone?: boolean;
}
export type AssessAnswer = number | number[] | Record<string, Step>;
type Patch = Partial<ScreenUI> | ((prev: ScreenUI) => Partial<ScreenUI>);

interface Persisted {
  cur: string;
  visited: Record<string, boolean>;
  ui: Record<string, ScreenUI>;
}

const STORAGE_KEY = 'grow-course-v1';
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function load(): Persisted {
  const fresh: Persisted = { cur: '1.1', visited: { '1.1': true }, ui: {} };
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (d && SCREEN_BY_ID[d.cur]) return { cur: d.cur, visited: d.visited || {}, ui: d.ui || {} };
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return fresh;
}

interface CourseApi {
  screen: Screen;
  visited: Record<string, boolean>;
  ui: (id?: string) => ScreenUI;
  setU: (patch: Patch, id?: string) => void;
  go: (id: string) => void;
  track: (verb: CourseStatement['verb'], id: string, result?: Record<string, unknown>) => void;
  menuOpen: boolean;
  toggleMenu: () => void;
  /** Progress of the 1.1 and 3.3 intro sequences, in ticks. Undefined = fully shown. */
  welcomeTick: number | undefined;
  judgeTick: number | undefined;
  playWelcome: () => void;
  playJudge: () => void;
  /** Screen-level timer; cleared whenever the learner changes screen. */
  every: (ms: number, fn: (k: number) => boolean | void) => void;
  after: (ms: number, fn: () => void) => void;
}

const Ctx = createContext<CourseApi | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(load);
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeTick, setWelcomeTick] = useState<number>();
  const [judgeTick, setJudgeTick] = useState<number>();

  const latest = useRef(data);
  latest.current = data;
  const timer = useRef<number>();
  const welcomeTimer = useRef<number>();
  const judgeTimer = useRef<number>();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* private mode etc. — progress just isn't kept */
    }
  }, [data]);

  const track = useCallback<CourseApi['track']>((verb, id, result) => {
    const d = latest.current;
    sendStatement({
      verb, object: 'grow-course/screen/' + id, result, bookmark: d.cur,
      progress: Object.keys(d.visited).length / SCREENS.length, timestamp: new Date().toISOString(),
    });
  }, []);

  const setU = useCallback<CourseApi['setU']>((patch, id) => {
    setData((d) => {
      const key = id || d.cur;
      const prev = d.ui[key] || {};
      const next = typeof patch === 'function' ? patch(prev) : patch;
      return { ...d, ui: { ...d.ui, [key]: { ...prev, ...next } } };
    });
  }, []);

  const clearT = () => {
    window.clearInterval(timer.current);
    window.clearTimeout(timer.current);
    timer.current = undefined;
  };
  const every = useCallback<CourseApi['every']>((ms, fn) => {
    clearT();
    let k = 0;
    timer.current = window.setInterval(() => {
      k++;
      if (fn(k)) clearT();
    }, ms);
  }, []);
  const after = useCallback<CourseApi['after']>((ms, fn) => {
    clearT();
    timer.current = window.setTimeout(fn, ms);
  }, []);

  const runTicks = (ref: React.MutableRefObject<number | undefined>, set: (n: number) => void, end: number) => {
    window.clearInterval(ref.current);
    if (reducedMotion()) return set(999);
    let k = 0;
    set(0);
    ref.current = window.setInterval(() => {
      k++;
      set(k);
      if (k >= end) window.clearInterval(ref.current);
    }, 110);
  };
  const playWelcome = useCallback(() => runTicks(welcomeTimer, setWelcomeTick, WELCOME.end), []);
  const playJudge = useCallback(() => runTicks(judgeTimer, setJudgeTick, JUDGE_INTRO.end), []);

  /** Reveal rows one by one (2.1 settings, 3.1 steps, 7.1 table). */
  const stepIn = useCallback((id: string, n: number) => {
    setU({ setStep: 0 }, id);
    every(700, (k) => {
      setU({ setStep: k }, id);
      return k >= n;
    });
  }, [every, setU]);

  const go = useCallback<CourseApi['go']>((id) => {
    const s = SCREEN_BY_ID[id];
    if (!s) return;
    clearT();
    setData((d) => ({ ...d, cur: id, visited: { ...d.visited, [id]: true } }));
    setMenuOpen(false);
    track('experienced', id);
    const rows = s.settings ? 3 : s.steps4 || s.cmp7 ? 4 : 0;
    if (rows) window.setTimeout(() => stepIn(id, rows), 30);
    window.scrollTo(0, 0);
    window.clearInterval(welcomeTimer.current);
    if (id === '1.1') window.setTimeout(playWelcome, 30);
    window.clearInterval(judgeTimer.current);
    if (id === '3.3') window.setTimeout(playJudge, 30);
  }, [playJudge, playWelcome, stepIn, track]);

  // First load: record the launch and play the intro of the screen we resume on.
  const launched = useRef(false);
  useEffect(() => {
    if (!launched.current) {
      launched.current = true;
      track('launched', latest.current.cur);
    }
    if (latest.current.cur === '1.1') playWelcome();
    if (latest.current.cur === '3.3') playJudge();
    return () => {
      clearT();
      window.clearInterval(welcomeTimer.current);
      window.clearInterval(judgeTimer.current);
    };
  }, [playJudge, playWelcome, track]);

  const api = useMemo<CourseApi>(() => ({
    screen: SCREEN_BY_ID[data.cur],
    visited: data.visited,
    ui: (id) => data.ui[id || data.cur] || {},
    setU, go, track, every, after,
    menuOpen, toggleMenu: () => setMenuOpen((o) => !o),
    welcomeTick, judgeTick, playWelcome, playJudge,
  }), [data, setU, go, track, every, after, menuOpen, welcomeTick, judgeTick, playWelcome, playJudge]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCourse() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCourse must be used inside <CourseProvider>');
  return c;
}

/** State of the current screen plus a setter bound to it. */
export function useScreenUI(id?: string) {
  const c = useCourse();
  const key = id || c.screen.id;
  return [c.ui(key), (patch: Patch) => c.setU(patch, key)] as const;
}
