"use client";

import { useState } from "react";

interface ChecklistProps {
  items: string[];
}

export default function Checklist({ items }: ChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="space-y-2 my-3">
      {items.map((item, i) => (
        <label
          key={i}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={() => toggle(i)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 cursor-pointer"
          />
          <span
            className={`text-sm ${
              checked[i]
                ? "line-through text-gray-400"
                : "text-gray-700 group-hover:text-gray-900"
            }`}
          >
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}
