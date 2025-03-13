"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type ExamStatusData = {
  status: string;
  count: number;
};

export default function ExamStatusChart({ exams }: { exams: any[] }) {
  const [data, setData] = useState<ExamStatusData[]>([]);

  useEffect(() => {
    // Count the number of exams per status
    const statusMap: Record<string, number> = {};
    exams.forEach((exam) => {
      statusMap[exam.status] = (statusMap[exam.status] || 0) + 1;
    });
    const chartData = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));
    setData(chartData);
  }, [exams]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="status" stroke="var(--foreground)" />
        <YAxis stroke="var(--foreground)" allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none" }} />
        <Bar dataKey="count" fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
