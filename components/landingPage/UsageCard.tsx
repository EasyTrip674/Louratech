import { motion } from "motion/react";

export default function UsageCard() {
  return (
    <div className="relative flex flex-col items-center justify-center text-white p-6 w-[100%] h-[100%]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-gradient-to-r from-[#0d0f1b] via-[#1a1d2d] to-[#0d0f1b] rounded-full opacity-20"></div>
      </div>

      <div className="bg-[#1a1d2d] p-8 rounded-2xl shadow-xl relative z-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Statistiques d&apos;utilisation</h3>
          <span className="text-gray-400 text-sm">2024 ▼</span>
        </div>

        <div className="space-y-6">
          {/* Graph bars */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-gray-400">Jan</span>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
              <span className="w-16 text-right text-gray-400">65%</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-400">Fév</span>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "80%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <span className="w-16 text-right text-gray-400">80%</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-400">Mar</span>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
              <span className="w-16 text-right text-gray-400">45%</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-400">Avr</span>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
              <span className="w-16 text-right text-gray-400">90%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">Transactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">Recharges</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">Retraits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}