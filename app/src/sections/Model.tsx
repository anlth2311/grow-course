import { GROW, GROW_QUESTIONS, JUDGE_INTRO, ZONES } from '../data/constants';
import type { Screen, Speaker } from '../data/types';
import { useCourse, useScreenUI } from '../state/CourseContext';
import { ArtPlaceholder, countOn, FlipCard, IntroRow, Kicker, OptionRow, ResultPanel, toggleKey } from '../components/common';
import { TypedSentence } from './Intro';
import { dragSource, dropTarget } from './dnd';

/** 3.1 — the four GROW steps slide in one at a time. */
export function FourSteps() {
  const [u] = useScreenUI();
  const step = u.setStep ?? 4;
  return (
    <div className="stack">
      {GROW.map(([l, w, d], i) => {
        const on = step > i;
        return (
          <div key={l} className="step-row anim" style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -16}px)` }}>
            <span className="step-row__letter">{l}</span>
            <div className="step-row__text">
              <span className="step-row__word">{w}</span>
              <span className="step-row__desc">{d}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** 3.2 — select a step to see its purpose and example questions. */
export function StepTabs({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const tab = u.tab || 'G';
  const seen = { G: true, ...(u.seen || {}) };
  const [purpose, qs] = GROW_QUESTIONS[tab];
  return (
    <div className="stack" style={{ gap: 20 }}>
      <IntroRow count={`${Object.keys(seen).length} of 4 explored`}>Select each step to see its purpose and what it sounds like.</IntroRow>
      <div className="tabs" role="group" aria-label="GROW steps">
        {GROW.map(([l, w]) => (
          <button
            key={l}
            className={'tab' + (tab === l ? ' is-on' : '')}
            aria-pressed={tab === l}
            onClick={() => {
              setU((x) => ({ tab: l, seen: { ...(x.seen || {}), [l]: true } }));
              track('interacted', screen.id, { response: l });
            }}
          >
            <span className="tab__letter">{l}</span>
            <span className="tab__word">{w}</span>
            <span className="tab__mark">{tab !== l && seen[l] ? '✓ Viewed' : ''}</span>
          </button>
        ))}
      </div>
      <div className="stack" style={{ gap: 16, paddingTop: 4 }}>
        <div className="stack" style={{ gap: 6 }}>
          <Kicker>Purpose</Kicker>
          <span className="tabs__purpose">{purpose}</span>
        </div>
        <div className="stack">
          <Kicker className="tabs__qs-label">Example questions</Kicker>
          {qs.map((q) => <span key={q} className="tabs__q">"{q}"</span>)}
        </div>
      </div>
    </div>
  );
}

/** 3.3 — "Before you start" sequence: typed line, thinking manager, two situation → decision rows, highlight. */
export function JudgeIntro() {
  const { judgeTick, playJudge } = useCourse();
  const k = judgeTick ?? 999;
  const on = (t: number) => k >= t;
  const J = JUDGE_INTRO;
  return (
    <div className="stack" style={{ gap: 24 }}>
      <TypedSentence className="judge-intro__sentence" words={J.words} tick={k} label={J.sentence} />
      <div className="thinker anim-slow" style={{ opacity: on(J.img) ? 1 : 0, transform: `translateY(${on(J.img) ? 0 : 16}px)` }}>
        <div className="thinker__crop">
          <img src="assets/thinking-manager.png" alt="A manager looking up thoughtfully, finger on her chin" />
        </div>
        <div className="thinker__bubble" style={{ opacity: on(J.bub) ? 1 : 0, transform: `scale(${on(J.bub) ? 1 : 0.85})` }}>
          <div className="thinker__cloud" style={{ backgroundImage: 'url(assets/thought-bubble.png)' }} />
          <div className="thinker__question">Can this person find a good answer if I ask the right question?</div>
        </div>
      </div>
      <div className="situations">
        {J.rows.map((r) => (
          <div key={r.label} className="situation" style={{ opacity: on(r.at) ? 1 : 0 }}>
            <span className="situation__label">{r.label}</span>
            <div className="situation__grid">
              <div className="situation__tabs">
                {r.tabs.map((t, i) => (
                  <span key={t} className="situation__tab" style={{ opacity: on(r.tabAt[i]) ? 1 : 0, transform: `translateX(${on(r.tabAt[i]) ? 0 : -10}px)` }}>{t}</span>
                ))}
              </div>
              <div className="situation__link" style={{ opacity: on(r.link) ? 1 : 0 }}>
                <span className="situation__bracket" style={{ top: `calc((100% - ${(r.tabs.length - 1) * 8}px) / ${r.tabs.length * 2})`, bottom: `calc((100% - ${(r.tabs.length - 1) * 8}px) / ${r.tabs.length * 2})` }} />
                <span className="situation__line" />
                <span className="situation__arrow" />
              </div>
              <div className={'situation__decision' + (r.accent ? ' is-accent' : '')} style={{ opacity: on(r.decAt) ? 1 : 0, transform: `translateX(${on(r.decAt) ? 0 : -10}px)` }}>
                <span className="situation__decision-label">Decision</span>
                <span className="situation__decision-text">{r.dec}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="highlight-row anim" style={{ opacity: on(J.fin) ? 1 : 0, transform: `translateY(${on(J.fin) ? 0 : 10}px)` }}>
        <p className="highlight-row__text"><span className="highlight">Often you'll do both in one conversation.</span></p>
        <button className="btn btn-ghost" onClick={playJudge}>Replay</button>
      </div>
      <div className="rule" style={{ opacity: on(J.ex) ? 1 : 0, transition: 'opacity .5s' }} />
    </div>
  );
}

/** 3.3 — place three situations on the Directive ↔ Non-directive slider. */
export function JudgeSlider({ screen }: { screen: Screen }) {
  const items = screen.judge!;
  const [u, setU] = useScreenUI();
  const { track, judgeTick } = useCourse();
  const place = u.place || {}, sel = u.pick, checked = !!u.checked;
  const placeIt = (id: string, z: string) => !checked && setU((x) => ({ place: { ...(x.place || {}), [id]: z }, pick: null }));
  const unplace = (id: string) => !checked && setU((x) => { const p = { ...(x.place || {}) }; delete p[id]; return { place: p, pick: null }; });
  const n = items.length;
  const nOk = items.filter(([id, , a]) => place[id] === a).length;
  const all = items.every(([id]) => place[id]);

  const card = ([id, text, ans, why]: (typeof items)[number], inZone: boolean) => {
    const ok = place[id] === ans;
    return (
      <button
        key={id}
        {...dragSource(id)}
        onClick={(e) => { e.stopPropagation(); if (!checked) setU({ pick: sel === id ? null : id }); }}
        className={`sort-card${inZone ? ' sort-card--zone' : ' sort-card--bank'}${checked ? (ok ? ' is-correct' : ' is-wrong') : sel === id ? ' is-picked' : ''}`}
        aria-pressed={sel === id}
      >
        <span>{text}</span>
        {inZone && checked && <span className="sort-card__why">{ok ? '✓' : '✗'} {why}</span>}
      </button>
    );
  };

  const check = () => {
    if (checked) {
      if (nOk === n) return;
      const p: Record<string, string> = {};
      items.forEach(([id, , a]) => { if (place[id] === a) p[id] = a; });
      setU({ checked: false, place: p });
      return;
    }
    setU({ checked: true });
    track('answered', screen.id, { score: nOk / n, success: nOk === n });
  };

  return (
    <div className="stack anim-fade" style={{ gap: 18, opacity: (judgeTick ?? 999) >= JUDGE_INTRO.ex ? 1 : 0 }}>
      <p className="lede">Place each situation on the slider. <span className="muted">Drag each situation to a position, or select it and then select a position.</span></p>
      <div className="bank" {...dropTarget(unplace)}>
        {items.filter(([id]) => !place[id]).map((it) => card(it, false))}
        {all && <span className="bank__empty">All situations placed. Check your answer, or drag one back here.</span>}
      </div>
      <div className="stack" style={{ gap: 8 }}>
        <div className="slider__ends"><span>← Directive</span><span>Non-directive →</span></div>
        <div className="slider__track">
          <div className="slider__bar" />
          {ZONES.map(([z]) => <span key={z} className={'slider__tick' + (items.some(([id]) => place[id] === z) ? ' is-on' : '')} />)}
        </div>
        <div className="slider__zones">
          {ZONES.map(([z, name, hint]) => (
            <div key={z} className={'drop-zone slider__zone' + (sel ? ' is-armed' : '')} {...dropTarget((id) => placeIt(id, z))} onClick={() => sel && placeIt(sel, z)}>
              <div className="slider__zone-head">
                <span className="slider__zone-name">{name}</span>
                <span className="muted slider__zone-hint">{hint}</span>
              </div>
              {items.filter(([id]) => place[id] === z).map((it) => card(it, true))}
            </div>
          ))}
        </div>
      </div>
      <div className="check-row">
        <button className="btn btn-primary" onClick={check} disabled={!all && !checked}>{checked && nOk < n ? 'Try again' : 'Check answer'}</button>
        <span className="check-row__result">
          {checked && (nOk === n ? `${n} of ${n}. Often you'll do both in one conversation.` : `${nOk} of ${n} in the right place. Wrong ones go back when you try again.`)}
        </span>
      </div>
    </div>
  );
}

const who = (s: Speaker) => (s === 'M' ? 'Marcus' : 'Nadia');

/** A comic panel: illustration slot on the left, speech bubbles on the right. */
function ComicPanel({ n, art, children }: { n: number; art: string; children: React.ReactNode }) {
  return (
    <div className="comic">
      <div className="comic__head">Panel {n}</div>
      <div className="comic__grid">
        <ArtPlaceholder label={art} className="comic__art" />
        <div className="comic__bubbles">{children}</div>
      </div>
    </div>
  );
}

function BubbleHead({ n, name, children }: { n: number; name: string; children?: React.ReactNode }) {
  return (
    <span className="bubble__head">
      <span className="num-badge">{n}</span>
      <span>{name}</span>
      {children}
    </span>
  );
}

/** 3.4 — setup, flag-the-problem comic, accordion, and four flip cards. */
export function Backfire({ screen }: { screen: Screen }) {
  const B = screen.backfire!;
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const fl = u.flags || {}, checked = !!u.checked, open = u.acc || { 0: true }, flips = u.flips || {};
  const probs = B.bubbles.filter((b) => b.problem).length;
  const found = B.bubbles.filter((b, i) => b.problem && fl[i]).length;
  const nFl = countOn(fl);

  const check = () => {
    if (checked) return setU({ checked: false, flags: {} });
    setU({ checked: true });
    track('answered', screen.id, { score: found / probs, success: found === probs && nFl === probs });
  };

  return (
    <div className="stack backfire" style={{ gap: 40 }}>
      <div className="split-2">
        <div className="grayscale photo photo--3x2">
          <img src="assets/backfire-setup.png" alt="Marcus stands over Nadia, pointing at her laptop, while she looks up at him warily" style={{ objectPosition: '50% 30%' }} />
        </div>
        <p className="backfire__setup">
          Nadia is an account manager. On Thursday she sent a client proposal with a pricing error, and the client noticed. Her manager, Marcus, has led the team for five months. He is frustrated. <strong>Read what he says next.</strong>
        </p>
      </div>

      <div className="section">
        <Kicker>Read the conversation</Kicker>
        <IntroRow count={checked ? `${found} of ${probs} problem bubbles found` : `${nFl} flagged`}>
          {checked ? 'Here is what is going wrong in each bubble.' : 'Select the bubbles that you think are a problem, then select Check.'}
        </IntroRow>
        <div className="stack" style={{ gap: 8 }}>
          {([1, 2, 3] as const).map((p) => (
            <ComicPanel key={p} n={p} art={B.panels[p - 1]}>
              {B.bubbles.map((b, i) => [b, i] as const).filter(([b]) => b.panel === p).map(([b, i]) => {
                const f = !!fl[i];
                const tag = checked ? (b.problem && f ? '✓ Found' : b.problem ? 'Missed' : f ? 'Not a problem' : '') : f ? '⚑ Flagged' : '';
                const cls = checked ? (b.problem ? ' is-problem' : '') + (b.problem && f ? ' is-filled' : '') : f ? ' is-flagged is-filled' : '';
                return (
                  <button
                    key={i}
                    className={'bubble bubble--btn' + (b.who === 'E' ? ' bubble--right' : '') + cls}
                    aria-pressed={f}
                    onClick={() => !checked && setU((x) => ({ flags: toggleKey(x.flags, i) }))}
                  >
                    <BubbleHead n={i + 1} name={who(b.who)}><span className="bubble__tag">{tag}</span></BubbleHead>
                    <span className="bubble__text">{b.text}</span>
                  </button>
                );
              })}
            </ComicPanel>
          ))}
        </div>
        <div className="check-row">
          <button className="btn btn-primary" onClick={check} disabled={!checked && !nFl}>{checked ? 'Try again' : 'Check'}</button>
          <span className="check-row__result">
            {checked && (found === probs ? (nFl === probs ? 'You found all four.' : "You found all four, and flagged one that isn't a problem.") : 'Open each item below to see what you missed.')}
          </span>
        </div>
        {checked && (
          <>
            <div className="accordion">
              {B.bubbles.map((b, i) => (
                <div key={i} className="accordion__item">
                  <button className="accordion__btn" aria-expanded={!!open[i]} onClick={() => setU((x) => ({ acc: toggleKey(x.acc || { 0: true }, i) }))}>
                    <span className={'accordion__num' + (b.problem ? ' is-problem' : '')}>{i + 1}</span>
                    <span className="accordion__verdict">{who(b.who)} · {b.problem ? 'Problem' : 'Not a problem'}</span>
                    <span className="accordion__toggle">{open[i] ? 'Hide' : 'Show'}</span>
                  </button>
                  {open[i] && <p className="accordion__text">{b.why}</p>}
                </div>
              ))}
            </div>
            <p className="big-line big-line--22">Marcus wasn't trying to be cruel. He was frustrated, and he wanted Nadia to improve. But look at what actually came out.</p>
          </>
        )}
      </div>

      <div className="section">
        <div className="intro-row">
          <Kicker className="flex-fill">Four common ways feedback goes wrong</Kicker>
          <span className="counter counter--plain">{countOn(flips)} of 4 turned</span>
        </div>
        <span className="lede">Select a card to see why it backfires.</span>
        <div className="grid-2">
          {B.cards.map(([mistake, sounds, why], i) => (
            <FlipCard
              key={i}
              className="flip--230"
              flipped={!!flips[i]}
              onClick={() => setU((x) => ({ flips: toggleKey(x.flips, i) }))}
              label={mistake + (flips[i] ? '. ' + why : '')}
              front={<>
                <span className="flip__num">0{i + 1}</span>
                <span className="flip__title">{mistake}</span>
                <span className="flip__quote">{sounds}</span>
                <span className="flip__cue">Why it backfires →</span>
              </>}
              back={<>
                <span className="flip__kicker">Why it backfires</span>
                <span className="flip__answer flip__answer--20">{why}</span>
                <span className="flip__cue">← {mistake}</span>
              </>}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 3.5 — Observation, Impact, Question card and worked example. */
export function Oiq() {
  const parts: [string, string, string][] = [
    ['O', 'Observation', 'Specific and factual.'],
    ['I', 'Impact', 'The effect on the work, team or client.'],
    ['Q', 'Question', "Invites the employee's view."],
  ];
  const example: [string, string][] = [
    ['Observation', "In the last two project reviews, you presented the data but didn't give a recommendation."],
    ['Impact', 'That made it hard for the client to decide.'],
    ['Question', 'What do you think is going on?'],
  ];
  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="cols-3 cols-3--ruled">
        {parts.map(([l, w, d]) => (
          <div key={l} className="cols-3__cell">
            <span className="big-num">{l}</span>
            <span className="cols-3__title">{w}</span>
            <span className="cols-3__text">{d}</span>
          </div>
        ))}
      </div>
      <div className="stack" style={{ gap: 10 }}>
        <span className="kicker oiq__example-label">Example</span>
        <div className="oiq__example">
          {example.map(([k, v]) => (
            <div key={k} className="oiq__row">
              <span className="kicker oiq__row-key">{k}</span>
              <span className="oiq__row-text">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const OIQ_FIELDS: ['O' | 'I' | 'Q', string, string][] = [
  ['O', 'Observation', 'What happened, as a fact?'],
  ['I', 'Impact', 'What effect did it have?'],
  ['Q', 'Question', "What will you ask to hear Nadia's view?"],
];
const OIQ_WORD = { O: 'Observation', I: 'Impact', Q: 'Question' };

/** 3.5 — rewrite exercise, the rebuilt comic with O/I/Q tags, flip cards and the closing line. */
export function Rebuild({ screen }: { screen: Screen }) {
  const B = screen.rebuild!;
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const line = u.rwLine ?? 0, rw = u.rw || {}, flips = u.flips || {};
  return (
    <div className="stack" style={{ gap: 40 }}>
      <div className="section">
        <Kicker>Try it: rewrite one of Marcus's lines</Kicker>
        <span className="lede lede--loose">Choose a line from Friday's conversation, then rewrite it as an Observation, an Impact and a Question.</span>
        <div className="stack" style={{ gap: 6 }}>
          {B.orig.map((t, i) => (
            <button key={i} className={'line-pick' + (line === i ? ' is-on' : '')} aria-pressed={line === i} onClick={() => setU({ rwLine: i })}>
              <span className="num-badge num-badge--22">{i + 1}</span>
              <span className="line-pick__text">{t}</span>
            </button>
          ))}
        </div>
        <div className="stack" style={{ gap: 10 }}>
          {OIQ_FIELDS.map(([l, w, ph]) => (
            <div key={l} className="rw-field">
              <label htmlFor={'rw-' + l} className="rw-field__label">
                <span className="letter-badge">{l}</span>
                <span>{w}</span>
              </label>
              <textarea
                id={'rw-' + l}
                className="input rw-field__input"
                value={rw[l] || ''}
                placeholder={ph}
                onChange={(e) => { const v = e.target.value; setU((x) => ({ rw: { ...(x.rw || {}), [l]: v } })); }}
              />
            </div>
          ))}
        </div>
        <div className="check-row">
          <button className="btn btn-primary" onClick={() => { setU({ rwDone: true }); track('responded', screen.id, { response: JSON.stringify({ line: line + 1, ...rw }) }); }}>Compare</button>
          <span className="muted note">{u.rwDone ? 'Saved. Only you can see this.' : ''}</span>
        </div>
      </div>

      <div className="section">
        <Kicker>The conversation, rebuilt</Kicker>
        <span className="lede lede--loose">Here is the same situation. Marcus is just as concerned about the error. This time he uses the formula. Each part is labelled so you can see how it works.</span>
        <div className="stack" style={{ gap: 8 }}>
          {([1, 2, 3] as const).map((p) => (
            <ComicPanel key={p} n={p} art={B.panels[p - 1]}>
              {B.bubbles.map((b, i) => [b, i] as const).filter(([b]) => b.panel === p).map(([b, i]) => (
                <div key={i} className={'bubble' + (b.who === 'E' ? ' bubble--right' : '') + (b.tag ? ' is-tagged' : '')}>
                  <BubbleHead n={i + 1} name={who(b.who)}>
                    {b.tag && <span className="bubble__oiq"><span className="bubble__oiq-letter">{b.tag}</span>{OIQ_WORD[b.tag]}</span>}
                  </BubbleHead>
                  <span className="bubble__text">{b.text}</span>
                </div>
              ))}
            </ComicPanel>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="intro-row">
          <Kicker className="flex-fill">What makes each part work</Kicker>
          <span className="counter counter--plain">{countOn(flips)} of 3 turned</span>
        </div>
        <span className="lede">Each card shows a line from Friday. Select it to see the rebuilt version.</span>
        <div className="cols-3" style={{ gap: 8 }}>
          {B.cards.map(([l, part, friday, rebuilt], i) => (
            <FlipCard
              key={l}
              className="flip--260"
              flipped={!!flips[i]}
              onClick={() => setU((x) => ({ flips: toggleKey(x.flips, i) }))}
              label={`${part}. Friday: ${friday}${flips[i] ? '. Rebuilt: ' + rebuilt : ''}`}
              front={<>
                <span className="flip__num">{l}</span>
                <span className="flip__title flip__title--natural">{part}</span>
                <Kicker muted>Friday version</Kicker>
                <span className="flip__quote">{friday}</span>
                <span className="flip__cue">Rebuilt version →</span>
              </>}
              back={<>
                <span className="flip__num">{l}</span>
                <span className="flip__kicker">Rebuilt version</span>
                <span className="flip__answer flip__answer--17">{rebuilt}</span>
                <span className="flip__cue">← Friday version</span>
              </>}
            />
          ))}
        </div>
      </div>

      <p className="big-line big-line--24 section-rule">
        Marcus still said plainly that the error mattered. <span className="accent">Being kind isn't the same as being vague.</span> The difference is that he described what happened, asked what Nadia saw, and finished with an action.
      </p>
    </div>
  );
}

const IconEar = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" /><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" /></svg>;
const IconHelp = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;
const IconPen = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

/** 3.6 — three habits, centred between the header rule and the footer. */
export function Habits() {
  const habits: [JSX.Element, string, string][] = [
    [<IconEar />, 'Listen more than you talk.', 'Aim for the employee speaking at least half the time.'],
    [<IconHelp />, 'Ask "And what else?"', 'Once, before you offer your own idea.'],
    [<IconPen />, 'End with a written commitment.', 'One or two actions, an owner, a date.'],
  ];
  return (
    <div className="cols-3 habits">
      {habits.map(([icon, title, text], i) => (
        <div key={i} className="habits__cell">
          {icon}
          <span className="big-num">0{i + 1}</span>
          <span className="habits__title">{title}</span>
          <span className="cols-3__text">{text}</span>
        </div>
      ))}
    </div>
  );
}

/** Deterministic shuffle of the four answers per attempt, so a retry shows a new order. */
function answerOrder(attempt: number, k: number) {
  const a = [0, 1, 2, 3];
  let x = (attempt + 1) * 9301 + k * 49297;
  for (let i = 3; i > 0; i--) {
    x = (x * 233280 + 49297) % 1000003;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 3.7 — four scenario questions, one at a time, then a result. Three of four passes. */
export function ScenarioQuiz({ screen }: { screen: Screen }) {
  const S = screen.scen!;
  const [u, setU] = useScreenUI();
  const { go, track } = useCourse();
  const att = u.attempt || 0, qi = u.qi || 0, ans = u.ans || {}, done = !!u.done, sel = u.scSel;
  const score = S.filter((q, k) => ans[k] === q.correct).length;
  const cur = S[Math.min(qi, 3)];
  const answered = ans[qi] != null;
  const ok = answered && ans[qi] === cur.correct;
  const passed = score >= 3;

  return (
    <div className="stack" style={{ gap: 20, marginTop: -12 }}>
      <div className="intro-row intro-row--center">
        <span className="intro-row__text">Four short scenarios. Choose the best answer for each. You need three out of four to pass.</span>
        <div className="dots" aria-label={done ? 'Complete' : `Scenario ${qi + 1} of 4`}>
          {S.map((q, k) => (
            <span key={k} className={'dot dot--28 ' + (k < qi || done ? (ans[k] === q.correct ? 'is-right' : 'is-wrong') : k === qi ? 'is-current' : '')} />
          ))}
        </div>
      </div>

      {!done && (
        <div className="stack" style={{ gap: 18 }}>
          <div className="case-card">
            <Kicker>Scenario {qi + 1} of 4 · {cur.label}</Kicker>
            <p className="case-card__text">{cur.text}</p>
          </div>
          <p className="question">{cur.q}</p>
          <div className="stack" style={{ gap: 8 }}>
            {answerOrder(att, qi).map((oi, pos) => {
              const picked = answered ? ans[qi] === oi : sel === oi;
              const isC = oi === cur.correct;
              return (
                <OptionRow
                  key={oi}
                  letter={'ABCD'[pos]}
                  text={cur.opts[oi][0]}
                  pressed={picked}
                  state={answered && isC ? 'correct' : answered && picked ? 'picked-wrong' : picked ? 'selected' : undefined}
                  tag={answered ? (isC ? 'Correct' : picked ? 'Your answer' : '') : picked ? 'Selected' : ''}
                  onClick={() => !answered && setU({ scSel: oi })}
                />
              );
            })}
          </div>
          {!answered && (
            <div>
              <button
                className="btn btn-primary"
                disabled={sel == null}
                onClick={() => {
                  setU((x) => ({ ans: { ...(x.ans || {}), [qi]: sel! }, scSel: null }));
                  track('answered', `${screen.id}/scenario-${qi + 1}`, { response: cur.opts[sel!][0], success: sel === cur.correct });
                }}
              >
                Check answer
              </button>
            </div>
          )}
          {answered && (
            <ResultPanel
              ok={ok}
              verdict={ok ? 'Correct' : 'Not quite'}
              action={{
                label: qi < 3 ? 'Next scenario' : 'See your result',
                onClick: () => {
                  if (qi < 3) setU({ qi: qi + 1, scSel: null });
                  else { setU({ done: true }); track('completed', screen.id, { score: score / 4, success: passed }); }
                },
              }}
            >
              {cur.opts[ans[qi]][1] + (ok ? '' : ' The best answer is highlighted.')}
            </ResultPanel>
          )}
        </div>
      )}

      {done && (
        <div className="stack" style={{ gap: 18 }}>
          <div className={'score-panel' + (passed ? ' is-ok' : '')}>
            <span className="kicker kicker--plain">{passed ? 'Passed' : 'Not yet passed'}</span>
            <span className="score-panel__score">{score} / 4</span>
            <span className="score-panel__text">
              {passed
                ? 'Well done. You can tell where you are in a GROW conversation, when to inform before asking, and how to open feedback so it invites a response.'
                : 'Review the three screens on GROW, ask or tell, and Observation, Impact, Question, then try again.'}
            </span>
          </div>
          <div className="summary">
            {S.map((q, k) => (
              <div key={k} className="summary__row">
                <span className={'summary__mark' + (ans[k] === q.correct ? ' is-right' : '')}>{ans[k] === q.correct ? '✓' : '✗'}</span>
                <span className="summary__label">Scenario {k + 1} · {q.label}</span>
              </div>
            ))}
          </div>
          {!passed && (
            <div className="stack" style={{ gap: 8 }}>
              <Kicker>Review</Kicker>
              <div className="btn-row">
                {[['3.2', '3.2 What each step sounds like'], ['3.3', '3.3 Ask or tell?'], ['3.5', '3.5 Observation, Impact, Question']].map(([id, label]) => (
                  <button key={id} className="btn btn-secondary" onClick={() => go(id)}>{label}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <button className={'btn ' + (passed ? 'btn-secondary' : 'btn-primary')} onClick={() => setU({ attempt: att + 1, qi: 0, ans: {}, scSel: null, done: false })}>Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}
