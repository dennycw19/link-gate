"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// type EditLinkFormProps = {
//   defaultTitle?: string;
//   defaultDescription?: string;
//   defaultUrl?: string;
//   onSubmit?: (data: {
//     title: string;
//     description: string;
//     url: string;
//   }) => void;
// };

//Validasi
const createLinkFormSchema = z.object({
  title: z.string().max(20).min(1),
  description: z.string().max(50).min(1),
  url: z.string().min(1),
});

//Typescript type
type CreateLinkFormSchema = z.infer<typeof createLinkFormSchema>;

export const AddLinkForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSubmit?.({ title, description, url });
  // };
  const formAddLink = useForm<CreateLinkFormSchema>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
    },
  });

  const createLinkFormMutation = api.link.createLink.useMutation({
    onSuccess: async () => {
      alert("Link has been added successfully");
      formAddLink.reset();
      onSuccess?.();
    },
    onError: (error) => {
      if (error.message) {
        alert(error.message);
        return;
      }
    },
  });

  const handlerAddLink = (values: CreateLinkFormSchema) => {
    createLinkFormMutation.mutate({
      title: values.title,
      description: values.description,
      url: values.url,
    });
  };

  return (
    <FieldSet>
      {/* <FieldLegend>Add New Link</FieldLegend> */}
      <form id="add-link" onSubmit={formAddLink.handleSubmit(handlerAddLink)}>
        <FieldGroup className="flex flex-col gap-4 p-2">
          <Controller
            name="title"
            control={formAddLink.control}
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
            control={formAddLink.control}
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
            control={formAddLink.control}
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
          <Button
            type="submit"
            className="w-full"
            form="add-link"
            disabled={createLinkFormMutation.isPending}
          >
            {createLinkFormMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" />
                Adding Link...
              </span>
            ) : (
              "Add Link"
            )}
          </Button>
        </FieldGroup>
      </form>
    </FieldSet>
  );
};
