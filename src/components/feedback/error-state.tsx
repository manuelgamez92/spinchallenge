import type { ErrorStateProps } from "@/src/types/ui.types";
import { errorStateStyles } from "@/src/styles/ui.styles";

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className={errorStateStyles.card}>
      <div className={errorStateStyles.icon}>
        !
      </div>
      <h3 className={errorStateStyles.title}>{title}</h3>
      <p className={errorStateStyles.description}>{description}</p>
      {action ? <div className={errorStateStyles.action}>{action}</div> : null}
    </div>
  );
}