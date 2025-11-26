// backend/routes/voluntarios.js

// ... (código anterior de registro e login mantém-se igual)

// Rota para ATUALIZAR o perfil
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const { nome, bio, interesses } = req.body;
        const idUsuario = req.user.id; // O ID vem do token seguro

        // Atualiza apenas os campos permitidos
        const { error } = await supabase
            .from('voluntarios')
            .update({ 
                nome: nome, 
                bio: bio, 
                interesses: interesses // O Supabase aceita arrays diretamente
            })
            .eq('id', idUsuario);

        if (error) throw error;

        res.json({ success: true, message: "Perfil atualizado!" });
    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        res.status(500).json({ error: 'Erro ao atualizar dados.' });
    }
});

module.exports = router;