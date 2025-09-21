// backend/server.js

// ... (início do seu arquivo server.js)

// Atualizar um projeto existente - VERSÃO CORRIGIDA
app.put('/projetos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, imagem_url, localizacao, categoria } = req.body;

        // Validação simples para garantir que os campos principais não estão vazios
        if (!titulo || !descricao) {
            return res.status(400).json({ error: 'Título e Descrição são campos obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('projetos')
            .update({ titulo, descricao, imagem_url, localizacao, categoria })
            .eq('id', id)
            .select() // <<< ADICIONE ESTA LINHA!
        
        if (error) {
            // Se houver um erro no Supabase, lance-o para o bloco catch
            throw error;
        }

        if (!data || data.length === 0) {
            // Se nenhum registro foi atualizado (ex: ID não encontrado)
            return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        // Retorna o projeto que foi atualizado
        res.status(200).json(data[0]);

    } catch (error) {
        // Envia uma resposta de erro mais detalhada
        console.error('Erro ao atualizar projeto:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
    }
});


// ... (resto do seu arquivo server.js)