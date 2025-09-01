const mongoose = require('mongoose');

// Esta é a nossa "forma de bolo" (Schema)
// Ela define a estrutura que todo documento de projeto terá
const projetoSchema = new mongoose.Schema({
  nome: String,
  tematica: String,
  descricao_curta: String,
  descricao_completa: String,
  local_texto: String,
  data_hora_texto: String,
});

// A partir da "forma", criamos o "confeiteiro" (Model)
// O Model é a ferramenta que nos permitirá criar, ler, atualizar e apagar projetos no banco
const Projeto = mongoose.model('Projeto', projetoSchema);

// Exportamos o "confeiteiro" para que outros arquivos (como o server.js) possam usá-lo
module.exports = Projeto;