"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { api } from "~/trpc/react";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "~/lib/utils";

// Validasi
const linkFormSchema = z.object({
  title: z.string().max(50).min(1),
  description: z.string().max(100).min(1),
  url: z.string().min(1),
});

type LinkFormSchema = z.infer<typeof linkFormSchema>;

type LinkFormProps = {
  defaultValues?: LinkFormSchema;
  linkId?: string; // untuk edit
  onSuccess?: () => void;
};

export const LinkFormDialog = ({
  defaultValues,
  linkId,
  onSuccess,
}: LinkFormProps) => {
  const form = useForm<LinkFormSchema>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: defaultValues ?? { title: "", description: "", url: "" },
  });
  const apiUtils = api.useUtils();
  const { data: session } = useSession();

  const createMutation = api.link.createLink.useMutation();

  const updateMutation = api.link.updateLink.useMutation();

  const handleSubmit = (values: LinkFormSchema) => {
    const promise = new Promise((resolve, reject) => {
      if (linkId) {
        updateMutation.mutate(
          {
            linkId: linkId,
            userId: session?.user.id ?? "",
            ...values,
          },
          {
            onSuccess: () => {
              void apiUtils.link.getLinkPaginated.invalidate();
              form.reset();
              onSuccess?.();
              resolve("updated");
            },
            onError: (err) => reject(new Error(err.message ?? "Unknown error")),
          },
        );
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            void apiUtils.link.getLinkPaginated.invalidate();
            form.reset();
            onSuccess?.();
            resolve("created");
          },
        });
      }
    });
    toast.promise(promise, {
      loading: linkId ? "Updating link..." : "Adding link...",
      success: linkId ? "Link Updated" : "Link added!",
      error: getErrorMessage,
    });
  };
  // const handleSubmit = (values: LinkFormSchema) => {
  //   if (linkId) {
  //     updateMutation.mutate({
  //       linkId: linkId,
  //       userId: session?.user.id ?? "",
  //       ...values,
  //     });
  //   } else {
  //     createMutation.mutate(values);
  //   }
  // };

  const isLoading = linkId
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <FieldSet>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup className="flex flex-col gap-4 p-2">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Insert title..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Insert description..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input
                  {...field}
                  id="url"
                  type="url"
                  aria-invalid={fieldState.invalid}
                  placeholder="Insert url..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" />
                {linkId ? "Updating Link..." : "Adding Link..."}
              </span>
            ) : linkId ? (
              "Update Link"
            ) : (
              "Add Link"
            )}
          </Button>
        </FieldGroup>
      </form>
    </FieldSet>
  );
};
