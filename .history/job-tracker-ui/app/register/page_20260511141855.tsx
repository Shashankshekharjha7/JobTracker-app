"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Mail,
  Lock,
  ArrowRight,
  Briefcase,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-10">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-in fade-in duration-500">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
              Sign in to continue managing your job applications
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium gap-2"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}

              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}