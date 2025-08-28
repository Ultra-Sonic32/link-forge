import { ChartConfiguration } from 'chart.js';
import { clicksOverTime } from '../../core/interfaces/analytics.model';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export function getClickOverTimeLineChartConfig(
  data: clicksOverTime[]
): ChartConfiguration<'line'> {
  return {
    type: 'line',
    data: {
      labels: data.map((d) => new Date(d._id).toLocaleDateString()),
      datasets: [
        {
          label: 'Clicks Over Time',
          data: data.map((d) => d.count),
          fill: true,
          borderColor: '#4fd1c5',
          backgroundColor: 'rgba(79, 209, 197, 0.2)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#4fd1c5',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'white',
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  };
}
