'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-zinc-200">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-md border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 outline-none focus:border-cyan-400"
      />
    </div>
  );
}

const ROTATING_TEXTS = [
  'Horus: um sistema completo de monitoramento com inteligência artificial',
  'Prevenção de descartes inadequados de resíduos',
  'Rastreabilidade dos infratores',
  'Medição volumétrica dos pontos críticos',
  'Identificação de novos pontos críticos',
  'Horus para uma cidade mais limpa',
];

export default function LoginPage() {
  const router = useRouter();
  
  // login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cadastro (modal)
  const [openCadastro, setOpenCadastro] = useState(false);
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadCpf, setCadCpf] = useState('');
  const [cadCodFunc, setCadCodFunc] = useState('');
  const [cadTelefone, setCadTelefone] = useState('');
  const [cadCep, setCadCep] = useState('');
  const [cadSenha, setCadSenha] = useState('');
  const [cadLoading, setCadLoading] = useState(false);
  const [cadError, setCadError] = useState<string | null>(null);

  // textos rotativos
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Simulação de login - integração futura com API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para o dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setCadError(null);
    setCadLoading(true);
    try {
      // Simulação de cadastro - integração futura com API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fecha o modal e redireciona
      setOpenCadastro(false);
      router.push('/dashboard');
    } catch (err: any) {
      setCadError(err.message ?? 'Erro ao cadastrar');
    } finally {
      setCadLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Coluna esquerda */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-md px-6">
            {/* Logo centralizada */}
            <div className="mb-10 flex justify-center">
              <Image
                src="/logo.png"
                alt="HORUS"
                width={280}
                height={70}
                priority
                className="h-auto w-auto"
              />
            </div>

            {/* Card do formulário */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 shadow-lg backdrop-blur">
              <form onSubmit={handleLogin} className="p-6 space-y-5">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Digite seu email"
                />
                <Field
                  id="senha"
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={setSenha}
                  placeholder="Digite sua senha"
                />

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    className="text-sm text-zinc-300 hover:text-zinc-100"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-w-[120px] justify-center rounded-md bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-white disabled:opacity-60"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <a
                    href="#"
                    className="text-zinc-300 underline underline-offset-2 hover:text-zinc-100"
                    onClick={(e) => e.preventDefault()}
                  >
                    Esqueceu sua senha?
                  </a>

                  <button
                    type="button"
                    onClick={() => setOpenCadastro(true)}
                    className="text-cyan-300 hover:text-cyan-200 font-medium underline-offset-2 hover:underline"
                  >
                    Cadastre-se
                  </button>
                </div>
              </form>
            </div>

            {/* Divisor "Entrar com" - melhor visibilidade */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-600" />
              <span className="text-sm font-medium text-zinc-300">Entrar com</span>
              <div className="h-px flex-1 bg-zinc-600" />
            </div>

            {/* Botões sociais (somente visual) - ícones centralizados */}
            <div className="space-y-3">
              {/* Microsoft */}
              <button
                type="button"
                aria-disabled="true"
                onClick={(e) => e.preventDefault()}
                className="w-full cursor-default rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 23 23" className="h-5 w-5" aria-hidden="true">
                  <path fill="#F35325" d="M1 1h10v10H1z"/><path fill="#81BC06" d="M12 1h10v10H12z"/><path fill="#05A6F0" d="M1 12h10v10H1z"/><path fill="#FFBA08" d="M12 12h10v10H12z"/>
                </svg>
                <span>com a Microsoft</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                aria-disabled="true"
                onClick={(e) => e.preventDefault()}
                className="w-full cursor-default rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-zinc-100" aria-hidden="true">
                  <path d="M16.365 1.43c0 1.14-.466 2.226-1.25 3.046-.8.836-2.1 1.486-3.263 1.39-.14-1.12.47-2.31 1.23-3.07.82-.82 2.22-1.41 3.283-1.366zM21.5 17.23c-.46 1.03-.675 1.48-1.26 2.39-.82 1.24-1.98 2.78-3.43 2.8-1.28.02-1.62-.82-3.38-.82-1.77 0-2.14.8-3.41.84-1.45.03-2.56-1.34-3.39-2.58-2.32-3.4-2.56-7.39-1.13-9.51.99-1.49 2.56-2.37 4.32-2.4 1.35-.03 2.63.9 3.38.9.74 0 2.35-1.11 3.97-.95.68.03 2.6.28 3.83 2.13-3.37 1.84-2.83 6.64.48 7.19z"/>
                </svg>
                <span>com a Apple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coluna direita com imagem e textos rotativos */}
        <div className="hidden md:block relative">
          {/* fundo em tons escuros e acento ciano/teal */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#0b2b33] to-[#0f3b45]" />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* linhas sutis */}
            <svg className="h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <pattern id="gridDark" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1f3a45" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridDark)" />
            </svg>
          </div>

          {/* moldura/acento */}
          <div className="absolute inset-6 rounded-2xl ring-1 ring-cyan-400/30" />

          {/* imagem principal */}
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="relative w-full max-w-2xl aspect-[16/10] rounded-xl overflow-hidden shadow-2xl ring-1 ring-cyan-300/20">
              <Image
                src="/inicio.png"
                alt="Painel inicial"
                fill
                priority
                className="object-cover"
              />
              {/* overlay sutil para combinar com a paleta */}
              <div className="absolute inset-0 bg-cyan-300/10 mix-blend-soft-light" />
            </div>
          </div>

          {/* Textos rotativos animados */}
          <div className="absolute inset-x-0 bottom-16 flex justify-center px-10">
            <div className="relative w-full max-w-2xl h-24 flex items-center justify-center">
              {ROTATING_TEXTS.map((text, index) => (
                <p
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center text-center text-lg md:text-xl font-semibold text-cyan-50 px-6 transition-all duration-700 ${
                    index === currentTextIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cadastro */}
      {openCadastro && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenCadastro(false)} />
          <div className="relative w-full max-w-2xl rounded-xl bg-zinc-900 text-zinc-100 shadow-xl border border-zinc-700">
            <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-3">
              <h2 className="text-base font-semibold">Cadastro</h2>
              <button
                aria-label="Fechar cadastro"
                onClick={() => setOpenCadastro(false)}
                className="rounded p-1 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCadastro} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
              <Field id="cadNome" label="Nome" value={cadNome} onChange={setCadNome} placeholder="Seu nome completo" />
              <Field id="cadEmail" label="Email" type="email" value={cadEmail} onChange={setCadEmail} placeholder="seu@email.com" />
              <Field id="cadCpf" label="CPF" value={cadCpf} onChange={setCadCpf} placeholder="000.000.000-00" />
              <Field id="cadCodFunc" label="Código do funcionário" value={cadCodFunc} onChange={setCadCodFunc} placeholder="Ex: 12345" />
              <Field id="cadTelefone" label="Telefone" value={cadTelefone} onChange={setCadTelefone} placeholder="(00) 00000-0000" />
              <Field id="cadCep" label="CEP" value={cadCep} onChange={setCadCep} placeholder="00000-000" />
              <Field id="cadSenha" label="Senha" type="password" value={cadSenha} onChange={setCadSenha} placeholder="Crie uma senha" />

              {cadError && (
                <div className="md:col-span-2">
                  <p className="text-sm text-red-400">{cadError}</p>
                </div>
              )}

              <div className="md:col-span-2 mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenCadastro(false)}
                  className="text-sm text-zinc-300 hover:text-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cadLoading}
                  className="inline-flex justify-center rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-cyan-300 disabled:opacity-60"
                >
                  {cadLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}