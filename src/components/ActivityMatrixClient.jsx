import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import telemetry from '../data/portfolio-telemetry.json';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const repos = telemetry.repositories;
const now = new Date();

const data = {
  datasets: [
    {
      label: 'Applications',
      data: repos.map((repo) => {
        const pushedAt = new Date(repo.pushedAt);
        const daysSinceCommit = Math.floor((now - pushedAt) / (1000 * 60 * 60 * 24));
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
};

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
        label: function (context) {
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

export default function ActivityMatrixClient() {
  return <Scatter data={data} options={options} />;
}
