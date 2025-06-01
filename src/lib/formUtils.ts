/* eslint-disable @typescript-eslint/no-explicit-any */
import { toaster } from "../components/ui/toaster";

type MutationOptions<T> = {
  data: T;
  isEdit: boolean;
  addMutation: (data: T) => Promise<any>;
  updateMutation: (data: T) => Promise<any>;
  onSuccess?: () => void;
  onError?: (err: any) => void;
};

export async function handleFormMutation<T>({
  data,
  isEdit,
  addMutation,
  updateMutation,
  onSuccess,
  onError,
}: MutationOptions<T>) {
  try {
    if (isEdit) {
      await updateMutation(data);
    } else {
      await addMutation(data);
    }

    // Global toast
    toaster.create({
      title: "Success",
      description: `User ${isEdit ? "updated" : "added"} successfully`,
      type: "success",
    });

    onSuccess?.();
  } catch (err: any) {
    toaster.create({
      title: "Error",
      description: err?.data?.message ?? "Something went wrong",
      type: "error",
    });

    onError?.(err);
  }
}
