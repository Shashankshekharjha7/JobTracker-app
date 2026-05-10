import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">
        Job Application Tracker
      </h1>
      <p className="text-muted-foreground max-w-xl">
        Track applications, analyze progress, and stay interview-ready.
      </p>

      <div className="mt-6 flex gap-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Register</Button>
        </Link>
      </div>
    </main>
  );
}
