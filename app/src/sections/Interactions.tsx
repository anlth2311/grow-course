import type { Screen } from '../data/types';
import { useCourse, useScreenUI } from '../state/CourseContext';
import { Kicker, OptionRow, ResultPanel } from '../components/common';

/** Single-choice knowledge check: select, "Check answer", result panel, "Try again" if wrong. */
export function Mcq({ screen }: { screen: Screen }) {
  const q = screen.mcq!;
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const done = !!u.done, checked = !!u.checked, picked = u.picked;
  const partly = picked != null && q.partial?.[picked];
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="question">{q.q}</p>
      <div className="stack" style={{ gap: 8 }}>
        {q.opts.map((t, i) => {
          const isRight = done && i === q.correct;
          const isWrong = checked && !done && i === picked;
          const isSel = !checked && i === picked;
          return (
            <OptionRow
              key={i}
              letter={'ABCD'[i]}
              text={t}
              state={isRight ? 'correct' : isWrong ? 'wrong' : isSel ? 'selected' : undefined}
              tag={isRight ? 'Correct' : isWrong ? (q.partial?.[i] ? 'Partly right' : 'Not this one') : isSel ? 'Selected' : ''}
              onClick={() => !done && !checked && setU({ picked: i })}
            />
          );
        })}
      </div>
      {!checked && (
        <div>
          <button
            className="btn btn-primary"
            disabled={picked == null}
            onClick={() => {
              const ok = picked === q.correct;
              setU({ checked: true, done: ok });
              track('answered', screen.id, { response: 'ABCD'[picked!], success: ok });
            }}
          >
            Check answer
          </button>
        </div>
      )}
      {checked && (
        <ResultPanel
          ok={done}
          verdict={done ? 'Correct' : partly ? 'Partly right' : 'Not quite'}
          action={done ? undefined : { label: 'Try again', onClick: () => setU({ checked: false, picked: null }) }}
        >
          {done ? q.right : (q.notes?.[picked!] ? q.notes[picked!] + ' ' : '') + q.wrong}
        </ResultPanel>
      )}
    </div>
  );
}

/**
 * Free-text reflection. Depending on the screen it either just saves the response,
 * or opens a reveal box (suggested points, model answer, suggested answer).
 */
export function Reflection({ screen }: { screen: Screen }) {
  const r = screen.reflect!;
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const done = !!u.revealed;
  const hasBox = !!r.reveal;
  const submit = () => {
    setU({ revealed: true, boxOpen: true });
    track('responded', screen.id, { response: u.text || '' });
  };
  const peek = () => {
    const open = !u.boxOpen;
    setU({ boxOpen: open });
    if (open && !done) track('responded', screen.id, { response: '', skipped: true });
  };
  return (
    <div className="reflect">
      <Kicker weight={600}>{r.kicker}</Kicker>
      <label htmlFor="rf-text" className="reflect__prompt">{r.prompt}</label>
      <textarea id="rf-text" className="input reflect__input" value={u.text || ''} onChange={(e) => setU({ text: e.target.value })} placeholder="Type your answer" />
      <div className="check-row">
        <button className="btn btn-primary" onClick={submit}>{done && !hasBox ? 'Update response' : r.btn}</button>
        <span className="muted note">{done && !hasBox ? 'Saved. Only you can see this.' : ''}</span>
      </div>
      {r.after && <p className="reflect__after">{r.after}</p>}
      {hasBox && !r.noPeek && (
        <button className="reflect__peek" onClick={peek} aria-expanded={!!u.boxOpen}>
          {u.boxOpen ? 'Hide suggested answer' : 'Click to reveal suggested answer'}
        </button>
      )}
      {hasBox && u.boxOpen && (
        <div className="reveal">
          <span className="reveal__title">{r.revealTitle}</span>
          {r.model && <p className="reveal__model">{r.model}</p>}
          {r.reveal!.map((t, i) => (
            <div key={i} className="reveal__item"><span className="reveal__n">0{i + 1}</span><span>{t}</span></div>
          ))}
          {r.suggest && <div className="reveal__suggest"><p>{r.suggest}</p></div>}
        </div>
      )}
    </div>
  );
}
