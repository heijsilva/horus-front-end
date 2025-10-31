'use client';

import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const statsCards = [
  {
    title: 'Descarte',
    value: '7,265',
    change: '+11.01%',
    isPositive: true,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Ocorrências',
    value: '3,671',
    change: '-0.03%',
    isPositive: false,
    color: 'from-blue-400 to-blue-500',
  },
  {
    title: 'Volume Coletado',
    value: '156',
    change: '+15.03%',
    isPositive: true,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    title: 'Impacto Ambiental',
    value: '2,318',
    change: '+0.08%',
    isPositive: true,
    color: 'from-cyan-400 to-cyan-500',
  },
];

const alertasRecentes = [
  { name: 'Critico', status: 'active' },
  { name: 'Critico', status: 'active' },
  { name: 'Critico', status: 'active' },
  { name: 'Baixo', status: 'inactive' },
  { name: 'Critico', status: 'active' },
  { name: 'Medio', status: 'inactive' },
];

export default function DashboardPage() {
  // Dados do gráfico de linha (Descartes por período)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Descarte por dia',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(34, 211, 238)',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Este ano',
        data: [8000, 12000, 11000, 18000, 16000, 20000, 24000],
        borderColor: 'rgb(96, 165, 250)',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgb(24, 24, 27)',
        titleColor: 'rgb(244, 244, 245)',
        bodyColor: 'rgb(244, 244, 245)',
        borderColor: 'rgb(63, 63, 70)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(63, 63, 70, 0.3)',
        },
        ticks: {
          color: 'rgb(161, 161, 170)',
        },
      },
      y: {
        grid: {
          color: 'rgba(63, 63, 70, 0.3)',
        },
        ticks: {
          color: 'rgb(161, 161, 170)',
        },
      },
    },
  };

  // Dados do gráfico de rosca (Impacto Ambiental)
  const doughnutData = {
    labels: ['Ibura', 'Ilha do Leite', 'Recife Antigo', 'Outros'],
    datasets: [
      {
        data: [52.1, 22.8, 13.9, 11.2],
        backgroundColor: [
          'rgb(30, 58, 138)',
          'rgb(59, 130, 246)',
          'rgb(96, 165, 250)',
          'rgb(147, 197, 253)',
        ],
        borderColor: 'rgb(24, 24, 27)',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgb(24, 24, 27)',
        titleColor: 'rgb(244, 244, 245)',
        bodyColor: 'rgb(244, 244, 245)',
        borderColor: 'rgb(63, 63, 70)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-6">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
      </div>

      <div className="p-8">
        {/* Cards de estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl bg-gradient-to-br ${card.color} p-6 shadow-lg`}
            >
              <h3 className="mb-2 text-sm font-medium text-white/80">
                {card.title}
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    card.isPositive ? 'text-white' : 'text-white/70'
                  }`}
                >
                  <span>{card.change}</span>
                  <svg
                    className={`h-4 w-4 ${
                      card.isPositive ? 'rotate-0' : 'rotate-180'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gráfico de linha - Descartes por período */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Descartes por período</h2>
                <div className="mt-2 flex gap-4 text-sm">
                  <button className="text-cyan-400 underline underline-offset-4">
                    Descarte por dia
                  </button>
                  <button className="text-zinc-400 hover:text-zinc-100">
                    Este ano
                  </button>
                </div>
              </div>
            </div>
            <div className="h-80">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Alertas recentes */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Alertas recentes</h2>
            <div className="space-y-3">
              {alertasRecentes.map((alerta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
                >
                  <span className="text-sm text-zinc-100">{alerta.name}</span>
                  <div
                    className={`h-2 w-16 rounded-full ${
                      alerta.status === 'active'
                        ? 'bg-cyan-400'
                        : 'bg-zinc-700'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Impacto Ambiental */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Impacto Ambiental</h2>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="mt-4 space-y-2">
              {doughnutData.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: doughnutData.datasets[0].backgroundColor[index],
                      }}
                    />
                    <span className="text-zinc-300">{label}</span>
                  </div>
                  <span className="font-medium text-zinc-100">
                    {doughnutData.datasets[0].data[index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Locais Descarte (Mapa placeholder) */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Locais Descarte</h2>
            <div className="flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-950/30 to-blue-950/30">
              <div className="relative h-full w-full">
                {/* Pontos no mapa simulados */}
                <div className="absolute left-1/4 top-1/3 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                <div className="absolute right-1/3 top-1/2 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                <div className="absolute bottom-1/4 left-1/2 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                <div className="absolute right-1/4 top-2/3 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                <div className="absolute bottom-1/3 right-1/2 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}