'use client';

import React, { useState } from 'react';
import AlertsTable from '../components/AlertsTable';
import useSWR from 'swr';

interface Alerta {
  id: string;
  location: string;
  status: 'Crítico' | 'Médio' | 'Baixo' | 'Resolvido';
  date: string;
  time: string;
  duration: string;
  reporter: string;
  videoUrl: string;
}

const mockAlerts: Alerta[] = [
  { id: '3822', location: 'Crítico - Iburá', status: 'Crítico', date: '2024-05-25', time: '14:30', duration: '2h', reporter: 'Sistema AI', videoUrl: '/videoalerta.mp4' },
  { id: '3821', location: 'Médio - Ilha do Leite', status: 'Médio', date: '2024-05-25', time: '10:05', duration: '1h', reporter: 'Câmera 04', videoUrl: '/videoalerta.mp4' },
  { id: '3820', location: 'Baixo - Boa Viagem', status: 'Baixo', date: '2024-05-24', time: '23:15', duration: '30m', reporter: 'Sistema AI', videoUrl: '/videoalerta.mp4' },
  { id: '3819', location: 'Crítico - Imbiribeira', status: 'Crítico', date: '2024-05-24', time: '18:45', duration: '4h', reporter: 'Câmera 01', videoUrl: '/videoalerta.mp4' },
  { id: '3818', location: 'Resolvido - Pina', status: 'Resolvido', date: '2024-05-24', time: '09:00', duration: '1h', reporter: 'Operador 101', videoUrl: '/videoalerta.mp4' },
  { id: '3817', location: 'Crítico - Santo Antônio', status: 'Crítico', date: '2024-05-23', time: '05:20', duration: '2h', reporter: 'Sistema AI', videoUrl: '/videoalerta.mp4' },
];

const fetcher = (url: string) =>
  new Promise<Alerta[]>(resolve =>
    setTimeout(() => resolve(mockAlerts), 1500)
  );

const AlertasPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null);

  const { data, error, isLoading } = useSWR('/api/alertas', fetcher, {
    revalidateOnFocus: false,
    fallbackData: [],
  });

  const openModal = (alerta: Alerta) => {
    setSelectedAlerta(alerta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlerta(null);
  };

  const alertsData = data || [];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 md:p-8 w-full">
      <div className="w-full rounded-xl bg-zinc-800 p-6 shadow-lg">
        <AlertsTable
          data={alertsData}
          isLoading={isLoading}
          error={error}
          isModalOpen={isModalOpen}
          selectedAlerta={selectedAlerta}
          openModal={openModal}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default AlertasPage;
