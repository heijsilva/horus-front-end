'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

type User = {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  avatar: string;
  estiloPerfil: string;
};

const defaultUser: User = {
  nome: 'Usuário',
  email: 'usuario@email.com',
  telefone: '(00) 00000-0000',
  cargo: 'Operador',
  avatar: '/profile1.png',
  estiloPerfil: 'clássico', // estilo atual
};

export default function ConfiguracoesPage() {
  const [formData, setFormData] = useState<User>(defaultUser);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(defaultUser.avatar);
  const [perfilOpen, setPerfilOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Dados salvos:', { ...formData, avatar: selectedAvatar });
    alert('Configurações atualizadas com sucesso!');
  };

  const perfis = [
    { id: 'clássico', label: 'Clássico' },
    { id: 'moderno', label: 'Moderno' },
    { id: 'minimalista', label: 'Minimalista' },
    { id: 'colorful', label: 'Colorful' },
  ];

  const aplicarPerfil = (estilo: string) => {
    setFormData({ ...formData, estiloPerfil: estilo });
    // aqui você pode adaptar o estilo visual do avatar/card conforme necessário
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo (à direita da Sidebar) */}
      <main className="flex-1 p-10 overflow-y-auto" style={{ marginLeft: 260 }}>
        {/* Removido: <h1>Configurações da Conta</h1> */}

        {/* Card principal */}
        <div className="bg-zinc-900/60 rounded-xl p-8 shadow-xl border border-zinc-800">
          {/* Avatar */}
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Foto de Perfil</h2>

          <div className="flex gap-4 items-center mb-4">
            <button
              className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700"
              onClick={() => setPerfilOpen((v) => !v)}
            >
              Perfis
            </button>

            <div className="ml-auto">
              <img
                src={selectedAvatar}
                alt="Avatar selecionado"
                className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg"
              />
            </div>
          </div>

          {perfilOpen && (
            <div className="mb-6 p-4 rounded-lg bg-zinc-800 border border-zinc-700">
              <div className="text-sm text-zinc-300 mb-2">Selecione o estilo de perfil</div>
              <div className="flex gap-3 flex-wrap">
                {perfis.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => aplicarPerfil(p.id)}
                    className={`
                      px-4 py-2 rounded-lg
                      ${formData.estiloPerfil === p.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600'}
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="w-full flex justify-center my-6">
            <img
              src={selectedAvatar}
              alt="Avatar selecionado"
              className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg"
            />
          </div>

          {/* Informações pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
              <label className="text-sm text-zinc-400">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-zinc-800 text-zinc-100 
                border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-zinc-800 text-zinc-100 
                border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-zinc-800 text-zinc-100 
                border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-zinc-800 text-zinc-100 
                border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Botão salvar */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 
              text-white font-semibold shadow-lg transition"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}