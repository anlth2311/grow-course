# Career check-in conversations — GROW course

The eLearning course designed in Claude Design (`../project/GROW Course.dc.html`), built as a Vite + React + TypeScript single-page app. Seven modules and 39 screens, using the Modernist design system.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check, then static build in dist/
npm run preview    # serve dist/
```

The build uses relative paths, so you can host `dist/` anywhere or wrap it for an LMS.

## Where things live

| Path | What |
| --- | --- |
| `src/data/screens.ts` | Every screen's content: text, questions, answers and feedback. Most content edits happen here. |
| `src/data/constants.ts` | Module list, GROW definitions, scenario map, downloads, sources and animation timings. |
| `src/data/types.ts` | The content model. A screen's fields decide which sections it shows. |
| `src/components/ScreenView.tsx` | Renders the current screen's sections in a fixed order, then the footer. |
| `src/sections/*` | The sections: intro (1.x), settings and map (2.x), the model (3.x), deep dives (4–6), wrap-up (7.x). |
| `src/state/CourseContext.tsx` | Current screen, visited screens, each screen's interaction state, timers and persistence. |
| `src/state/lms.ts` | The LMS hook (see below). |
| `src/styles/modernist.css` | The design system's tokens and components, unchanged from the bundle. |
| `src/styles/app.css` | Course layout and components. The breakpoint is 860px. |

## Progress and LMS

Progress, the bookmark and every answer are saved in `localStorage` under `grow-course-v1`.

Each learner action also produces an xAPI-shaped statement (`launched`, `experienced`, `answered`, `responded`, `interacted`, `committed`, `completed`). A SCORM or xAPI wrapper can receive them by defining `window.LMS = { send(statement) { … } }` before the app loads. All statements are also collected in `window.courseStatements`.

## Placeholders still to supply

- Downloads (alerts for now): the pre-conversation checklist, the pocket-questions card, the development plan template and the 14 job aids.
- Illustrations for the comic panels on 3.4 and 3.5 (striped placeholders).
- The reminder email on 7.3 (a dashed note).
- Module 6's real promotion criteria, cycle and escalation path.
