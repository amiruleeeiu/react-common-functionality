import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { DefaultValues } from "react-hook-form";
import { toaster } from "../components/ui/toaster";
import type { User } from "../types/User";

interface Props<T extends FieldValues> {
  initialData: DefaultValues<T>;
  addFn: (data: T) => { unwrap: () => Promise<User> };
  editFn: (data: T) => { unwrap: () => Promise<User> };
  onClose?: () => void;
}

export default function useFormHandler<T extends FieldValues>({
  initialData,
  addFn,
  editFn,
  onClose,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<T>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: T) => {
    try {
      if ("id" in data && data.id) {
        await editFn(data).unwrap();

        toaster.create({
          title: `Updated successfully`,
          type: "success",
        });
      } else {
        await addFn(data).unwrap();

        toaster.create({
          title: `Added successfully`,
          type: "success",
        });
      }

      onClose?.();
      reset();
    } catch (err: unknown) {
      let message = "Something went wrong";
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
      ) {
        message = (err.data as { message?: string }).message || message;
      }
      toaster.create({
        title: "Error",
        description: message,
        duration: 3000,
        type: "error",
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
