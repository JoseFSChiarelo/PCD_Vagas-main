type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  helperText?: string;
};

export default function Input({ label, id, helperText, className = '', ...props }: Props) {
  const helperId = helperText ? `${id}-helper` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/30 placeholder:text-gray-400 ${className}`}
        {...props}
        aria-describedby={helperId}
      />
      {helperText && (
        <p id={helperId} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
