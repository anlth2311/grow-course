import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CourseProvider } from './state/CourseContext';
import { Sidebar } from './components/Sidebar';
import { ScreenView } from './components/ScreenView';
import './styles/modernist.css';
import './styles/app.css';

function App() {
  return (
    <CourseProvider>
      <div className="shell">
        <Sidebar />
        <main className="main">
          <ScreenView />
        </main>
      </div>
    </CourseProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
