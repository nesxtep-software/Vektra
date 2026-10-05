import { useState, useMemo } from 'react';
import telemetry from '../data/portfolio-telemetry.json';

const repos = telemetry.repositories;

export default function AppTableClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('lastUpdated');

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
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 5: Production');
      } else if (categoryFilter === 'Active MVP') {
        filtered = filtered.filter(
          (r) =>
            r.maturityLevel === 'Level 3: Core MVP' ||
            r.maturityLevel === 'Level 4: Staging / Beta'
        );
      } else if (categoryFilter === 'Concept') {
        filtered = filtered.filter(
          (r) =>
            r.maturityLevel === 'Level 1: Concept & Spec' ||
            r.maturityLevel === 'Level 2: Architecture'
        );
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
    if (level === 'Level 5: Production') return 'bg-blue-100 text-blue-800';
    if (level === 'Level 4: Staging / Beta') return 'bg-green-100 text-green-800';
    if (level === 'Level 3: Core MVP') return 'bg-yellow-100 text-yellow-800';
    if (level === 'Level 2: Architecture') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
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
          <option value="Active MVP">Active MVP</option>
          <option value="Concept">Concept</option>
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
              <tr key={repo.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                      <div className="text-sm text-gray-500">{repo.primaryLanguage}</div>
                    </div>
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
                    {repo.hasDockerfile && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Docker
                      </span>
                    )}
                    {repo.hasPackageJson && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        CI
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
    </div>
  );
}
