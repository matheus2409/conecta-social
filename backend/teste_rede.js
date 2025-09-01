console.log("Tentando fazer uma requisição de rede para o Google...");

fetch('https://www.google.com')
  .then(res => {
    console.log("================================================");
    console.log("SUCESSO! A conexão de rede do Node.js está funcionando.");
    console.log("Status da resposta do Google:", res.status);
    console.log("================================================");
  })
  .catch(err => {
    console.error("================================================");
    console.error("FALHA! A conexão de rede do Node.js foi bloqueada.");
    console.error("Erro detalhado:", err);
    console.error("================================================");
  });