import { TransactionDetailScreen } from "@/src/features/accounts/components/transaction-detail-screen";

type TransactionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const { id } = await params;

  return <TransactionDetailScreen transactionId={id} />;
}
