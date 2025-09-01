const mongoose = require('mongoose');
const { Schema } = mongoose; // Importamos o Schema do Mongoose

const feedbackSchema = new Schema({
  nome_usuario: {
    type: String,
    required: false // O nome do usuário não é obrigatório
  },
  mensagem: {
    type: String,
    required: true // A mensagem é obrigatória
  },
  data_envio: {
    type: Date,
    default: Date.now // Define a data/hora atual automaticamente na criação
  },
  // Este é o campo mais importante!
  // Ele vai guardar o ID do projeto ao qual este feedback pertence.
  id_do_projeto: {
    type: Schema.Types.ObjectId,
    ref: 'Projeto', // Faz uma referência ao nosso Model 'Projeto'
    required: true
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;