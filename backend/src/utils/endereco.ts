export const buscarEnderecoPorCEP = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
    return null;
  }
};