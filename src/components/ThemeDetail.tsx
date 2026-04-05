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

function Subheading({ theme, children }: { theme: ThemePreset; children: React.ReactNode }) {
  return (
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
      {children}
    </h3>
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

function VisualShowcase({ theme }: { theme: ThemePreset }) {
  const meters = [
    { label: 'Color balance', value: 87, color: theme.colors.primary },
    { label: 'Readability', value: 82, color: theme.colors.accent },
    { label: 'Depth', value: 68, color: theme.colors.secondary },
  ];

  const tableRows = [
    { id: 'ID1', primary: 5, accent: 6, muted: 10 },
    { id: 'ID2', primary: 7, accent: 1, muted: 13 },
    { id: 'ID3', primary: 3, accent: 2, muted: 2 },
  ];

  const totals = tableRows.reduce(
    (acc, row) => ({
      primary: acc.primary + row.primary,
      accent: acc.accent + row.accent,
      muted: acc.muted + row.muted,
    }),
    { primary: 0, accent: 0, muted: 0 }
  );

  return (
    <Section title="Visuals" theme={theme}>
      <Subheading theme={theme}>Colored Meters</Subheading>
      <div style={{ display: 'grid', gap: 12, marginBottom: 32, maxWidth: 580 }}>
        {meters.map((meter) => (
          <div key={meter.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: theme.colors.secondary, fontFamily: `'${theme.fonts.body}', sans-serif` }}>{meter.label}</span>
            <div
              style={{
                height: 10,
                borderRadius: 9999,
                backgroundColor: `${theme.colors.border}90`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${meter.value}%`,
                  height: '100%',
                  borderRadius: 9999,
                  background: `linear-gradient(90deg, ${meter.color}, ${theme.colors.accent})`,
                  boxShadow: `0 0 12px ${meter.color}40`,
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.foreground, fontFamily: 'monospace' }}>{meter.value}%</span>
          </div>
        ))}
      </div>

      <Subheading theme={theme}>Charts</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginBottom: 14 }}>Donut metric</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: `conic-gradient(${theme.colors.primary} 0 62%, ${theme.colors.accent} 62% 87%, ${theme.colors.border} 87% 100%)`,
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: '50%',
                  backgroundColor: theme.colors.background,
                  display: 'grid',
                  placeItems: 'center',
                  color: theme.colors.foreground,
                  fontFamily: `'${theme.fonts.heading}', sans-serif`,
                  fontWeight: 700,
                }}
              >
                87%
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: theme.colors.secondary }}>Coverage mix for the {theme.name} palette system.</div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginBottom: 14 }}>Pie chart</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `conic-gradient(${theme.colors.primary} 0 38%, ${theme.colors.accent} 38% 67%, ${theme.colors.secondary} 67% 100%)`,
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { label: 'Primary', color: theme.colors.primary },
                { label: 'Accent', color: theme.colors.accent },
                { label: 'Secondary', color: theme.colors.secondary },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontSize: 12, color: theme.colors.foreground }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginBottom: 14 }}>Bar chart</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
            {[
              { label: 'Mon', height: 54, color: theme.colors.secondary },
              { label: 'Tue', height: 82, color: theme.colors.primary },
              { label: 'Wed', height: 66, color: theme.colors.accent },
              { label: 'Thu', height: 92, color: theme.colors.foreground },
            ].map((bar) => (
              <div key={bar.label} style={{ display: 'grid', justifyItems: 'center', gap: 8, flex: 1 }}>
                <div style={{ width: '100%', height: bar.height, borderRadius: '8px 8px 0 0', background: `linear-gradient(180deg, ${bar.color}, ${bar.color}80)` }} />
                <span style={{ fontSize: 11, color: theme.colors.secondary, fontFamily: 'monospace' }}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Subheading theme={theme}>Table + Logs</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ color: theme.colors.secondary, textAlign: 'left' }}>
                <th style={{ paddingBottom: 10 }}>ID</th>
                <th style={{ paddingBottom: 10 }}>P1</th>
                <th style={{ paddingBottom: 10 }}>P2</th>
                <th style={{ paddingBottom: 10 }}>P3</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: '10px 0', color: theme.colors.foreground }}>{row.id}</td>
                  <td style={{ color: theme.colors.secondary }}>{row.primary}</td>
                  <td style={{ color: theme.colors.secondary }}>{row.accent}</td>
                  <td style={{ color: theme.colors.secondary }}>{row.muted}</td>
                </tr>
              ))}
              <tr style={{ borderTop: `1px solid ${theme.colors.border}`, fontWeight: 700 }}>
                <td style={{ paddingTop: 10, color: theme.colors.foreground }}>Total</td>
                <td style={{ paddingTop: 10, color: theme.colors.primary }}>{totals.primary}</td>
                <td style={{ paddingTop: 10, color: theme.colors.accent }}>{totals.accent}</td>
                <td style={{ paddingTop: 10, color: theme.colors.foreground }}>{totals.muted}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          <div style={{ color: theme.colors.secondary, marginBottom: 10 }}>SYSTEM LOG</div>
          <div style={{ color: theme.colors.foreground, marginBottom: 8 }}>syncing {theme.id} palette...</div>
          <div style={{ color: theme.colors.accent, marginBottom: 8 }}>+ gradient cards enabled</div>
          <div style={{ color: '#4ade80', marginBottom: 8 }}>+ counters calibrated</div>
          <div style={{ color: theme.colors.secondary }}>
            ready <span style={{ animation: 'blink 1.1s step-end infinite' }}>_</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ModernWebEssentials({ theme }: { theme: ThemePreset }) {
  const alerts = [
    { label: 'Success', title: 'Palette saved', text: `${theme.name} tokens were copied.`, color: '#4ade80', bg: '#4ade8018' },
    { label: 'Info', title: 'Draft updated', text: 'Counters and charts are now live.', color: theme.colors.primary, bg: `${theme.colors.primary}18` },
    { label: 'Warning', title: 'Contrast check', text: 'Secondary text is display-only.', color: '#fbbf24', bg: '#fbbf2418' },
  ];

  return (
    <Section title="Modern Web Essentials" theme={theme}>
      <Subheading theme={theme}>Alerts & Toast</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          {alerts.map((alert) => (
            <div
              key={alert.label}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '12px 14px',
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: alert.bg,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: alert.color, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.foreground }}>{alert.title}</div>
                <div style={{ fontSize: 12, color: theme.colors.secondary, marginTop: 2 }}>{alert.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            alignSelf: 'start',
            padding: '14px 16px',
            borderRadius: theme.borderRadius,
            background: `linear-gradient(135deg, ${theme.colors.primary}1f, ${theme.colors.background})`,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.colors.secondary, marginBottom: 6 }}>Toast</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.foreground }}>Theme preview saved</div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, marginTop: 4 }}>Just now · synced across devices</div>
        </div>
      </div>

      <Subheading theme={theme}>Tabs, Toggle & Avatars</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              gap: 6,
              padding: 4,
              backgroundColor: theme.colors.background,
              borderRadius: 9999,
              marginBottom: 14,
            }}
          >
            {['Overview', 'Analytics', 'Tokens'].map((tab, index) => (
              <span
                key={tab}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  backgroundColor: index === 0 ? theme.colors.primary : 'transparent',
                  color: index === 0 ? theme.colors.background : theme.colors.secondary,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 13, color: theme.colors.foreground, marginBottom: 6 }}>Editorial system overview</div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, lineHeight: 1.6 }}>
            Tabs are great for dashboard layouts, settings panels, and analytics views.
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            display: 'grid',
            gap: 14,
          }}
        >
          {[
            { label: 'Auto-save presets', enabled: true },
            { label: 'Reduced motion', enabled: false },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: theme.colors.foreground }}>{item.label}</span>
              <span
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 9999,
                  backgroundColor: item.enabled ? theme.colors.primary : theme.colors.background,
                  border: `1px solid ${item.enabled ? theme.colors.primary : theme.colors.border}`,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: item.enabled ? 20 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: item.enabled ? theme.colors.background : theme.colors.secondary,
                    transition: 'left 0.2s ease',
                  }}
                />
              </span>
            </div>
          ))}

          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, color: theme.colors.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Avatar group</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['WS', 'UI', 'UX'].map((initials, index) => (
                <div
                  key={initials}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    marginLeft: index === 0 ? 0 : -8,
                    border: `2px solid ${theme.colors.background}`,
                    backgroundColor: [theme.colors.primary, theme.colors.accent, theme.colors.secondary][index],
                    color: theme.colors.background,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </div>
              ))}
              <span style={{ marginLeft: 10, fontSize: 12, color: theme.colors.secondary }}>+4 collaborators</span>
            </div>
          </div>
        </div>
      </div>

      <Subheading theme={theme}>Skeleton Loading & Empty State</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {[70, 100, 88, 54].map((width, index) => (
            <div
              key={index}
              style={{
                height: index === 0 ? 18 : 10,
                width: `${width}%`,
                borderRadius: 9999,
                marginBottom: 10,
                background: `linear-gradient(90deg, ${theme.colors.border}, ${theme.colors.foreground}18, ${theme.colors.border})`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.6s linear infinite',
              }}
            />
          ))}
        </div>

        <div
          style={{
            padding: '22px 18px',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px dashed ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 10, color: theme.colors.accent }}>◌</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.foreground, marginBottom: 6 }}>No saved comparisons yet</div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, lineHeight: 1.6, marginBottom: 14 }}>
            Empty states matter just as much as the fully populated UI.
          </div>
          <button
            style={{
              padding: '8px 14px',
              borderRadius: theme.borderRadius,
              border: 'none',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Create first view
          </button>
        </div>
      </div>
    </Section>
  );
}

function MotionAndSymbols({ theme }: { theme: ThemePreset }) {
  const symbols = ['△', '○', '□', '✕', '+', '◉'];
  const typedLabel = theme.name;
  const typewriterVars = {
    ['--type-width' as string]: `${typedLabel.length}ch`,
  } as React.CSSProperties;

  return (
    <Section title="Motion & Symbols" theme={theme}>
      <Subheading theme={theme}>Headline Motion</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              ...typewriterVars,
              width: 'var(--type-width)',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderRight: `2px solid ${theme.colors.primary}`,
              fontFamily: `'${theme.fonts.heading}', sans-serif`,
              fontSize: 28,
              color: theme.colors.foreground,
              marginBottom: 12,
              animation: `typing 2.4s steps(${typedLabel.length}, end) 1 both, caretBlink 0.9s step-end infinite`,
            }}
          >
            {typedLabel}
          </div>
          <div style={{ position: 'relative', display: 'inline-flex', color: theme.colors.primary, fontSize: 13, fontWeight: 600 }}>
            Explore editorial layouts
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: -4,
                width: '100%',
                height: 1,
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                transformOrigin: 'left',
                animation: 'underlineSweep 2.4s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            background: `linear-gradient(135deg, ${theme.colors.primary}18, ${theme.colors.accent}10 55%, ${theme.colors.background})`,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <div style={{ fontSize: 11, color: theme.colors.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Spotlight panel</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.foreground, marginBottom: 6, fontFamily: `'${theme.fonts.heading}', sans-serif` }}>
            Featured {theme.name} layout
          </div>
          <div style={{ fontSize: 12, color: theme.colors.secondary, lineHeight: 1.6, marginBottom: 14 }}>
            Use this for a launch promo, hero callout, featured article, or campaign message.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 10px', borderRadius: 9999, backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary, fontSize: 11, fontWeight: 600 }}>
                New release
              </span>
              <span style={{ padding: '4px 10px', borderRadius: 9999, backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent, fontSize: 11, fontWeight: 600 }}>
                12 min read
              </span>
            </div>
            <span style={{ color: theme.colors.foreground, fontSize: 12, fontWeight: 600 }}>Read story →</span>
          </div>
        </div>
      </div>

      <Subheading theme={theme}>Loaders</Subheading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 18, borderRadius: theme.borderRadius, backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, minWidth: 120, display: 'grid', placeItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, border: `2px solid ${theme.colors.border}`, borderTopColor: theme.colors.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 11, color: theme.colors.secondary }}>Circle</span>
        </div>

        <div style={{ padding: 18, borderRadius: theme.borderRadius, backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, minWidth: 120, display: 'grid', placeItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', background: `linear-gradient(180deg, ${theme.colors.accent}, ${theme.colors.primary})`, animation: 'pulseFloat 1.2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, color: theme.colors.secondary }}>Triangle</span>
        </div>

        <div style={{ padding: 18, borderRadius: theme.borderRadius, backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, minWidth: 180 }}>
          <div style={{ width: '100%', height: 8, borderRadius: 9999, backgroundColor: `${theme.colors.border}90`, overflow: 'hidden', marginBottom: 10 }}>
            <div
              style={{
                width: '45%',
                height: '100%',
                borderRadius: 9999,
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                animation: 'warmSweep 1.7s ease-in-out infinite',
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: theme.colors.secondary }}>Loading bar</span>
        </div>
      </div>

      <Subheading theme={theme}>Symbols & Terminal</Subheading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {symbols.map((symbol, index) => (
            <div
              key={symbol}
              style={{
                padding: '16px 0',
                borderRadius: theme.borderRadius,
                backgroundColor: theme.colors.muted,
                border: `1px solid ${theme.colors.border}`,
                textAlign: 'center',
                color: [theme.colors.primary, theme.colors.accent, theme.colors.secondary][index % 3],
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          <div style={{ color: theme.colors.secondary, marginBottom: 8 }}>$ preview {theme.id}</div>
          <div style={{ color: theme.colors.foreground, marginBottom: 6 }}>booting visual modules...</div>
          <div style={{ color: theme.colors.accent, marginBottom: 6 }}>loading charts · symbols · loaders</div>
          <div style={{ color: '#4ade80' }}>
            status: online <span style={{ animation: 'blink 1s step-end infinite' }}>▋</span>
          </div>
        </div>
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
      {/* Animation keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: var(--type-width); }
        }
        @keyframes caretBlink {
          50% { border-color: transparent; }
        }
        @keyframes warmSweep {
          0%, 100% { transform: translateX(-20%); opacity: 0.7; }
          50% { transform: translateX(90%); opacity: 1; }
        }
        @keyframes pulseFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-4px) scale(1.05); opacity: 1; }
        }
        @keyframes underlineSweep {
          0%, 100% { transform: scaleX(0.35); opacity: 0.5; }
          50% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

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
        <VisualShowcase theme={theme} />
        <ModernWebEssentials theme={theme} />
        <MotionAndSymbols theme={theme} />
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
