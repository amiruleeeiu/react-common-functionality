import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from "zod";

// generic useZodForm.ts
export function useZodForm<T>({
  schema,
  defaultValues,
}: {
  schema: ZodSchema<T>;
  defaultValues: T;
}) {
  const methods = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues]);

  return methods;
}
