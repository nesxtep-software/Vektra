import React from 'react';

interface AppTableHeaderProps {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export default function AppTableHeader({ sortColumn, sortDirection, onSort }: AppTableHeaderProps) {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('name')}
        >
          App Name {getSortIcon('name')}
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('maturityLevel')}
        >
          Status {getSortIcon('maturityLevel')}
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('version')}
        >
          Version {getSortIcon('version')}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px', maxWidth: '150px' }}>
          Milestone Progress
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('pushedAt')}
        >
          Last Commit {getSortIcon('pushedAt')}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Health Indicators
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Link
        </th>
      </tr>
    </thead>
  );
}
