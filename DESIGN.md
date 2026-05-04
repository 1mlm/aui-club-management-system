# AIMM Design System

Reference doc for replicating this design system in other projects.

---

## Stack

```
Next.js 15 (App Router)
Tailwind CSS 4 (PostCSS plugin, no config file)
shadcn/ui — style: "radix-nova", aliases in shadcn/ not components/
@hugeicons/react + @hugeicons/core-free-icons
recharts 3.x
Prisma (db)
```

---

## Font

**Outfit** from Google Fonts.

```tsx
// app/layout.tsx
import { Outfit } from "next/font/google";
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
<html className={outfit.variable}>
```

```css
/* globals.css — @theme inline */
--font-sans: var(--font-sans);
```

---

## Color System

All tokens live in `:root` using `light-dark()` (no `.dark` class needed — automatic system preference). This is not a shadcn default, so it must be added explicitly.
Chart colors use HSL triplets so `hsl(var(--chart-N))` resolves in SVG contexts.

```css
:root {
  color-scheme: light dark;

  --background:   light-dark(oklch(1 0 0),           oklch(0.145 0 0));
  --foreground:   light-dark(oklch(0.145 0 0),        oklch(0.985 0 0));
  --card:         light-dark(oklch(1 0 0),            oklch(0.205 0 0));
  --card-foreground: light-dark(oklch(0.145 0 0),     oklch(0.985 0 0));
  --popover:      light-dark(oklch(1 0 0),            oklch(0.205 0 0));
  --popover-foreground: light-dark(oklch(0.145 0 0),  oklch(0.985 0 0));

  --primary:      light-dark(oklch(0.145 0 0),        oklch(0.985 0 0));
  --primary-foreground: light-dark(oklch(1 0 0),      oklch(0.145 0 0));

  --secondary:    light-dark(oklch(0.967 0.001 286.375), oklch(0.274 0.006 286.033));
  --secondary-foreground: light-dark(oklch(0.21 0.006 285.885), oklch(0.985 0 0));

  --muted:        light-dark(oklch(0.97 0 0),         oklch(0.269 0 0));
  --muted-foreground: light-dark(oklch(0.556 0 0),    oklch(0.708 0 0));

  --accent:       light-dark(oklch(0.97 0 0),         oklch(0.371 0 0));
  --accent-foreground: light-dark(oklch(0.205 0 0),   oklch(0.985 0 0));

  --destructive:  light-dark(oklch(0.58 0.22 27),     oklch(0.704 0.191 22.216));

  --border:       light-dark(oklch(0.922 0 0),        oklch(1 0 0 / 10%));
  --input:        light-dark(oklch(0.922 0 0),        oklch(1 0 0 / 15%));
  --ring:         light-dark(oklch(0.708 0 0),        oklch(0.556 0 0));

  /* Charts — must be HSL triplets */
  --chart-1: 217 91% 60%;   /* blue   */
  --chart-2: 142 71% 45%;   /* green  */
  --chart-3: 27 98% 55%;    /* orange */
  --chart-4: 330 85% 60%;   /* pink   */
  --chart-5: 262 83% 58%;   /* purple */

  --radius: 0.625rem;       /* base = 10px */

  --sidebar:           light-dark(oklch(0.985 0 0),   oklch(0.205 0 0));
  --sidebar-foreground: light-dark(oklch(0.145 0 0),  oklch(0.985 0 0));
  --sidebar-primary:   light-dark(oklch(0.145 0 0),   oklch(0.985 0 0));
  --sidebar-primary-foreground: light-dark(oklch(1 0 0), oklch(0.145 0 0));
  --sidebar-accent:    light-dark(oklch(0.97 0 0),    oklch(0.269 0 0));
  --sidebar-accent-foreground: light-dark(oklch(0.205 0 0), oklch(0.985 0 0));
  --sidebar-border:    light-dark(oklch(0.922 0 0),   oklch(1 0 0 / 10%));
  --sidebar-ring:      light-dark(oklch(0.708 0 0),   oklch(0.556 0 0));
}
```

---

## Border Radius Scale

Base = `0.625rem` (10px).

| Token         | Value              |
|---------------|--------------------|
| `radius-sm`   | base − 4px (6px)   |
| `radius-md`   | base − 2px (8px)   |
| `radius-lg`   | base (10px)        |
| `radius-xl`   | base + 4px (14px)  |
| `radius-2xl`  | base + 8px (18px)  |
| `radius-3xl`  | base + 12px (22px) |
| `radius-4xl`  | base + 16px (26px) — used for pill badges |

---

## shadcn/ui Setup

