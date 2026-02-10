import { themes } from './data/themes';
import { Header } from './components/Header';
import { ThemeGrid } from './components/ThemeGrid';

export default function App() {
  return (
    <div className="min-h-screen max-w-[1600px] mx-auto" style={{ padding: 'clamp(24px, 4vw, 80px)' }}>
      <Header />
      <ThemeGrid themes={themes} />
    </div>
  );
}
