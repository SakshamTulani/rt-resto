"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Button } from "@workspace/ui/components/button";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "../../lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError("");

      try {
        const result = await signIn.email({
          email: value.email,
          password: value.password,
        });

        if (result.error) {
          setServerError(result.error.message || "Login failed");
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        setServerError("An unexpected error occurred");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4">
      {serverError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
          {serverError}
        </div>
      )}

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Email is required"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? "Invalid email address"
                : undefined,
        }}>
        {(field) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Password is required"
              : value.length < 8
                ? "Password must be at least 8 characters"
                : undefined,
        }}>
        {(field) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
