type Option = { value: string; label: string };
type Props = {
  id: string;
  label: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  helperText?: string;
};

export default function Dropdown({ id, label, options, value, onChange, placeholder, helperText }: Props) {
  const helperId = helperText ? `${id}-helper` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/30"
        aria-describedby={helperId}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p id={helperId} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
