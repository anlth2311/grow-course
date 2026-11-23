import { DOWNLOADS, GROW, placeholder, SOURCES, stepName } from '../data/constants';
import type { AssessQuestion, Screen, Step } from '../data/types';
import { useCourse, useScreenUI, type AssessAnswer } from '../state/CourseContext';
import { countOn, Kicker, OptionRow, ResultPanel, toggleKey } from '../components/common';
import { dragSource, dropTarget } from './dnd';

/** 7.1 — comparison of the three conversations; rows build one at a time. */
export function Comparison({ screen }: { screen: Screen }) {
  const c = screen.cmp7!;
  const [u] = useScreenUI();
  const step = u.setStep ?? 4;
  return (
    <div className="cmp7">
      <div className="cmp7__row cmp7__row--head">
        <span />
        {c.heads.map(([name, setting]) => (
          <div key={name} className="cmp7__head">
            <span className="cmp7__name">{name}</span>
            <span className="cmp7__setting">{setting}</span>
          </div>
        ))}
      </div>
      {c.rows.map(([label, ...cells], i) => {
        const on = step > i;
        return (
          <div key={label} className="cmp7__row anim" style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 10}px)` }}>
            <span className="cmp7__label">{label}</span>
            {cells.map((t, j) => <span key={j} className="cmp7__cell">{t}</span>)}
          </div>
        );
      })}
    </div>
  );
}

/** 7.2 — tick-off checklist. */
export function Checklist({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const c = u.ck || {};
  const items = screen.check7!;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <span className="lede">Use it before every career conversation. Tick each question as you prepare.</span>
      <div className="checklist">
        {items.map((t, i) => (
          <button key={i} className="checklist__item" role="checkbox" aria-checked={!!c[i]} onClick={() => setU((x) => ({ ck: toggleKey(x.ck, i) }))}>
            <span className={'checkbox' + (c[i] ? ' is-on' : '')}>{c[i] ? '✓' : ''}</span>
            <span className="checklist__text">{t}</span>
          </button>
        ))}
      </div>
      <div className="check-row">
        <button className="btn btn-secondary" onClick={() => placeholder('the printable pre-conversation checklist')}>Download checklist</button>
        <span className="counter counter--plain">{countOn(c)} of {items.length} ready</span>
      </div>
    </div>
  );
}

/** 7.3 — choose one action and a date. */
export function Commit({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const opts = screen.commit!;
  const pick = u.cmPick, date = u.cmDate || '';
  const dateLabel = date ? new Date(date + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return (
    <div className="stack" style={{ gap: 18 }}>
      <span className="lede">Choose one action.</span>
      <div className="stack" style={{ gap: 8 }} role="radiogroup" aria-label="Actions">
        {opts.map((t, i) => (
          <button key={i} className={'commit-opt' + (pick === i ? ' is-on' : '')} aria-pressed={pick === i} onClick={() => setU({ cmPick: i, cmDone: false })}>
            <span className="commit-opt__box" />
            <span className="commit-opt__text">{t}</span>
          </button>
        ))}
      </div>
      <div className="field commit__date">
        <label htmlFor="cm-date">By when?</label>
        <input id="cm-date" type="date" className="input" value={date} onChange={(e) => setU({ cmDate: e.target.value, cmDone: false })} />
      </div>
      <div>
        <button
          className="btn btn-primary"
          disabled={pick == null || !date}
          onClick={() => { setU({ cmDone: true }); track('committed', screen.id, { response: opts[pick!] + ' | ' + date }); }}
        >
          Commit
        </button>
      </div>
      {u.cmDone && pick != null && (
        <>
          <div className="commitment">
            <span className="kicker kicker--plain">Your commitment</span>
            <span className="commitment__choice">{opts[pick]}</span>
            <span className="commitment__date">By {dateLabel}</span>
          </div>
          <div className="dashed-note">Placeholder: a reminder email is sent on this date once the course is connected to your LMS.</div>
        </>
      )}
    </div>
  );
}

const KIND = { match: 'Drag and drop', single: 'Single choice', multi: 'Select all that apply' };
const HINT = { match: 'Drag each card into a box, or select a card and then a box.', single: 'Choose one answer.', multi: 'Select all that apply.' };
const PASS_MARK = 4;

/** Whether a stored answer has the right shape for its question. */
const fits = (q: AssessQuestion, a: unknown): a is AssessAnswer =>
  a != null && (q.type === 'single' ? typeof a === 'number' : q.type === 'match' ? typeof a === 'object' && !Array.isArray(a) : Array.isArray(a));

const isRight = (q: AssessQuestion, a: AssessAnswer) => {
  if (q.type === 'match') return q.cards.every((c) => (a as Record<string, Step>)[c[0]] === c[3]);
  if (q.type === 'single') return a === q.correct;
  return [...(a as number[])].sort().join() === [...q.correct].sort().join();
};

/** 7.4 — five questions, one at a time; four correct to pass. */
export function Assessment({ screen }: { screen: Screen }) {
  const A = screen.assess!;
  const [u, setU] = useScreenUI();
  const { go, track } = useCourse();
  const qi = Math.min(u.aq || 0, A.length - 1);
  const ans: Record<number, AssessAnswer> = Object.fromEntries(Object.entries(u.aans || {}).filter(([i, a]) => A[+i] && fits(A[+i], a)));
  const done = !!u.adone && A.every((_, i) => ans[i] != null);
  const cur = A[qi];
  const answered = ans[qi] != null;
  const empty: AssessAnswer = cur.type === 'single' ? (null as unknown as number) : cur.type === 'match' ? {} : [];
  const sel = answered ? ans[qi] : fits(cur, u.asel) ? u.asel! : empty;
  const score = A.filter((q, i) => ans[i] != null && isRight(q, ans[i])).length;
  const ok = answered && isRight(cur, ans[qi]);
  const passed = score >= PASS_MARK;

  const checkDisabled =
    cur.type === 'match' ? Object.keys(sel as object).length < cur.cards.length : cur.type === 'single' ? sel == null : (sel as number[]).length === 0;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="intro-row intro-row--center">
        <span className="intro-row__text">Five questions. You need four correct to pass.</span>
        <div className="dots" aria-label={done ? 'Complete' : `Question ${qi + 1} of ${A.length}`}>
          {A.map((q, i) => (
            <span key={i} className={'dot dot--24 ' + (ans[i] != null ? (isRight(q, ans[i]) ? 'is-right' : 'is-wrong') : i === qi && !done ? 'is-current' : '')} />
          ))}
        </div>
      </div>

      {!done && (
        <div className="stack" style={{ gap: 16 }}>
          <div className="case-card">
            <Kicker>Question {qi + 1} of 5 · {KIND[cur.type]}</Kicker>
            <p className="question">{cur.q}</p>
          </div>
          <span className="assess__hint">{HINT[cur.type]}</span>

          {cur.type === 'match' && <MatchBoard q={cur} sel={sel as Record<string, Step>} answered={answered} />}

          {cur.type !== 'match' && (
            <div className="stack" style={{ gap: 8 }}>
              {cur.opts.map((t, i) => {
                const multi = cur.type === 'multi';
                const picked = multi ? (sel as number[]).includes(i) : sel === i;
                const corr = multi ? cur.correct.includes(i) : cur.correct === i;
                return (
                  <OptionRow
                    key={i}
                    letter={<span className={'mark-box' + (picked ? ' is-on' : '')}>{multi ? (picked ? '✓' : '') : 'ABCDEFG'[i]}</span>}
                    text={t}
                    pressed={picked}
                    state={answered && corr ? 'correct' : answered && picked ? 'picked-wrong' : picked ? 'selected' : undefined}
                    tag={answered ? (corr ? (picked || !multi ? 'Correct' : 'Missed') : picked ? 'Your answer' : '') : ''}
                    onClick={() => {
                      if (answered) return;
                      if (multi) { const s = sel as number[]; setU({ asel: picked ? s.filter((x) => x !== i) : [...s, i] }); }
                      else setU({ asel: i });
                    }}
                  />
                );
              })}
            </div>
          )}

          {!answered && (
            <div className="btn-row">
              {qi > 0 && <button className="btn btn-secondary" onClick={() => setU({ aq: qi - 1, asel: null })}>Previous question</button>}
              <button
                className="btn btn-primary"
                disabled={checkDisabled}
                onClick={() => {
                  setU((x) => ({ aans: { ...(x.aans || {}), [qi]: sel }, asel: null }));
                  track('answered', `${screen.id}/q${qi + 1}`, { response: JSON.stringify(sel), success: isRight(cur, sel) });
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
                label: qi < A.length - 1 ? 'Next question' : 'See your result',
                onClick: () => {
                  if (qi < A.length - 1) setU({ aq: qi + 1, asel: null });
                  else { setU({ adone: true }); track('completed', screen.id, { score: score / A.length, success: passed }); }
                },
              }}
            >
              {ok ? cur.right : cur.wrong}
            </ResultPanel>
          )}
        </div>
      )}

      {done && (
        <div className="stack" style={{ gap: 18 }}>
          <div className={'score-panel' + (passed ? ' is-ok' : '')}>
            <span className="kicker kicker--plain">{passed ? 'Passed' : 'Not yet passed'}</span>
            <span className="score-panel__score">{score} / 5</span>
            <span className="score-panel__text">
              {passed
                ? "Well done. You're ready to hold your first career conversation. Use the checklist and pocket questions on the next screen."
                : 'You need four out of five to pass. Review the screens linked below, then try again.'}
            </span>
          </div>
          <div className="summary">
            {A.map((q, i) => {
              const r = ans[i] != null && isRight(q, ans[i]);
              return (
                <div key={i} className="summary__row summary__row--wrap">
                  <span className={'summary__mark' + (r ? ' is-right' : '')}>{r ? '✓' : '✗'}</span>
                  <span className="summary__label summary__label--wrap">{i + 1}. {q.label}</span>
                  {!r && <button className="btn btn-ghost" onClick={() => go(q.screen)}>Review screen {q.screen}</button>}
                </div>
              );
            })}
          </div>
          <div>
            <button className={'btn ' + (passed ? 'btn-secondary' : 'btn-primary')} onClick={() => setU({ aq: 0, aans: {}, asel: null, adone: false })}>Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** 7.4 question 1 — drag each manager question into its GROW box. */
function MatchBoard({ q, sel, answered }: { q: Extract<AssessQuestion, { type: 'match' }>; sel: Record<string, Step>; answered: boolean }) {
  const [u, setU] = useScreenUI();
  const pick = u.amPick;
  const put = (id: string, l: Step) => !answered && setU({ asel: { ...sel, [id]: l }, amPick: null });
  const unput = (id: string) => { if (answered) return; const o = { ...sel }; delete o[id]; setU({ asel: o, amPick: null }); };
  const ordered = q.order.map((id) => q.cards.find((c) => c[0] === id)!);

  const card = (c: (typeof q.cards)[number], inBox: boolean) => {
    const ok = sel[c[0]] === c[3];
    const state = answered ? (ok ? ' is-correct' : ' is-wrong') : pick === c[0] ? ' is-picked' : '';
    return (
      <button
        key={c[0]}
        {...dragSource(c[0], !answered)}
        onClick={(e) => { e.stopPropagation(); if (!answered) setU({ amPick: pick === c[0] ? null : c[0] }); }}
        className={'match-card' + (inBox ? '' : ' match-card--bank') + state}
        aria-pressed={pick === c[0]}
      >
        <span className="match-card__sit">{c[1]}</span>
        <span className="match-card__q">{c[2]}</span>
        {answered && (
          <span className="match-card__fb">
            <span className={'match-card__mark' + (ok ? ' is-right' : '')}>{ok ? '✓' : '✗'}</span>
            <span><strong>Correct step: {stepName(c[3])}.</strong> {c[4]}</span>
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="bank" {...dropTarget(unput)}>
        {!answered && ordered.filter((c) => !sel[c[0]]).map((c) => card(c, false))}
        {!answered && ordered.every((c) => sel[c[0]]) && <span className="bank__empty">All cards placed. Check your answer, or drag a card back here.</span>}
      </div>
      <div className="grid-2">
        {GROW.map(([l, w]) => (
          <div key={l} className={'drop-zone match-box' + (pick ? ' is-armed' : '')} {...dropTarget((id) => put(id, l))} onClick={() => pick && put(pick, l)}>
            <div className="box-head"><span className="box-head__letter">{l}</span><span className="box-head__word">{w}</span></div>
            {ordered.filter((c) => sel[c[0]] === l).map((c) => card(c, true))}
          </div>
        ))}
      </div>
      {!answered && Object.keys(sel).length > 0 && <div><button className="btn btn-ghost" onClick={() => setU({ asel: {}, amPick: null })}>Start again</button></div>}
    </div>
  );
}

/** 7.5 — closing line, downloads and sources. */
export function Close() {
  return (
    <div className="stack" style={{ gap: 40, marginTop: -24 }}>
      <p className="statement statement--close">
        You need curiosity, honesty and follow-through. <span className="accent"><br />Start small, and start soon.</span>
      </p>
      <div className="stack" style={{ gap: 10 }}>
        <Kicker>Downloads</Kicker>
        <div className="downloads">
          {DOWNLOADS.map(([t, d]) => (
            <div key={t} className="downloads__row">
              <div className="downloads__text"><span className="downloads__title">{t}</span><span className="muted downloads__desc">{d}</span></div>
              <button className="btn btn-secondary" onClick={() => placeholder(`"${t}"`)}>Download</button>
            </div>
          ))}
        </div>
      </div>
      <div className="stack" style={{ gap: 8 }}>
        <Kicker muted>Sources</Kicker>
        {SOURCES.map((t, i) => <span key={i} className="muted sources__item">{i + 1}. {t}</span>)}
      </div>
    </div>
  );
}

/** Print only the certificate, on one landscape US-letter page. The learner saves it as PDF from the print dialog. */
function printCertificate() {
  const root = document.documentElement;
  root.dataset.print = 'cert';
  const done = () => { delete root.dataset.print; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  (document.fonts?.ready ?? Promise.resolve()).then(() => window.print());
}

/** 7.6 — certificate of completion. */
export function Certificate() {
  return (
    <div className="stack" style={{ gap: 20, marginTop: -24 }}>
      <p className="cert__intro">You've completed the course. Download your certificate for your records.</p>
      <div className="cert__wrap">
        <div id="grow-cert" className="cert">
          <div className="cert__shape cert__shape--tl1" />
          <div className="cert__shape cert__shape--tl2" />
          <div className="cert__shape cert__shape--tl3" />
          <div className="cert__shape cert__shape--br1" />
          <div className="cert__shape cert__shape--br2" />
          <div className="cert__shape cert__shape--br3" />
          <div className="cert__frame" />
          <div className="cert__panel">
            <span className="cert__title">CERTIFICATE</span>
            <span className="cert__sub">Of Training Course Completion</span>
            <span className="cert__small cert__awarded">This certificate is awarded to</span>
            <span className="cert__name">John Doe</span>
            <span className="cert__small cert__course">Has successfully completed the training course on<br />Career Check-in Conversations: Coaching with GROW</span>
            <span className="cert__issued">ISSUED BY</span>
            <span className="cert__issuer">COACHING ACADEMY</span>
          </div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={printCertificate}>Download certificate (PDF)</button>
      </div>
    </div>
  );
}
