"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginPayload } from "@/types/LoginPayload";
import googleIcon from "@/assets/icons/google.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import React from "react";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const { signIn } = useSignIn();
  const [error, setError] = useState<null | string>(null);
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    clearErrors,
  } = useForm<LoginPayload>();

  const handleGoogleSignIn = async () => {
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/dashboard",
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      redirect("/login");
    }
  };

  const onSubmit = async (data: LoginPayload) => {
    console.log("Logging in");
    setError(null);
    const { error } = await signIn.password({
      identifier: data.email,
      password: data.password,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/dashboard");
          router.push(url);
        },
      });
    }

    if (error && isClerkAPIResponseError(error)) {
      setError(error.errors[0]?.longMessage || error.errors[0]?.message);
      return;
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-semibold text-brand-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs ">
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className={`${error ? "gap-4" : "gap-7"}`}>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="font-medium"
                >
                  <Image
                    src={googleIcon}
                    height={20}
                    width={20}
                    alt="Google Icon"
                  />
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className={`${errors.email ? "border-error" : ""} ring-0! focus-visible:border-brand-primary `}
                    />
                  )}
                />

                {errors.email && (
                  <p className="text-xs leading-0 uppercase text-error">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline text-brand-primary underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "password is required" }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      id="password"
                      type="password"
                      value={value}
                      onChange={onChange}
                      className={`${errors.password ? "border-error" : ""} ring-0! focus-visible:border-brand-primary `}
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-xs leading-0 uppercase text-error">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {error && (
                <div className="bg-error/10 p-2 rounded-md text-center border border-error">
                  <p className="text-error text-xs uppercase">{error}</p>
                </div>
              )}
              <Field>
                <Button
                  type="submit"
                  className={
                    "bg-brand-secondary active:bg-brand-secondary/80 hover:bg-brand-secondary/95 cursor-pointer"
                  }
                >
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
