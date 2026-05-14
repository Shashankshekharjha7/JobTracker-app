export const chartColors = {
  primary: "hsl(221.2 83.2% 53.3%)",
  success: "hsl(142.1 76.2% 36.3%)",
  warning: "hsl(47.9 95.8% 53.1%)",
  danger: "hsl(0 84.2% 60.2%)",
  purple: "hsl(262.1 83.3% 57.8%)",
  gray: "hsl(215.4 16.3% 46.9%)",
};

export const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
    },
  },
};

export function generateChartData(labels: string[], data: number[], label: string) {
  return {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: [
          chartColors.primary,
          chartColors.purple,
          chartColors.success,
          chartColors.danger,
          chartColors.gray,
        ],
        borderWidth: 0,
      },
    ],
  };
}