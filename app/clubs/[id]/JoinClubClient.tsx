"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
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
import { serverRequestJoinClub, serverLeaveClub } from "@/app/actions";
import { toast } from "sonner";

type Props = {
  clubId: number;
  userId: number;
  currentRole: string;
  joinRequestStatus: string | null;
};

export function JoinClubClient({ clubId, userId, currentRole, joinRequestStatus }: Props) {
  const router = useRouter();
  const [joinOpen, setJoinOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setLoading(true);
      await serverRequestJoinClub(clubId, userId, message || undefined);
      setJoinOpen(false);
      setMessage("");
      toast.success("Join request sent!");
      router.refresh();
    } catch {
      toast.error("Failed to send join request.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setLoading(true);
      await serverLeaveClub(clubId, userId);
      setLeaveOpen(false);
      toast.success("You have left the club.");
      router.push("/");
    } catch {
      toast.error("Failed to leave club.");
    } finally {
      setLoading(false);
    }
  };

  if (currentRole === "owner") return null;

  if (currentRole === "member" || currentRole === "board_member") {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setLeaveOpen(true)} className="gap-2 text-muted-foreground">
          <Icon icon={ICON_MAP.actions.leave} className="size-4" /> Leave Club
        </Button>

        <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Club?</AlertDialogTitle>
              <AlertDialogDescription>
                You will lose access to this club. You can request to rejoin later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={handleLeave} disabled={loading}>
                {loading ? "Leaving..." : "Leave Club"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (joinRequestStatus === "pending") {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2 text-muted-foreground">
        <Icon icon={ICON_MAP.status.pending} className="size-4" /> Request Pending
      </Button>
    );
  }

  return (
    <>
      <Button size="sm" onClick={() => setJoinOpen(true)} className="gap-2">
        <Icon icon={ICON_MAP.actions.join} className="size-4" /> Join Club
      </Button>

      <AlertDialog open={joinOpen} onOpenChange={setJoinOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request to Join</AlertDialogTitle>
            <AlertDialogDescription>
              Send a join request. A board member will review it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-2">
            <Label>Message (optional)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the club why you'd like to join..."
              rows={3}
              maxLength={255}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleJoin} disabled={loading} className="gap-2">
              {loading ? "Sending..." : <><Icon icon={ICON_MAP.actions.join} className="size-4" /> Send Request</>}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
