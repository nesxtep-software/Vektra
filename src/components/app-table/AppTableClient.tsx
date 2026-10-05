import { useState, useMemo } from 'react';
import AppTableFilters from './AppTableFilters';
import AppTableHeader from './AppTableHeader';
import AppTableRow from './AppTableRow';
import RepoModal from '../RepoModal';

interface AppTableClientProps {
  repos: any[];
}

export default function AppTableClient({ repos }: AppTableClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('pushedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  const handleRowClick = (repo: any) => setSelectedRepo(repo);
  const handleModalClose = () => setSelectedRepo(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repos;

    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.primaryLanguage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Production') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 3: Production');
      } else if (categoryFilter === 'MVP') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 2: MVP');
      } else if (categoryFilter === 'PoC') {
        filtered = filtered.filter((r) => r.maturityLevel === 'Level 1: PoC');
      }
    }

    const comparators: Record<string, (a: any, b: any) => number> = {
      pushedAt: (a, b) => new Date(a.pushedAt).getTime() - new Date(b.pushedAt).getTime(),
      maturityScore: (a, b) => a.maturityScore - b.maturityScore,
      openIssues: (a, b) => a.openIssues - b.openIssues,
      name: (a, b) => a.name.localeCompare(b.name),
      maturityLevel: (a, b) => a.maturityLevel.localeCompare(b.maturityLevel),
      version: (a, b) => (a.version || '').localeCompare(b.version || ''),
    };

    const comparator = comparators[sortColumn] || (() => 0);
    const sorted = [...filtered].sort((a, b) => {
      const comparison = comparator(a, b);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [searchTerm, categoryFilter, sortColumn, sortDirection]);

  return (
    <div>
      <AppTableFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
      />

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
          <AppTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRepos.map((repo) => (
              <AppTableRow key={repo.name} repo={repo} onRowClick={handleRowClick} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredAndSortedRepos.length} of {repos.length} applications
      </div>

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={handleModalClose} />
      )}
    </div>
  );
}
