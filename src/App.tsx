import { Routes, Route } from 'react-router-dom';
import { themes } from './data/themes';
import { Header } from './components/Header';
import { ThemeGrid } from './components/ThemeGrid';
import { ThemeDetail } from './components/ThemeDetail';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen max-w-[1600px] mx-auto" style={{ padding: 'clamp(24px, 4vw, 80px)' }}>
            <Header />
            <ThemeGrid themes={themes} />
          </div>
        }
      />
      <Route path="/theme/:id" element={<ThemeDetail />} />
    </Routes>
  );
}
