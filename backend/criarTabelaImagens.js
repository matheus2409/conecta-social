// backend/criarTabelaImagens.js
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        
        // Cria a tabela para guardar as imagens extras do projeto
        const query = `
            CREATE TABLE IF NOT EXISTS imagens_projeto (
                id SERIAL PRIMARY KEY,
                projeto_id INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
                imagem_url TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `;
        
        await client.query(query);
        console.log("✅ Tabela 'imagens_projeto' criada com sucesso!");
    } catch (e) {
        console.error("❌ Erro:", e.message);
    } finally {
        await client.end();
    }
}

run();