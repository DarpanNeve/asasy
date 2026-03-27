export function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  optional = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}{" "}
        {optional && <span className="text-neutral-400 font-normal">(Optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? "border-red-400" : "border-neutral-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white ${
          error ? "border-red-400" : "border-neutral-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}{" "}
        {optional && <span className="text-neutral-400 font-normal">(Optional)</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
          error ? "border-red-400" : "border-neutral-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
