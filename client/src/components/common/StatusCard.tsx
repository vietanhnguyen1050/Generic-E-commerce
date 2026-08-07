import type { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  children: ReactNode;
}

export const StatusCard = ({ title, children }: StatusCardProps) => {
  return (
    <section className="status-card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};
