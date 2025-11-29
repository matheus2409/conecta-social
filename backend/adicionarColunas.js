// backend/adicionarColunas.js
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

const sqlAtualizacao = `
    -- Adicionar coluna 'descricao_curta' se não existir
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS descricao_curta TEXT;

    -- Adicionar coluna 'nome_contato' se não existir
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS nome_contato TEXT;

    -- Adicionar coluna 'local' (para o endereço)
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS local TEXT;

    -- Garantir que 'latitude' e 'longitude' existem
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

    -- Garantir que 'link_site' existe
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS link_site TEXT;
    
    -- Garantir que 'categoria' existe
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS categoria TEXT;
`;

async function atualizar() {
    try {
        console.log("⏳ Conectando ao banco de dados...");
        await client.connect();
        
        console.log("🔧 Adicionando as colunas que faltam...");
        await client.query(sqlAtualizacao);
        
        console.log("✅ SUCESSO! O banco de dados foi atualizado com os novos campos.");
    } catch (err) {
        console.error("❌ Erro ao atualizar:", err.message);
    } finally {
        await client.end();
    }
}

atualizar();