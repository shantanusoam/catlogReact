import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'

const Menu = ({activeTab}) => {
  return (
    <div>
         <TabsList className="flex space-x-4 bg-white justify-start">
              {['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className={`px-4 py-2 text-sm font-medium data-[state=active]:shadow-none text-gray-500 transition-all duration-200 ease-in-out relative ${
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
    </div>
  )
}

export default Menu
