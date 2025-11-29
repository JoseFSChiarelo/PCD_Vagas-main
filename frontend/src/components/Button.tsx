type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };
export default function Button({ variant='primary', className, children, ...props }: Props) {
  const base = "px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = variant === 'primary'
    ? "bg-brand-accent text-white hover:bg-blue-600 focus:ring-brand-accent"
    : "border border-brand-accent text-brand-accent hover:bg-brand-light focus:ring-brand-accent";
  return <button className={`${base} ${styles} ${className||''}`} {...props} aria-label={props['aria-label'] || 'Botão'}>{children}</button>
}