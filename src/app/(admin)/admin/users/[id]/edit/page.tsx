"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import {Loading} from "@/components/loading";
import { Switch } from "@/components/ui/switch"; // Controlled switch component

// Define the schema for editing a user, now including the active field and optional password.
const editUserSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  email: z.string().email("Invalid email"),
  roleId: z.string().uuid("Please select a valid role"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  active: z.boolean().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  // Watch active value and default it to true.
  const active = watch("active", true);

  // Fetch available roles from API.
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/admin/roles", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data.roles || []);
      } catch (error: any) {
        toast(error.message || "Error fetching roles", { variant: "destructive" });
      } finally {
        setLoadingRoles(false);
      }
    }
    fetchRoles();
  }, []);

  // Fetch the existing user details.
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        const user = data.user;
        reset({
          displayName: user.displayName,
          email: user.email,
          roleId: user.role?.id || "",
          active: user.active, // Pre-populate active status.
          password: "",
        });
      } catch (error: any) {
        toast(error.message || "Error fetching user", { variant: "destructive" });
      } finally {
        setLoadingUser(false);
      }
    }
    if (id) {
      fetchUser();
    }
  }, [id, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      const updatedData = { ...data };
      if (!updatedData.password) {
        delete updatedData.password; // Remove password if empty
      }
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      toast("User updated successfully", { variant: "success" });
      router.push("/admin/users");
    } catch (err: any) {
      toast(err.message || "Error updating user", { variant: "destructive" });
    }
  };

  if (loadingUser || loadingRoles) return <Loading />;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Display Name</label>
              <Input placeholder="Display Name" {...register("displayName")} />
              {errors.displayName && (
                <p className="text-red-500 text-sm">{errors.displayName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select {...register("roleId")} className="border rounded p-2 w-full">
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-red-500 text-sm">{errors.roleId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Active</label>
              <div className="flex items-center">
                <Switch
                  checked={active}
                  onCheckedChange={(checked) => setValue("active", checked)}
                />
                <span className="ml-2 text-sm">
                  {active ? "User is active" : "User is inactive"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <Input type="password" placeholder="New Password (optional)" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Update User
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
