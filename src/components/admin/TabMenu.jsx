import React from "react";
/**
 * TabMenu dùng chung cho admin
 * @param {Array} tabs [{ key, label }]
 * @param {String} activeTab
 * @param {Function} onChange (key) => void
 */
export default function TabMenu({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-2 border-b mb-6">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === t.key
              ? "border-[#c52032] text-[#c52032] bg-[#fff7f7]"
              : "border-transparent text-[#223b73] hover:bg-[#f7f9fb]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
} 