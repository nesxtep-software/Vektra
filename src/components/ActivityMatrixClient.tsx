import { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

interface ActivityMatrixClientProps {
  repos: any[];
  now: string;
}

const data = (repos: any[], now: string) => ({
  datasets: [
    {
      label: 'Applications',
      data: repos.map((repo) => {
        const pushedAt = new Date(repo.pushedAt);
        const nowDate = new Date(now);
        const daysSinceCommit = Math.floor((nowDate - pushedAt) / (1000 * 60 * 60 * 24));
        return {
          x: daysSinceCommit,
          y: repo.maturityScore,
          r: Math.min(Math.max(repo.stargazerCount, 5), 20),
          name: repo.name,
        };
      }),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Activity & Velocity Matrix',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const point = context.raw;
          return [
            `${point.name}`,
            `Days Since Commit: ${point.x}`,
            `Maturity Score: ${point.y}%`,
          ];
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Days Since Last Commit',
      },
      beginAtZero: true,
    },
    y: {
      title: {
        display: true,
        text: 'Maturity Score (%)',
      },
      beginAtZero: true,
      max: 100,
    },
  },
};

export default function ActivityMatrixClient({ repos, now }: ActivityMatrixClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      ChartJS.register(LinearScale, PointElement, Tooltip, Legend);
      setIsLoaded(true);
    } catch (err) {
      console.error('Chart.js registration error:', err);
      setError('Failed to load chart');
    }
  }, []);

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chart</div>;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>;
  }

  return <Scatter data={data(repos, now)} options={options} />;
}
