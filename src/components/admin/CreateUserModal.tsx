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

export default function CreateUserModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: {
    email: string;
    displayName: string;
    username: string;
    role: string;
  }) => {
    // TODO: Replace with your API call to create a user.
    console.log("Creating user:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
