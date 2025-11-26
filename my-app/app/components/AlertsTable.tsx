'use client';

import React from 'react';

// --- TIPAGEM DE DADOS (Duplicada para manter o ficheiro autossuficiente) ---
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

// --- Funções de Estilo (Duplicada) ---
const getStatusClasses = (status: Alerta['status']) => {
  switch (status) {
    case 'Crítico':
      return 'bg-cyan-900 text-cyan-400 border-cyan-500/50';
    case 'Médio':
      return 'bg-blue-900 text-blue-400 border-blue-500/50';
    case 'Baixo':
      return 'bg-zinc-700 text-zinc-300 border-zinc-500/50';
    case 'Resolvido':
      return 'bg-green-900 text-green-400 border-green-500/50';
    default:
      return 'bg-zinc-700 text-zinc-300 border-zinc-500/50';
  }
};

// --- Componente Modal Interno (A ser movido) ---
interface AlertasModalProps {
    isOpen: boolean;
    onClose: () => void;
    alerta: Alerta | null;
}

const AlertasModal: React.FC<AlertasModalProps> = ({ isOpen, onClose, alerta }) => {
    if (!isOpen || !alerta) return null;
    
    const simulatedVideoUrl = '/videoalerta.mp4'; 
    const modalTitle = `Detalhes do Alerta #${alerta.id}`;
    
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl transform rounded-xl bg-zinc-800 shadow-2xl transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header do Modal */}
                <div className="flex items-center justify-between border-b border-zinc-700 p-6">
                    <h3 className="text-xl font-semibold text-zinc-100">{modalTitle}</h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-100 transition-colors"
                        aria-label="Fechar Modal"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        
                        {/* Coluna Mídia */}
                        <div className="lg:w-1/2 rounded-lg overflow-hidden bg-black/50">
                            <div className="relative aspect-video flex items-center justify-center bg-zinc-900">
                                <video 
                                    src={simulatedVideoUrl} 
                                    controls 
                                    loop
                                    className="w-full h-full object-cover"
                                    poster="https://placehold.co/600x400/27272a/FFFFFF?text=Preview+do+Alerta"
                                >
                                    Seu navegador não suporta a tag de vídeo.
                                </video>
                            </div>
                          
                            {/* Controles da Mídia */}
                            <div className="flex gap-4 p-4">
                                <button className="flex-1 rounded-lg bg-zinc-700 p-3 text-sm font-medium text-zinc-100 hover:bg-zinc-600 transition-colors">Baixar Mídia</button>
                                <button className="flex-1 rounded-lg bg-zinc-700 p-3 text-sm font-medium text-zinc-100 hover:bg-zinc-600 transition-colors">Visualizar Mapa</button>
                            </div>
                        </div>

                        {/* Coluna Detalhes */}
                        <div className="lg:w-1/2 space-y-4">
                            <h4 className="text-lg font-semibold text-zinc-300">Resumo da Ocorrência</h4>
                          
                            {/* Informação do Alerta */}
                            <div className="space-y-3">
                                <p className="text-zinc-400">
                                    <span className="font-medium text-zinc-200">Local:</span> {alerta.location}
                                </p>
                                <p className="text-zinc-400">
                                    <span className="font-medium text-zinc-200">Data e Hora:</span> {new Date(`${alerta.date}T${alerta.time}`).toLocaleDateString('pt-BR')} às {alerta.time}
                                </p>
                                <p className="text-zinc-400">
                                    <span className="font-medium text-zinc-200">Duração Estimada:</span> {alerta.duration}
                                </p>
                                <p className="text-zinc-400">
                                    <span className="font-medium text-zinc-200">Reportado por:</span> {alerta.reporter}
                                </p>
                                <p className="text-zinc-400 flex items-center gap-2">
                                    <span className="font-medium text-zinc-200">Status Atual:</span> 
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusClasses(alerta.status)}`}>
                                        {alerta.status}
                                    </span>
                                </p>
                            </div>

                            <h4 className="text-lg font-semibold text-zinc-300 pt-4 border-t border-zinc-700">Ações</h4>
                            <p className="text-sm text-zinc-400">
                                Detalhes de notas e ações tomadas ou recomendadas.
                            </p>

                            {/* Formulário de Ação */}
                            <div className="space-y-3">
                                <textarea 
                                    className="w-full rounded-lg bg-zinc-700/50 p-3 text-zinc-100 placeholder-zinc-400 focus:ring-cyan-500 focus:border-cyan-500 border border-zinc-700"
                                    placeholder="Adicionar nota de acompanhamento..."
                                    rows={3}
                                />
                                <button className="w-full rounded-lg bg-cyan-600 p-3 text-sm font-bold text-white hover:bg-cyan-500 transition-colors">
                                    Marcar como 'Em Andamento'
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- Fim Componente Modal Interno ---

// --- Propriedades do Componente Tabela ---
interface AlertasTabelaProps {
    data: Alerta[];
    isLoading: boolean;
    error: any; // Erro do SWR
    isModalOpen: boolean;
    selectedAlerta: Alerta | null;
    openModal: (alerta: Alerta) => void;
    closeModal: () => void;
}

// --- Componente AlertasTabela ---
const AlertasTabela: React.FC<AlertasTabelaProps> = ({ 
    data, 
    isLoading, 
    error,
    isModalOpen,
    selectedAlerta,
    openModal,
    closeModal,
}) => {

  if (error) {
    return <div className="p-8 text-red-400">Erro ao carregar a lista de alertas.</div>;
  }
  
  return (
    <div className="p-8">
      {/* Tabela de Alertas */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            
            {/* Cabeçalho */}
            <thead className="bg-zinc-800/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Duração
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Ações
                </th>
              </tr>
            </thead>
            
            {/* Corpo da Tabela */}
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
              {/* Indicador de Carregamento */}
              {isLoading && Array(5).fill(0).map((_, index) => (
                <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-700 rounded w-12 animate-pulse" /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-700 rounded w-24 animate-pulse" /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-zinc-700 rounded-full w-20 animate-pulse" /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-700 rounded w-32 animate-pulse" /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-700 rounded w-16 animate-pulse" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-center"><div className="h-8 bg-zinc-700 rounded w-20 mx-auto animate-pulse" /></td>
                </tr>
              ))}
              
              {/* Linhas de Dados */}
              {!isLoading && data.length > 0 ? (
                data.map((alerta) => (
                  <tr key={alerta.id} className="hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300">
                      #{alerta.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {alerta.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusClasses(alerta.status)}`}>
                        {alerta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {new Date(alerta.date).toLocaleDateString('pt-BR')} às {alerta.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {alerta.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => openModal(alerta)}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500 transition-colors"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : !isLoading && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                        Nenhum alerta recente encontrado.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Alerta - Renderizado com o componente interno */}
      <AlertasModal
          isOpen={isModalOpen}
          onClose={closeModal}
          alerta={selectedAlerta}
      />
    </div>
  );
};

export default AlertasTabela; // Exportação renomeada