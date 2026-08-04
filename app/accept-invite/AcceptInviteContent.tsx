"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

// Added 'needs-email-code' to the page status union type
type PageStatus =
  | "loading"
  | "needs-password"
  | "needs-email-code"
  | "error"
  | "success";

export default function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signUp } = useSignUp();

  const ticket = searchParams.get("__clerk_ticket");

  const [status, setStatus] = useState<PageStatus>("loading");
  const [errorMessage, setErrorMessage] = useState(
    "This invitation link is invalid or has expired.",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  // State for the email verification code input
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasProcessedRef = useRef(false);

  // Helper function to finalize the session and redirect user to dashboard
  const finalizeAndRedirect = async () => {
    const { error } = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/dashboard");
        window.location.href = url;
      },
    });

    if (error) {
      setErrorMessage(error.message || "Failed to finalize session.");
      setStatus("error");
      return;
    }

    setStatus("success");
  };

  // Effect to process the initial Clerk ticket on mount
  useEffect(() => {
    if (!signUp || hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    if (!ticket) {
      setErrorMessage("Invalid or missing invitation link");
      setStatus("error");
      return;
    }

    const processTicket = async () => {
      // Consume the invitation ticket via Clerk Future API
      const { error } = await signUp.ticket({ ticket });

      if (error) {
        setErrorMessage(
          error.message || "This invitation link is invalid or has expired",
        );
        setStatus("error");
        return;
      }

      // Check the resulting status of the signup attempt
      if (signUp.status === "complete") {
        await finalizeAndRedirect();
      } else if (signUp.status === "missing_requirements") {
        setStatus("needs-password");
      } else {
        setErrorMessage("Unexpected invitation status. Please try again.");
        setStatus("error");
      }
    };

    processTicket();
  }, [ticket, signUp]);

  // Handle password submission step
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (!signUp) return;

    setIsSubmitting(true);

    // Set the password on the signup attempt
    const { error } = await signUp.password({
      emailAddress: signUp.emailAddress ?? "",
      password,
    });

    if (error) {
      setFormError(error.message || "Failed to set password.");
      setIsSubmitting(false);
      return;
    }

    // Check if email verification is needed next or if signup is already complete
    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields?.includes("email_address")
    ) {
      // Send verification code to user's email
      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        setFormError(sendError.message || "Failed to send verification code.");
        setIsSubmitting(false);
        return;
      }

      setStatus("needs-email-code");
    } else if (signUp.status === "complete") {
      await finalizeAndRedirect();
    } else {
      setFormError("Please check your input and try again.");
    }

    setIsSubmitting(false);
  };

  // Handle verification code submission step
  const handleVerifyCodeSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setFormError("");

    if (!code || code.length < 6) {
      setFormError("Please enter a valid 6-digit verification code.");
      return;
    }

    if (!signUp) return;

    setIsSubmitting(true);

    // Verify the email address code
    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      setFormError(error.message || "Invalid verification code.");
      setIsSubmitting(false);
      return;
    }

    // After successful code verification, check if complete and finalize session
    if (signUp.status === "complete") {
      await finalizeAndRedirect();
    } else {
      setFormError("Additional requirements needed or verification failed.");
    }

    setIsSubmitting(false);
  };

  // Handler to resend email verification code
  const handleResendCode = async () => {
    setFormError("");
    if (!signUp) return;

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setFormError(error.message || "Failed to resend verification code.");
    } else {
      setFormError("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm text-card-foreground">
        {/* Loading State UI */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                Setting up your account...
              </h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your invitation.
              </p>
            </div>
          </div>
        )}

        {/* Error State UI */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                Invitation Error
              </h2>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            <Button className="mt-4 w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        )}

        {/* Needs Password State UI */}
        {status === "needs-password" && (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold tracking-tight">
                Complete Your Account
              </h2>
              <p className="text-sm text-muted-foreground">
                Please set a password to finish joining your organization.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Account & Join"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Needs Email Verification Code State UI */}
        {status === "needs-email-code" && (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold tracking-tight">
                Verify Your Email
              </h2>
              <p className="text-sm text-muted-foreground">
                We sent a verification code to{" "}
                <span className="font-medium text-foreground">
                  {signUp?.emailAddress || "your email"}
                </span>
                . Enter it below to complete your account.
              </p>
            </div>

            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-primary underline hover:text-primary/80 font-medium"
                >
                  Resend code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success State UI */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-muted-foreground">
                Redirecting you to your dashboard...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
