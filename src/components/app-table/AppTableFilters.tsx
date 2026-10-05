import React from 'react';

interface AppTableFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function AppTableFilters({
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
}: AppTableFiltersProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by name or language..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="All">All Categories</option>
        <option value="Production">Production</option>
        <option value="MVP">MVP</option>
        <option value="PoC">PoC</option>
      </select>
    </div>
  );
}
