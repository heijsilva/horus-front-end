'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';

export default function MapasPage() {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estatísticas
  const stats = [
    {
      label: 'Câmeras Ativas',
      value: '24',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
    },
    {
      label: 'Alertas Ativos',
      value: '8',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      label: 'Área Monitorada',
      value: '12 km²',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Zonas Críticas',
      value: '3',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ];

  const filters = [
    { id: 'todos', label: 'Todos', count: 32 },
    { id: 'cameras', label: 'Câmeras', count: 24 },
    { id: 'alertas', label: 'Alertas', count: 8 },
    { id: 'criticos', label: 'Críticos', count: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      
      <main className="ml-64 flex-1">
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          {/* Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Mapas</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Visualização geográfica do sistema de monitoramento
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Exportar
                </button>
                
                <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="border-b border-zinc-800 bg-zinc-900/30 px-8 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="border-b border-zinc-800 bg-zinc-900/30 px-8 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      selectedFilter === filter.id
                        ? 'bg-cyan-600 text-white'
                        : 'border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        selectedFilter === filter.id
                          ? 'bg-cyan-500 text-white'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 lg:w-80">
                <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="p-8">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
              {/* Map Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10">
                    <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Mapa de Monitoramento</h2>
                    <p className="text-xs text-zinc-400">Recife, Pernambuco - Brasil</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
                    <span className="text-xs text-zinc-400">Câmeras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-zinc-400">Alertas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-zinc-400">Você</span>
                  </div>
                </div>
              </div>

              {/* Map Component */}
              <div className="relative h-[calc(100vh-28rem)]">
                <MapComponent />
              </div>

              {/* Map Footer */}
              <div className="border-t border-zinc-800 bg-zinc-900 px-6 py-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span>Última atualização: há 2 minutos</span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                      Sistema Online
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Coordenadas: -8.0476° S, -34.8770° W</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-cyan-400/50 hover:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/10">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Adicionar Câmera</h3>
                  <p className="text-sm text-zinc-400">Cadastrar nova câmera no mapa</p>
                </div>
              </button>

              <button className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-yellow-400/50 hover:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400/10">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Ver Relatórios</h3>
                  <p className="text-sm text-zinc-400">Análise de dados por região</p>
                </div>
              </button>

              <button className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-blue-400/50 hover:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Configurar Zonas</h3>
                  <p className="text-sm text-zinc-400">Definir áreas de monitoramento</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
