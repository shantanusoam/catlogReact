import { TimeRange } from "@/types/catlogTypes";
import { Button } from "../ui/button";
import { timeRanges } from "@/consts/chart-consts";

export const ChartControls: React.FC<{
  selectedRange: TimeRange;
  isFullscreen: boolean;
  isComparing: boolean;
  toggleCompare: () => void;
  toggleFullscreen: () => void;
  handleRangeChange: (range: TimeRange) => void;
}> = ({
  selectedRange,
  handleRangeChange,
  isFullscreen,
  isComparing,
  toggleFullscreen,
  toggleCompare,
}) => (
  <div className="flex flex-wrap items-center  justify-between gap-1">
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        className="flex items-center space-x-1"
        onClick={toggleFullscreen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3h18v18H3z" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
        <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center space-x-1 ${
          isComparing ? "bg-gray-200" : ""
        }`}
        onClick={toggleCompare}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>{isComparing ? "Hide Comparison" : "Compare"}</span>
      </Button>
    </div>

    <div className="flex space-x-1">
      {timeRanges.map((range) => (
        <Button
          key={range}
          variant="ghost"
          size="sm"
          className={`transition-all duration-200 ease-in-out ${
            range === selectedRange
              ? "bg-[#4B40EE] font-bold text-white"
              : "text-gray-500 font-semibold hover:text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleRangeChange(range)}
        >
          {range}
        </Button>
      ))}
    </div>
  </div>
);
