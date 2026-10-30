"use client";

import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah, formatRupiahShort } from "@/lib/utils";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { PieChart as PieIcon, BarChart2 } from "lucide-react";

// Warna untuk pie chart kategori
const PIE_COLORS = [
  "#F97316", "#3B82F6", "#10B981", "#8B5CF6",
  "#F59E0B", "#EF4444", "#6366F1", "#EC4899",
];

interface ChartData {
  pie: { name: string; value: number; emoji: string }[];
  bar: { bulan: string; pemasukan: number; pengeluaran: number }[];
  line: { tanggal: string; pengeluaran: number }[];
}

async function fetchChartData(periode: string): Promise<ChartData> {
  const res = await fetch(`/api/charts?periode=${periode}`);
  if (!res.ok) throw new Error("Gagal memuat data grafik");
  return res.json();
}

// Custom tooltip untuk pie chart
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">
          {item.payload.emoji} {item.name}
        </p>
        <p className="text-sm text-orange-600 font-bold">
          {formatRupiah(item.value)}
        </p>
        <p className="text-xs text-gray-500">
          {((item.value / item.payload.total) * 100).toFixed(1)}% dari total
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip untuk bar chart
const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
            {entry.name === "pemasukan" ? "Pemasukan" : "Pengeluaran"}:{" "}
            <span className="font-bold">{formatRupiah(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip untuk line chart
const LineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
        <p className="text-xs text-red-500 font-bold">
          Pengeluaran: {formatRupiah(payload[0]?.value ?? 0)}
        </p>
      </div>
    );
  }
  return null;
};

interface ChartsProps {
  periode: string;
}

export default function Charts({ periode }: ChartsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["charts", periode],
    queryFn: () => fetchChartData(periode),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="chart" />
        </div>
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Gagal memuat grafik"
        description="Tidak bisa terhubung ke server. Coba muat ulang halaman."
      />
    );
  }

  const totalPie = data.pie.reduce((sum, item) => sum + item.value, 0);
  const pieDataWithTotal = data.pie.map((item) => ({ ...item, total: totalPie }));

  return (
    <div className="space-y-4">
      {/* Baris 1: Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart: Pengeluaran per Kategori */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-900">
              Pengeluaran per Kategori
            </h3>
          </div>

          {data.pie.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieDataWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieDataWithTotal.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value, entry: any) =>
                    `${entry.payload.emoji} ${value}`
                  }
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart: Pemasukan vs Pengeluaran 6 Bulan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-900">
              Pemasukan vs Pengeluaran
            </h3>
          </div>

          {data.bar.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.bar} barGap={4} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatRupiahShort}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) =>
                    value === "pemasukan" ? "Pemasukan" : "Pengeluaran"
                  }
                />
                <Bar
                  dataKey="pemasukan"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pengeluaran"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line Chart: Trend Pengeluaran Harian */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Trend Pengeluaran Harian Bulan Ini
        </h3>

        {data.line.length === 0 ? (
          <div className="h-36 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Belum ada data transaksi bulan ini</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data.line}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="tanggal"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatRupiahShort}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<LineTooltip />} />
              <Line
                type="monotone"
                dataKey="pengeluaran"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ fill: "#F97316", r: 3 }}
                activeDot={{ r: 5, fill: "#EA580C" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
