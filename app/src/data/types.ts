/** Content model for the course. Every screen is data; the view decides what to render from which fields are present. */

export type Step = 'G' | 'R' | 'O' | 'W';
/** M = the manager in a dialogue, E = the employee. */
export type Speaker = 'M' | 'E';

export interface DialogueLine {
  who: Speaker;
  text: string;
  /** The technique shown, displayed in the right-hand column. */
  tech: string;
}

export interface Reflection {
  kicker: string;
  prompt: string;
  btn: string;
  /** Text shown after the box and button ("bridge" line to the next screen). */
  after?: string;
  /** Title of the reveal box. When absent the screen has no reveal box; the response is simply saved. */
  revealTitle?: string;
  /** Numbered points in the reveal box. */
  reveal?: string[];
  /** Longer suggested answer at the bottom of the reveal box. */
  suggest?: string;
  /** Model answer shown in italics at the top of the reveal box. */
  model?: string;
  /** Hide the "Click to reveal suggested answer" link; the box only opens on submit. */
  noPeek?: boolean;
}

export interface Mcq {
  q: string;
  opts: string[];
  correct: number;
  right: string;
  wrong: string;
  /** Options that earn a "Partly right" verdict. */
  partial?: Record<number, true>;
  /** Extra feedback for specific wrong options, placed before `wrong`. */
  notes?: Record<number, string>;
}

export interface BranchOption {
  text: string;
  when: string;
  result: string;
  best?: boolean;
}

export interface Scenario {
  label: string;
  text: string;
  q: string;
  correct: number;
  /** [option text, feedback] */
  opts: [string, string][];
}

export type AssessQuestion =
  | {
      type: 'match';
      label: string;
      screen: string;
      q: string;
      /** [id, situation, question, correct step, why] */
      cards: [string, string, string, Step, string][];
      /** Display order of the card ids in the bank. */
      order: string[];
      right: string;
      wrong: string;
    }
  | { type: 'single'; label: string; screen: string; q: string; opts: string[]; correct: number; right: string; wrong: string }
  | { type: 'multi'; label: string; screen: string; q: string; opts: string[]; correct: number[]; right: string; wrong: string };

export interface ComicBubble {
  panel: 1 | 2 | 3;
  who: Speaker;
  text: string;
}

export interface Screen {
  id: string;
  mod: number;
  title: string;
  /** Words in the title to colour red. */
  titleHi?: string[];
  narration?: string;
  /** Narration sits in full directly under the header (no rule between). Otherwise it closes the screen. */
  narrTop?: boolean;
  /** Collapsed takeaway at the very end of the screen. */
  takeaway?: string;
  /** Label for the footer's next button. */
  next?: string;
  /** GROW step highlighted in the sidebar for the whole screen. */
  step?: Step;

  hero?: { tagline: string };
  stat?: true;
  convo?: { cast: string; names: Record<Speaker, string>; lines: [Speaker, string][] };
  reflect?: Reflection;
  mcq?: Mcq;
  settings?: true;
  map?: true;
  steps4?: true;
  tabs?: true;
  /** 3.3: animated "Before you start" intro followed by the slider exercise. */
  judge?: [id: string, text: string, zone: 'D' | 'S' | 'N', why: string][];
  backfire?: {
    panels: [string, string, string];
    bubbles: (ComicBubble & { problem: boolean; why: string })[];
    cards: [mistake: string, sounds: string, why: string][];
  };
  oiq?: true;
  rebuild?: {
    orig: string[];
    panels: [string, string, string];
    bubbles: (ComicBubble & { tag?: 'O' | 'I' | 'Q' })[];
    cards: [letter: 'O' | 'I' | 'Q', part: string, friday: string, rebuilt: string][];
  };
  habits?: true;
  scen?: Scenario[];
  setup?: true;
  setupX?: {
    img: string;
    bright?: number;
    photo: string;
    cast: [role: string, name: string, desc: string][];
    quoteWho: string;
    quote: string;
    bg?: [string, string][];
  };
  /** Annotated dialogue. */
  lines?: DialogueLine[];
  names?: Record<Speaker, string>;
  /** "stage" = one line at a time as avatar + speech bubble; otherwise annotated rows. */
  dialogue?: 'rows' | 'stage';
  avatars?: Record<Speaker, string>;
  /** GROW step of each line, for sidebar highlighting and the 5.3 timer. */
  lineSteps?: Step[];
  timer?: true;
  /** 4.6: the written development plan appears once the conversation ends. */
  plan?: true;
  branch?: { askWho: string; askText: string; speaker: string; prompt: string; options: BranchOption[] };
  /** Footer sits right under the content instead of being pushed to the bottom of the window. */
  compactFooter?: true;
  recap?: string[];
  compare?: { context: string; cols: [label: string, line: string, effect: string, good: boolean][] };
  pocket?: string[];
  flips?: [dont: string, say: string][];
  cmp7?: { heads: [string, string][]; rows: [string, string, string, string][] };
  check7?: string[];
  commit?: string[];
  assess?: AssessQuestion[];
  close7?: true;
  cert?: true;
}
