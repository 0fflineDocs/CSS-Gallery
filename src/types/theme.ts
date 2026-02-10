export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'colorful' | 'minimal' | 'brutalist';
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  shadow: string;
}

export type ThemeCategory = ThemePreset['category'];
