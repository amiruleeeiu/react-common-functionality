/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAddUserMutation, useUpdateUserMutation } from "../services/userApi";
import { toaster } from "./ui/toaster";

interface User {
  id?: number;
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: User;
}

export default function UserDialogForm({
  isOpen,
  onClose,
  initialData,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: initialData,
  });

  const [addUser, { isLoading: isAddLoading }] = useAddUserMutation();
  const [editUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: User) => {
    try {
      if (data.id) {
        const updatedRes = await editUser({
          id: data.id,
          data: { name: data.name, email: data.email },
        }).unwrap();

        if (updatedRes) {
          toaster.create({
            title: "Success",
            description: "User updated successfully",
            duration: 3000,
            type: "success",
          });
        }
      } else {
        const res = await addUser(data).unwrap();

        if (res) {
          toaster.create({
            title: "Success",
            description: "User updated successfully",
            duration: 3000,
            type: "success",
          });
        }
      }

      onClose();
    } catch (err: any) {
      toaster.create({
        title: "Error",
        description: err?.data?.message,
        duration: 3000,
        type: "error",
      });
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      initialFocusEl={() => ref.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {initialData?.id ? "Edit User" : "Add User"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      placeholder="Enter name"
                      {...register("name", { required: true })}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...register("email", {
                        required: true,
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email",
                        },
                      })}
                    />
                  </Field.Root>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="user-form"
                colorScheme="blue"
                loading={isAddLoading || isLoading}
                disabled={isAddLoading || isLoading}
                loadingText={initialData?.id ? "Updating..." : "Adding..."}
              >
                {initialData?.id ? "Update" : "Add"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
