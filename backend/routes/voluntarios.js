// ... (código anterior igual)

// === ROTA DE LOGIN ===
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const query = 'SELECT * FROM voluntarios WHERE email = $1';
        const result = await db.query(query, [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // AQUI ESTÁ A MUDANÇA: Adicionamos role: 'voluntario'
        const token = jwt.sign(
            { 
                id: user.id, 
                nome: user.nome,
                role: 'voluntario' // <--- Papel normal
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// ... (resto das rotas iguais)