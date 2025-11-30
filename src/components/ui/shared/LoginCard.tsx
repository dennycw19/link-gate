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

//Validasi
const createLogin = z.object({
  username: z.string().max(32).min(5),
  password: z.string().max(32).min(8),
});

//Typescript type
type CreateLogin = z.infer<typeof createLogin>;

export const LoginCard = () => {
  const router = useRouter();
  const formLogin = useForm<CreateLogin>({
    resolver: zodResolver(createLogin),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: CreateLogin) {
    console.log("LOGIN DATA:", data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <Card className="w-full max-w-md bg-neutral-800 p-8">
        <FieldSet className="text-neutral-100">
          <CardHeader className="justify-center">
            <FieldLegend className="text-2xl!">LOGIN</FieldLegend>
          </CardHeader>
          <CardContent>
            <form id="login" onSubmit={formLogin.handleSubmit(onSubmit)}>
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
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation={"vertical"} className="gap-4">
              <Button type="submit" form="login">
                Login
              </Button>
              {/* <Button
                type="button"
                variant={"outline"}
                className="text-black"
                onClick={() => router.push("/login")}
              >
                Cancel
              </Button> */}
            </Field>
          </CardFooter>
        </FieldSet>
      </Card>
    </div>
  );
};
