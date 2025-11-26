'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';

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

import { fetcher } from '@/lib/fetcher'; 
import { useDashboardStore } from '@/stores/dashboardStore'; 

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

// --- TIPAGEM DE DADOS DA API ---
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface Alert {
  name: string;
}

interface DoughnutItem {
  label: string;
  data: number;
  color: string;
}

interface StatsCard {
  title: string;
  value: number;
  change: number; // 0.1101 para +11.01%
}

// Mock de dados para uma lista maior de alertas em Recife
const mockRecentAlerts: Alert[] = [
    { name: 'Crítico - Ibura' },
    { name: 'Medio - Ilha do Leite' },
    { name: 'Crítico - Recife Antigo' },
    { name: 'Baixo - Boa Viagem' },
    { name: 'Crítico - Imbiribeira' },
    { name: 'Medio - Pina' },
    { name: 'Crítico - Santo Antônio' },
    { name: 'Baixo - Casa Amarela' },
    { name: 'Medio - Madalena' },
    { name: 'Crítico - Derby' },
    { name: 'Baixo - Cordeiro' },
    { name: 'Medio - Várzea' },
];


interface DashboardApiData {
  stats: StatsCard[];
  lineChart: ChartData;
  doughnutChart: DoughnutItem[];
  recentAlerts: Alert[];
}

// --- CONSTANTES DE CONFIGURAÇÃO DO CHART.JS ---
const DOUGHNUT_COLORS = [
  'rgb(30, 58, 138)', // Azul escuro
  'rgb(59, 130, 246)', // Azul principal
  'rgb(96, 165, 250)', // Azul claro
  'rgb(147, 197, 253)', // Azul muito claro
];
const BORDER_COLOR = 'rgb(24, 24, 27)'; // Cor de fundo do chart

// Opções de Gráfico de Linha
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { 
      backgroundColor: 'rgb(24, 24, 27)', 
      titleColor: 'rgb(244, 244, 245)', 
      bodyColor: 'rgb(244, 244, 245)',
      borderColor: 'rgb(63, 63, 70)', 
      borderWidth: 1 
    },
  },
  scales: {
    x: { 
      grid: { color: 'rgba(63, 63, 70, 0.5)' }, 
      ticks: { color: 'rgb(161, 161, 170)' } 
    },
    y: { 
      grid: { color: 'rgba(63, 63, 70, 0.5)' }, 
      ticks: { color: 'rgb(161, 161, 170)' } 
    },
  },
};

// Opções de Gráfico de Rosca
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { 
      backgroundColor: 'rgb(24, 24, 27)', 
      titleColor: 'rgb(244, 244, 245)', 
      bodyColor: 'rgb(244, 244, 245)',
      borderColor: 'rgb(63, 63, 70)', 
      borderWidth: 1 
    },
  },
};

// --- COMPONENTE PRINCIPAL ---

