import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TechStackBreakdownClientProps {
  labels: string[];
  data: number[];
}

const colors = [
  'rgba(59, 130, 246, 0.6)',
  'rgba(34, 197, 94, 0.6)',
  'rgba(234, 179, 8, 0.6)',
  'rgba(249, 115, 22, 0.6)',
  'rgba(239, 68, 68, 0.6)',
  'rgba(168, 85, 247, 0.6)',
  'rgba(20, 184, 166, 0.6)',
  'rgba(107, 114, 128, 0.6)',
];

const chartData = (labels: string[], data: number[]) => ({
  labels,
  datasets: [
    {
      data,
      backgroundColor: colors.slice(0, labels.length),
      borderColor: colors.slice(0, labels.length).map((c) => c.replace('0.6', '1')),
      borderWidth: 2,
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Tech Stack & Language Breakdown',
      font: {
        size: 18,
        weight: 'bold' as const,
      },
      color: '#374151',
    },
  },
};

export default function TechStackBreakdownClient({ labels, data }: TechStackBreakdownClientProps) {
  console.log('TechStackBreakdownClient: Rendering with', labels.length, 'languages');

  const transformedLabels = labels.map((label: string): string =>
    label === 'Unknown' ? 'Documentation/Empty' : label
  );

  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <Doughnut data={chartData(transformedLabels, data)} options={options} />
    </div>
  );
}
