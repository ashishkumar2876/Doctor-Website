import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  prescriptionId: string;
}

const COLORS = ["#1E40AF", "#3B82F6", "#BFDBFE"]; // Dark Blue, Bright Blue, Light Blue

const PrescriptionPieChart: React.FC<Props> = ({ prescriptionId }) => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reminders/status-summary/${prescriptionId}`,
          { withCredentials: true }
        );
        const stats = res.data;

        const formattedData = [
          { name: "Taken", value: stats.taken },
          { name: "Missed", value: stats.missed },
          { name: "Pending", value: stats.pending },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [prescriptionId]);

  if (loading)
    return <p className="text-sm text-gray-400">Loading chart...</p>;

  if (data.every((d) => d.value === 0))
    return <p className="text-sm text-gray-400">No data to display</p>;

  return (
    <div className="w-40 h-40 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            dataKey="value"
            stroke="#ffffff"
            label={({ percent, value }) => (percent! > 0.08 ? value : null)}
            labelLine={false}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [value, name]}
            contentStyle={{
              backgroundColor: "#e0e7ff",
              borderRadius: "8px",
              border: "1px solid #3B82F6",
              color: "#1E40AF",
              fontWeight: "600",
              fontSize: "14px",
            }}
            itemStyle={{ color: "#1E40AF" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrescriptionPieChart;
