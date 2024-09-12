import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "./Chart/Chart";
import { TabTriggers } from "./Menu";

// Dynamic Tab Content Renderer
const TabContent: React.FC<{
  activeTab: string;
  contentMap: Record<string, React.ComponentType>;
}> = ({ activeTab, contentMap }) => (
  <AnimatePresence mode="wait">
    {Object.entries(contentMap).map(
      ([tabKey, ContentComponent]) =>
        activeTab === tabKey && (
          <motion.div
            key={tabKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ContentComponent />
          </motion.div>
        )
    )}
  </AnimatePresence>
);

const CatlogDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("chart");
  // Mapping of tabs to content components
  const tabContentMap = {
    summary: () => <p>This is the summary content.</p>,
    chart: () => (
      <>
        <Chart />
      </>
    ),
    statistics: () => <p>This is the statistics content.</p>,
    analysis: () => <p>This is the analysis content.</p>,
    settings: () => <p>This is the settings content.</p>,
  };

  return (
    <div className="min-h-screen w-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              63,179.71
              <span className="text-lg md:text-xl font-normal text-gray-500 align-top">
                USD
              </span>
            </h1>
            <p className="text-md md:text-lg text-green-500">
              + 2,161.42 (3.54%)
            </p>
          </div>

          {/* Tabs and Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabTriggers
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={["Summary", "Chart", "Statistics", "Analysis", "Settings"]}
            />
            <div className="h-[450px] mt-14">
              <TabContent activeTab={activeTab} contentMap={tabContentMap} />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CatlogDashboard;
