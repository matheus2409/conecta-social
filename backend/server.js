// 1. Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// 2. Importa as ferramentas necessárias
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 3. Inicializa o Express
const app = express();
const PORT = 3000;

// 4. Cria o "cliente" do Supabase para conectar com nosso banco de dados
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Ativa o "decodificador" de JSON do Express
app.use(express.json());


// --- ROTAS DA API ---
// Rota para CRIAR um novo projeto (usada pelo admin.html)
app.post('/api/projetos', async (req, res) => {
  console.log('Recebida requisição para criar novo projeto:', req.body);

  // Pega os dados do corpo da requisição
  const { nome, categoria, descrição, local, contato, imagem_url } = req.body;

  const { data, error } = await supabase
    .from('projetos')
    .insert([
      { 
        nome: nome,
        categoria: categoria,
        descrição: descrição, // Nome da coluna com acento
        local: local,
        contato: contato,
        imagem_url: imagem_url,
      }
    ]);

  if (error) {
    console.error('Erro ao salvar novo projeto:', error);
    return res.status(400).json({ error: 'Erro ao salvar o novo projeto.' });
  }
  res.status(201).json({ message: 'Projeto criado com sucesso!', data: data });
});
// NOVO: Rota para APAGAR um projeto pelo seu ID
app.delete('/api/projetos/:id', async (req, res) => {
  const { error } = await supabase
    .from('projetos')
    .delete()
    .eq('id', req.params.id); // Apague da tabela 'projetos' onde o 'id' for igual ao id da requisição

  if (error) {
    console.error('Erro ao apagar projeto:', error);
    return res.status(500).json({ error: 'Erro ao apagar o projeto.' });
  }

  res.status(200).json({ message: 'Projeto apagado com sucesso!' });
}); 

// Rota para buscar todos os projetos
app.get('/api/projetos', async (req, res) => {
  const { data, error } = await supabase
    .from('projetos')
    .select('*');
  
  // Bloco de erro completo e corrigido
  if (error) {
    console.error('--- ERRO DETALHADO AO BUSCAR PROJETOS ---');
    console.error('Mensagem:', error.message);
    console.error('Detalhes:', error.details);
    console.error('Causa do Erro (pista final):', error.cause);
    console.error('-----------------------------------------');
    return res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
  
  // Parte que estava faltando: enviar os dados em caso de sucesso
  res.json(data);
});

// Rota para buscar um projeto por ID
app.get('/api/projetos/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projetos')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    console.error('Erro ao buscar projeto por ID:', error);
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }
  res.json(data);
});

// Rota para salvar um novo feedback
app.post('/api/feedbacks', async (req, res) => {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([
      { 
        nome_usuario: req.body.nome_usuario,
        mensagem: req.body.mensagem,
        id_do_projeto: req.body.id_do_projeto
      }
    ]);

  if (error) {
    console.error('Erro ao salvar feedback:', error);
    return res.status(400).json({ error: 'Erro ao salvar o feedback.' });
  }
  res.status(201).json({ message: 'Feedback recebido com sucesso!', data: data });
});


// --- Configuração para servir o frontend (continua igual) ---
const caminhoFrontend = path.join(__dirname, '../frontend');
app.use(express.static(caminhoFrontend));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  console.log('Backend conectado ao Supabase!');
});