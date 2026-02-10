import type { ThemePreset } from '../types/theme';

interface ThemePreviewProps {
  theme: ThemePreset;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const { colors, fonts } = theme;

  return (
    <div
      style={{
        backgroundColor: colors.background,
        fontFamily: `'${fonts.body}', sans-serif`,
        padding: '28px 28px 32px 28px',
      }}
    >
      {/* Row: Title (heading font name) + Primary */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
        <p
          style={{
            fontFamily: `'${fonts.heading}', sans-serif`,
            fontSize: 22,
            fontWeight: 700,
            color: colors.foreground,
            lineHeight: 1.2,
          }}
        >
          {fonts.heading}
        </p>
        <p
          style={{
            fontFamily: `'${fonts.heading}', sans-serif`,
            fontSize: 16,
            fontWeight: 700,
            color: colors.primary,
            lineHeight: 1.4,
            flexShrink: 0,
          }}
        >
          Primary
        </p>
      </div>

      {/* Row: Subtitle (body font name) + Accent */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginTop: '28px' }}>
        <p
          style={{
            fontFamily: `'${fonts.body}', sans-serif`,
            fontSize: 14,
            color: colors.secondary,
            lineHeight: 1.4,
          }}
        >
          {fonts.body}
        </p>
        <p
          style={{
            fontFamily: `'${fonts.heading}', sans-serif`,
            fontSize: 16,
            fontWeight: 700,
            color: colors.accent,
            lineHeight: 1.4,
            flexShrink: 0,
          }}
        >
          Accent
        </p>
      </div>

      {/* Color palette */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
        {Object.values(colors).map((color, idx) => (
          <div
            key={idx}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: color,
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>

      {/* Description text */}
      <p
        style={{
          fontFamily: `'${fonts.body}', sans-serif`,
          fontSize: 12,
          color: colors.secondary,
          lineHeight: 1.6,
          marginTop: '24px',
          minHeight: '3.2em',
        }}
      >
        {theme.description}
      </p>
    </div>
  );
}
