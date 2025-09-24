import React from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";

const UnitStats = ({ stats }) => {
  return (
    <motion.div
      className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <StatCard
        title="Tổng đơn vị"
        value={stats.total}
        icon="🏢"
        color="blue"
        trend={{ value: "+12%", isPositive: true }}
      />
      <StatCard
        title="Phòng ban"
        value={stats.departments}
        icon="🏛️"
        color="green"
        trend={{ value: "+5%", isPositive: true }}
      />
      <StatCard
        title="Nhóm"
        value={stats.teams}
        icon="👥"
        color="purple"
        trend={{ value: "+23%", isPositive: true }}
      />
      <StatCard
        title="Dự án"
        value={stats.projects}
        icon="📋"
        color="orange"
        trend={{ value: "+8%", isPositive: true }}
      />
    </motion.div>
  );
};

export default UnitStats;