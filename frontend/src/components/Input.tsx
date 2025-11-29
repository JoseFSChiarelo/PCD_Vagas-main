type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; };
export default function Input({ label, id, className, ...props }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-brand-dark">{label}</label>
      <input
        id={id}
        className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent ${className||''}`}
        {...props}
        aria-labelledby={id}
      />
    </div>
  );
}