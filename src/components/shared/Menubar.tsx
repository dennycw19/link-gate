"use client";
import { Plus, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { LinkFormDialog } from "./LinkFormDialog";

export const Menubar = () => {
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  return (
    <div className="flex justify-between p-2">
      <ButtonGroup>
        <Input placeholder="⚠️Under Maintenance⚠️" />
        <Button variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>

      <Button onClick={() => setShowAddLinkDialog(true)}>
        <Plus />
        Tambah
      </Button>
      <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
        <DialogContent
          className="sm:max-w-3xl"
          aria-describedby="add-link-dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          {/* <AddLinkForm onSuccess={() => setShowAddLinkDialog(false)} /> */}
          <LinkFormDialog onSuccess={() => setShowAddLinkDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
