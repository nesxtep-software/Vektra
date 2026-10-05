import { useState, useMemo } from 'react';
import type { MouseEvent } from 'react';

interface AppTableClientProps {
  repos: any[];
}

export default function AppTableClient({ repos }: AppTableClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  const handleRowClick = (repo: any) => setSelectedRepo(repo);
  const handleModalClose = () => setSelectedRepo(null);
  const handleStopPropagation = (e: MouseEvent) => e.stopPropagation();

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.primaryLanguage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Production') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 3: Production');
      } else if (categoryFilter === 'MVP') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 2: MVP');
      } else if (categoryFilter === 'PoC') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 1: PoC');
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'lastUpdated') {
        return new Date(b.pushedAt) - new Date(a.pushedAt);
      } else if (sortBy === 'maturityScore') {
        return b.maturityScore - a.maturityScore;
      } else if (sortBy === 'openIssues') {
        return b.openIssues - a.openIssues;
      }
      return 0;
    });

    return sorted;
  }, [searchTerm, categoryFilter, sortBy]);

  const getMaturityLevelColor = (level) => {
    if (level === 'Level 3: Production') return 'bg-blue-100 text-blue-800';
    if (level === 'Level 2: MVP') return 'bg-green-100 text-green-800';
    if (level === 'Level 1: PoC') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMilestoneProgress = (milestone) => {
    if (!milestone) return 0;
    const total = milestone.openIssues + milestone.closedIssues;
    if (total === 0) return 0;
    return Math.round((milestone.closedIssues / total) * 100);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Production">Production</option>
          <option value="MVP">MVP</option>
          <option value="PoC">PoC</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="lastUpdated">Sort by Last Updated</option>
          <option value="maturityScore">Sort by Maturity Score</option>
          <option value="openIssues">Sort by Open Issues</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                App Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Milestone Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Commit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Indicators
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRepos.map((repo) => (
              <tr key={repo.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(repo)}>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {repo.milestone ? (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{repo.milestone.title}</span>
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredAndSortedRepos.length} of {repos.length} applications
      </div>

      {/* Modal for repo details */}
      {selectedRepo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={handleStopPropagation}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedRepo.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedRepo.description}</p>
                </div>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Maturity Score</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedRepo.maturityScore}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedRepo.maturityLevel}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Characteristics</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRepo.hasReadme && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Documentation
                      </span>
                    )}
                    {selectedRepo.hasPackageJson && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Package Manager
                      </span>
                    )}
                    {selectedRepo.releases && selectedRepo.releases.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {selectedRepo.releases.length} Release{selectedRepo.releases.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {selectedRepo.tags && selectedRepo.tags.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        {selectedRepo.tags.length} Tag{selectedRepo.tags.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {selectedRepo.hasWorkflows && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        CI/CD
                      </span>
                    )}
                    {selectedRepo.hasLicense && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        License
                      </span>
                    )}
                    {selectedRepo.hasContributing && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                        Contributing
                      </span>
                    )}
                    {selectedRepo.hasChangelog && (
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
                      <span className="ml-2 text-gray-900">{selectedRepo.primaryLanguage}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Version:</span>
                      <span className="ml-2 text-gray-900">{selectedRepo.version || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stars:</span>
                      <span className="ml-2 text-gray-900">{selectedRepo.stargazerCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Open Issues:</span>
                      <span className="ml-2 text-gray-900">{selectedRepo.openIssues}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Closed Issues:</span>
                      <span className="ml-2 text-gray-900">{selectedRepo.closedIssues}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Commit:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedRepo.pushedAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedRepo.milestone && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Milestone</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{selectedRepo.milestone.title}</span>
                        <span className="text-sm text-gray-500">{getMilestoneProgress(selectedRepo.milestone)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getMilestoneProgress(selectedRepo.milestone)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepo.topics.map((topic: string) => (
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
                  href={`https://github.com/nesxtep-software/${selectedRepo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Repository
                </a>
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
