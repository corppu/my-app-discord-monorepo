import { useState, useCallback } from "react";
import { ValidationError } from "@my-app/common";

export interface ValidationResult<T> {
  value: T | null;
  error: ValidationError | null;
  isValid: boolean;
}

export type BuilderFn<T> = () => T;

export function useDTOValidation<T>(): {
  result: ValidationResult<T>;
  validate: (builderFn: BuilderFn<T>) => T | null;
  clearError: () => void;
} {
  const [result, setResult] = useState<ValidationResult<T>>({
    value: null,
    error: null,
    isValid: false,
  });

  const validate = useCallback((builderFn: BuilderFn<T>): T | null => {
    try {
      const value = builderFn();
      setResult({ value, error: null, isValid: true });
      return value;
    } catch (err) {
      if (err instanceof ValidationError) {
        setResult({ value: null, error: err, isValid: false });
      } else {
        const unknownError = new ValidationError(
          "validation.required",
          "unknown",
          "en",
        );
        setResult({ value: null, error: unknownError, isValid: false });
      }
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setResult((prev) => ({ ...prev, error: null }));
  }, []);

  return { result, validate, clearError };
}
