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

// Rota para CRIAR um novo projeto
app.post('/api/projetos', async (req, res) => {
  const { nome, categoria, descricao_curta, descricao_completa, local, contato, nome_contato, imagem_url } = req.body;

  const { data, error } = await supabase
    .from('projetos')
    .insert([{ nome, categoria, descricao_curta, descricao_completa, local, contato, nome_contato, imagem_url }]);

  if (error) {
    console.error('Erro ao salvar novo projeto:', error);
    return res.status(400).json({ error: 'Erro ao salvar o novo projeto.' });
  }
  res.status(201).json({ message: 'Projeto criado com sucesso!', data });
});

// Rota para ATUALIZAR um projeto existente (Versão corrigida e única)
app.put('/api/projetos/:id', async (req, res) => {
  const projetoId = req.params.id;
  const dadosAtualizados = req.body;

  const { data, error } = await supabase
    .from('projetos')
    .update(dadosAtualizados)
    .eq('id', projetoId);

  if (error) {
    console.error('Erro ao atualizar projeto:', error);
    return res.status(400).json({ error: 'Erro ao atualizar o projeto.' });
  }
  res.status(200).json({ message: 'Projeto atualizado com sucesso!', data });
});

// Rota para APAGAR um projeto
app.delete('/api/projetos/:id', async (req, res) => {
  const { error } = await supabase
    .from('projetos')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    console.error('Erro ao apagar projeto:', error);
    return res.status(500).json({ error: 'Erro ao apagar o projeto.' });
  }
  res.status(200).json({ message: 'Projeto apagado com sucesso!' });
}); 

// Rota para buscar todos os projetos (com filtro de busca CORRIGIDO)
app.get('/api/projetos', async (req, res) => {
  const { busca } = req.query;
  let query = supabase.from('projetos').select('*');

  if (busca) {
    // CORRIGIDO: Agora busca em 'nome' e na nova 'descricao_completa'
    query = query.or(`nome.ilike.%${busca}%,descricao_completa.ilike.%${busca}%`);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('--- ERRO DETALHADO AO BUSCAR PROJETOS ---', error);
    return res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
  
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


// --- Configuração para servir o frontend ---
const caminhoFrontend = path.join(__dirname, '../frontend');
app.use(express.static(caminhoFrontend));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  console.log('Backend conectado ao Supabase!');
});