import "./globals.css";
import { Providers } from "./providers";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import ConditionalNavbar from "@/components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "Andelus Exam System",
  description: "Description of the exam system",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ConditionalNavbar />
            <div className="container flex gap-2 py-0 px-0">
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
