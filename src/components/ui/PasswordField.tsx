"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
};

export function PasswordField({ label, id, ...props }: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="password-control">
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={`${visible ? "Hide" : "Show"} password`}
          aria-controls={inputId}
          disabled={props.disabled}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          <span>{visible ? "Hide" : "Show"}</span>
        </button>
      </div>
    </div>
  );
}
