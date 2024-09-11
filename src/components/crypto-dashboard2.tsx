import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

interface DataPoint {
  time: string;
  price: number;
  volume: number;
}

const generateData = (days: number): DataPoint[] => {
  const data: DataPoint[] = []
  let price = 63000
  let volume = 1000
  const pointsPerDay = 3 // Reduce number of points to 4 per day
  for (let i = 0; i < days * pointsPerDay; i++) {
    price += Math.random() * 200 - 100
    volume = Math.max(100, volume + Math.random() * 200 - 100)
    data.push({
      time: new Date(Date.now() - (days * 24 - i * (24 / pointsPerDay)) * 3600000).toISOString(),
      price: Math.max(price, 60000),
      volume: volume
    })
  }
  return data
}

const timeRanges = ['1d', '3d', '1w', '1m', '6m', '1y', 'max'] as const
type TimeRange = typeof timeRanges[number]

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

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
    )
  }
  return null
}

const FixedTooltip: React.FC<{ data: DataPoint[] }> = React.memo(({ data }) => {
  const lastPoint = data[data.length - 1]
  return (
    <div className="absolute right-0 top-1/2 bg-[#4B40EE] text-white p-2 rounded shadow text-sm">
      <p className="font-bold">{formatCurrency(lastPoint.price)}</p>
      {/* <p>{new Date(lastPoint.time).toLocaleDateString()}</p> */}
    </div>
  )
})

const HighestPriceTooltip: React.FC<{ data: DataPoint[] }> = React.memo(({ data }) => {
  const highestPoint = data.reduce((max, point) => point.price > max.price ? point : max, data[0])
  return (
    <div className="absolute right-0 top-1/4 bg-black text-white p-2 rounded shadow text-sm">
      <p className="font-bold">{formatCurrency(highestPoint.price)}</p>
      {/* <p>{new Date(highestPoint.time).toLocaleDateString()}</p> */}
    </div>
  )
})

export default function CryptoDashboard() {
  const [data, setData] = useState<DataPoint[]>(() => generateData(7))
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1w')
  const [activeTab, setActiveTab] = useState('chart')

  useEffect(() => {
    const days = timeRanges.indexOf(selectedRange) + 1
    setData(generateData(days * 7))
  }, [selectedRange])

  const handleRangeChange = useCallback((range: TimeRange) => {
    setSelectedRange(range)
  }, [])

  const memoizedChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8E7FF" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="time" 
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <YAxis 
          yAxisId="left"
          orientation="left"
          domain={['dataMin - 1000', 'dataMax + 1000']}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          domain={[0, 'dataMax']}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar yAxisId="right" dataKey="volume" fill="#E5E7EB" opacity={0.5} />
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
      </ComposedChart>
    </ResponsiveContainer>
  ), [data])

  return (
    <div className="min-h-screen w-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              63,179.71<span className="text-lg md:text-xl font-normal text-gray-500 align-top">USD</span>
            </h1>
            <p className="text-md md:text-lg text-green-500">+ 2,161.42 (3.54%)</p>
          </div>


          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex space-x-4 h-11 border-b-2 py-5 rounded-none -mx-6 bg-white justify-start">
              {['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className={`px-4 py-3 text-sm font-medium  data-[state=active]:shadow-none text-gray-500 transition-all duration-200 ease-in-out relative ${
                    activeTab === tab.toLowerCase()
                      ? 'text-[#4B40EE]'
                      : 'hover:text-gray-700'
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

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="chart" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3h18v18H3z" />
                          <path d="M8 12h8" />
                          <path d="M12 8v8" />
                        </svg>
                        <span>Fullscreen</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        <span>Compare</span>
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
                              ? 'bg-[#4B40EE] text-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleRangeChange(range)}
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[400px] relative">
                    {memoizedChart}
                    <HighestPriceTooltip data={data} />
                    <FixedTooltip data={data} />
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  )
}