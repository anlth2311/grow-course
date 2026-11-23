import { MAYA_TOMAS, placeholder } from '../data/constants';
import type { Screen, Speaker, Step } from '../data/types';
import { useCourse, useScreenUI } from '../state/CourseContext';
import { countOn, FlipCard, IntroRow, Kicker, toggleKey } from '../components/common';
import { currentStep } from '../components/Sidebar';

function CastCard({ role, name, desc }: { role: string; name: string; desc: string }) {
  return (
    <div className="cast-card">
      <Kicker weight={600}>{role}</Kicker>
      <span className="cast-card__name">{name}</span>
      <span className="cast-card__desc">{desc}</span>
    </div>
  );
}

/** 4.1 — scene photo and the two character cards. */
export function Setup() {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grayscale photo photo--15x8">
        <img src="assets/scenario-4-1.png" alt="Maya and Tomás talking across a desk during their development conversation" style={{ objectPosition: '50% 40%' }} />
      </div>
      <div className="cast">
        <CastCard role="Employee" name="Tomás" desc="Senior content specialist. Three years at the company, consistently delivers good work." />
        <CastCard role="Manager" name="Maya" desc="Marketing team lead, four months in the role." />
      </div>
    </div>
  );
}

/** 5.1, 6.1 — scene photo, character cards, the opening quote and (6.1) background facts. */
export function SetupX({ screen }: { screen: Screen }) {
  const x = screen.setupX!;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div
        role="img"
        aria-label={x.photo}
        className="grayscale scene-photo"
        style={{ backgroundImage: `url(${x.img})`, filter: x.bright ? `grayscale(1) brightness(${x.bright})` : 'grayscale(1)' }}
      />
      <div className="cast">
        {x.cast.map(([role, name, desc]) => <CastCard key={name} role={role} name={name} desc={desc} />)}
      </div>
      <div className="quote-card">
        <Kicker>{x.quoteWho} says</Kicker>
        <span className="quote-card__text">{x.quote}</span>
      </div>
      {x.bg && (
        <div className="facts">
          <Kicker className="facts__label">Background</Kicker>
          {x.bg.map(([k, v]) => (
            <div key={k} className="facts__row">
              <span className="facts__key">{k}</span>
              <span className="facts__val">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Said({ ini, name, text, dark, italic, size = 18 }: { ini: string; name: string; text: string; dark?: boolean; italic?: boolean; size?: number }) {
  return (
    <div className="said">
      <span className={'initial' + (dark ? ' is-dark' : '')}>{ini}</span>
      <div>
        <div className="said__name">{name}</div>
        <div className="said__text" style={{ fontSize: size, fontStyle: italic ? 'italic' : undefined }}>{text}</div>
      </div>
    </div>
  );
}

/** 5.2 — Lena's line, then the common and better reactions side by side. */
export function Compare({ screen }: { screen: Screen }) {
  const c = screen.compare!;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <Said ini="L" name="Lena" text={c.context} italic />
      <div className="grid-2" style={{ gap: 24 }}>
        {c.cols.map(([label, line, effect, good]) => (
          <div key={label} className={'reaction' + (good ? ' is-good' : '')}>
            <span className="kicker reaction__label">{label}</span>
            <Said ini="S" name="Sam" text={line} dark />
            <div className="reaction__effect">
              <Kicker>Effect</Kicker>
              <span className="reaction__effect-text">{effect}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 5.5 — three pocket questions. */
export function Pocket({ screen }: { screen: Screen }) {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="cols-3" style={{ gap: 8 }}>
        {screen.pocket!.map((t, i) => (
          <div key={i} className="pocket-card">
            <span className="big-num">0{i + 1}</span>
            <span className="pocket-card__text">"{t}"</span>
          </div>
        ))}
      </div>
      <div><button className="btn btn-secondary" onClick={() => placeholder('the printable pocket-questions card')}>Download pocket questions</button></div>
    </div>
  );
}

const TIMER: [Step, string, string][] = [['G', '1 min', 'Goal'], ['R', '2 min', 'Reality'], ['O', '3 min', 'Options'], ['W', '2 min', 'Will']];

/** 5.3 — timer bar; selecting a step highlights its lines in the conversation. */
export function Timer({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const { track } = useCourse();
  const step = currentStep(screen, u);
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="timer__head">
        <Kicker>About eight minutes</Kicker>
        <span className="timer__hint">Select a step to highlight it in the conversation.</span>
      </div>
      <div className="timer">
        {TIMER.map(([l, mins, w]) => (
          <button
            key={l}
            className={'timer__step' + (step === l ? ' is-on' : '')}
            aria-pressed={u.hl === l}
            aria-label={`${w}, ${mins}. Highlight in the conversation`}
            onClick={() => {
              const off = u.hl === l;
              setU({ hl: off ? null : l, shown: screen.lines!.length });
              if (!off) track('interacted', screen.id, { response: w });
            }}
          >
            <span className="timer__letter">{l}</span>
            <span className="timer__mins">{mins}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const DialogueHead = () => (
  <div className="dlg__head"><span className="dlg__col-text">Dialogue</span><span className="dlg__col-tech">Technique shown</span></div>
);

/** Annotated dialogue: rows revealed one line at a time (4.2–4.6, 5.3) or a single speech bubble per line (6.3, 6.4). */
export function Dialogue({ screen }: { screen: Screen }) {
  const lines = screen.lines!;
  const names: Record<Speaker, string> = screen.names || MAYA_TOMAS;
  const [u, setU] = useScreenUI();
  const n = lines.length;
  const shown = Math.min(u.shown || 1, n);
  const counter = `${shown} of ${n} lines`;

  if (screen.dialogue === 'stage') {
    const c = lines[shown - 1];
    const isM = c.who === 'M';
    return (
      <div className="stack" style={{ gap: 16 }}>
        <div className="dlg">
          <DialogueHead />
          <div className="stage">
            <div className={'stage__speaker' + (isM ? '' : ' is-right')} aria-live="polite">
              <div className={'stage__bubble' + (isM ? ' is-dark' : '')}>
                <div className="stage__text">{c.text}</div>
                <span className={'stage__tail' + (isM ? '' : ' is-right')} />
              </div>
              <div className="stage__person">
                <div role="img" aria-label={names[c.who]} className="stage__avatar" style={{ backgroundImage: screen.avatars ? `url(${screen.avatars[c.who]})` : undefined }} />
                <span className="stage__name">{names[c.who]}</span>
              </div>
            </div>
            <div className="stage__tech">
              <Kicker weight={600}>Line {shown}</Kicker>
              <span className="stage__tech-text">{c.tech}</span>
            </div>
          </div>
        </div>
        <div className="check-row check-row--tight">
          <button className="btn btn-secondary" onClick={() => shown > 1 && setU({ shown: shown - 1 })} disabled={shown <= 1}>Previous line</button>
          <button className="btn btn-primary" onClick={() => setU({ shown: shown + 1 })} disabled={shown >= n}>Next line</button>
          <span className="muted note">{counter}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="dlg">
        <DialogueHead />
        {lines.slice(0, shown).map((l, i) => {
          const hl = u.hl && screen.lineSteps ? (screen.lineSteps[i] === u.hl ? ' is-hl' : ' is-dim') : '';
          return (
            <div key={i} className={'dlg__row' + hl}>
              <div className="dlg__col-text dlg__line">
                <span className={'initial' + (l.who === 'M' ? ' is-dark' : '')}>{screen.names ? names[l.who][0] : l.who}</span>
                <div className="dlg__said"><div className="said__name">{names[l.who]}</div><div className="dlg__text">{l.text}</div></div>
              </div>
              <div className="dlg__col-tech dlg__tech">{l.tech}</div>
            </div>
          );
        })}
      </div>
      <div className="check-row check-row--tight">
        {shown < n && <>
          <button className="btn btn-primary" onClick={() => setU({ shown: shown + 1 })}>Next line</button>
          <button className="btn btn-secondary" onClick={() => setU({ shown: n })}>Show full conversation</button>
        </>}
        {shown >= n && n > 1 && <button className="btn btn-secondary" onClick={() => setU({ shown: 1, hl: null })}>Show one line at a time</button>}
        <span className="muted note">{counter}</span>
      </div>
    </div>
  );
}

/** 4.4 — pick what Maya says; each choice plays out before returning to the options. */
export function Branch({ screen }: { screen: Screen }) {
  const b = screen.branch!;
  const [u, setU] = useScreenUI();
  const { track, after } = useCourse();
  const tried = u.tried || [];
  const playing = u.playing != null ? b.options[u.playing] : null;
  const choose = (i: number) => {
    setU((x) => ({ tried: [...new Set([...(x.tried || []), i])], best: x.best || !!b.options[i].best }));
    track('answered', screen.id, { response: 'ABC'[i], success: !!b.options[i].best });
    setU({ playing: i, playStep: 0 });
    after(900, () => setU({ playStep: 1 }));
  };
  const stepStyle = { opacity: u.playStep ? 1 : 0 };
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="ask-card">
        <Kicker weight={600}>{b.askWho}</Kicker>
        <span className="ask-card__text">{b.askText}</span>
      </div>
      {!playing && (
        <div className="stack" style={{ gap: 10 }}>
          <span className="branch__prompt">{u.best ? 'You found the best response. Review the others if you like.' : b.prompt}</span>
          {b.options.map((o, i) => {
            const t = tried.includes(i);
            return (
              <div key={i} className={'branch-opt' + (t && o.best ? ' is-best' : '')}>
                <button className="branch-opt__btn" onClick={() => choose(i)}>
                  <span className="option__letter">{'ABC'[i]}</span>
                  <span className="option__text">{o.text}</span>
                  <span className={'option__tag' + (o.best ? '' : ' is-muted')}>{t ? (o.best ? 'Best' : 'Not quite') : ''}</span>
                </button>
                {t && <div className="branch-opt__result">{o.result}</div>}
              </div>
            );
          })}
        </div>
      )}
      {playing && (
        <div className="playout">
          <div className="playout__head">How option {'ABC'[u.playing!]} plays out</div>
          <div className="playout__body">
            <Said ini={b.speaker[0]} name={b.speaker} text={playing.text} dark />
            <div className="playout__when anim-fade" style={stepStyle}>
              <Kicker weight={600}>{playing.when}</Kicker>
              <span className="playout__rule" />
            </div>
            <p className="playout__result anim-fade anim-delay" style={stepStyle}>{playing.result}</p>
            <div><button className="btn btn-primary" onClick={() => setU({ playing: null })}>{playing.best ? 'Back to the choices' : 'Choose again'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 4.6 — the written development plan, shown once the conversation ends. */
export function DevPlan({ ready }: { ready: boolean }) {
  if (!ready) return <div className="plan-locked">The written development plan appears when you reach the end of the conversation.</div>;
  return (
    <div className="plan">
      <div className="plan__head">
        <span className="plan__title">Development plan · Tomás</span>
        <span className="muted plan__meta">Agreed with Maya · Written up by Tomás</span>
      </div>
      <div className="plan__row">
        <Kicker className="plan__key">G · Goal</Kicker>
        <span className="plan__val">Move into a people-manager role within two years. Drivers: helping newer writers improve, and more say in what the team publishes.</span>
      </div>
      <div className="plan__row">
        <Kicker className="plan__key">R · Reality</Kicker>
        <span className="plan__val">Strengths: the strongest editorial judgment on the team; mentored two interns through their projects. To build: raising problems early; leading a project end to end.</span>
      </div>
      <div className="plan__row">
        <Kicker className="plan__key">W · Priority actions</Kicker>
        <div className="plan__val plan__table">
          <table className="table">
            <thead><tr><th>Action</th><th>Owner</th><th>When</th></tr></thead>
            <tbody>
              <tr><td>Take over the weekly status report to leadership</td><td>Tomás</td><td>Starts next week</td></tr>
              <tr><td>Lead the autumn campaign</td><td>Tomás</td><td>Once confirmed</td></tr>
              <tr><td>Confirm Tomás as campaign lead with the director</td><td>Maya</td><td>This week</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="plan__row">
        <Kicker className="plan__key">Check-ins</Kicker>
        <span className="plan__val">20 minutes, first Monday of each month.</span>
      </div>
      <div className="plan__row">
        <Kicker className="plan__key">Template</Kicker>
        <span className="plan__val plan__template">
          Use the same structure with your team.{' '}
          <button className="btn btn-secondary" onClick={() => placeholder('the development plan template')}>Download plan template</button>
        </span>
      </div>
    </div>
  );
}

/** 4.7 — the seven techniques, in two columns (01–04, 05–07). */
export function Recap({ screen }: { screen: Screen }) {
  return (
    <div className="stack" style={{ gap: 10 }}>
      <Kicker weight={600}>Techniques you saw</Kicker>
      <div className="recap">
        {screen.recap!.map((t, i) => (
          <div key={t} className="recap__item"><span className="recap__n">0{i + 1}</span><span className="recap__t">{t}</span></div>
        ))}
      </div>
    </div>
  );
}

/** 6.5 — "Don't say" cards that flip to "Say instead". */
export function SayInstead({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const fs = u.flips || {};
  const cards = screen.flips!;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <IntroRow count={`${countOn(fs)} of ${cards.length} turned`}>Select a card to see what to say instead.</IntroRow>
      <div className="grid-2">
        {cards.map(([dont, say], i) => (
          <FlipCard
            key={i}
            className="flip--220"
            flipped={!!fs[i]}
            onClick={() => setU((x) => ({ flips: toggleKey(x.flips, i) }))}
            label={"Don't say " + dont + (fs[i] ? '. Say instead ' + say : '')}
            front={<>
              <span className="flip__num">0{i + 1}</span>
              <span className="flip__kicker flip__kicker--ink">Don't say</span>
              <span className="flip__title flip__title--loose">{dont}</span>
              <span className="flip__cue">Say instead →</span>
            </>}
            back={<>
              <span className="flip__num">0{i + 1}</span>
              <span className="flip__kicker">Say instead</span>
              <span className="flip__answer flip__answer--18">{say}</span>
              <span className="flip__cue">← Don't say</span>
            </>}
          />
        ))}
      </div>
    </div>
  );
}
