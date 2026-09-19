import type { EmptyStateProps } from "@/src/types/ui.types";
import { emptyStateStyles } from "@/src/styles/ui.styles";

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={emptyStateStyles.card}>
      <h3 className={emptyStateStyles.title}>{title}</h3>
      <p className={emptyStateStyles.description}>{description}</p>
      {action ? <div className={emptyStateStyles.action}>{action}</div> : null}
    </div>
  );
}