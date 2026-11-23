import { GROW, MODULES } from '../data/constants';
import { SCREENS } from '../data/screens';
import type { Screen, Step } from '../data/types';
import { useCourse, type ScreenUI } from '../state/CourseContext';

/** The GROW step to light up in the sidebar for the current screen. */
export function currentStep(s: Screen, u: ScreenUI): Step | null {
  if (s.lineSteps && s.lines) return u.hl || s.lineSteps[Math.min(u.shown || 1, s.lines.length) - 1];
  if (s.tabs) return u.tab || 'G';
  if (s.steps4) {
    const k = u.setStep ?? 4;
    return k > 0 && k < 4 ? GROW[k - 1][0] : null;
  }
  return s.step ?? null;
}

export function Sidebar() {
  const { screen: s, visited, ui, go, menuOpen, toggleMenu } = useCourse();
  const viewed = SCREENS.filter((x) => visited[x.id]).length;
  const step = currentStep(s, ui());

  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <div className="sidebar__brand">
          <div className="sidebar__titles">
            <div className="sidebar__kicker">First-time managers</div>
            <div className="sidebar__title">Career check-in conversations</div>
          </div>
          <button className="btn btn-secondary sidebar__menu-btn" onClick={toggleMenu} aria-expanded={menuOpen}>
            {menuOpen ? 'Close' : 'Modules'}
          </button>
        </div>
        <div className="sidebar__progress">
          <div className="progress-bar">
            <div style={{ width: Math.round((viewed / SCREENS.length) * 100) + '%' }} />
          </div>
          <div className="sidebar__progress-label">{viewed} of {SCREENS.length} screens viewed</div>
        </div>
      </div>

      <nav className={'sidebar__nav' + (menuOpen ? ' is-open' : '')} aria-label="Modules">
        {MODULES.map(([n, title, mins]) => {
          const screens = SCREENS.filter((x) => x.mod === n);
          const isCur = s.mod === n;
          return (
            <div className="module" key={n}>
              <button className="module__btn" onClick={() => go(screens[0].id)} aria-current={isCur ? 'true' : undefined}>
                <span className={'module__num' + (isCur ? ' is-current' : '')}>{n}</span>
                <span className="module__text">
                  <span className="module__title">{title}</span>
                  <span className="module__meta">{mins} min · {screens.filter((x) => visited[x.id]).length} of {screens.length} viewed</span>
                </span>
              </button>
              {isCur && (
                <div className="module__screens">
                  {screens.map((x) => (
                    <button key={x.id} className={'module__screen' + (x.id === s.id ? ' is-current' : '')} onClick={() => go(x.id)} aria-current={x.id === s.id ? 'page' : undefined}>
                      <span className="module__screen-id">{x.id}</span>
                      <span className="module__screen-title">{x.title}</span>
                      <span className="module__screen-mark">{visited[x.id] ? '✓' : ''}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar__grow">
        <div className="sidebar__grow-label">GROW · {step ? 'current step: ' + GROW.find((g) => g[0] === step)![1] : 'the model used throughout'}</div>
        <div className="grow-list">
          {GROW.map(([l, w, d]) => (
            <div key={l} className={'grow-item' + (step === l ? ' is-on' : '')}>
              <span className="grow-item__letter">{l}</span>
              <span className="grow-item__text">
                <span className="grow-item__word">{w}</span>
                <span className="grow-item__desc">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
