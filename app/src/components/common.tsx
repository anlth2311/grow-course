import type { ReactNode } from 'react';
import { useScreenUI } from '../state/CourseContext';

/** Small uppercase label used throughout. */
export function Kicker({ children, weight = 700, muted, className = '' }: { children: ReactNode; weight?: 600 | 700; muted?: boolean; className?: string }) {
  return <span className={`kicker${weight === 600 ? ' kicker--600' : ''}${muted ? ' kicker--muted' : ''} ${className}`}>{children}</span>;
}

/** Instruction on the left, red counter on the right ("2 of 4 turned"). */
export function IntroRow({ children, count }: { children: ReactNode; count?: ReactNode }) {
  return (
    <div className="intro-row">
      <span className="intro-row__text">{children}</span>
      {count != null && <span className="counter">{count}</span>}
    </div>
  );
}

/** Striped stand-in for an illustration that hasn't been supplied yet. */
export function ArtPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={'art-placeholder ' + className}>
      <span>{label}</span>
    </div>
  );
}

/** Collapsed "Takeaway" callout with Show/Hide. */
export function Takeaway({ text }: { text: string }) {
  const [u, setU] = useScreenUI();
  const open = !!u.tkOpen;
  return (
    <div className="takeaway">
      <button className="takeaway__head" onClick={() => setU((x) => ({ tkOpen: !x.tkOpen }))} aria-expanded={open}>
        <span className="kicker kicker--600 takeaway__label">Takeaway</span>
        <span className="takeaway__toggle">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && <span className="takeaway__text">{text}</span>}
    </div>
  );
}

/** Narration closing a screen, after a 2px rule. */
export function Narration({ text }: { text: string }) {
  return (
    <div className="narration">
      <span>{text}</span>
    </div>
  );
}

/** Dark (or red, when correct) feedback panel under a question. */
export function ResultPanel({ ok, verdict, children, action }: { ok: boolean; verdict: string; children: ReactNode; action?: { label: string; onClick: () => void } }) {
  return (
    <div className={'result-panel' + (ok ? ' is-ok' : '')} role="status">
      <span className="result-panel__verdict">{verdict}</span>
      <span className="result-panel__text">{children}</span>
      {action && (
        <button className="btn btn-secondary btn-on-dark" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

/** correct = red outline + tint; selected = dark outline; wrong = grey fill; picked-wrong = dark outline + grey fill. */
export type OptionState = 'correct' | 'wrong' | 'selected' | 'picked-wrong' | undefined;

/** Lettered answer row used by the knowledge checks and quizzes. */
export function OptionRow({ letter, text, tag, state, pressed, onClick }: { letter: ReactNode; text: string; tag?: string; state?: OptionState; pressed?: boolean; onClick: () => void }) {
  return (
    <div className={'option' + (state ? ' is-' + state : '')}>
      <button className="option__btn" onClick={onClick} aria-pressed={pressed}>
        <span className="option__letter">{letter}</span>
        <span className="option__text">{text}</span>
        <span className="option__tag">{tag}</span>
      </button>
    </div>
  );
}

/** Card that turns over on click. `front` and `back` share one grid cell, so the card grows to fit the longer side. */
export function FlipCard({ flipped, onClick, label, front, back, className = '' }: { flipped: boolean; onClick: () => void; label: string; front: ReactNode; back: ReactNode; className?: string }) {
  return (
    <button className={'flip ' + className} onClick={onClick} aria-pressed={flipped} aria-label={label}>
      <div className={'flip__inner' + (flipped ? ' is-flipped' : '')}>
        <div className="flip__face flip__front">{front}</div>
        <div className="flip__face flip__back">{back}</div>
      </div>
    </button>
  );
}

/** Count of truthy values in a record ("2 of 4 turned"). */
export const countOn = (r?: Record<string | number, boolean | undefined>) => Object.values(r || {}).filter(Boolean).length;

/** Toggle one key of a record-valued UI field. */
export const toggleKey = <K extends string | number>(r: Record<K, boolean> | undefined, k: K) => ({ ...(r || ({} as Record<K, boolean>)), [k]: !(r || ({} as Record<K, boolean>))[k] });
