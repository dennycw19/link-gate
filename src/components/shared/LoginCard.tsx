"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signIn } from "next-auth/react";
import { log } from "console";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";

//Validasi
const createLoginFormSchema = z.object({
  username: z.string().max(32).min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

//Typescript type
type CreateLoginFormSchema = z.infer<typeof createLoginFormSchema>;

export const LoginCard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formLogin = useForm<CreateLoginFormSchema>({
    resolver: zodResolver(createLoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // function onSubmit(data: CreateLogin) {
  //   console.log("LOGIN DATA:", data);
  // }
  async function handleLogin(values: CreateLoginFormSchema) {
    setLoading(true);
    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    console.log("SIGN IN RESPONSE: ", res);

    if (res?.error) {
      formLogin.setError("username", {
        type: "manual",
        message: "Invalid username or password",
      });
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <FieldSet className="">
          <CardHeader className="justify-center">
            <FieldLegend className="text-2xl!">LOGIN</FieldLegend>
          </CardHeader>
          <CardContent>
            <form id="login" onSubmit={formLogin.handleSubmit(handleLogin)}>
              <FieldGroup className="flex flex-col gap-6">
                <Controller
                  name="username"
                  control={formLogin.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
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
                  control={formLogin.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>

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
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation={"vertical"} className="gap-4">
              <Button
                type="submit"
                form="login"
                className=""
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon className="animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </Field>
          </CardFooter>
        </FieldSet>
      </Card>
    </div>
  );
};
