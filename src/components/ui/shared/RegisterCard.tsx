"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

//Validasi
const createRegister = z
  .object({
    username: z
      .string()
      .max(32)
      .min(5, "Username must be at least 5 characters"),
    password: z
      .string()
      .max(32)
      .min(8, "Username must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain capital letters")
      .regex(/[^a-zA-Z0-9]/, "Password must contain special characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Confirm Password tidak sama",
    path: ["confirmPassword"],
  });

//Typescript type
type CreateRegister = z.infer<typeof createRegister>;

export const RegisterCard = () => {
  const formRegister = useForm<CreateRegister>({
    resolver: zodResolver(createRegister),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: CreateRegister) {
    console.log("REGISTER DATA:", data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <Card className="w-full max-w-md bg-neutral-800 p-8">
        <FieldSet className="text-neutral-100">
          <CardHeader>
            <FieldLegend className="text-2xl!">Register</FieldLegend>
          </CardHeader>
          <CardContent>
            <form id="register" onSubmit={formRegister.handleSubmit(onSubmit)}>
              <FieldGroup className="flex flex-col gap-6">
                <Controller
                  name="username"
                  control={formRegister.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <FieldDescription>
                        Choose an unique username for your account.
                      </FieldDescription>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insert username..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={formRegister.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>

                      <Input
                        {...field}
                        id="password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insert password..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={formRegister.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>

                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="Insert confirmation password..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation={"vertical"} className="gap-4">
              <Button type="submit" form="register">
                Register
              </Button>
              <Button type="button" variant={"outline"} className="text-black">
                Cancel
              </Button>
            </Field>
          </CardFooter>
        </FieldSet>
      </Card>
    </div>
  );
};
