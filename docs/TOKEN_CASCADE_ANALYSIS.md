# Token Cascade Analysis

**Generated:** December 21, 2025  
**Updated:** December 22, 2025  
**Status:** ✅ COMPLETE - All tokens now covered in Theme Builder

---

## `--wex-primary` / `--primary` Cascade

### Summary
- **138 total usages** across 36 files
- **17 unique utility patterns**
- **100% coverage** in Theme Builder (live previews + Additional Components list)

### Utility Pattern Breakdown

| Pattern | Count | Category |
|---------|-------|----------|
| `text-primary` | 59 | Text accent color |
| `bg-primary` | 24 | Solid backgrounds (buttons, badges) |
| `bg-primary/10` | 12 | Light tinted backgrounds |
| `bg-primary/5` | 10 | Very light tinted backgrounds |
| `border-primary` | 7 | Borders (focus states, inputs) |
| `ring-primary/20` | 6 | Light focus rings |
| `text-primary/80` | 4 | Slightly faded text |
| `hover:bg-primary/90` | 3 | Hover state (slightly darker) |
| `ring-primary/50` | 2 | Medium focus rings |
| `ring-primary` | 2 | Solid focus rings |
| `hover:bg-primary/80` | 2 | Hover state (more faded) |
| `hover:bg-primary` | 2 | Solid hover backgrounds |
| `bg-primary/20` | 2 | Light backgrounds (progress track) |
| `hover:bg-primary/5` | 1 | Very light hover |
| `border-primary/30` | 1 | Light border accent |
| `border-primary/20` | 1 | Very light border accent |
| `bg-primary/8` | 1 | Custom light background |

### Files by Directory

| Directory | File Count | Purpose |
|-----------|------------|---------|
| `src/docs/pages` | 13 | Documentation pages |
| `src/components/ui` | 13 | Base shadcn components |
| `src/docs/components` | 7 | Docs-specific components |
| `src/components/wex` | 2 | WEX wrapper components |
| `src/docs/data` | 1 | Token registry data |

### Categorized Impact

#### 1. Solid Backgrounds (bg-primary)
Components that use the full primary color as background:
- `WexButton` (default intent)
- `WexBadge` (default intent)
- `WexProgress` (indicator bar)
- `WexSwitch` (checked state)
- `WexCheckbox` (checked state)
- `WexRadioGroup` (selected state)
- `WexCalendar` (selected dates)
- `WexSlider` (range fill, thumb border)

#### 2. Tinted Backgrounds (bg-primary/5, bg-primary/10, bg-primary/20)
UI elements with subtle primary tinting:
- Navigation hover states (`NavLink`)
- Active navigation items
- Section highlights (Theme Builder "affected" sections)
- Status badges ("stable" status)
- Icon containers (Getting Started, Architecture pages)
- `WexSkeleton` (loading placeholder)
- `WexProgress` (track background)
- `WexField` (checkbox container checked state)

#### 3. Text Color (text-primary)
Elements using primary as text color:
- Token code display (monospace code blocks)
- Links and interactive text
- Icon accents (Palette, Layers, Package icons)
- Stat numbers
- Active labels
- Link-style buttons

#### 4. Borders (border-primary)
Elements with primary-colored borders:
- `WexCheckbox` border
- `WexRadioGroup` item border
- `WexSlider` thumb border
- Highlight containers (Architecture page)
- Focus states

#### 5. Focus Rings (ring-primary, ring-primary/*)
Focus indicators:
- Selected swatches (Theme Builder)
- Highlighted sections
- Active selections

---

## Theme Builder Implementation Status

### ✅ Live Previews (27 components rendered)

**Primary Section:**
- WexButton, WexBadge, WexProgress, WexSwitch, WexCheckbox
- WexRadioGroup, WexSlider, WexSkeleton, WexSpinner
- WexButtonGroup, WexPagination, WexCalendar, Focus Ring

**Other Token Sections:**
- WexAlert (destructive, success, warning, info)
- WexInput, WexTextarea, WexSelect (input border)
- WexTabs, WexAvatar, WexToggle (surface muted)
- WexCard, WexSeparator (border)
- WexToast/Sonner (all intents)

### ✅ Additional Components Lists (23 non-renderable components)

Components too complex to render in triggered state, shown with:
- Color swatch
- Component name & description  
- WCAG contrast ratio badge

**Primary:** WexDialog, WexAlertDialog, WexSheet, WexDrawer, WexSelect, WexCommand, WexCombobox, WexDropdownMenu, WexContextMenu, WexNavigationMenu, WexMenubar, WexDataTable, WexTable, WexDatePicker, WexBreadcrumb, WexAccordion, WexCarousel, WexChart, WexEmpty, WexHoverCard, WexSidebar, WexToggleGroup, WexTooltip

### ✅ WCAG Contrast Checking

Real-time contrast compliance for all foreground/background pairs:
- Per-component contrast badges with ratio display
- Global compliance summary in nav (with mode indicator)
- Detailed popover with suggestions for failing pairs
- Automatic re-check on token value changes

### ✅ Intentionally Skipped (8 structural/utility components)

- WexAspectRatio, WexCollapsible, WexResizable, WexScrollArea (layout only)
- WexPopover, WexLabel, WexItem (utility wrappers)
- WexForm (validation wrapper)

---

## Other Token Cascades

All intent tokens now have full coverage in Theme Builder:

| Token | Live Previews | Additional Components | Contrast Pairs |
|-------|---------------|----------------------|----------------|
| `--wex-primary` | ✅ 13 components | ✅ 23 components | ✅ 15+ pairs |
| `--wex-destructive` | ✅ 4 components | ✅ 7 components | ✅ 5+ pairs |
| `--wex-success` | ✅ 3 components | ✅ 1 component | ✅ 3+ pairs |
| `--wex-warning` | ✅ 3 components | ✅ 1 component | ✅ 3+ pairs |
| `--wex-info` | ✅ 3 components | ✅ 1 component | ✅ 3+ pairs |
| `--wex-muted` | ✅ 6 components | ✅ 6 components | ✅ 5+ pairs |
| `--wex-background` | ✅ 2 sections | ✅ 13 components | ✅ 5+ pairs |
| `--wex-border` | ✅ 2 components | ✅ 7 components | ✅ 2+ pairs |
| `--wex-input` | ✅ 5 components | ✅ 4 components | ✅ 3+ pairs |

---

## Total Component Coverage

**57 WEX components = 27 live + 22 additional + 8 skipped = 100% coverage**

