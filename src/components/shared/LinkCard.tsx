"use client";
import { EllipsisVerticalIcon, Link as LinkDiagonal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LinkFormDialog } from "./LinkFormDialog";
import { useSession } from "next-auth/react";

type LinkCardProps = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: Date;
};

export const LinkCard = (props: LinkCardProps) => {
  const apiUtils = api.useUtils();
  const { data: session } = useSession();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  type TruncateURLProps = {
    url: string;
    max?: number;
  };
  const truncateURL = ({ url, max = 60 }: TruncateURLProps) => {
    if (url.length < max) return url;

    const start = url.slice(0, Math.floor(max * 0.6));
    const end = url.slice(-Math.floor(max * 0.3));

    return `${start}...${end}`;
  };

  const deleteLinkMutation = api.link.deleteLink.useMutation();

  const handleDeleteLink = () => {
    toast.promise(
      deleteLinkMutation.mutateAsync(
        {
          linkId: props.id,
          userId: session?.user.id ?? "",
        },
        {
          onSuccess: () => {
            void apiUtils.link.getLinkPaginated.invalidate();
          },
        },
      ),
      {
        loading: "Deleting link...",
        success: "Link deleted successfully!",
        error: "Failed to delete post.",
      },
    );
  };

  return (
    <div className="space-y-2 rounded-xl border p-6 shadow">
      <div className="flex items-center justify-between">
        <h1>{props.title}</h1>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"link"} aria-label="Open menu" className="">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-card text-card-foreground w-40 space-y-0.5 rounded-lg border px-3 py-2 shadow-xl"
            align="end"
          >
            <DropdownMenuItem
              onSelect={() => setShowEditDialog(true)}
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer p-1 hover:rounded-sm"
            >
              Edit...
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer p-1 hover:rounded-sm"
            >
              Delete...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
            </DialogHeader>
            <LinkFormDialog
              defaultValues={{
                title: props.title,
                description: props.description,
                url: props.url,
              }}
              linkId={props.id}
              onSuccess={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this link?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              link and remove it from our servers.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant={"destructive"} onClick={handleDeleteLink}>
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <hr />
      <div>
        <p className="text-muted-foreground text-justify text-sm">
          {props.description}
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-2 rounded-2xl border p-2">
        <div className="border-r p-2">
          <LinkDiagonal className="" />
        </div>

        <Link
          href={props.url}
          target="_blank"
          // className="block break-all"
          // className="min-w-0 break-all text-fuchsia-400 underline-offset-2 transition-colors hover:text-fuchsia-500 hover:underline"
          className="text-accent min-w-0 break-all underline-offset-2 transition-colors hover:underline"
        >
          {truncateURL({
            url: props.url,
            max: 85,
          })}
        </Link>
      </div>
    </div>
  );
};
