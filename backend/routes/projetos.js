// backend/routes/projetos.js

// ... (imports e configurações anteriores)

// ===================== ROTA PRIVADA - ADICIONAR =====================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo, descricao, categoria, imagem_url, link_site, link_repositorio, contato_coordenador } = req.body;
    
    // O middleware 'authMiddleware' já decodificou o token e colocou os dados em req.user
    const idDoVoluntario = req.user.id; 

    const { data, error } = await supabase
      .from('projetos')
      .insert([{ 
          titulo, 
          descricao, 
          categoria, 
          imagem_url,
          link_site,
          link_repositorio,
          contato_coordenador,
          criador_id: idDoVoluntario // <--- AQUI ESTÁ A CONEXÃO!
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao adicionar projeto:', err.message);
    res.status(500).json({ error: 'Erro ao adicionar projeto.' });
  }
});

// ... (resto do arquivo)