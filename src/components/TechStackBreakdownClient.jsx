import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import telemetry from '../data/portfolio-telemetry.json';

ChartJS.register(ArcElement, Tooltip, Legend);

const repos = telemetry.repositories;

const languageCounts = repos.reduce((acc, repo) => {
  const lang = repo.primaryLanguage || 'Unknown';
  acc[lang] = (acc[lang] || 0) + 1;
  return acc;
}, {});

const labels = Object.keys(languageCounts);
const data = Object.values(languageCounts);

const colors = [
  'rgba(59, 130, 246, 0.7)',
  'rgba(34, 197, 94, 0.7)',
  'rgba(234, 179, 8, 0.7)',
  'rgba(249, 115, 22, 0.7)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(168, 85, 247, 0.7)',
  'rgba(20, 184, 166, 0.7)',
  'rgba(107, 114, 128, 0.7)',
];

const chartData = {
  labels,
  datasets: [
    {
      data,
      backgroundColor: colors.slice(0, labels.length),
      borderColor: colors.slice(0, labels.length).map((c) => c.replace('0.7', '1')),
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Tech Stack & Language Breakdown',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  },
};

export default function TechStackBreakdownClient() {
  return <Doughnut data={chartData} options={options} />;
}
