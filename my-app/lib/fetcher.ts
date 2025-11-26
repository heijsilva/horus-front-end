export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // Se a resposta não for bem-sucedida, lance um erro.
  if (!res.ok) {
    const error = new Error('Ocorreu um erro durante o fetch de dados.');
    // Tenta anexar detalhes adicionais do erro, se disponíveis
    // error.info = await res.json();
    // error.status = res.status;
    throw error;
  }

  return res.json();
};