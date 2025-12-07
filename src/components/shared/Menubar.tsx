"use client";
import { ArrowDown, ArrowUp, Plus, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { LinkFormDialog } from "./LinkFormDialog";

interface MenubarProps {
  sort: "asc" | "desc";
  setSort: (v: "asc" | "desc") => void;
}
export const Menubar = ({ sort, setSort }: MenubarProps) => {
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  // const [sort, setSort] = useState("asc");
  const handleSort = () => {
    setSort(sort === "asc" ? "desc" : "asc");
  };
  return (
    <div className="flex justify-between gap-2 p-2">
      <ButtonGroup>
        <Input placeholder="⚠️Under Maintenance⚠️" disabled />
        <Button variant="outline" aria-label="Search" disabled>
          <SearchIcon />
        </Button>
      </ButtonGroup>
      <div className="flex justify-between gap-2 p-2">
        <Button variant={"secondary"} onClick={handleSort}>
          {sort === "asc" ? <ArrowDown /> : <ArrowUp />}
        </Button>
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
    </div>
  );
};
