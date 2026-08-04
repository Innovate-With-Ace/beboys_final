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
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Loader2 } from "lucide-react"; // <-- Make sure to import this!

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { signIn } = useSignIn();

  const [error, setError] = useState<null | string>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // We pull 'isSubmitting' directly from RHF to handle our manual login loading state
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    if (!signIn) return;

    try {
      setIsGoogleLoading(true);
      setError(null);

      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/dashboard",
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setError("Failed to initialize Google Sign In.");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (data: LoginPayload) => {
    if (!signIn) return;

    setError(null);
    try {
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
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage || err.errors[0]?.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Compute a master loading state so we can disable the whole form
  const isLoading = isSubmitting || isGoogleLoading;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-semibold text-brand-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs">
            Login to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup
              className={cn(
                "transition-all duration-300",
                error ? "gap-4" : "gap-7",
              )}
            >
              {/* Google Button */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="font-medium w-full relative"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Image
                      src={googleIcon}
                      height={18}
                      width={18}
                      alt="Google Icon"
                      className="mr-2"
                    />
                  )}
                  {isGoogleLoading ? "Connecting..." : "Login with Google"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-muted-foreground text-xs uppercase tracking-wider">
                Or continue with
              </FieldSeparator>

              {/* Email Input */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      disabled={isLoading}
                      className={cn(
                        "ring-0! transition-colors focus-visible:border-brand-primary",
                        errors.email &&
                          "border-error focus-visible:ring-error/20",
                      )}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-xs leading-none mt-1 text-error animate-in fade-in slide-in-from-top-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Password Input */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-xs underline-offset-4 hover:underline text-brand-primary transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      id="password"
                      type="password"
                      value={value}
                      onChange={onChange}
                      disabled={isLoading}
                      placeholder="••••••••"
                      className={cn(
                        "ring-0! transition-colors focus-visible:border-brand-primary",
                        errors.password &&
                          "border-error focus-visible:ring-error/20",
                      )}
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-xs leading-none mt-1 text-error animate-in fade-in slide-in-from-top-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Error Alert */}
              {error && (
                <div className="bg-error/10 p-3 rounded-md text-center border border-error/50 animate-in fade-in zoom-in-95">
                  <p className="text-error text-xs font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-secondary text-white active:bg-brand-secondary/80 hover:bg-brand-secondary/95 transition-all shadow-sm"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
