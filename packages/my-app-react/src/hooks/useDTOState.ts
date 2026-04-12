import { useState, useCallback } from "react";
import type { ValidationError } from "@my-app/common";

export interface DTOState<T> {
  data: T | null;
  error: ValidationError | null;
  isValid: boolean;
  isLoading: boolean;
}

export function useDTOState<T>(): DTOState<T> & {
  setData: (data: T | null) => void;
  setError: (error: ValidationError | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
} {
  const [data, setDataState] = useState<T | null>(null);
  const [error, setErrorState] = useState<ValidationError | null>(null);
  const [isLoading, setLoadingState] = useState(false);

  const setData = useCallback((newData: T | null) => {
    setDataState(newData);
    setErrorState(null);
  }, []);

  const setError = useCallback((newError: ValidationError | null) => {
    setErrorState(newError);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setLoadingState(loading);
  }, []);

  const reset = useCallback(() => {
    setDataState(null);
    setErrorState(null);
    setLoadingState(false);
  }, []);

  return {
    data,
    error,
    isValid: data !== null && error === null,
    isLoading,
    setData,
    setError,
    setLoading,
    reset,
  };
}
