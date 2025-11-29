type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark disabled:opacity-60 disabled:cursor-not-allowed shadow-sm';
  const styles =
    variant === 'primary'
      ? 'bg-brand-dark text-white hover:-translate-y-0.5 hover:shadow-lg'
      : 'border border-brand-dark text-brand-dark hover:bg-brand-light';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
