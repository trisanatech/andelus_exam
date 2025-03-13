"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const createUserSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().uuid("Please select a valid role"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });
  const router = useRouter();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

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

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      toast("User created successfully", { variant: "success" });
      router.push("/admin/users");
    } catch (err: any) {
      toast(err.message || "Error creating user", { variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
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
              <label className="block text-sm font-medium">Password</label>
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              {loadingRoles ? (
                <p>Loading roles...</p>
              ) : (
                <select {...register("roleId")} className="border rounded p-2 w-full">
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.roleId && (
                <p className="text-red-500 text-sm">{errors.roleId.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Create User
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
