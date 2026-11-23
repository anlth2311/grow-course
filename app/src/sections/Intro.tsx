import { WELCOME } from '../data/constants';
import type { Screen } from '../data/types';
import { useCourse, useScreenUI } from '../state/CourseContext';

/** 1.1 — course title, tagline and the three key facts. */
export function Hero({ screen }: { screen: Screen }) {
  return (
    <div className="hero">
      <div className="hero__title">Career check-in conversations</div>
      <p className="hero__tagline">{screen.hero!.tagline}</p>
      <div className="fact-row">
        <div><div className="fact-row__big">45 min</div><div className="fact-row__small">self-paced</div></div>
        <div><div className="fact-row__big">7 modules</div><div className="fact-row__small">4 to 10 minutes each</div></div>
        <div><div className="fact-row__big">3 deep dives</div><div className="fact-row__small">full conversations</div></div>
      </div>
    </div>
  );
}

/** Words fade in one per tick: the "typing" reveal used on 1.1 and 3.3. */
export function TypedSentence({ words, tick, className, label }: { words: string[]; tick: number; className: string; label: string }) {
  return (
    <p className={className} aria-label={label}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="typed-word" style={{ opacity: tick > i ? 1 : 0 }}>{w} </span>
      ))}
    </p>
  );
}

const show = (on: boolean, dy = 10) => ({ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : dy}px)` });

/** 1.1 — welcome motion graphic: typed sentence, photo, three question bubbles, closing line. */
export function WelcomeMotion() {
  const { welcomeTick, playWelcome } = useCourse();
  const k = welcomeTick ?? 999;
  const on = (t: number) => k >= t;
  return (
    <div className="welcome">
      <TypedSentence className="welcome__sentence" words={WELCOME.words} tick={k} label={WELCOME.sentence} />
      <div className="welcome__stage anim-slow" style={show(on(WELCOME.img), 16)}>
        <img src="assets/welcome-two-women-cut.png" alt="Two colleagues talking over coffee at a table" className="welcome__photo" />
        <div className="welcome__bubbles">
          {WELCOME.qs.map((q, i) => {
            const v = on(WELCOME.bub[i]);
            return (
              <div key={q} className="welcome__bubble" style={{ opacity: v ? 1 : 0, transform: `translateY(${v ? 0 : 10}px) scale(${v ? 1 : 0.85})` }}>
                {q}
                <span className="welcome__tail" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="highlight-row anim" style={show(on(WELCOME.fin))}>
        <p className="highlight-row__text"><span className="highlight highlight--lg">This course will help you answer them.</span></p>
        <button className="btn btn-ghost" onClick={playWelcome}>Replay</button>
      </div>
    </div>
  );
}

const UsersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const TrendIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const AnchorIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></svg>
);

/** 1.2 — three outcomes, the headline claim, photo and two statistics. */
export function ManagerEffect() {
  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="outcomes">
        {([['Engagement', <UsersIcon />], ['Growth', <TrendIcon />], ['Retention', <AnchorIcon />]] as const).map(([label, icon]) => (
          <div key={label} className="outcomes__cell">{icon}<span>{label}</span></div>
        ))}
      </div>
      <p className="statement">
        Managers account for most of the difference in how engaged their teams are.<sup>1</sup>
      </p>
      <div className="photo photo--16x9">
        <img src="assets/manager-effect-red.png" alt="A manager in conversation with three colleagues around a table" />
      </div>
      <div className="stats">
        <Stat pre="At least" big="70%" label="of the variance in team engagement" text="is accounted for by the manager." source="Gallup, manager development research" />
        <Stat pre="Ranked" big="1st" label="Being a good coach" text="among the behaviors of Google's best managers." source="Google re:Work, Project Oxygen" />
      </div>
    </div>
  );
}

function Stat({ pre, big, label, text, source }: { pre: string; big: string; label: string; text: string; source: string }) {
  return (
    <div className="stats__col">
      <span className="stats__pre">{pre}</span>
      <span className="stats__big">{big}</span>
      <span className="stats__label">{label}</span>
      <span className="stats__text">{text}</span>
      <span className="stats__source">Source: {source}</span>
    </div>
  );
}

const TIMES = ['10:42 AM', '10:44 AM', '10:45 AM'];

/** 1.3 — the conversation as a chat channel, played line by line, then the narration. */
export function ChatConversation({ screen }: { screen: Screen }) {
  const c = screen.convo!;
  const [u, setU] = useScreenUI();
  const { every } = useCourse();
  const shown = u.shown || 0;
  const play = () => {
    setU({ shown: 1 });
    every(1400, (k) => {
      setU({ shown: k + 1 });
      return k + 1 >= c.lines.length;
    });
  };
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="chat-bar">
        <span className="muted chat-bar__cast">{c.cast}</span>
        <button className="btn btn-primary" onClick={play}>{shown ? 'Replay' : 'Play the conversation'}</button>
      </div>
      <div className="chat">
        <div className="chat__channel"><span>#</span>dev-team</div>
        <div className="chat__body" aria-live="polite">
          {c.lines.slice(0, shown).map(([who, text], i) => (
            <div key={i} className="chat__msg">
              <div role="img" aria-label={c.names[who]} className="chat__avatar" style={{ backgroundImage: `url(assets/${who === 'M' ? 'avatar-daniel' : 'avatar-priya'}.png)` }} />
              <div className="chat__content">
                <div className="chat__meta"><span className="chat__name">{c.names[who]}</span><span className="chat__time">{TIMES[i]}</span></div>
                <div className="chat__text">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="convo-close">{screen.narration}</p>
    </div>
  );
}
