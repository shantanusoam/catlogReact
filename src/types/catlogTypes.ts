import { timeRanges } from "@/consts/chart-consts";

export interface DataPoint {
    time: string;
    price: number;
    volume: number;
  }
  


export type TimeRange = (typeof timeRanges)[number];  