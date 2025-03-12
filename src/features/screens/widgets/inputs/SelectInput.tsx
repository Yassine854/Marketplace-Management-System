import { UseFormRegister, FieldError } from "react-hook-form";

type SelectInputProps = {
  name: string;
  options: string[];
  register: UseFormRegister<any>;
  errors?: FieldError;
  label?: string;
};

export const SelectInput = ({
  name,
  options,
  register,
  errors,
  label,
}: SelectInputProps) => {
  return (
    <div>
      {label && <label className="mb-2 block">{label}</label>}
      <select {...register(name)} className="mb-4 w-full rounded-lg border p-2">
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors && <p className="text-red-500">{errors.message}</p>}
    </div>
  );
};