```json
// components.json
{
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": { "cssVariables": true },
  "iconLibrary": "hugeicons",
  "aliases": {
    "components": "@/shadcn/cpns",
    "utils": "@/shadcn/lib/utils",
    "ui": "@/shadcn/ui",
    "lib": "@/shadcn/lib",
    "hooks": "@/shadcn/hooks"
  }
}
```

shadcn components live in `shadcn/ui/`, NOT `components/ui/`.

---

## Icon System

All icons come from `@hugeicons/core-free-icons` rendered via a shared wrapper.

### Icon Wrapper (`shadcn/cpns/Icon.tsx`)

```tsx
import { HugeiconsIcon } from "@hugeicons/react";

type IconProps = React.ComponentProps<typeof HugeiconsIcon>;
const DEFAULT_STROKE_WIDTH = 2;

export function Icon({ strokeWidth = DEFAULT_STROKE_WIDTH, ...props }: IconProps) {
  return <HugeiconsIcon strokeWidth={strokeWidth} {...props} />;
}
```

Always use `<Icon icon={SomeIcon} />` — never `<SomeIcon />` directly.
Default stroke width is **2** everywhere.

### Icon Constants File (create in target repo)

In this repo, app-level icons live in `lib/icons.ts` and domain icon picker data lives in `lib/domain-icons.ts`.

When replicating this system in another project, **create a single icon map file** so every string key maps to exactly one Hugeicons icon in one place (do not hardcode icon imports in feature files). Example guidance:

```ts
// lib/icon-map.ts (create this in the target repo)
// Central source of truth for all string -> Hugeicons icon mappings.
export const ICON_MAP = {
  actions: {
    edit: Edit01Icon,
    delete: Delete01Icon,
    create: Add01Icon,
  },
  nav: {
    history: History01Icon,
    domains: Cube01Icon,
    suggestions: Idea01Icon,
    stats: ChartHistogramIcon,
  },
  status: {
    accepted: CheckmarkCircle01Icon,
    pending: Timer01Icon,
    refused: CancelCircle01Icon,
  },
} as const;

export type IconKey = keyof typeof ICON_MAP;
```

Use this map everywhere and render via `<Icon icon={ICON_MAP.actions.edit} />`.

---

## Sidebar

**Variant: `"inset"`** — creates floating panel with shadow and rounded corners inside the layout.
**Collapsible: `"offcanvas"`** — slides off-screen on mobile.
**Toggle shortcut: Cmd/Ctrl+B**

### Structure

```tsx
// app/layout.tsx
<SidebarProvider>
  <AppSidebar />           {/* async server component */}
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

```tsx
// AppSidebar
<Sidebar variant="inset">
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/history">
            {/* Logo icon block */}
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon icon={AiIdeaIcon} className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">APP NAME</span>
              <span className="text-xs text-muted-foreground">Subtitle</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
  <SidebarContent>{/* nav groups */}</SidebarContent>
</Sidebar>
```

### Nav Groups Pattern

```tsx
<SidebarContent>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/route")}>
            <Link href="/route">
              <Icon icon={APP_ICONS.someIcon} />
              <span>Label</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <SidebarSeparator />

  {/* Item with badge count + nested submenu */}
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/items")}>
            <Link href="/items">
              <Icon icon={SomeIcon} />
              <span>Items</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge>{items.length}</SidebarMenuBadge>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton asChild isActive={isActive(`/items/${item.id}`)}>
                  <Link href={`/items/${item.id}`}>
                    <Icon icon={getItemIcon(item.icon)} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</SidebarContent>
