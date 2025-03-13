// components/admin/EditUserModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "./user-form.tsx";

type EditUserModalProps = {
  user: {
    id: string;
    email: string;
    displayName: string;
    username: string;
    role: string;
  };
  onEdit: (data: {
    id: string;
    email: string;
    displayName: string;
    username: string;
    role: string;
  }) => void;
};

export default function EditUserModal({ user, onEdit }: EditUserModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: {
    email: string;
    displayName: string;
    username: string;
    role: string;
  }) => {
    onEdit({ id: user.id, ...data });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <UserForm
          initialData={{
            email: user.email,
            displayName: user.displayName,
            username: user.username,
            role: user.role,
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
