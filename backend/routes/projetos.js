// backend/routes/projetos.js (versão final e segura)

const express = require('express');
const router = express.Router();
const supabase = require('../db');
const authMiddleware = require('../middleware/auth');

// ===================== ROTA PÚBLICA - TODOS OS PROJETOS =====================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projetos').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('Erro ao buscar projetos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});

// ===================== ROTA PÚBLICA - PROJETO POR ID =====================
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Projeto não encontrado.' });

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro ao buscar projeto por ID:', err.message);
    res.status(500).json({ error: 'Erro ao buscar projeto.' });
  }
});

// ===================== ROTA PRIVADA - ADICIONAR =====================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo, descricao, categoria, imagem_url } = req.body;

    const { data, error } = await supabase
      .from('projetos')
      .insert([{ titulo, descricao, categoria, imagem_url }])
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao adicionar projeto:', err.message);
    res.status(500).json({ error: 'Erro ao adicionar projeto.' });
  }
});

// ===================== ROTA PRIVADA - ATUALIZAR =====================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria, imagem_url } = req.body;

    const { data, error } = await supabase
      .from('projetos')
      .update({ titulo, descricao, categoria, imagem_url })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('Erro ao atualizar projeto:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
});

// ===================== ROTA PRIVADA - DELETAR =====================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('projetos').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar projeto:', err.message);
    res.status(500).json({ error: 'Erro ao deletar projeto.' });
  }
});

module.exports = router;
