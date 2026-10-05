export function getMaturityLevelColor(level: string): string {
  if (level === 'Level 3: Production') return 'bg-blue-100 text-blue-800';
  if (level === 'Level 2: MVP') return 'bg-green-100 text-green-800';
  if (level === 'Level 1: PoC') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getMilestoneProgress(milestone: { openIssues: number; closedIssues: number }): number {
  if (!milestone) return 0;
  const total = milestone.openIssues + milestone.closedIssues;
  if (total === 0) return 0;
  return Math.round((milestone.closedIssues / total) * 100);
}