```

**Active state:** `data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:font-medium` (built into the component).
**Disabled item:** `disabled className="opacity-50 cursor-not-allowed" aria-disabled="true"`.

---

## Buttons

### Sizes

| Size       | Class       | Use                          |
|------------|-------------|------------------------------|
| `xs`       | `h-6`       | compact inline               |
| `sm`       | `h-7`       | secondary actions            |
| `default`  | `h-8`       | standard                     |
| `lg`       | `h-9`       | primary CTA                  |
| `icon`     | `size-8`    | square icon button           |
| `icon-xs`  | `size-6`    | tiny icon button             |
| `icon-sm`  | `size-7`    | table row action button      |
| `icon-lg`  | `size-9`    | large icon button            |

### Variants

| Variant       | Use                                     |
|---------------|-----------------------------------------|
| `default`     | primary action                          |
| `outline`     | secondary/cancel                        |
| `ghost`       | icon-only table actions, sidebar items  |
| `secondary`   | tertiary action                         |
| `destructive` | delete / refuse                         |
| `link`        | inline text links                       |

### Icon Button with Tooltip (`components/icon-btn.tsx`)

Every icon-only button is wrapped in a tooltip:

```tsx
export function IconBtn({ tooltip, children, ...props }: ButtonProps & { tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
```

Usage in tables:
```tsx
<IconBtn variant="ghost" size="icon-sm" tooltip="Edit">
  <Icon icon={Edit01Icon} />
</IconBtn>
<IconBtn variant="ghost" size="icon-sm" tooltip="Delete" className="text-destructive hover:text-destructive">
  <Icon icon={Delete01Icon} />
</IconBtn>
```

### Semantic Color Buttons

```tsx
{/* Accept */}
<Button className="bg-green-600 text-white hover:bg-green-700">Accept</Button>

{/* Refuse / Delete */}
<Button variant="destructive">Refuse</Button>

{/* Cancel */}
<Button variant="outline">Cancel</Button>
```

---

## Tables

### Sortable Header Pattern

```tsx
function SortBtn({ label, icon, active, direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground"
    >
      <Icon icon={icon} className="size-3.5" />
      {label}
      {active && <span className="text-[10px]">{direction === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}
```

Table header pattern: `<Icon> Label [sort indicator]` — icon always precedes label. All sortable headers include icons even when not active.

### Row Action Buttons

Actions are hidden by default and shown on row hover:

```tsx
<TableRow className="group">
  <TableCell>…content…</TableCell>
  <TableCell>
    <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <IconBtn variant="ghost" size="icon-sm" tooltip="Edit">
        <Icon icon={Edit01Icon} />
      </IconBtn>
      <IconBtn variant="ghost" size="icon-sm" tooltip="Delete" className="text-destructive hover:text-destructive">
        <Icon icon={Delete01Icon} />
      </IconBtn>
    </div>
  </TableCell>
</TableRow>
```

### Icon Cell Pattern

Small icon container in table cells:

```tsx
<div className="flex size-7 items-center justify-center rounded-md bg-muted">
  <Icon icon={SomeIcon} className="size-3.5" />
</div>
```

---

## Chips & Badges

Three chip flavors used in history/tables:

```tsx
{/* Domain chip — links to domain page */}
<Badge variant="outline" className="cursor-pointer gap-1 hover:bg-muted h-5 text-xs">
  <Icon icon={DomainIcon} className="size-3" />
  {domainName}
</Badge>

{/* User chip */}
<Badge variant="secondary" className="gap-1 h-5 text-xs">
  <Icon icon={UserIcon} className="size-3" />
  {displayName}
</Badge>

{/* Code / rule chip */}
<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
  {ruleTitle}
</code>

{/* Icon + label inline badge (e.g. showing icon key change) */}
<span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
  <Icon icon={SomeIcon} className="size-3" />
  {label}
</span>
```

### Stat Filter Chip (toggle on/off)

```tsx
<button
  type="button"
  onClick={() => toggle(key)}
  className={`flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all ${
    active
      ? "border-primary/30 bg-primary/8 text-foreground"
      : "border-border text-muted-foreground opacity-40"
  }`}
>
  <Icon icon={ItemIcon} className="size-2.5" />
  {label}
</button>
```

---

## Icon-First UI Convention

- Every primary button can include a leading icon when space allows.
- Every icon-only button uses `IconBtn` with a tooltip label.
- Every table header uses an icon before the label.
- Inline chips and badges use a small icon for quick scanning.

---

## Statistics Dashboard

### Stat Cards (top row)

```tsx
<div className="grid grid-cols-3 gap-3">
  {[
    { label: "Accepted", value: totalAccepted, color: "text-green-600" },
    { label: "Pending",  value: totalPending,  color: "text-primary" },
    { label: "Refused",  value: totalRefused,  color: "text-muted-foreground" },
  ].map((s) => (
    <div key={s.label} className="rounded-lg border border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">{s.label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${s.color}`}>{s.value}</p>
    </div>
  ))}
</div>
```

### Chart Builder (sentence-style filter row)

```tsx
<div className="space-y-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
    <span>Show</span>
    <Select value={metric} onValueChange={setMetric}>
      <SelectTrigger size="sm" className="h-7 text-xs font-medium text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>…</SelectContent>
    </Select>
    <span>grouped by</span>
    <Select …/>
    <span>between</span>
    <input type="date" className="h-7 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring" />
    <span>and</span>
    <input type="date" … />
    <span>as</span>
    {/* Chart type icon toggle group */}
    <div className="flex gap-0.5 rounded-lg border border-border bg-background p-0.5">
      {CHART_TYPES.map(({ value, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setChartType(value)}
          className={`cursor-pointer rounded-md p-1 transition-colors ${
            chartType === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon icon={icon} className="size-3.5" />
        </button>
      ))}
    </div>
  </div>
  {/* Filter chips row */}
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="shrink-0 text-xs text-muted-foreground">Category:</span>
    {/* toggle chips here */}
  </div>
</div>
```

### Customizable Chart Concept

The stats page is built around a sentence-like filter row that fully controls the chart configuration. Treat each control (metric, grouping, date range, chart type, category chips) as a separate state atom so the chart can be re-rendered without resetting other filters.

### Chart Colors

```ts
const CHART_COLORS = [
  "hsl(var(--chart-1))",  // blue
  "hsl(var(--chart-2))",  // green
  "hsl(var(--chart-3))",  // orange
  "hsl(var(--chart-4))",  // pink
  "hsl(var(--chart-5))",  // purple
];
```

### Chart Components (recharts)

```tsx
// Tooltip style — always pass as contentStyle
const tooltipStyle = {
  fontSize: 12,
  borderRadius: 6,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  color: "hsl(var(--popover-foreground))",
};

// Bar chart
<BarChart data={data} barSize={10}>
  <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
  <YAxis hide allowDecimals={false} />
  <Tooltip contentStyle={tooltipStyle} />
  <Bar dataKey="count" fill={CHART_COLORS[0]} radius={3} />
</BarChart>

// Line chart
<LineChart data={data}>
  <Line type="monotone" dataKey="count" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
</LineChart>

// Donut chart
<PieChart>
  <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
    {data.map((d) => <Cell key={d.name} fill={d.color} />)}
  </Pie>
  <Tooltip contentStyle={tooltipStyle} />
</PieChart>
```

### Breakdown Card

```tsx
<div className="rounded-lg border border-border p-4">
  <div className="mb-3 flex items-center justify-between">
    <p className="text-xs font-medium text-muted-foreground">{title}</p>
    <span className="text-xs tabular-nums text-muted-foreground">{total} total</span>
  </div>
  <div className="space-y-2">
    {items.map((item, i) => (
      <div key={item.key} className="flex items-center gap-2">
        <Icon icon={item.icon} className="size-3 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-xs text-muted-foreground">{item.label}</span>
        <span className="text-xs font-medium tabular-nums">{item.value}</span>
        {/* Mini progress bar */}
        <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.round((item.value / total) * 100)}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Page Layout Pattern

```tsx
// Every page content root
<div className="space-y-4">
  {/* Page header */}
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Page Title</h1>
    <span className="text-xs text-muted-foreground tabular-nums">N items</span>
  </div>

  {/* Content */}
</div>
```

Main content wrapper (from layout):

```tsx
<SidebarInset>
  <main className="flex flex-1 flex-col gap-4 p-4">
    {children}
  </main>
</SidebarInset>
```

---

## History / Activity Feed Pattern

```tsx
<div className="space-y-0.5">
  {events.map((event) => (
    <div
      key={event.id}
      className="flex items-center gap-3 rounded-md p-3 py-1 hover:bg-muted/50 transition-colors"
    >
      <Icon icon={EVENT_ICONS[event.type]} className={`size-3.5 shrink-0 ${EVENT_COLORS[event.type]}`} />
      <div className="flex-1 min-w-0 text-sm leading-relaxed flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60 cursor-default tabular-nums">
              {exactTime(event.createdAt)}
            </time>
          </TooltipTrigger>
          <TooltipContent>{relativeTime(event.createdAt)}</TooltipContent>
        </Tooltip>
        <EventDescription type={event.type} data={event.data} />
      </div>
    </div>
  ))}
</div>
```

### Event Icon Colors

| Event pattern | Color                  |
|---------------|------------------------|
| `*_created`   | `text-blue-500`        |
| `*_accepted`  | `text-green-600`       |
| `*_refused`   | `text-destructive`     |
| `*_deleted`   | `text-destructive`     |
| `*_updated`   | `text-muted-foreground`|

---

## Tooltip Config

```tsx
// Wrap app in TooltipProvider with zero delay
<TooltipProvider delayDuration={0}>
  {children}
</TooltipProvider>
```

---

## shadcn Template Styles

- Use shadcn `radix-nova` style tokens and components from `shadcn/ui/`.
- Keep `@import "shadcn/tailwind.css";` in globals.
- Prefer shadcn buttons, badges, cards, dialogs, and sheet/sidebar components.

---

## Empty State

```tsx
<p className="py-6 text-center text-xs text-muted-foreground">
  No data for the current selection.
</p>

{/* Full page empty */}
<div className="py-12 text-center text-sm text-muted-foreground">
  Nothing here yet.
</div>
```

---

## globals.css Base

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";       /* from shadcn/tailwind.css in your shadcn/ dir */

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* map all CSS vars to Tailwind color tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  /* ... all sidebar, chart, and semantic tokens ... */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  /* ... 2xl through 4xl ... */
}

/* paste full :root token block from above */

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```
