import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "purple" | "green" | "red" | "yellow";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-lg", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}