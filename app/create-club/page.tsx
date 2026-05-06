"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ALLOWED_ICON_MAP, ALLOWED_COLOR_VALUES, ALLOWED_ICON_VALUES, CLUB_COLOR_HEX } from "@/db/catalog";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card";
import { serverSubmitClubCreationRequest } from "@/app/actions";
import { toast } from "sonner";
import { getClubColorStyles } from "@/util/clubStyles";
import Link from "next/link";

export default function CreateClubPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState<string>(ALLOWED_COLOR_VALUES[0]);
  const [icon, setIcon] = useState<string>(ALLOWED_ICON_VALUES[0]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <Icon icon={ICON_MAP.nav.clubs} className="size-12 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold">You need to be logged in</h2>
        <p className="text-muted-foreground">Sign in to submit a club creation request.</p>
        <Button asChild><Link href="/auth">Sign In</Link></Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 max-w-md mx-auto">
        <div className="size-16 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center">
          <Icon icon={ICON_MAP.status.success} className="size-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Request Submitted!</h2>
        <p className="text-muted-foreground">
          Your club creation request has been sent to the admin for review. You&apos;ll be notified once it&apos;s approved.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" asChild><Link href="/">Browse Clubs</Link></Button>
          <Button asChild><Link href="/dashboard">My Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  const canSubmit = name.trim().length >= 2 && email.trim().length > 0 && email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    startTransition(async () => {
      try {
        await serverSubmitClubCreationRequest({ name, description, color, icon, email });
        setSubmitted(true);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to submit request.");
      }
    });
  };

  const previewStyles = getClubColorStyles(color as any);
  const PreviewIcon = ALLOWED_ICON_MAP[icon as keyof typeof ALLOWED_ICON_MAP];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Create a Club</h1>
        <p className="text-muted-foreground">
          Fill in the details below. An admin will review and approve your request.
        </p>
      </div>

      {/* Live Preview */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl border-2"
        style={{ backgroundColor: previewStyles.bg, borderColor: previewStyles.border }}
      >
        <div
          className="size-16 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{ borderColor: previewStyles.border, boxShadow: `0 0 20px ${previewStyles.shadow}` }}
        >
          <Icon icon={PreviewIcon} className="size-8" style={{ color: previewStyles.text }} strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-semibold text-lg">{name || "Club Name"}</p>
          <p className="text-sm text-muted-foreground">{description || "Club description will appear here."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Chess Club"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Club Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="chess@aui.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does your club do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Club Color</CardTitle>
            <CardDescription>Pick a color theme for your club.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {ALLOWED_COLOR_VALUES.map((c) => {
                const hex = CLUB_COLOR_HEX[c];
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="size-9 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: hex,
                      borderColor: isSelected ? hex : "transparent",
                      boxShadow: isSelected ? `0 0 0 3px ${hex}40` : "none",
                      outline: isSelected ? `2px solid ${hex}` : "none",
                      outlineOffset: "2px",
                    }}
                    title={c}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Club Icon</CardTitle>
            <CardDescription>Choose an icon that represents your club.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {ALLOWED_ICON_VALUES.map((key) => {
                const IconComp = ALLOWED_ICON_MAP[key];
                const isSelected = icon === key;
                const styles = getClubColorStyles(color as any);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className="size-11 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: isSelected ? styles.bg : undefined,
                      borderColor: isSelected ? styles.border : "transparent",
                    }}
                    title={key.replace(/_/g, " ")}
                  >
                    <Icon
                      icon={IconComp}
                      className="size-5"
                      style={{ color: isSelected ? styles.text : undefined }}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          disabled={!canSubmit || isPending}
        >
          {isPending ? "Submitting..." : "Submit for Admin Approval"}
        </Button>
      </form>
    </div>
  );
}
