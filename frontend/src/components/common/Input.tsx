interface InputProps {
  type: string;
  name: string;
  id?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  variant?: 'light' | 'dark';
  styleClass?: string;
}

const Input = ({
  type,
  name,
  id,
  value,
  placeholder,
  onChange,
  autoComplete,
  variant = 'light',
  styleClass = '',
}: InputProps) => {
  const baseStyles =
    'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles =
    variant === 'dark'
      ? 'bg-slate-100 text-black focus:ring-emerald-400'
      : 'bg-white text-black focus:ring-emerald-500';

  return (
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`${baseStyles} ${variantStyles} ${styleClass}`}
    />
  );
};

export default Input;
