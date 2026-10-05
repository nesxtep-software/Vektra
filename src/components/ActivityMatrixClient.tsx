import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

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
      borderWidth: 2,
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
        size: 18,
        weight: 'bold',
      },
      color: '#374151',
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
        color: '#374151',
      },
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Maturity Score (%)',
        color: '#374151',
      },
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
};

export default function ActivityMatrixClient({ repos, now }: ActivityMatrixClientProps) {
  console.log('ActivityMatrixClient: Rendering with', repos.length, 'repos');
  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <Scatter data={data(repos, now)} options={options} />
    </div>
  );
}
