export const pageShellStyles = {
  main: "bg-app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
  container: "mx-auto w-full max-w-6xl",
} as const;

export const emptyStateStyles = {
  card: "glass-panel rounded-[var(--radius-card-lg)] p-8 text-center",
  title: "text-lg font-semibold text-white",
  description: "mt-2 text-sm leading-6 text-slate-300",
  action: "mt-6",
} as const;

export const errorStateStyles = {
  card: "glass-panel status-error-surface rounded-[var(--radius-card-lg)] p-8 text-center",
  icon: "status-error-surface status-error-text mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg",
  title: "text-lg font-semibold text-white",
  description: "mt-2 text-sm leading-6 text-slate-300",
  action: "mt-6",
} as const;

export const globalFooterStyles = {
  shell: "border-t border-white/10 bg-slate-950/35 backdrop-blur-md",
  container: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8",
  grid: "grid gap-5 md:grid-cols-[1.2fr_0.8fr]",
  brand: "text-sm uppercase tracking-[0.22em] text-slate-200",
  title: "mt-2 text-xl font-semibold text-white",
  description: "mt-2 text-sm leading-6 text-slate-300",
  metaRow: "mt-4 flex flex-wrap items-center gap-2",
  chip: "brand-surface-primary inline-flex rounded-full px-3 py-1 text-xs font-medium text-white",
  rightColumn: "space-y-2 text-sm text-slate-300",
  rightLabel: "text-slate-300",
  rightValue: "text-white",
} as const;
