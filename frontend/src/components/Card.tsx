type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`glass-card p-5 hover:-translate-y-1 hover:shadow-xl transition ${className}`} role="region">
      {children}
    </div>
  );
}
