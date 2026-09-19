export type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export type ErrorStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};
