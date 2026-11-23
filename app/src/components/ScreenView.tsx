import { MODULE_LABEL } from '../data/constants';
import { SCREENS } from '../data/screens';
import type { Screen } from '../data/types';
import { useCourse } from '../state/CourseContext';
import { Narration, Takeaway } from './common';
import { ChatConversation, Hero, ManagerEffect, WelcomeMotion } from '../sections/Intro';
import { ScenarioMap, Settings } from '../sections/Module2';
import { Backfire, FourSteps, Habits, JudgeIntro, JudgeSlider, Oiq, Rebuild, ScenarioQuiz, StepTabs } from '../sections/Model';
import { Branch, Compare, DevPlan, Dialogue, Pocket, Recap, SayInstead, Setup, SetupX, Timer } from '../sections/DeepDive';
import { Mcq, Reflection } from '../sections/Interactions';
import { Assessment, Certificate, Checklist, Close, Commit, Comparison } from '../sections/WrapUp';

/** Splits the title so the words in `titleHi` can be shown in red. */
function Title({ s }: { s: Screen }) {
  if (!s.titleHi) return <>{s.title}</>;
  const parts = s.title.split(new RegExp('(' + s.titleHi.join('|') + ')', 'i')).filter(Boolean);
  return <>{parts.map((t, i) => s.titleHi!.some((w) => w.toLowerCase() === t.toLowerCase()) ? <span key={i} className="accent">{t}</span> : t)}</>;
}

/**
 * One screen of the course. Sections render in a fixed order; each screen's data decides
 * which of them appear. Narration closes the screen unless the screen places it itself.
 */
export function ScreenView() {
  const { screen: s, ui, go } = useCourse();
  const idx = SCREENS.indexOf(s);
  const prev = SCREENS[idx - 1], next = SCREENS[idx + 1];
  const u = ui();
  const bottomNarration = s.narration && !s.narrTop && !s.convo && !s.settings;
  const headerRule = !(s.settings || s.narrTop || s.backfire);

  return (
    <div className="page">
      <header className={'screen-head' + (headerRule ? ' has-rule' : '')}>
        <div className="screen-head__titles">
          <div className="kicker kicker--600">{MODULE_LABEL[s.mod]}</div>
          <h1 className="screen-head__title"><Title s={s} /></h1>
        </div>
      </header>

      {s.narrTop && s.narration && <p className="narr-top">{s.narration}</p>}
      {s.steps4 && <FourSteps />}
      {s.tabs && <StepTabs screen={s} />}
      {s.judge && <JudgeIntro />}
      {s.judge && <JudgeSlider screen={s} />}
      {s.backfire && <Backfire screen={s} />}
      {s.oiq && <Oiq />}
      {s.rebuild && <Rebuild screen={s} />}
      {s.scen && <ScenarioQuiz screen={s} />}
      {s.habits && <Habits />}
      {s.hero && <Hero screen={s} />}
      {s.stat && <ManagerEffect />}
      {s.setup && <Setup />}
      {s.setupX && <SetupX screen={s} />}
      {s.compare && <Compare screen={s} />}
      {s.pocket && <Pocket screen={s} />}
      {s.cmp7 && <Comparison screen={s} />}
      {s.check7 && <Checklist screen={s} />}
      {s.commit && <Commit screen={s} />}
      {s.assess && <Assessment screen={s} />}
      {s.cert && <Certificate />}
      {s.close7 && <Close />}
      {s.flips && <SayInstead screen={s} />}
      {s.settings && <Settings screen={s} />}
      {s.map && <ScenarioMap screen={s} />}
      {s.recap && <Recap screen={s} />}
      {s.convo && <ChatConversation screen={s} />}
      {s.timer && <Timer screen={s} />}
      {s.lines && <Dialogue screen={s} />}
      {s.branch && <Branch screen={s} />}
      {s.mcq && <Mcq screen={s} />}
      {s.plan && <DevPlan ready={(u.shown || 1) >= s.lines!.length} />}
      {s.reflect && <Reflection screen={s} />}
      {s.hero && <WelcomeMotion />}
      {bottomNarration && <Narration text={s.narration!} />}
      {s.takeaway && <Takeaway text={s.takeaway} />}

      <footer className={'screen-foot' + (s.compactFooter ? ' is-compact' : '')}>
        <button className="btn btn-secondary" onClick={() => prev && go(prev.id)} disabled={!prev}>← Back</button>
        <span className="muted screen-foot__pos">Screen {s.id} · {idx + 1} of {SCREENS.length}</span>
        <button className="btn btn-primary screen-foot__next" onClick={() => next && go(next.id)} disabled={!next}>{s.next || 'Next'} →</button>
      </footer>
    </div>
  );
}
