"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { useRouter } from "next/navigation";
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
import { api } from "~/trpc/react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useState } from "react";

//Validasi
const createRegisterFormSchema = z
  .object({
    username: z
      .string()
      .max(32)
      .min(5, "Username must be at least 5 characters")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Only letters, numbers, periods, underscores, or dashes",
      ),
    password: z
      .string()
      .min(8, "Username must be at least 8 characters")
      // Minimal 1 huruf kecil
      .regex(/[a-z]/, "Must contain lowercase letters")
      // Minimal 1 huruf besar
      .regex(/[A-Z]/, "Must contain uppercase letters")
      // Minimal 1 angka
      .regex(/\d/, "Must contain numbers")
      // Minimal 1 simbol
      .regex(/[^a-zA-Z0-9]/, "Must contain symbols"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Confirm Password tidak sama",
    path: ["confirmPassword"],
  });

//Typescript type
type CreateRegisterFormSchema = z.infer<typeof createRegisterFormSchema>;

export const RegisterCard = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formRegister = useForm<CreateRegisterFormSchema>({
    resolver: zodResolver(createRegisterFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createRegisterMutation = api.user.createUser.useMutation({
    onSuccess: async () => {
      alert("Registration successful. You can now log in.");
      formRegister.reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
      router.push("/login");
    },
    onError: (error) => {
      if (error.message.includes("Username")) {
        formRegister.setError("username", {
          type: "manual",
          message: error.message,
        });
      } else {
        alert(error.message);
      }
    },
  });

  const handleRegister = (values: CreateRegisterFormSchema) => {
    createRegisterMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <FieldSet className="">
          <CardHeader className="justify-center">
            <FieldLegend className="text-2xl!">REGISTER</FieldLegend>
          </CardHeader>
          <CardContent>
            <form
              id="register"
              onSubmit={formRegister.handleSubmit(handleRegister)}
            >
              <FieldGroup className="flex flex-col gap-6">
                <Controller
                  name="username"
                  control={formRegister.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <FieldDescription className="text-xs">
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
                      <FieldDescription className="text-xs">
                        Password must contain lowercase, uppercase, numbers, and
                        symbols
                      </FieldDescription>
                      <div className="flex justify-end">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Insert password..."
                        />
                        <Button
                          type="button"
                          className="absolute"
                          tabIndex={-1}
                          onClick={() => setShowPassword((show) => !show)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
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
                      <div className="flex justify-end">
                        <Input
                          {...field}
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Insert confirmation password..."
                        />
                        <Button
                          type="button"
                          className="absolute"
                          tabIndex={-1}
                          onClick={() =>
                            setShowConfirmPassword((show) => !show)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
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
              <Button
                type="submit"
                form="register"
                disabled={createRegisterMutation.isPending}
              >
                {createRegisterMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon className="animate-spin" />
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            </Field>
          </CardFooter>
        </FieldSet>
      </Card>
    </div>
  );
};
