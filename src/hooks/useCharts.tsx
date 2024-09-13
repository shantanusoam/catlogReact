import { timeRanges } from "@/consts/chart-consts";
import { TimeRange } from "@/types/catlogTypes";
import { useCallback, useEffect, useState } from "react";

interface DataPoint {
  time: string;
  price: number;
  volume: number;
}

export const generateData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  let price = 63000;
  let volume = 1000;
  const pointsPerDay = 5;
  for (let i = 0; i < days * pointsPerDay; i++) {
    price += Math.random() * 200 - 100;
    volume = Math.max(100, volume + Math.random() * 200 - 100);
    data.push({
      time: new Date(
        Date.now() - (days * 24 - i * (24 / pointsPerDay)) * 3600000
      ).toISOString(),
      price: Math.max(price, 60000),
      volume: volume,
    });
  }
  return data;
};

export const useChartData = (initialRange: TimeRange = "1w") => {
  const [data, setData] = useState<DataPoint[]>(() => generateData(7));
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);

  useEffect(() => {
    const days = timeRanges.indexOf(selectedRange) + 1;
    setData(generateData(days * 7));
  }, [selectedRange]);

  const handleRangeChange = useCallback((range: TimeRange) => {
    setSelectedRange(range);
  }, []);

  return { data, selectedRange, handleRangeChange };
};
