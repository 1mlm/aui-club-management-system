"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Label } from "@/shadcn/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import { serverCreatePost } from "@/app/actions";
import { toast } from "sonner";

type Props = {
  clubId: number;
  userId: number;
};

export function CreatePostClient({ clubId, userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      setLoading(true);
      await serverCreatePost(clubId, userId, title, content);
      setOpen(false);
      setTitle("");
      setContent("");
      toast.success("Announcement posted!");
      router.refresh();
    } catch {
      toast.error("Failed to post announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Icon icon={ICON_MAP.actions.create} className="size-4" /> New Announcement
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              This will be visible to all club members.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Meeting this Friday at 5pm"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details about the announcement..."
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">{content.length}/1000</p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleSubmit} disabled={loading || !title.trim() || !content.trim()} className="gap-2">
              {loading ? "Posting..." : <><Icon icon={ICON_MAP.status.success} className="size-4" /> Post</>}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
