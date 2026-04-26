const inputBase =
  "w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 input-glow focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-400";

const inputOk = "border-neutral-300 dark:border-slate-600 focus:ring-blue-100 dark:focus:ring-blue-900/40 hover:border-neutral-400 dark:hover:border-slate-500";
const inputErr = "border-red-400 dark:border-red-600 bg-red-50/30 dark:bg-red-900/10 focus:ring-red-200 dark:focus:ring-red-900/40";

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500 dark:bg-red-400" />
      {msg}
    </p>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  optional = false,
  ...inputProps
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
        {label}{" "}
        {optional && <span className="text-neutral-400 dark:text-slate-500 font-normal">(Optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputBase} ${error ? inputErr : inputOk}`}
        {...inputProps}
      />
      <ErrorMsg msg={error} />
    </div>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
  placeholder,
  ...selectProps
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputBase} ${error ? inputErr : inputOk} ${!value ? "text-neutral-400 dark:text-slate-500" : "text-neutral-900 dark:text-slate-100"}`}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-neutral-900 dark:text-slate-100 bg-white dark:bg-slate-800">
            {o}
          </option>
        ))}
      </select>
      <ErrorMsg msg={error} />
    </div>
  );
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  optional = false,
  ...textareaProps
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
        {label}{" "}
        {optional && <span className="text-neutral-400 dark:text-slate-500 font-normal">(Optional)</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`${inputBase} ${error ? inputErr : inputOk} resize-none`}
        {...textareaProps}
      />
      <ErrorMsg msg={error} />
    </div>
  );
}