export default function DashboardPage() {
  const { timePeriod, setTimePeriod } = useDashboardStore();

  const apiPath = `/api/dashboard-data?period=${timePeriod}`;
  const { data: apiData, error, isLoading } = useSWR<DashboardApiData>(apiPath, fetcher);
  
  const data: DashboardApiData | undefined = useMemo(() => {
    if (!apiData) return undefined;
    return {
        ...apiData,
        recentAlerts: mockRecentAlerts,
    }
  }, [apiData]);


  const lineChart = useMemo(() => {
    const apiDataChart = data?.lineChart || { labels: [], datasets: [] };
    
    return {
        ...apiDataChart,
        datasets: apiDataChart.datasets.map((ds, index) => {
            const primaryColor = 'rgb(34, 211, 238)'; // cyan-400
            const secondaryColor = 'rgb(96, 165, 250)'; // blue-400

            const borderColor = index === 0 ? primaryColor : secondaryColor;
            const backgroundColor = index === 0 ? 'rgba(34, 211, 238, 0.2)' : 'rgba(96, 165, 250, 0.1)';
            const borderDash = index === 1 ? [5, 5] : undefined;
            
            return {
                ...ds,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                fill: true,
                tension: 0.4,
                pointRadius: 4, 
                pointHoverRadius: 6,
                borderDash: borderDash,
            };
        })
    };

  }, [data]);

  const doughnutChart = useMemo(() => {
    if (!data?.doughnutChart) {
      return { labels: [], datasets: [{ data: [] as number[], backgroundColor: [], borderColor: BORDER_COLOR, borderWidth: 2 }] };
    }

    const labels = data.doughnutChart.map(d => d.label);
    const chartData = data.doughnutChart.map(d => d.data);
    const backgroundColors = data.doughnutChart.map((_, index) => DOUGHNUT_COLORS[index % DOUGHNUT_COLORS.length]);

    return {
      labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: backgroundColors,
          borderColor: BORDER_COLOR,
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  // --- Funções de renderização auxiliares ---

  const renderStatsCards = () => {
    const cards = data?.stats || [];
    
    // Configurações estáticas de cor para os cards
    const staticCardConfigs = [
      { title: 'Descarte', color: 'from-blue-500 to-blue-600' },
      { title: 'Ocorrências', color: 'from-blue-400 to-blue-500' },
      { title: 'Volume Coletado', color: 'from-cyan-500 to-cyan-600' },
      { title: 'Impacto Ambiental', color: 'from-cyan-400 to-cyan-500' },
    ];

    return staticCardConfigs.map((config, index) => {
        const dynamicData = cards.find(c => c.title === config.title);

        const value = dynamicData ? dynamicData.value.toLocaleString('pt-BR') : '...';
        const change = dynamicData ? (dynamicData.change * 100).toFixed(2) + '%' : '...';
        const isPositive = dynamicData ? dynamicData.change >= 0 : true;

        if (isLoading) {
            return (
                <div key={index} className={`rounded-xl bg-zinc-800/50 p-6 shadow-lg animate-pulse h-32`}>
                    <div className="h-4 bg-zinc-700 w-1/2 mb-4 rounded" />
                    <div className="h-8 bg-zinc-700 w-1/4 rounded" />
                </div>
            );
        }

        return (
          <div
            key={index}
            className={`rounded-xl bg-gradient-to-br ${config.color} p-6 shadow-lg`}
          >
            <h3 className="mb-2 text-sm font-medium text-white/80">
              {config.title}
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{value}</p>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-white' : 'text-white/70'
                }`}
              >
                <span>{change}</span>
                <svg
                  className={`h-4 w-4 ${
                    isPositive ? 'rotate-0' : 'rotate-180'
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
        );
    });
  };

  const renderAlerts = () => {
    const alerts = data?.recentAlerts || mockRecentAlerts;
    
    if (isLoading && !data) {
      return Array(6).fill(0).map((_, index) => (
        <div key={index} className="h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 animate-pulse">
            <div className="h-full bg-zinc-700 w-2/3 rounded" />
        </div>
      ));
    }
    
    const getAlertColor = (alertName: string) => {
        const levelMatch = alertName.match(/^(Crítico|Medio|Baixo)/i);
        const level = levelMatch ? levelMatch[1].toLowerCase() : 'desconhecido';

        if (level === 'crítico') {
             return 'bg-cyan-400';
        }
        
        if (level === 'medio') {
            return 'bg-blue-600'; 
        }

        return 'bg-zinc-700';
    };

    return alerts.map((alerta, index) => (
      <div
        key={index}
        className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
      >
        <span className="text-sm text-zinc-100">{alerta.name}</span>
        <div
          className={`h-2 w-16 rounded-full ${getAlertColor(alerta.name)}`}
        />
      </div>
    ));
  };
  
  if (error) {
    return (
      <div className="p-8 text-red-400">
        Erro ao carregar o dashboard: {error.message}
        <p className="text-zinc-400 mt-2">Tentando novamente em segundo plano...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-6">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
      </div>

      <div className="p-8">
        {/* Cards de estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {renderStatsCards()}
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* LOCAIS DESCARTES (Anteriormente: Descartes por período) */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Locais Descarte</h2>
            <div className="flex h-80 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-950/30 to-blue-950/30">
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
          
          {/* ALERTAS RECENTES (Anteriormente: Impacto Ambiental) */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Alertas recentes</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {renderAlerts()}
            </div>
          </div>


          {/* IMPACTO AMBIENTAL (Anteriormente: Alertas recentes) */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Impacto Ambiental</h2>
            <div className="h-64 flex items-center justify-center">
              {isLoading ? (
                 <div className="text-zinc-500">Carregando dados do rosca...</div>
              ) : (
                <Doughnut data={doughnutChart} options={doughnutOptions} />
              )}
            </div>
            
            {/* Legenda do Gráfico de Rosca */}
            <div className="mt-4 space-y-2">
              {doughnutChart.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: doughnutChart.datasets[0].backgroundColor[index],
                      }}
                    />
                    <span className="text-zinc-300">{label}</span>
                  </div>
                  <span className="font-medium text-zinc-100">
                    {(doughnutChart.datasets[0].data[index] || 0).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* DESCARTES POR PERÍODO (Anteriormente: Locais Descarte) */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Descartes por período (Filtro: {timePeriod.toUpperCase()})
                </h2>
                <div className="mt-2 flex gap-4 text-sm">
                  {/* Botão de filtro */}
                  <button 
                    onClick={() => setTimePeriod('daily')} 
                    className={`${timePeriod === 'daily' ? 'text-cyan-400 underline underline-offset-4' : 'text-zinc-400 hover:text-zinc-100'}`}
                  >
                    Diário
                  </button>
                  <button 
                    onClick={() => setTimePeriod('monthly')} 
                    className={`${timePeriod === 'monthly' ? 'text-cyan-400 underline underline-offset-4' : 'text-zinc-400 hover:text-zinc-100'}`}
                  >
                    Mensal
                  </button>
                  <button 
                    onClick={() => setTimePeriod('yearly')} 
                    className={`${timePeriod === 'yearly' ? 'text-cyan-400 underline underline-offset-4' : 'text-zinc-400 hover:text-zinc-100'}`}
                  >
                    Anual
                  </button>
                </div>
              </div>
            </div>
            {/* Exibe um loading ou o gráfico */}
            <div className="h-64 flex items-center justify-center">
              {isLoading ? (
                <div className="text-zinc-500">Carregando dados do gráfico...</div>
              ) : (
                <Line data={lineChart} options={lineChartOptions} />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}