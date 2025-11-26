// backend/criarTabelas.js
const { Client } = require('pg');
require('dotenv').config();

// Configuração da conexão (vai ler do teu arquivo .env)
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

// O SQL que cria a estrutura
const sqlCriacao = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS voluntarios (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL, 
        interesses TEXT[],
        bio TEXT,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS projetos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT,
        imagem_url TEXT,
        link_site TEXT,
        link_repositorio TEXT,
        contato_coordenador TEXT,
        criador_id UUID REFERENCES voluntarios(id) ON DELETE SET NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        nome_usuario TEXT,
        mensagem TEXT NOT NULL,
        id_do_projeto INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS fotos_comunidade (
        id SERIAL PRIMARY KEY,
        url_imagem TEXT NOT NULL,
        descricao TEXT,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
`;

async function criarBanco() {
    try {
        console.log("⏳ Conectando à AWS...");
        await client.connect();
        console.log("✅ Conectado! Criando tabelas...");
        
        await client.query(sqlCriacao);
        
        console.log("🎉 SUCESSO! As tabelas foram criadas na AWS.");
    } catch (err) {
        console.error("❌ Erro:", err);
    } finally {
        await client.end();
    }
}

criarBanco();