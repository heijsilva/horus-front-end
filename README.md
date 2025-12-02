Horus - Sistema de Monitoramento Inteligente

Sistema de monitoramento urbano com inteligência artificial para detecção de irregularidades através de câmeras de segurança.

---

Índice

- Sobre o Projeto
- Tecnologias
- Pré-requisitos
- Instalação
- Configuração
- Executando o Projeto
- Estrutura do Projeto
- Funcionalidades
- API Endpoints
- Contribuindo
- Licença

---

Sobre o Projeto

O Horus é um sistema completo de monitoramento urbano que utiliza inteligência artificial para detectar irregularidades em tempo real através de câmeras de segurança. O sistema é focado em identificar acúmulo de lixo, problemas de infraestrutura e outras anomalias urbanas.

Principais Características

- Monitoramento em tempo real via câmeras CCTV
- Detecção automática de irregularidades com IA
- Visualização geográfica com mapas interativos
- Dashboard com estatísticas e métricas
- Sistema de alertas em tempo real
- Interface responsiva e moderna
- Sistema de autenticação seguro

---

Tecnologias

Frontend
- Next.js 15 - Framework React
- TypeScript - Tipagem estática
- Tailwind CSS - Estilização
- Leaflet - Mapas interativos
- React Hooks - Gerenciamento de estado

Backend
- Python 3.11+ - Linguagem principal
- FastAPI - Framework web
- MongoDB Atlas - Banco de dados NoSQL
- Bcrypt - Hash de senhas
- Uvicorn - Servidor ASGI
- Swagger/OpenAPI - Documentação automática

---

Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18+
- Python 3.11+
- npm ou yarn (vem com Node.js)
- pip (vem com Python)
- Git

---

Instalação

1. Clone o Repositório

git clone https://github.com/seu-usuario/horus-front-end.git
cd horus-front-end

---

Configuração

Backend (Python + FastAPI)

1. Navegue até a pasta do backend

cd horus-back-end

2. Crie um ambiente virtual

Windows:
python -m venv venv
venv\Scripts\activate

Linux/Mac:
python3 -m venv venv
source venv/bin/activate

3. Instale as dependências

pip install -r requirements.txt

4. Configure as variáveis de ambiente

Crie um arquivo .env na pasta horus-back-end:

# MongoDB Atlas
MONGODB_URI=mongodb+srv://suachave:suasenha.yfwze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=pi
collection_name=users

# Configurações da API
API_PORT=6660
API_HOST=0.0.0.0



5. Estrutura de pastas do backend

horus-back-end/
├── app/
│   ├── __init__.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── database.py
│   └── routes/
│       ├── __init__.py
│       ├── auth.py
│       └── users.py
├── main.py
├── .env
└── requirements.txt

---

Frontend (Next.js + TypeScript)

1. Navegue até a pasta do frontend

cd my-app

2. Instale as dependências

npm install

Ou com yarn:
yarn install

3. Configure as variáveis de ambiente (opcional)

Crie um arquivo .env.local na pasta my-app:

NEXT_PUBLIC_API_URL=http://localhost:6660

4. Estrutura de pastas do frontend

my-app/
├── app/
│   ├── page.tsx (Login)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── cameras/
│   │   └── page.tsx
│   ├── alertas/
│   │   └── page.tsx
│   ├── historico/
│   │   └── page.tsx
│   ├── mapas/
│   │   └── page.tsx
│   ├── configuracoes/
│   │   └── page.tsx
│   └── components/
│       ├── Sidebar.tsx
│       └── MapComponent.tsx
├── public/
│   ├── video1.mp4
│   ├── video2.mp4
│   └── ...
├── package.json
└── tailwind.config.ts

---

Executando o Projeto

1. Inicie o Backend

Abra um terminal na pasta horus-back-end:

# Ative o ambiente virtual (se ainda não estiver ativo)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Execute o servidor
python -m uvicorn main:app --reload --port 6660

O backend estará rodando em: http://localhost:6660

Documentação Swagger: http://localhost:6660/docs

---

2. Inicie o Frontend

Abra outro terminal na pasta my-app:

npm run dev

Ou com yarn:
yarn dev

O frontend estará rodando em: http://localhost:7777

---

Pronto! Acesse o sistema

Abra seu navegador e acesse:

http://localhost:7777

---

Estrutura do Projeto

horus/
│
├── horus-back-end/          # Backend (Python + FastAPI)
│   ├── app/
│   │   ├── config/
│   │   │   └── database.py  # Configuração MongoDB
│   │   └── routes/
│   │       ├── auth.py      # Rotas de autenticação
│   │       └── users.py     # Rotas de usuários
│   ├── main.py              # Arquivo principal da API
│   ├── .env                 # Variáveis de ambiente
│   └── requirements.txt     # Dependências Python
│
└── my-app/                  # Frontend (Next.js)
    ├── app/
    │   ├── page.tsx         # Página de login
    │   ├── dashboard/       # Dashboard principal
    │   ├── cameras/         # Visualização de câmeras
    │   ├── alertas/         # Gerenciamento de alertas
    │   ├── historico/       # Histórico de eventos
    │   ├── mapas/           # Visualização em mapa
    │   ├── configuracoes/   # Configurações do usuário
    │   └── components/      # Componentes reutilizáveis
    ├── public/              # Arquivos estáticos
    └── package.json         # Dependências Node.js

---

Funcionalidades

Autenticação
- Login com email e senha
- Registro de novos usuários
- Hash de senhas com Bcrypt
- Persistência de sessão com localStorage

Gerenciamento de Usuários
- Visualizar perfil completo
- Editar informações pessoais
- Alterar senha
- Upload de foto de perfil
- Deletar conta

Monitoramento
- Visualização de múltiplas câmeras
- Reprodução de vídeo em tempo real
- Autoplay e loop de vídeos
- Filtros e busca de câmeras
- Status ao vivo das câmeras

Mapas
- Visualização geográfica
- Marcadores de câmeras
- Marcadores de alertas
- Geolocalização do usuário
- Controles de zoom
- Botão de recentralizar

Dashboard
- Estatísticas em tempo real
- Gráficos e métricas
- Alertas recentes
- Resumo de atividades

Alertas
- Notificações em tempo real
- Histórico de alertas
- Filtros por tipo e prioridade
- Detalhes de cada alerta

---

API Endpoints

Autenticação

POST /auth/register
Registra um novo usuário

Body:
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "codigo_funcionario": "FUNC001",
  "telefone": "(81) 99999-9999",
  "cep": "50000-000",
  "senha": "senha123"
}

POST /auth/login
Realiza login

Body:
{
  "email": "joao@email.com",
  "senha": "senha123"
}

---

Usuários

GET /users/email/{email}
Busca usuário por email

GET /users/{user_id}
Busca usuário por ID

PUT /users/{user_id}
Atualiza dados do usuário

Body:
{
  "nome": "João Silva Santos",
  "telefone": "(81) 98888-8888",
  "senha": "novaSenha123"
}

DELETE /users/{user_id}
Deleta usuário

GET /users/
Lista todos os usuários

---

Health Check

GET /health
Verifica status da API e banco de dados

Response:
{
  "status": "healthy",
  "database": "pi",
  "collections": ["users"]
}

---

Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (git checkout -b feature/MinhaFeature)
3. Commit suas mudanças (git commit -m 'Adiciona MinhaFeature')
4. Push para a branch (git push origin feature/MinhaFeature)
5. Abra um Pull Request

---

Licença

Este projeto está sob a licença Apache 2.0. Veja o arquivo LICENSE para mais detalhes.

---

Autor

João Victor Oliveira Da Silva - Desenvolvimento