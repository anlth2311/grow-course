import type { Speaker, Step } from './types';

/** [module number, title, minutes] */
export const MODULES: [number, string, number][] = [
  [1, 'Why career conversations matter', 4],
  [2, 'Where career conversations come up', 5],
  [3, 'The model: GROW, plus one judgment call', 8],
  [4, 'Deep dive 1: Dedicated check-in with an ambitious employee', 10],
  [5, 'Deep dive 2: A disengagement signal in a regular one-on-one', 7],
  [6, 'Deep dive 3: A strong performer who wants a promotion now', 8],
  [7, 'Wrap-up and assessment', 5],
];

export const MODULE_LABEL: Record<number, string> = {
  1: 'Module 1',
  2: 'Module 2',
  3: 'Module 3',
  4: 'Module 4 · Deep dive 1',
  5: 'Module 5 · Deep dive 2',
  6: 'Module 6 · Deep dive 3',
  7: 'Module 7',
};

/** [letter, word, guiding question] */
export const GROW: [Step, string, string][] = [
  ['G', 'Goal', 'What do they want?'],
  ['R', 'Reality', 'Where do things stand?'],
  ['O', 'Options', 'What could they do?'],
  ['W', 'Will', 'What will they do, by when?'],
];
export const stepName = (l: Step) => GROW.find((g) => g[0] === l)![1];

/** 3.2 — purpose and example questions per step. */
export const GROW_QUESTIONS: Record<Step, [string, string[]]> = {
  G: ['Find out what the person wants, for this conversation and for the longer term.', ['What would you like to get out of this conversation?', 'If things went really well in the next year, what would be different?']],
  R: ["Get an honest picture of the present, including facts and the employee's own view.", ['Where are you now relative to that?', "What's going well? What's getting in the way?", 'What have you tried?']],
  O: ['Generate several paths before choosing one.', ['What could you do?', 'What else?', 'What would you do if you had no constraints?']],
  W: ['Turn the choice into a commitment.', ['What will you do, and by when?', 'What support do you need from me?', "How will we know it's working?"]],
};

/** 3.3 slider positions: [id, name, hint] */
export const ZONES: ['D' | 'S' | 'N', string, string][] = [
  ['D', 'Directive', 'Tell or teach first'],
  ['S', 'Situational', 'Ask, and add information'],
  ['N', 'Non-directive', 'Ask'],
];

export const SETTINGS = [
  { name: 'Dedicated check-ins', cadence: 'Quarterly or yearly', desc: 'Planned in advance. Usually about an hour.', img: 'assets/setting-1.png', photo: 'Two colleagues in a planned check-in at a high table', size: '165% auto', pos: '58% 22%' },
  { name: 'Regular one-on-ones', cadence: 'Weekly or fortnightly', desc: 'Five minutes inside a normal one-on-one.', img: 'assets/setting-2.png', photo: 'A manager and employee in a quick one-on-one at a desk', size: '115% auto', pos: '45% 40%' },
  { name: 'Difficult moments', cadence: 'Unannounced', desc: "They arrive when you're least ready for them.", img: 'assets/setting-3.png', photo: 'A manager in an unexpected, serious conversation', size: '110% auto', pos: '55% 35%' },
];

/** 2.2 scenario map: [setting index, title, what it tests, deep dive number] */
export const SCENARIO_MAP: [number, string, string, number?][] = [
  [0, 'The employee with a clear ambition', 'Goal and Reality: testing readiness honestly, then building a plan', 1],
  [0, "The employee who doesn't know what they want", 'Curious questions without forcing a goal'],
  [0, 'The solid performer content to stay put', 'Respecting that choice while keeping growth alive'],
  [0, "The ambition that doesn't fit the business", 'Honest limits and creative options'],
  [0, 'Building the written development plan', 'The Will step: owners, dates, support'],
  [0, 'The follow-up a quarter later', 'Reviewing progress and owning your side'],
  [1, 'Adding a career question to a status-heavy meeting', 'A short coaching question in five minutes'],
  [1, 'The employee who only wants to talk about tasks', 'Opening the door without pushing'],
  [1, 'Spotting a growth opportunity mid-conversation', 'Turning interest into an action'],
  [1, 'The disengagement signal', 'Open, non-leading inquiry, then a short GROW', 2],
  [2, '"I\'m thinking of leaving"', 'Listening before defending, no false promises'],
  [2, 'A strong performer who wants a promotion now', 'Direct feedback plus coaching on the gap', 3],
  [2, 'Unrealistic expectations about pay or title', 'Clear messages that keep trust'],
  [2, '"Why did she get promoted and I didn\'t?"', 'Fairness without breaching confidentiality'],
  [2, 'The employee who has outgrown you', 'Supporting growth beyond your reach'],
  [2, 'The underperformer who wants career growth', "Separating today's gap from tomorrow's goals"],
  [2, 'Return from leave, remote or overlooked employees', 'Equitable access to opportunity'],
];

/** Default cast for the Module 4 dialogues. */
export const MAYA_TOMAS: Record<Speaker, string> = { M: 'Maya', E: 'Tomás' };

/** Timing (in 110 ms ticks) of the 3.3 "Before you start" sequence. */
export const JUDGE_INTRO = (() => {
  const sentence = 'Before you start, ask yourself:';
  const words = sentence.split(' ');
  const img = words.length + 3;
  const bub = img + 8;
  const rows = [
    { label: 'Situation 1', tabs: ["If they're new to the topic", 'If time is short', 'If the stakes are high'], dec: 'Tell or teach them first', accent: false },
    { label: 'Situation 2', tabs: ['If they already have the skill', 'Need to build judgment and ownership'], dec: 'Ask', accent: true },
  ].map((r) => ({ ...r, at: 0, tabAt: [] as number[], link: 0, decAt: 0 }));
  let t = bub + 8;
  for (const r of rows) {
    r.at = t;
    r.tabAt = r.tabs.map((_, i) => t + 2 + i * 3);
    r.link = t + 2 + r.tabs.length * 3;
    r.decAt = r.link + 3;
    t = r.decAt + 6;
  }
  return { sentence, words, img, bub, rows, fin: t + 2, ex: t + 8, end: t + 10 };
})();

/** Timing (in 110 ms ticks) of the 1.1 welcome sequence. */
export const WELCOME = (() => {
  const sentence = "If you've just become a manager, you've probably noticed that people now bring you questions you never had to answer before.";
  const words = sentence.split(' ');
  const img = words.length + 3;
  const fin = img + 39;
  return { sentence, words, img, bub: [img + 7, img + 17, img + 27], fin, end: fin + 6, qs: ['Where is my career going?', 'Am I doing well?', 'What should I learn next?'] };
})();

export const DOWNLOADS: [string, string][] = [
  ['Pre-conversation checklist', 'One page · Module 7'],
  ['Three pocket questions', 'Card · Module 5'],
  ['Development plan template', 'One page · Module 4'],
  ['Job aids', '14 one-page guides for the scenarios not covered in depth · Module 2'],
];

export const SOURCES = [
  'Ibarra, H. and Scoular, A. "The Leader as Coach." Harvard Business Review, Nov–Dec 2019.',
  'Google re:Work. Project Oxygen and manager resources.',
  'Gallup. Manager development research.',
  'Dahling, J. et al. (2016). "Does Coaching Matter?" Personnel Psychology.',
  'de Haan, E. and Nilsson, V. (2023). Meta-analysis of coaching randomized trials. Academy of Management Learning and Education.',
];

/** Downloads are not supplied yet; each button explains that. */
export const placeholder = (what: string) => window.alert(`Placeholder: ${what} will be supplied before release.`);
