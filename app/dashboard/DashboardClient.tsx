"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { AuthUser } from "@/db/auth-types";
import type { OwnedClub, MemberClub, PendingJoinRequest } from "@/db/queries";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { getClubColorStyles } from "@/util/clubStyles";
import { Button } from "@/shadcn/ui/button";
import { Badge } from "@/shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { toast } from "sonner";
import { serverApproveJoinRequest, serverRejectJoinRequest } from "@/app/actions";

type Props = {
  user: AuthUser;
  ownedClubs: OwnedClub[];
  memberClubs: MemberClub[];
  pendingRequests: PendingJoinRequest[];
};

export function DashboardClient({ user, ownedClubs, memberClubs, pendingRequests }: Props) {
  const [requests, setRequests] = useState(pendingRequests);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (requestId: number) => {
    startTransition(async () => {
      try {
        await serverApproveJoinRequest(requestId);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        toast.success("Request approved");
      } catch {
        toast.error("Failed to approve request");
      }
    });
  };

  const handleReject = (requestId: number) => {
    startTransition(async () => {
      try {
        await serverRejectJoinRequest(requestId);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        toast.success("Request rejected");
      } catch {
        toast.error("Failed to reject request");
      }
    });
  };

  const firstName = user.displayName.split(" ")[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="text-muted-foreground">
          {ownedClubs.length > 0 && (
            <span>
              You own {ownedClubs.length} club{ownedClubs.length !== 1 ? "s" : ""}
            </span>
          )}
          {ownedClubs.length > 0 && memberClubs.length > 0 && <span> · </span>}
          {memberClubs.length > 0 && (
            <span>
              Member of {memberClubs.length} club{memberClubs.length !== 1 ? "s" : ""}
            </span>
          )}
          {ownedClubs.length === 0 && memberClubs.length === 0 && (
            <span>You haven't joined any clubs yet.</span>
          )}
        </p>
      </div>

      {/* Owned Clubs */}
      {ownedClubs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-semibold">Your Clubs</h2>
            <Badge variant="secondary">{ownedClubs.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ownedClubs.map((club) => (
              <OwnedClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Join Requests */}
      {requests.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-semibold">Pending Join Requests</h2>
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white">{requests.length}</Badge>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{req.requesterName}</p>
                      <p className="text-sm text-muted-foreground truncate">{req.requesterEmail}</p>
                      {req.message && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        → {req.clubName}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-600/30 hover:bg-emerald-600/10 hover:text-emerald-600"
                        disabled={isPending}
                        onClick={() => handleApprove(req.id)}
                      >
                        <Icon icon={ICON_MAP.actions.approve} className="size-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        disabled={isPending}
                        onClick={() => handleReject(req.id)}
                      >
                        <Icon icon={ICON_MAP.actions.reject} className="size-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Member Clubs */}
      {memberClubs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-semibold">Clubs You&apos;re In</h2>
            <Badge variant="secondary">{memberClubs.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberClubs.map((club) => (
              <MemberClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {ownedClubs.length === 0 && memberClubs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Icon
            icon={ICON_MAP.nav.browse}
            className="size-16 text-muted-foreground/30 mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">No clubs yet</h2>
          <p className="text-muted-foreground mb-6">
            Discover clubs and request to join them.
          </p>
          <Button asChild>
            <Link href="/">Browse Clubs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function OwnedClubCard({ club }: { club: OwnedClub }) {
  const colorStyles = getClubColorStyles(club.color ?? undefined);
  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;

  return (
    <Card className="overflow-hidden" style={{ borderColor: colorStyles.border }}>
      <CardHeader
        className="pb-3"
        style={{ backgroundColor: colorStyles.bg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-full flex items-center justify-center shrink-0 border-2"
            style={{ borderColor: colorStyles.border }}
          >
            <Icon
              icon={icon}
              className="size-5"
              style={{ color: colorStyles.text }}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base truncate">{club.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {club.memberCount} member{club.memberCount !== 1 ? "s" : ""}
              {club.pendingRequests > 0 && (
                <span className="ml-1 font-medium text-amber-500">
                  · {club.pendingRequests} pending
                </span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={`/clubs/${club.id}`}>Manage Club</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function MemberClubCard({ club }: { club: MemberClub }) {
  const colorStyles = getClubColorStyles(club.color ?? undefined);
  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;
  const roleLabel = club.membershipRole === "board_member" ? "Board Member" : "Member";

  return (
    <Card className="overflow-hidden" style={{ borderColor: colorStyles.border }}>
      <CardHeader
        className="pb-3"
        style={{ backgroundColor: colorStyles.bg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-full flex items-center justify-center shrink-0 border-2"
            style={{ borderColor: colorStyles.border }}
          >
            <Icon
              icon={icon}
              className="size-5"
              style={{ color: colorStyles.text }}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base truncate">{club.name}</CardTitle>
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded-full border"
              style={{ color: colorStyles.text, borderColor: colorStyles.border }}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={`/clubs/${club.id}`}>View Club</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
