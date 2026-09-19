import { cn } from "@/src/lib/cn";
import type { PageShellProps } from "@/src/types/ui.types";
import { pageShellStyles } from "@/src/styles/ui.styles";

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={pageShellStyles.main}>
      <div className={cn(pageShellStyles.container, className)}>{children}</div>
    </main>
  );
}