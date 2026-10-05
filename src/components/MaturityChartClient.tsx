import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        'rgba(239, 68, 68, 0.5)',
        'rgba(249, 115, 22, 0.5)',
        'rgba(234, 179, 8, 0.5)',
        'rgba(34, 197, 94, 0.5)',
        'rgba(59, 130, 246, 0.5)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
      ],
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
      text: 'Maturity Distribution',
      font: {
        size: 18,
        weight: 'bold',
      },
      color: '#374151',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export default function MaturityChartClient({ levelCounts }: MaturityChartClientProps) {
  console.log('MaturityChartClient: Rendering with data:', levelCounts);
  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <Bar data={data(levelCounts)} options={options} />
    </div>
  );
}
