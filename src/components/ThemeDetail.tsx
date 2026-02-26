import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { themes } from '../data/themes';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import type { ThemePreset } from '../types/theme';

const colorLabels: Record<string, string> = {
  background: 'Background',
  foreground: 'Foreground',
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  muted: 'Muted',
  border: 'Border',
};

const categoryLabels: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  colorful: 'Colorful',
  minimal: 'Minimal',
  brutalist: 'Brutalist',
};

function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)!.map((c) => {
      const v = parseInt(c, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagLevel(ratio: number): { label: string; color: string } {
  if (ratio >= 7) return { label: 'AAA', color: '#4ade80' };
  if (ratio >= 4.5) return { label: 'AA', color: '#a3e635' };
  if (ratio >= 3) return { label: 'AA Large', color: '#fbbf24' };
  return { label: 'Fail', color: '#f87171' };
}

// ── Section wrapper ──────────────────────────────────────────────────
function Section({ title, theme, children }: { title: string; theme: ThemePreset; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2
        style={{
          fontFamily: `'${theme.fonts.heading}', sans-serif`,
          fontSize: 20,
          fontWeight: 700,
          color: theme.colors.foreground,
          marginBottom: 28,
          paddingBottom: 12,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Color Palette ────────────────────────────────────────────────────
function ColorPalette({ theme }: { theme: ThemePreset }) {
  const { copiedValue, copy } = useCopyToClipboard();
  const groups = [
    { label: 'Core', keys: ['background', 'foreground'] },
    { label: 'Brand', keys: ['primary', 'secondary', 'accent'] },
    { label: 'Surface', keys: ['muted', 'border'] },
  ];

  return (
    <Section title="Color Palette" theme={theme}>
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: 32 }}>
          <h3
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 12,
              fontWeight: 600,
              color: theme.colors.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            {group.label}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {group.keys.map((key) => {
              const color = theme.colors[key as keyof typeof theme.colors];
              const isCopied = copiedValue === color;
              return (
                <motion.button
                  key={key}
                  onClick={() => copy(color)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    cursor: 'pointer',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius,
                    backgroundColor: theme.colors.muted,
                    padding: 0,
                    overflow: 'hidden',
                    width: 140,
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      height: 64,
                      backgroundColor: color,
                      borderBottom: `1px solid ${theme.colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCopied && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.background === color ? theme.colors.foreground : theme.colors.background }}>
                        Copied!
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.foreground, fontFamily: `'${theme.fonts.body}', sans-serif` }}>
                      {colorLabels[key]}
                    </div>
                    <div style={{ fontSize: 11, color: theme.colors.secondary, fontFamily: 'monospace', marginTop: 2 }}>
                      {color}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Contrast ratios */}
      <div style={{ marginTop: 24 }}>
        <h3
          style={{
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 12,
            fontWeight: 600,
            color: theme.colors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          Contrast Ratios
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {['foreground', 'primary', 'accent', 'secondary'].map((key) => {
            const color = theme.colors[key as keyof typeof theme.colors];
            const ratio = contrastRatio(color, theme.colors.background);
            const level = wcagLevel(ratio);
            return (
              <div
                key={key}
                style={{
                  padding: '10px 16px',
                  borderRadius: theme.borderRadius,
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.muted,
                  minWidth: 150,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.foreground, fontFamily: `'${theme.fonts.body}', sans-serif` }}>
                    {colorLabels[key]}
                  </span>
                </div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: theme.colors.secondary }}>
                  {ratio.toFixed(1)}:1{' '}
                  <span style={{ color: level.color, fontWeight: 600 }}>{level.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ── Typography ───────────────────────────────────────────────────────
function Typography({ theme }: { theme: ThemePreset }) {
  const headingSizes = [
    { label: 'Heading 1', size: 36 },
    { label: 'Heading 2', size: 28 },
    { label: 'Heading 3', size: 22 },
    { label: 'Heading 4', size: 18 },
  ];

  const isMonoBody = /mono/i.test(theme.fonts.body);
  const isMonoHeading = /mono/i.test(theme.fonts.heading);
  const hasMonoFont = isMonoBody || isMonoHeading;

  return (
    <Section title="Typography" theme={theme}>
      {/* Font families */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <span style={{ fontSize: 11, color: theme.colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Heading</span>
          <div style={{ fontFamily: `'${theme.fonts.heading}', sans-serif`, fontSize: 16, fontWeight: 700, color: theme.colors.primary, marginTop: 4 }}>
            {theme.fonts.heading}
          </div>
        </div>
        <div
          style={{
            padding: '12px 20px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <span style={{ fontSize: 11, color: theme.colors.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Body</span>
          <div style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 16, color: theme.colors.accent, marginTop: 4 }}>
            {theme.fonts.body}
          </div>
        </div>
      </div>

      {/* Headings */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Headings
      </h3>
      <div style={{ marginBottom: 32 }}>
        {headingSizes.map(({ label, size }) => (
          <div key={label} style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: 11, color: theme.colors.secondary, fontFamily: 'monospace', width: 80, flexShrink: 0 }}>
              {size}px
            </span>
            <span
              style={{
                fontFamily: `'${theme.fonts.heading}', sans-serif`,
                fontSize: size,
                fontWeight: 700,
                color: theme.colors.foreground,
                lineHeight: 1.2,
              }}
            >
              {label} — {theme.fonts.heading}
            </span>
          </div>
        ))}
      </div>

      {/* Body text */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Body Text
      </h3>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 16, color: theme.colors.foreground, lineHeight: 1.6, marginBottom: 8 }}>
          Primary text — {theme.fonts.body}, full opacity
        </p>
        <p style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 14, color: theme.colors.secondary, lineHeight: 1.6, marginBottom: 8 }}>
          Secondary text — muted for complementary information
        </p>
        <p style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 13, color: theme.colors.secondary, opacity: 0.6, lineHeight: 1.6 }}>
          Muted text — for help text and placeholders
        </p>
      </div>

      {/* Code */}
      {hasMonoFont && (
        <>
          <h3
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 12,
              fontWeight: 600,
              color: theme.colors.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            Code
          </h3>
          <div
            style={{
              padding: 20,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.muted,
              border: `1px solid ${theme.colors.border}`,
              fontFamily: `'${isMonoHeading ? theme.fonts.heading : theme.fonts.body}', monospace`,
              fontSize: 13,
              lineHeight: 1.7,
              color: theme.colors.foreground,
            }}
          >
            <div style={{ color: theme.colors.secondary }}>{'// Theme configuration'}</div>
            <div>
              <span style={{ color: theme.colors.primary }}>const</span>{' '}
              <span style={{ color: theme.colors.accent }}>theme</span> = {'{'}
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: theme.colors.secondary }}>name</span>:{' '}
              <span style={{ color: theme.colors.accent }}>'{theme.name}'</span>,
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: theme.colors.secondary }}>primary</span>:{' '}
              <span style={{ color: theme.colors.primary }}>'{theme.colors.primary}'</span>,
            </div>
            <div>{'}'}</div>
          </div>
        </>
      )}
    </Section>
  );
}

// ── Component Showcase ───────────────────────────────────────────────
function ComponentShowcase({ theme }: { theme: ThemePreset }) {
  return (
    <Section title="UI Components" theme={theme}>
      {/* Buttons */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Buttons
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
            border: 'none',
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: theme.shadow,
          }}
        >
          Primary
        </button>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: theme.borderRadius,
            backgroundColor: 'transparent',
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}`,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Secondary
        </button>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: theme.borderRadius,
            backgroundColor: 'transparent',
            color: theme.colors.secondary,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Ghost
        </button>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            color: theme.colors.secondary,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
          disabled
        >
          Disabled
        </button>
      </div>

      {/* Badges */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Badges
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Active', bg: '#4ade8022', color: '#4ade80' },
          { label: 'Warning', bg: '#fbbf2422', color: '#fbbf24' },
          { label: 'Error', bg: '#f8717122', color: '#f87171' },
          { label: 'Info', bg: `${theme.colors.primary}22`, color: theme.colors.primary },
        ].map((badge) => (
          <span
            key={badge.label}
            style={{
              padding: '5px 14px',
              borderRadius: '9999px',
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: `'${theme.fonts.body}', sans-serif`,
            }}
          >
            {badge.label}
          </span>
        ))}
      </div>

      {/* Cards */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Cards
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 260,
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            overflow: 'hidden',
            backgroundColor: theme.colors.muted,
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${theme.colors.border}`,
              fontFamily: `'${theme.fonts.heading}', sans-serif`,
              fontSize: 14,
              fontWeight: 700,
              color: theme.colors.foreground,
            }}
          >
            Card Header
          </div>
          <div
            style={{
              padding: '16px 18px',
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 13,
              color: theme.colors.secondary,
              lineHeight: 1.6,
            }}
          >
            Card content with standard padding and background.
          </div>
          <div
            style={{
              padding: '12px 18px',
              borderTop: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                padding: '6px 16px',
                borderRadius: theme.borderRadius,
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: `'${theme.fonts.body}', sans-serif`,
              }}
            >
              Action
            </span>
          </div>
        </div>

        <div
          style={{
            width: 260,
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.muted,
            padding: '20px 18px',
            boxShadow: theme.shadow,
          }}
        >
          <div
            style={{
              fontFamily: `'${theme.fonts.heading}', sans-serif`,
              fontSize: 14,
              fontWeight: 700,
              color: theme.colors.primary,
              marginBottom: 8,
            }}
          >
            Elevated Card
          </div>
          <div
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 13,
              color: theme.colors.secondary,
              lineHeight: 1.6,
            }}
          >
            Card with the theme's shadow applied.
          </div>
        </div>
      </div>

      {/* Form elements */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Form Elements
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Text input..."
          readOnly
          style={{
            padding: '10px 16px',
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.muted,
            color: theme.colors.foreground,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="text"
          value="Valid input"
          readOnly
          style={{
            padding: '10px 16px',
            borderRadius: theme.borderRadius,
            border: `1px solid #4ade80`,
            backgroundColor: theme.colors.muted,
            color: theme.colors.foreground,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="text"
          value="Invalid input"
          readOnly
          style={{
            padding: '10px 16px',
            borderRadius: theme.borderRadius,
            border: `1px solid #f87171`,
            backgroundColor: theme.colors.muted,
            color: theme.colors.foreground,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            outline: 'none',
          }}
        />
      </div>

      {/* Loading spinner */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Loading
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          style={{
            width: 24,
            height: 24,
            border: `2px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <button
          disabled
          style={{
            padding: '10px 24px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
            border: 'none',
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 14,
            fontWeight: 600,
            opacity: 0.7,
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              border: `2px solid ${theme.colors.background}40`,
              borderTopColor: theme.colors.background,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Loading...
        </button>
      </div>
    </Section>
  );
}

// ── Gradients & Effects ──────────────────────────────────────────────
function GradientsEffects({ theme }: { theme: ThemePreset }) {
  return (
    <Section title="Gradients & Effects" theme={theme}>
      {/* Gradient text */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Gradient Text
      </h3>
      <p
        style={{
          fontFamily: `'${theme.fonts.heading}', sans-serif`,
          fontSize: 32,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 32,
        }}
      >
        {theme.name} Theme
      </p>

      {/* Gradient line */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Gradient Line
      </h3>
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.secondary})`,
          borderRadius: 1,
          marginBottom: 32,
        }}
      />

      {/* Gradient border card */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Gradient Border
      </h3>
      <div
        style={{
          padding: 1,
          borderRadius: theme.borderRadius,
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.secondary})`,
          marginBottom: 32,
          maxWidth: 320,
        }}
      >
        <div
          style={{
            padding: '20px 18px',
            borderRadius: `calc(${theme.borderRadius} - 1px)`,
            backgroundColor: theme.colors.background,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
            fontSize: 13,
            color: theme.colors.secondary,
            lineHeight: 1.6,
          }}
        >
          Card with gradient border effect.
        </div>
      </div>

      {/* Glow */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Glow Effect
      </h3>
      <div
        style={{
          padding: '20px 18px',
          borderRadius: theme.borderRadius,
          backgroundColor: theme.colors.muted,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 0 20px ${theme.colors.primary}40, 0 0 40px ${theme.colors.accent}20`,
          maxWidth: 320,
          marginBottom: 32,
        }}
      >
        <div style={{ fontFamily: `'${theme.fonts.body}', sans-serif`, fontSize: 13, color: theme.colors.foreground }}>
          Element with multi-color glow shadow.
        </div>
      </div>

      {/* Shadow showcase */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Theme Shadow
      </h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['none', theme.shadow, `0 0 30px ${theme.colors.primary}30`].map((shadow, i) => (
          <div
            key={i}
            style={{
              width: 140,
              height: 80,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.muted,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: shadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: theme.colors.secondary, fontFamily: 'monospace' }}>
              {i === 0 ? 'none' : i === 1 ? 'default' : 'glow'}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Stats & Lists ────────────────────────────────────────────────────
function StatsAndLists({ theme }: { theme: ThemePreset }) {
  return (
    <Section title="Stats & Lists" theme={theme}>
      {/* Stats grid */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Counters
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 32, maxWidth: 500 }}>
        {[
          { number: '7', label: 'Colors' },
          { number: '2', label: 'Font Families' },
          { number: theme.borderRadius, label: 'Border Radius' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              padding: '20px 12px',
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.muted,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                fontFamily: `'${theme.fonts.heading}', sans-serif`,
                fontSize: 28,
                fontWeight: 700,
                color: theme.colors.primary,
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontFamily: `'${theme.fonts.body}', sans-serif`,
                fontSize: 12,
                color: theme.colors.secondary,
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Lists */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Lists
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginBottom: 8, fontFamily: `'${theme.fonts.body}', sans-serif` }}>Bullet list</div>
          {['Color palette', 'Typography scale', 'Component library'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: theme.colors.primary, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: theme.colors.foreground, fontFamily: `'${theme.fonts.body}', sans-serif` }}>{item}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginBottom: 8, fontFamily: `'${theme.fonts.body}', sans-serif` }}>Checklist</div>
          {['Fonts loaded', 'Colors defined', 'Shadows set'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: theme.colors.accent, fontSize: 14 }}>&#10003;</span>
              <span style={{ fontSize: 14, color: theme.colors.foreground, fontFamily: `'${theme.fonts.body}', sans-serif` }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── CSS Token Reference ──────────────────────────────────────────────
function TokenReference({ theme }: { theme: ThemePreset }) {
  const { copiedValue, copy } = useCopyToClipboard();

  const cssVars = Object.entries(theme.colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');
  const cssBlock = `:root {\n${cssVars}\n  --font-heading: '${theme.fonts.heading}', sans-serif;\n  --font-body: '${theme.fonts.body}', sans-serif;\n  --radius: ${theme.borderRadius};\n  --shadow: ${theme.shadow};\n}`;

  const jsonBlock = JSON.stringify({ id: theme.id, name: theme.name, category: theme.category, colors: theme.colors, fonts: theme.fonts, borderRadius: theme.borderRadius, shadow: theme.shadow }, null, 2);

  return (
    <Section title="CSS Tokens" theme={theme}>
      {/* CSS Variables */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <button
          onClick={() => copy(cssBlock)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '4px 12px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.background,
            color: copiedValue === cssBlock ? theme.colors.accent : theme.colors.secondary,
            border: `1px solid ${theme.colors.border}`,
            fontSize: 11,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          {copiedValue === cssBlock ? 'Copied!' : 'Copy'}
        </button>
        <pre
          style={{
            padding: '20px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.8,
            color: theme.colors.foreground,
            overflow: 'auto',
          }}
        >
          {cssBlock}
        </pre>
      </div>

      {/* JSON */}
      <h3
        style={{
          fontFamily: `'${theme.fonts.body}', sans-serif`,
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Raw JSON
      </h3>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => copy(jsonBlock)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '4px 12px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.background,
            color: copiedValue === jsonBlock ? theme.colors.accent : theme.colors.secondary,
            border: `1px solid ${theme.colors.border}`,
            fontSize: 11,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          {copiedValue === jsonBlock ? 'Copied!' : 'Copy'}
        </button>
        <pre
          style={{
            padding: '20px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.8,
            color: theme.colors.foreground,
            overflow: 'auto',
          }}
        >
          {jsonBlock}
        </pre>
      </div>
    </Section>
  );
}

// ── Main ThemeDetail Page ────────────────────────────────────────────
export function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const theme = themes.find((t) => t.id === id);

  if (!theme) {
    return (
      <div style={{ padding: 'clamp(24px, 4vw, 80px)', maxWidth: 900, margin: '0 auto' }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          &larr; Back to gallery
        </Link>
        <h1 style={{ color: '#e2e8f0', marginTop: 32, fontSize: 24 }}>Theme not found</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: `'${theme.fonts.body}', sans-serif`,
      }}
    >
      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px, 4vw, 80px)' }}>
        {/* Navigation */}
        <Link
          to="/"
          style={{
            color: theme.colors.secondary,
            textDecoration: 'none',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: `'${theme.fonts.body}', sans-serif`,
          }}
        >
          <span>&larr;</span> Back to gallery
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: 40, marginBottom: 56 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span
              style={{
                padding: '4px 14px',
                borderRadius: '9999px',
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {categoryLabels[theme.category]}
            </span>
          </div>
          <h1
            style={{
              fontFamily: `'${theme.fonts.heading}', sans-serif`,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: theme.colors.foreground,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {theme.name}
          </h1>
          <p
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: 16,
              color: theme.colors.secondary,
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            {theme.description}
          </p>

          {/* Mini color strip */}
          <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
            {Object.values(theme.colors).map((color, idx) => (
              <div
                key={idx}
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: color,
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <ColorPalette theme={theme} />
        <Typography theme={theme} />
        <ComponentShowcase theme={theme} />
        <GradientsEffects theme={theme} />
        <StatsAndLists theme={theme} />
        <TokenReference theme={theme} />

        {/* Footer nav */}
        <div
          style={{
            paddingTop: 32,
            borderTop: `1px solid ${theme.colors.border}`,
            marginTop: 32,
          }}
        >
          <Link
            to="/"
            style={{
              color: theme.colors.primary,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: `'${theme.fonts.body}', sans-serif`,
            }}
          >
            <span>&larr;</span> Back to all themes
          </Link>
        </div>
      </div>
    </div>
  );
}
