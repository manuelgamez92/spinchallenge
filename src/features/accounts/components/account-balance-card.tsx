import { formatCurrency } from "@/src/utils/format";
import type { AccountBalanceCardProps } from "@/src/features/accounts/types/accounts.types";
import { accountBalanceCardStyles } from "@/src/features/accounts/styles/wallet.styles";

export function AccountBalanceCard({ availableBalance }: AccountBalanceCardProps) {
  return (
    <section className={accountBalanceCardStyles.card}>
      <div className={accountBalanceCardStyles.glow} />
      <div className={accountBalanceCardStyles.content}>
        <div>
          <p className={accountBalanceCardStyles.title}>Saldo disponible</p>
          <h2 className={accountBalanceCardStyles.amount}>
            {formatCurrency(availableBalance)}
            <span className={accountBalanceCardStyles.amountCurrency}>MXN</span>
          </h2>
        </div>
      </div>
    </section>
  );
}