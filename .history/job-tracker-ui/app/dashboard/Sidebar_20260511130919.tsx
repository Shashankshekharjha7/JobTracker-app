"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Video,
  BarChart3,
  Info,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/dashboard",
    icon: Briefcase,
  },
  {
    name: "Resumes",
    href: "/dashboard/resumes",
    icon: FileText,
  },
  {
    name: "Interview",
    href: "/dashboard/interview",
    icon: Video,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          JobTrackr
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          AI Interview Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}