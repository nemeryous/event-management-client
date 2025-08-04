import React from "react";

const PollItem = ({ question, type, options }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-base font-medium text-gray-700">{question}</div>
        <div className="text-sm text-gray-500">{type}</div>
      </div>
      {options.map((option) => (
        <div key={option.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-700">{option.label}</span>
            <div className="flex gap-2 text-gray-500">
              <span>{option.percent}%</span>
              <span>{option.votes} votes</span>
            </div>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-300 bg-${option.color}`}
              style={{ width: `${option.percent}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollItem;
