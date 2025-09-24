import React from "react";
import { motion } from "framer-motion";
import UnitCard from "./UnitCard";

const UnitList = ({ units, onEdit, onDelete }) => {
  console.log('📋 UnitList rendered with:', { 
    unitsCount: units?.length, 
    onEdit: !!onEdit, 
    onDelete: !!onDelete 
  });
  
  return (
    <motion.div
      className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {units.map((unit, index) => (
        <motion.div
          key={unit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <UnitCard
            unit={unit}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UnitList;