import { DataPoint } from "@/types/catlogTypes";
import { memo, useMemo } from "react";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A243A] text-white p-2 rounded shadow text-sm">
        <p className="font-bold">{formatCurrency(payload[0].value)}</p>
        {/* <p>{label ? new Date(label).toLocaleDateString() : ''}</p> */}
      </div>
    );
  }
  return null;
};

const FixedTooltip: React.FC<{ data: DataPoint[] }> = memo(({ data }) => {
  const lastPoint = data[data.length - 1];
  return (
    <div className="absolute right-0 top-1/2 bg-[#4B40EE] text-white p-2 rounded shadow text-sm">
      <p className="font-bold">{formatCurrency(lastPoint.price)}</p>
      {/* <p>{new Date(lastPoint.time).toLocaleDateString()}</p> */}
    </div>
  );
});

const HighestPriceTooltip: React.FC<{ data: DataPoint[] }> = memo(
  ({ data }) => {
    const highestPoint = data.reduce(
      (max, point) => (point.price > max.price ? point : max),
      data[0]
    );
    return (
      <div className="absolute right-0 top-1/4 bg-black text-white p-2 rounded shadow text-sm">
        <p className="font-bold">{formatCurrency(highestPoint.price)}</p>
        {/* <p>{new Date(highestPoint.time).toLocaleDateString()}</p> */}
      </div>
    );
  }
);

import React from "react";
import { ChartControls } from "./ChartMenu";
import { useChartData } from "@/hooks/useCharts";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = () => {
  const { data, selectedRange, handleRangeChange } = useChartData();

  const memoizedChart = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8E7FF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="time"
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            tick={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={["dataMin - 1000", "dataMax + 1000"]}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            tick={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, "dataMax"]}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="right" dataKey="volume" fill="#E5E7EB" opacity={0.3} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#4B40EE"
            fillOpacity={1}
            fill="url(#colorGradient)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#4B40EE"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
          />
          <ReferenceLine
            y={data.length > 0 ? Math.max(...data.map((d) => d.price)) : 0}
            yAxisId="left" // Specify the correct yAxisId to match the left axis
            stroke="#c3c5c9"
            strokeDasharray="3 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    ),
    [data]
  );

  return (
    <>
      <ChartControls
        selectedRange={selectedRange}
        handleRangeChange={handleRangeChange}
      />
      <div className="h-[400px] -ml-11 mt-2 relative">
        {memoizedChart}
        <HighestPriceTooltip data={data} />
        <FixedTooltip data={data} />
      </div>
    </>
  );
};

export default Chart;
