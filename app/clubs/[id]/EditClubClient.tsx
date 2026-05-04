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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import { serverUpdateClubInfo } from "@/app/actions";
import { ClubRecord } from "@/db/types";

export function EditClubClient({ club, canManage }: { club: ClubRecord, canManage: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(club.name);
  const [description, setDescription] = useState(club.description || "");
  const [loading, setLoading] = useState(false);

  if (!canManage) return null;

  const handleUpdate = async () => {
      try {
          setLoading(true);
          await serverUpdateClubInfo(club.id, { name, description });
          setOpen(false);
          router.refresh();
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  return (
      <>
         <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
             <Icon icon={ICON_MAP.actions.edit} className="size-4" /> Edit Club
         </Button>

         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Club Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the visible name and description for {club.name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Club Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleUpdate} disabled={loading} className="gap-2">
                       {loading ? "Saving..." : <><Icon icon={ICON_MAP.status.success}/> Save Changes</>}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
  )
}
