import { placeholder, SCENARIO_MAP, SETTINGS } from '../data/constants';
import type { Screen } from '../data/types';
import { useCourse, useScreenUI } from '../state/CourseContext';
import { countOn, IntroRow, toggleKey } from '../components/common';

/** 2.1 — narration, then one row per setting (text + photo; row 2 mirrored). */
export function Settings({ screen }: { screen: Screen }) {
  const [u] = useScreenUI();
  const step = u.setStep ?? 3;
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="narr-top">{screen.narration}</p>
      <div className="stack">
        {SETTINGS.map((c, i) => {
          const on = step > i;
          return (
            <div key={c.name} className={'setting anim' + (i === 1 ? ' setting--mirror' : '')} style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 12}px)` }}>
              <div className="setting__text">
                <span className="big-num">0{i + 1}</span>
                <span className="setting__name">{c.name}</span>
                <span className="tag tag-accent setting__tag">{c.cadence}</span>
                <span className="setting__desc">{c.desc}</span>
              </div>
              <div role="img" aria-label={c.photo} className="grayscale setting__photo" style={{ backgroundImage: `url(${c.img})`, backgroundSize: c.size, backgroundPosition: c.pos }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 2.2 — all 17 situations by setting; cards open to show what each tests. */
export function ScenarioMap({ screen }: { screen: Screen }) {
  const [u, setU] = useScreenUI();
  const { go, track } = useCourse();
  const open = u.open || {};
  return (
    <div className="stack" style={{ gap: 28 }}>
      <IntroRow count={`${countOn(open)} of ${SCENARIO_MAP.length} opened`}>
        Select a card to see what the situation tests. Starred cards are the three conversations this course examines in depth.
      </IntroRow>
      {SETTINGS.map((g, gi) => (
        <div key={g.name} className="stack" style={{ gap: 10 }}>
          <div className="map-group__head">
            <span className="map-group__name">{g.name}</span>
            <span className="muted map-group__cadence">{g.cadence}</span>
          </div>
          <div className="map-grid">
            {SCENARIO_MAP.map((c, ci) => [c, ci] as const)
              .filter(([c]) => c[0] === gi)
              .map(([[, title, tests, deep], ci]) => {
                const isOpen = !!open[ci];
                return (
                  <div key={ci} className={'map-card' + (deep ? ' is-deep' : '') + (isOpen ? ' is-open' : '')}>
                    <button
                      className="map-card__btn"
                      aria-expanded={isOpen}
                      onClick={() => {
                        setU((x) => ({ open: toggleKey(x.open, ci) }));
                        if (!isOpen) track('interacted', screen.id, { response: title });
                      }}
                    >
                      <span className={'map-card__kicker' + (deep ? ' is-deep' : '')}>{deep ? `★ Deep dive ${deep} · Module ${deep + 3}` : 'Job aid'}</span>
                      <span className="map-card__title">{title}</span>
                    </button>
                    {isOpen && (
                      <div className="map-card__body">
                        <span className="map-card__label">What it tests</span>
                        <span className="map-card__tests">{tests}</span>
                        <button
                          className="btn btn-secondary map-card__action"
                          onClick={() => (deep ? go(`${deep + 3}.1`) : placeholder(`the one-page job aid for "${title}"`))}
                        >
                          {deep ? `Go to Module ${deep + 3}` : 'Download job aid'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
