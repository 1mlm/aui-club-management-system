"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shadcn/ui/input-group";
import { Label } from "@/shadcn/ui/label";
import {
  isAuiEmail,
  isValidDisplayName,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
} from "@/util/authRules";

type AuthMode = "signin" | "register";

type AuthFieldKey = "displayName" | "email" | "password";

type AuthValues = {
  displayName: string;
  email: string;
  password: string;
};

type InputRule = {
  id: string;
  isValid: (value: string, values: AuthValues) => boolean;
  getLabel: (value: string, values: AuthValues) => string;
};

type AuthInputConfig = {
  key: AuthFieldKey;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  rules?: InputRule[];
  usePasswordGroup?: boolean;
};

const displayNameRules: InputRule[] = [
  {
    id: "display-name-min",
    isValid: (value) => value.trim().length >= 2,
    getLabel: () => "At least 2 characters",
  },
  {
    id: "display-name-pattern",
    isValid: (value) => isValidDisplayName(value),
    getLabel: () => "Letters, numbers, spaces, dots, underscores, hyphens",
  },
];

const emailRules: InputRule[] = [
  {
    id: "email-aui-domain",
    isValid: (value) => isAuiEmail(value),
    getLabel: () => "Must end with @aui.ma or .aui.ma subdomain",
  },
];

const passwordRules: InputRule[] = [
  {
    id: "password-min-length",
    isValid: (value) => isValidPassword(value),
    getLabel: () => `Minimum ${MIN_PASSWORD_LENGTH} characters`,
  },
];

const signinInputs: AuthInputConfig[] = [
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "you@aui.ma",
    autoComplete: "email",
    required: true,
    rules: emailRules,
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    required: true,
    rules: passwordRules,
    usePasswordGroup: true,
  },
];

const registerInputs: AuthInputConfig[] = [
  {
    key: "displayName",
    label: "Display Name",
    type: "text",
    placeholder: "AUI Student",
    autoComplete: "name",
    required: true,
    rules: displayNameRules,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "you@aui.ma",
    autoComplete: "email",
    required: true,
    rules: emailRules,
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    required: true,
    rules: passwordRules,
    usePasswordGroup: true,
  },
];

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [values, setValues] = useState<AuthValues>({
    displayName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const activeInputs = mode === "signin" ? signinInputs : registerInputs;

  const setField = (key: AuthFieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = useMemo(() => {
    return activeInputs.every((input) => {
      const value = values[input.key];
      if (input.required && value.trim().length === 0) {
        return false;
      }

      return (input.rules ?? []).every((rule) => rule.isValid(value, values));
    });
  }, [activeInputs, values]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please fill all fields with valid values.");
      return;
    }

    const endpoint =
      mode === "signin" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "signin"
        ? { email: values.email, password: values.password }
        : {
          displayName: values.displayName,
          email: values.email,
          password: values.password,
        };

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.error ?? "Authentication failed.");
      }

      await refreshUser();
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl border border-border py-6 shadow-xl">
        <CardHeader className="space-y-4 px-6">
          <div className="inline-flex w-fit items-center rounded-lg border border-border bg-muted p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === "signin" ? "secondary" : "ghost"}
              onClick={() => setMode("signin")}
            >
              <Icon icon={ICON_MAP.user.profile} className="mr-2" /> Sign In
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "register" ? "secondary" : "ghost"}
              onClick={() => setMode("register")}
            >
              <Icon icon={ICON_MAP.nav.users} className="mr-2" /> Register
            </Button>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              Use an AUI email ({"@"}aui.ma or subdomains ending with .aui.ma).
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6">
          <form className="space-y-4" onSubmit={submit}>
            {activeInputs.map((input) => {
              const value = values[input.key];
              return (
                <div key={input.key} className="space-y-2">
                  <Label htmlFor={input.key}>{input.label}</Label>
                  {input.usePasswordGroup ? (
                    <InputGroup>
                      <InputGroupInput
                        id={input.key}
                        type="password"
                        value={value}
                        onChange={(e) => setField(input.key, e.target.value)}
                        autoComplete={input.autoComplete}
                        required={input.required}
                        placeholder="••••••••"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>
                          min {MIN_PASSWORD_LENGTH}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  ) : (
                    <Input
                      id={input.key}
                      type={input.type ?? "text"}
                      value={value}
                      onChange={(e) => setField(input.key, e.target.value)}
                      placeholder={input.placeholder}
                      autoComplete={input.autoComplete}
                      required={input.required}
                    />
                  )}

                  {(input.rules ?? []).map((rule) => {
                    const hasValue = value.trim().length > 0;
                    const valid = rule.isValid(value, values);
                    const showValid = hasValue && valid;
                    const showInvalid = hasValue && !valid;

                    return (
                      <p
                        key={`${input.key}-rule-${rule.id}`}
                        className={cn(
                          "flex items-center gap-1.5 text-xs",
                          showValid && "text-emerald-600",
                          showInvalid && "text-destructive",
                          !hasValue && "text-muted-foreground",
                        )}
                      >
                        {showValid ? (
                          <Icon
                            icon={ICON_MAP.status.success}
                            className="size-3.5"
                          />
                        ) : showInvalid ? (
                          <Icon
                            icon={ICON_MAP.status.error}
                            className="size-3.5"
                          />
                        ) : null}
                        {rule.getLabel(value, values)}
                      </p>
                    );
                  })}
                </div>
              );
            })}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting || !canSubmit}
                className="mx-auto flex w-full max-w-[20rem] bg-emerald-600 text-white shadow-[0_0_24px_color-mix(in_oklab,var(--foreground)_24%,transparent)] hover:bg-emerald-500"
              >
                {submitting ? (
                  "Please wait..."
                ) : mode === "signin" ? (
                  <span className="flex items-center gap-2"><Icon icon={ICON_MAP.user.profile} /> Sign In</span>
                ) : (
                  <span className="flex items-center gap-2"><Icon icon={ICON_MAP.nav.users} /> Register</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
