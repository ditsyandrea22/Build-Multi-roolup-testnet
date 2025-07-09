import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  title,
  value,
  change,
  isPositive = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '↗' : '↘'} {change}
          </span>
          <span className="text-gray-400 text-sm">vs last period</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;