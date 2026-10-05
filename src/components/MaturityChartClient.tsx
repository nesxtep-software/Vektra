import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
// @ts-ignore - Chart.js named exports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

interface MaturityChartClientProps {
  levelCounts: number[];
}

const data = (levelCounts: number[]) => ({
  labels: ['Concept', 'Architecture', 'Core MVP', 'Staging/Beta', 'Production'],
  datasets: [
    {
      label: 'Applications',
      data: levelCounts,
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
      ],
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
      text: 'Maturity Distribution',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

export default function MaturityChartClient({ levelCounts }: MaturityChartClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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

  return <Bar data={data(levelCounts)} options={options} />;
}
