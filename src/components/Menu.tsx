import React from "react";
import { motion } from "framer-motion";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabTriggers: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}> = ({ activeTab, tabs }) => (
  <TabsList className="flex space-x-4 h-11 border-b-2 py-5 rounded-none -mx-6 bg-white justify-start">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab}
        value={tab.toLowerCase()}
        className={`px-4 py-3 text-sm font-medium data-[state=active]:shadow-none text-gray-500 transition-all duration-200 ease-in-out relative ${
          activeTab === tab.toLowerCase()
            ? "text-[#4B40EE]"
            : "hover:text-gray-700"
        }`}
      >
        {tab}
        {activeTab === tab.toLowerCase() && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4B40EE]"
            layoutId="activeTab"
          />
        )}
      </TabsTrigger>
    ))}
  </TabsList>
);
