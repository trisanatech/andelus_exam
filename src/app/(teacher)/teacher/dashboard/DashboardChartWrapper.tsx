"use client";

import dynamic from "next/dynamic";

// Dynamically import the ExamStatusChart as a client component
const ExamStatusChart = dynamic(() => import("./ExamStatusChart"), { ssr: false });

export default function DashboardChartWrapper({ exams }: { exams: any[] }) {
  return <ExamStatusChart exams={exams} />;
}
