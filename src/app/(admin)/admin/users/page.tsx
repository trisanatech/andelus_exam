"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {Loading} from "@/components/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from API endpoint
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter users by role
  const filteredUsers =
    filterRole === "all"
      ? users
      : users.filter((user) =>
          typeof user.role === "object"
            ? user.role.name.toLowerCase() === filterRole.toLowerCase()
            : user.role.toLowerCase() === filterRole.toLowerCase()
        );

  if (loading) return <Loading />;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Manage Users</h1>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded p-2 text-sm bg-background"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <Button asChild>
            <Link href="/admin/users/create" className="px-4 py-2 rounded transition">
              Create New User
            </Link>
          </Button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border">
            <thead>
              <tr className="text-center border-b">
                <th className="py-2 px-4">Display Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center border-b">
                  <td className="py-2 px-4">{user.displayName}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {typeof user.role === "object" ? user.role.name : user.role}
                  </td>
                  <td className="py-2 px-4">
                    {user.active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
