import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
// @ts-ignore - Chart.js named exports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

interface TechStackBreakdownClientProps {
  labels: string[];
  data: number[];
}

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

const chartData = (labels: string[], data: number[]) => ({
  labels,
  datasets: [
    {
      data,
      backgroundColor: colors.slice(0, labels.length),
      borderColor: colors.slice(0, labels.length).map((c) => c.replace('0.7', '1')),
      borderWidth: 1,
    },
  ],
});

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

export default function TechStackBreakdownClient({ labels, data }: TechStackBreakdownClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      ChartJS.register(ArcElement, Tooltip, Legend);
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

  return <Doughnut data={chartData(labels, data)} options={options} />;
}
