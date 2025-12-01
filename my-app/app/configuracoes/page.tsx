'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

type User = {
  _id: string;
  nome: string;
  email: string;
  cpf: string;
  codigo_funcionario: string;
  telefone: string;
  cep: string;
  senha: string;
};

export default function ConfiguracoesPage() {
  const [formData, setFormData] = useState<User>({
    _id: '',
    nome: '',
    email: '',
    cpf: '',
    codigo_funcionario: '',
    telefone: '',
    cep: '',
    senha: '',
  });
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:6660'; // Porta correta do backend

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      setError(null);
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        setError('Nenhum usuário encontrado no localStorage');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      console.log('📦 Dados do localStorage:', userData);

      // Verificar se o backend está rodando
      try {
        const healthCheck = await fetch(`${API_URL}/health`);
        if (!healthCheck.ok) {
          throw new Error('Backend não está respondendo');
        }
        console.log('✅ Backend está online na porta 6660');
      } catch (err) {
        setError('Erro ao conectar com o backend. Verifique se está rodando na porta 6660.');
        console.error('❌ Backend não está acessível:', err);
        // Usar dados do localStorage como fallback
        setFormData({
          _id: userData._id || '',
          nome: userData.nome || '',
          email: userData.email || '',
          cpf: userData.cpf || '',
          codigo_funcionario: userData.codigo_funcionario || '',
          telefone: userData.telefone || '',
          cep: userData.cep || '',
          senha: '',
        });
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
        setLoading(false);
        return;
      }

      // Buscar dados completos da API
      if (userData.email) {
        try {
          console.log('🔍 Buscando usuário por email:', userData.email);
          const response = await fetch(`${API_URL}/users/email/${encodeURIComponent(userData.email)}`);
          
          console.log('📡 Status da resposta:', response.status);
          
          if (response.ok) {
            const apiData = await response.json();
            console.log('✅ Dados da API:', apiData);
            
            // Atualizar formulário com dados da API
            setFormData({
              _id: apiData._id || userData._id || '',
              nome: apiData.nome || '',
              email: apiData.email || '',
              cpf: apiData.cpf || '',
              codigo_funcionario: apiData.codigo_funcionario || '',
              telefone: apiData.telefone || '',
              cep: apiData.cep || '',
              senha: '',
            });

            // Atualizar localStorage com dados completos
            const updatedUser = {
              ...userData,
              ...apiData,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            if (userData.avatar) {
              setAvatarPreview(userData.avatar);
            }
          } else {
            const errorData = await response.json();
            console.error('❌ Erro da API:', errorData);
            setError(`Erro ao buscar dados: ${errorData.detail || 'Erro desconhecido'}`);
            
            // Usar dados do localStorage como fallback
            setFormData({
              _id: userData._id || '',
              nome: userData.nome || '',
              email: userData.email || '',
              cpf: userData.cpf || '',
              codigo_funcionario: userData.codigo_funcionario || '',
              telefone: userData.telefone || '',
              cep: userData.cep || '',
              senha: '',
            });
            if (userData.avatar) {
              setAvatarPreview(userData.avatar);
            }
          }
        } catch (apiError) {
          console.error('❌ Erro ao buscar da API:', apiError);
          setError('Erro ao buscar dados da API. Usando dados locais.');
          
          // Usar dados do localStorage como fallback
          setFormData({
            _id: userData._id || '',
            nome: userData.nome || '',
            email: userData.email || '',
            cpf: userData.cpf || '',
            codigo_funcionario: userData.codigo_funcionario || '',
            telefone: userData.telefone || '',
            cep: userData.cep || '',
            senha: '',
          });
          if (userData.avatar) {
            setAvatarPreview(userData.avatar);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro geral ao carregar dados:', error);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarPreview(null);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      delete userData.avatar;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleSave = async () => {
    try {
      setError(null);

      // Validar ID do usuário
      if (!formData._id) {
        alert('ID do usuário não encontrado. Faça login novamente.');
        return;
      }

      // Validar campos obrigatórios
      if (!formData.nome || !formData.email || !formData.cpf || !formData.codigo_funcionario || !formData.telefone || !formData.cep) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
      }

      // Validar senha se estiver alterando
      if (novaSenha || confirmarSenha) {
        if (novaSenha !== confirmarSenha) {
          alert('As senhas não coincidem!');
          return;
        }
        if (novaSenha.length < 6) {
          alert('A senha deve ter no mínimo 6 caracteres!');
          return;
        }
      }

      // Preparar dados para enviar
      const dadosAtualizados: any = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        codigo_funcionario: formData.codigo_funcionario,
        telefone: formData.telefone,
        cep: formData.cep,
      };

      // Adicionar senha apenas se foi alterada
      if (novaSenha) {
        dadosAtualizados.senha = novaSenha;
      }

      console.log('📤 Enviando dados para atualização:', dadosAtualizados);
      console.log('🆔 ID do usuário:', formData._id);

      // Atualizar na API
      const response = await fetch(`${API_URL}/users/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      console.log('📡 Status da resposta:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resposta da API:', result);

        // Atualizar localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = {
            ...userData,
            ...dadosAtualizados,
            avatar: avatarPreview,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        alert('Configurações atualizadas com sucesso!');
        setNovaSenha('');
        setConfirmarSenha('');
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('❌ Erro da API:', error);
        alert(`Erro ao atualizar: ${error.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro ao salvar alterações. Verifique sua conexão com o backend.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError(null);

      if (!formData._id) {
        alert('ID do usuário não encontrado!');
        return;
      }

      console.log('🗑️ Deletando usuário com ID:', formData._id);

      const response = await fetch(`${API_URL}/users/${formData._id}`, {
        method: 'DELETE',
      });

      console.log('📡 Status da resposta:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resposta da API:', result);

        // Limpar dados do usuário
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        alert('Conta deletada com sucesso!');
        // Redirecionar para login
        window.location.href = '/';
      } else {
        const error = await response.json();
        console.error('❌ Erro da API:', error);
        alert(`Erro ao deletar conta: ${error.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Erro ao deletar conta:', error);
      alert('Erro ao deletar conta. Verifique sua conexão com o backend.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-cyan-400 text-xl">Carregando dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Configurações da Conta</h1>
            <p className="text-zinc-400 mt-2">Gerencie suas informações pessoais e preferências</p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
              <p className="font-semibold">⚠️ Atenção:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Card principal */}
          <div className="bg-zinc-900/50 rounded-xl p-6 lg:p-10 shadow-xl border border-zinc-800">
            
            {/* Layout em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Coluna da Esquerda - Avatar */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-6 text-cyan-400">Foto de Perfil</h2>
                
                <div className="flex flex-col items-center gap-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-44 h-44 rounded-full border-4 border-cyan-400 object-cover"
                    />
                  ) : (
                    <div className="w-44 h-44 rounded-full border-4 border-cyan-400 bg-zinc-800 flex items-center justify-center">
                      <span className="text-6xl text-cyan-400">
                        {formData.nome ? formData.nome.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 w-full">
                    <label
                      htmlFor="avatar-upload"
                      className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 cursor-pointer text-center transition font-medium"
                    >
                      Escolher Foto
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    
                    {avatarPreview && (
                      <button
                        onClick={handleDeleteAvatar}
                        className="px-4 py-2.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 transition font-medium"
                      >
                        Deletar Foto
                      </button>
                    )}
                    
                    <p className="text-xs text-zinc-500 text-center mt-1">PNG, JPG ou JPEG (máx. 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita - Informações */}
              <div className="lg:col-span-3">
                <h2 className="text-xl font-semibold mb-6 text-cyan-400">Informações Pessoais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* CPF */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Código Funcionário */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Código Funcionário <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="codigo_funcionario"
                      value={formData.codigo_funcionario}
                      onChange={handleChange}
                      placeholder="FUNC001"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      CEP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <hr className="border-zinc-800 my-8" />

                {/* Seção de Alteração de Senha */}
                <h2 className="text-xl font-semibold mb-6 text-cyan-400">Alterar Senha</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Digite a nova senha"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Confirme a nova senha"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-500 mt-2">
                  Deixe em branco se não quiser alterar a senha
                </p>
              </div>
            </div>

            <hr className="border-zinc-800 my-8" />

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 font-semibold transition"
              >
                Deletar Conta
              </button>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full border border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Deletar Conta</h3>
                <p className="text-zinc-400 text-sm">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <p className="text-zinc-300 mb-6">
              Tem certeza que deseja deletar sua conta? Todos os seus dados serão permanentemente removidos do sistema.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition"
              >
                Sim, Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
