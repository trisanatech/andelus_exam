"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export function UserAuthNav() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-[1.2rem] w-[1.2rem] rounded-full"
              width={20}
              height={20}
            />
          ) : (
            <User className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session?.user ? (
          <>
            <DropdownMenuItem disabled className="flex flex-col items-start">
              <span className="font-medium">{session.user.name}</span>
              {session.user.email && (
                <span className="text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* New Profile Link */}
            <DropdownMenuItem asChild>
              <Link href="/profile">  <User className="mr-2 h-4 w-4" /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(event) => {
                event.preventDefault();
                signOut({ callbackUrl: "/" });
              }}
            >
               <LogOut className="mr-2 h-4 w-4" />Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
            <Link href="/signin"><LogIn className="mr-2 h-4 w-4" /> Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Create account</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
