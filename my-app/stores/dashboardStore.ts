import { create } from 'zustand';

// Define a interface para o estado do filtro
interface DashboardState {
  // Exemplo de filtro: o período de tempo para o dashboard ('daily', 'monthly', 'yearly')
  timePeriod: 'daily' | 'monthly' | 'yearly';
  
  // Função para atualizar o período de tempo
  setTimePeriod: (period: 'daily' | 'monthly' | 'yearly') => void;
}

/**
 * Cria a store Zustand para gerenciar o estado do dashboard.
 * Esta store é um estado global simples.
 */
export const useDashboardStore = create<DashboardState>((set) => ({
  // Estado inicial
  timePeriod: 'daily', 

  // Ação para mudar o período de tempo
  setTimePeriod: (period) => set({ timePeriod: period }),
}));
