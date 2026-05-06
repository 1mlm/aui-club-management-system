"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { serverDeletePost, serverEditPost, serverTogglePinPost } from "@/app/actions";
import { toast } from "sonner";
import type { PostRecord } from "@/db/types";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";

type Props = {
  post: PostRecord;
};

export function PostActionsClient({ post }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"idle" | "edit" | "confirm-delete">("idle");
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await serverDeletePost(post.id);
      toast.success("Announcement deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete announcement.");
    } finally {
      setLoading(false);
      setMode("idle");
      setOpen(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;
    setLoading(true);
    try {
      await serverEditPost(post.id, editTitle, editContent);
      toast.success("Announcement updated.");
      router.refresh();
      setMode("idle");
      setOpen(false);
    } catch {
      toast.error("Failed to update announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handlePin = async () => {
    setLoading(true);
    try {
      await serverTogglePinPost(post.id, !post.is_pinned);
      toast.success(post.is_pinned ? "Unpinned." : "Pinned to top.");
      router.refresh();
    } catch {
      toast.error("Failed to update pin.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (mode === "edit") {
    return (
      <form onSubmit={handleEdit} className="mt-3 space-y-3 border-t pt-3">
        <div className="space-y-1">
          <Label htmlFor={`edit-title-${post.id}`}>Title</Label>
          <Input
            id={`edit-title-${post.id}`}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`edit-content-${post.id}`}>Content</Label>
          <Textarea
            id={`edit-content-${post.id}`}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={1000}
            rows={4}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setMode("idle")}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="mt-3 border-t pt-3 flex items-center gap-3">
        <p className="text-sm text-muted-foreground">Delete this announcement?</p>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setMode("idle")}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base leading-none">•••</span>
      </Button>
      {open && (
        <div
          className="absolute right-0 top-8 z-10 min-w-36 rounded-lg border bg-popover shadow-md py-1"
          onBlur={() => setOpen(false)}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
            onClick={() => { setMode("edit"); setOpen(false); }}
          >
            <Icon icon={ICON_MAP.actions.edit} className="size-3.5 shrink-0" /> Edit
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
            onClick={handlePin}
            disabled={loading}
          >
            <Icon icon={ICON_MAP.status.pending} className="size-3.5 shrink-0" /> {post.is_pinned ? "Unpin" : "Pin to top"}
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
            onClick={() => { setMode("confirm-delete"); setOpen(false); }}
          >
            <Icon icon={ICON_MAP.actions.delete} className="size-3.5 shrink-0" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
