// 'use client';

// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// // import { Github } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Separator } from '@/components/ui/separator';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Loading } from '@/components/loading';

// export default function SignInPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const result = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError(result.error);
//       } else {
//         router.push('/');
//         router.refresh();
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">
//       <Card className="w-full max-w-[350px]">
//         <CardHeader className="text-center">
//           <CardTitle>Welcome back</CardTitle>
//           <CardDescription>Sign in to your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               {error && <p className="text-sm text-red-500">{error}</p>}
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? <Loading size="sm" className="mr-2" /> : null}
//                 {isLoading ? 'Signing in...' : 'Sign in'}
//               </Button>
//             </form>

//             {/* <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <Separator className="w-full" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//               </div>
//             </div>

//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsLoading(true);
//                 signIn('github', { callbackUrl: '/' });
//               }}
//               className="w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <Loading size="sm" className="mr-2" />
//               ) : (
//                 <Github className="mr-2 h-4 w-4" />
//               )}
//               GitHub
//             </Button> */}

//             <p className="text-center text-sm text-muted-foreground">
//               Don&apos;t have an account?{' '}
//               <Link href="/register" className="text-primary hover:underline">
//                 Create one
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loading } from "@/components/loading";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use credentials provider for sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Wait for session update
        const session = await getSession();
        if (session?.user?.role === "TEACHER") {
          router.push("/teacher/dashboard");
        } else if (session?.user?.role === "STUDENT") {
          router.push("/student/dashboard");
        } else if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loading size="sm" className="mr-2" /> : null}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
