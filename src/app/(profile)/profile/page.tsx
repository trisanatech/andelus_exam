"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {Loading} from "@/components/loading";

// Define the schema for updating the profile.
const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(), // Optional; if left blank, the password remains unchanged.
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Pre-populate the form with session data.
  useEffect(() => {
    if (session?.user) {
      reset({
        displayName: session.user.displayName || session.user.name || "",
        email: session.user.email || "",
        password: "", // Leave blank by default.
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoadingUpdate(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      toast("Profile updated successfully!", { variant: "success" });
      router.push("/")// Optionally refresh the session data.
    } catch (err: any) {
      toast(err.message || "Error updating profile", { variant: "destructive" });
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (status === "loading") return <Loading />;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
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
              <label className="block text-sm font-medium">
                New Password (Leave blank to keep current)
              </label>
              <Input type="password" placeholder="New Password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" disabled={loadingUpdate} className="w-full">
              {loadingUpdate ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
