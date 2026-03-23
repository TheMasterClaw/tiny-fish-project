# CoralGuard Design System

> **Environmental Conservation Platform**
> Ocean-themed, eco-friendly design with glassmorphism effects

---

## Brand Identity

### Mission
Protecting coral reefs through AI-powered monitoring and blockchain transparency.

### Voice
- **Tone:** Passionate, urgent but hopeful, scientifically grounded
- **Keywords:** Conservation, restoration, transparency, impact, community
- **Avoid:** Corporate speak, overly technical jargon without explanation

---

## Color Palette

### Primary Colors (Ocean)
| Color | Hex | Usage |
|-------|-----|-------|
| Ocean Deep | `#0c4a6e` | Backgrounds, dark sections |
| Ocean | `#0369a1` | Primary buttons, links |
| Ocean Light | `#0ea5e9` | Hover states, accents |
| Sky | `#7dd3fc` | Highlights, icons |
| Foam | `#e0f2fe` | Light backgrounds, cards |

### Secondary Colors (Coral)
| Color | Hex | Usage |
|-------|-----|-------|
| Coral | `#ff6b6b` | CTAs, alerts, important actions |
| Coral Light | `#ff9e9e` | Hover states, badges |
| Coral Dark | `#e63946` | Active states |

### Tertiary Colors (Reef/Eco)
| Color | Hex | Usage |
|-------|-----|-------|
| Reef | `#22c55e` | Success states, eco indicators |
| Reef Light | `#4ade80` | Progress bars, positive metrics |
| Sand | `#f5f5f4` | Light sections backgrounds |

### Neutral
| Color | Hex | Usage |
|-------|-----|-------|
| White | `#ffffff` | Text on dark, card backgrounds |
| Black | `#0f172a` | Primary text |
| Gray 400 | `#94a3b8` | Secondary text |
| Gray 600 | `#475569` | Muted text |

---

## Typography

### Font Families
- **Headings:** `Space Grotesk`, sans-serif
- **Body:** `Inter`, sans-serif

### Type Scale
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | `clamp(2.5rem, 8vw, 5rem)` | 700 | Hero headlines |
| H2 | `clamp(2rem, 5vw, 3.5rem)` | 600 | Section titles |
| H3 | `1.5rem` (24px) | 600 | Card titles |
| H4 | `1.25rem` (20px) | 600 | Subsection titles |
| Body Large | `1.125rem` (18px) | 400 | Lead paragraphs |
| Body | `1rem` (16px) | 400 | Standard text |
| Small | `0.875rem` (14px) | 400 | Captions, metadata |
| Tiny | `0.75rem` (12px) | 500 | Badges, labels |

### Typography Patterns
- **Letter-spacing:** -0.02em for headings
- **Line-height:** 1.2 for headings, 1.6 for body
- **Max-width:** 65ch for readability

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon gaps |
| `space-3` | 12px | Small padding |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-12` | 48px | Large sections |
| `space-16` | 64px | Hero padding |
| `space-20` | 80px | Section margins |
| `space-24` | 96px | Major sections |

---

## Components

### Buttons

**Primary (Ocean)**
```css
btn-primary {
  background: linear-gradient(135deg, #0369a1, #0ea5e9);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}
```

**Secondary (Coral - CTA)**
```css
btn-coral {
  background: linear-gradient(135deg, #ff6b6b, #ff9e9e);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}
```

**Glass Button**
```css
btn-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
```

### Cards

**Glass Card**
```css
card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 24px;
}
```

**Impact Card**
```css
card-impact {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
}
```

### Badges

**Status Badge**
```css
badge {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(8px);
}
```

---

## Effects & Animations

### Glassmorphism
```css
glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Gradients
- **Ocean Gradient:** `linear-gradient(180deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)`
- **Coral Gradient:** `linear-gradient(135deg, #ff6b6b 0%, #ff9e9e 100%)`
- **Text Gradient:** `linear-gradient(135deg, #7dd3fc, #38bdf8)`

### Shadows
- **Card:** `0 8px 32px rgba(0, 0, 0, 0.2)`
- **Elevated:** `0 20px 40px rgba(0, 0, 0, 0.3)`
- **Glow Ocean:** `0 0 40px rgba(14, 165, 233, 0.3)`
- **Glow Coral:** `0 0 40px rgba(255, 107, 107, 0.3)`

### Transitions
- **Fast:** 150ms ease
- **Standard:** 300ms ease
- **Slow:** 500ms ease

---

## Page Layouts

### Landing Page Structure
1. **Navigation** - Fixed, glassmorphism
2. **Hero** - Full viewport, ocean background, bold headline
3. **Impact Stats** - Key metrics with animated counters
4. **Features** - 3-column grid with icons
5. **How It Works** - Step-by-step process
6. **CTA Section** - Coral background, strong call-to-action
7. **Footer** - Links, social, newsletter

### Section Spacing
- **Hero:** min-height: 100vh, padding: 120px top
- **Sections:** padding: 96px vertical
- **Containers:** max-width: 1280px, centered

---

## Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | < 640px | Single column, stacked nav |
| Tablet | 640px - 1024px | 2 columns, condensed spacing |
| Desktop | > 1024px | Full layout, max spacing |

---

## Accessibility

- **Contrast:** Minimum 4.5:1 for text
- **Focus states:** Visible outlines on all interactive elements
- **Reduced motion:** Respect `prefers-reduced-motion`
- **Semantic HTML:** Proper heading hierarchy
- **Alt text:** All images have descriptive alt text

---

## SEO Best Practices

### Meta Tags
```html
<title>CoralGuard - AI-Powered Coral Reef Conservation</title>
<meta name="description" content="Join the decentralized network protecting coral reefs through AI monitoring and blockchain transparency.">
<meta property="og:title" content="CoralGuard - Protect Our Oceans">
<meta property="og:description" content="AI + Blockchain for coral reef conservation">
<meta property="og:image" content="/og-image.jpg">
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CoralGuard",
  "description": "Coral reef conservation platform",
  "url": "https://coralguard.org"
}
```
