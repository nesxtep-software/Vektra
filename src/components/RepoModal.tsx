import type { MouseEvent } from 'react';
import { formatDate, getMilestoneProgress } from './utils';

interface RepoModalProps {
  repo: any;
  onClose: () => void;
}

export default function RepoModal({ repo, onClose }: RepoModalProps) {
  const handleStopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={handleStopPropagation}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{repo.name}</h3>
              <p className="text-gray-600 mt-1">{repo.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Maturity Score</p>
              <p className="text-3xl font-bold text-gray-900">{repo.maturityScore}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-gray-900">{repo.maturityLevel}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Characteristics</p>
              <div className="flex flex-wrap gap-2">
                {repo.hasReadme && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Documentation
                  </span>
                )}
                {repo.hasPackageJson && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Package Manager
                  </span>
                )}
                {repo.releases && repo.releases.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {repo.releases.length} Release{repo.releases.length > 1 ? 's' : ''}
                  </span>
                )}
                {repo.tags && repo.tags.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    {repo.tags.length} Tag{repo.tags.length > 1 ? 's' : ''}
                  </span>
                )}
                {repo.hasWorkflows && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    CI/CD
                  </span>
                )}
                {repo.hasLicense && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    License
                  </span>
                )}
                {repo.hasContributing && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                    Contributing
                  </span>
                )}
                {repo.hasChangelog && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Changelog
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Technical Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Language:</span>
                  <span className="ml-2 text-gray-900">{repo.primaryLanguage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 text-gray-900">{repo.version || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stars:</span>
                  <span className="ml-2 text-gray-900">{repo.stargazerCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Open Issues:</span>
                  <span className="ml-2 text-gray-900">{repo.openIssues}</span>
                </div>
                <div>
                  <span className="text-gray-500">Closed Issues:</span>
                  <span className="ml-2 text-gray-900">{repo.closedIssues}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Commit:</span>
                  <span className="ml-2 text-gray-900">{formatDate(repo.pushedAt)}</span>
                </div>
              </div>
            </div>

            {repo.milestone && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current Milestone</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{repo.milestone.title}</span>
                    <span className="text-sm text-gray-500">{getMilestoneProgress(repo.milestone)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${getMilestoneProgress(repo.milestone)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {repo.topics && repo.topics.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic: string) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <a
              href={`https://github.com/nesxtep-software/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Repository
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
