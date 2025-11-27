// backend/atualizarBanco.js
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (!process.env.DB_HOST) {
    console.error("❌ ERRO: Arquivo .env não encontrado ou vazio.");
    process.exit(1);
}

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
});

const sqlReconstrucao = `
    -- 1. Limpeza total das tabelas antigas
    DROP TABLE IF EXISTS feedbacks;
    DROP TABLE IF EXISTS projetos;

    -- 2. Criar a tabela PROJETOS (Limpa e Genérica)
    CREATE TABLE projetos (
        id SERIAL PRIMARY KEY,              -- Corrigido: "eu ia" vira ID numérico
        titulo TEXT NOT NULL,               -- "nome"
        descricao TEXT,                     -- "descrição_completa"
        imagem_url TEXT,                    -- "url_da_imagem"
        
        -- Localização
        localizacao TEXT,                   -- "local"
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        
        -- Contato e Links
        contato_coordenador TEXT,
        link_site TEXT,
        link_repositorio TEXT,

        -- Relação com o criador (Voluntário)
        criador_id UUID REFERENCES voluntarios(id) ON DELETE SET NULL,
        
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 3. Tabela FEEDBACKS
    CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        nome_usuario TEXT,
        mensagem TEXT NOT NULL,
        id_do_projeto INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
`;

async function rodar() {
    try {
        console.log("⏳ Conectando à AWS...");
        await client.connect();
        
        console.log("🧹 Removendo referências antigas...");
        await client.query(sqlReconstrucao);
        
        console.log("✅ SUCESSO! Banco de dados limpo e pronto para receber o novo código.");
    } catch (err) {
        console.error("❌ Erro ao atualizar:", err);
    } finally {
        await client.end();
    }
}

rodar();