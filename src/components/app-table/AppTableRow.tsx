import type { MouseEvent } from 'react';
import { getMaturityLevelColor, formatDate, getMilestoneProgress } from '../utils';

interface AppTableRowProps {
  repo: any;
  onRowClick: (repo: any) => void;
}

export default function AppTableRow({ repo, onRowClick }: AppTableRowProps) {
  const handleStopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick(repo)}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {repo.name}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaturityLevelColor(repo.maturityLevel)}`}>
          {repo.maturityLevel}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {repo.version || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: '150px', maxWidth: '150px' }}>
        {repo.milestone ? (
          <div className="w-full overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 truncate">{repo.milestone.title}</span>
              <span className="text-xs text-gray-500">{getMilestoneProgress(repo.milestone)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${getMilestoneProgress(repo.milestone)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No milestone</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(repo.pushedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          {repo.hasReadme && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              Docs
            </span>
          )}
          {repo.hasWorkflows && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              CI/CD
            </span>
          )}
          {repo.hasLicense && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              License
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <a
          href={`https://github.com/nesxtep-software/${repo.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-900"
          onClick={handleStopPropagation}
        >
          View
        </a>
      </td>
    </tr>
  );
}
