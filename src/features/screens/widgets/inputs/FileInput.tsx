import React, { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FileInputProps {
  id: string;
  label: string;
  register: UseFormRegister<any>; // UseFormRegister from react-hook-form
  error?: FieldError; // Error object from react-hook-form
  accept?: string; // Accepted file types (e.g., "image/*")
  multiple?: boolean; // Allow multiple files
}

const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  register,
  error,
  accept = "image/*",
  multiple = false,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName(null);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block font-medium md:text-lg">
        {label}
      </label>
      <div className="mt-1 flex items-center">
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span>Choose File</span>
          <input
            id={id}
            type="file"
            {...register(id)}
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
        {fileName && (
          <span className="ml-3 text-sm text-gray-500">{fileName}</span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default FileInput;
