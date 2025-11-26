// Salva em: backend/criarTabelas.js
const { Client } = require('pg');
require('dotenv').config();

// --- DIAGNÓSTICO (Para ter certeza que leu o .env) ---
console.log("------------------------------------------------");
console.log("🔍 A verificar configurações...");
if (!process.env.DB_HOST) {
    console.error("❌ ERRO CRÍTICO: O arquivo .env não foi lido ou está vazio.");
    console.error("   Certifica-te que o arquivo se chama '.env' e está na pasta 'backend'.");
    process.exit(1);
}
console.log("✅ Host encontrado:", process.env.DB_HOST);
console.log("✅ Usuário:", process.env.DB_USER);
console.log("------------------------------------------------");

// Configuração da conexão
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false } // Obrigatório para AWS RDS
});

// O SQL das tabelas (Limpo e corrigido)
const sqlCriacao = `
    -- Habilitar UUIDs
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- 1. Tabela de Usuários (Voluntários)
    CREATE TABLE IF NOT EXISTS voluntarios (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL, 
        interesses TEXT[],
        bio TEXT,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 2. Tabela de Projetos
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

    -- 3. Tabela de Feedbacks
    CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        nome_usuario TEXT,
        mensagem TEXT NOT NULL,
        id_do_projeto INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 4. Tabela de Fotos (Galeria)
    CREATE TABLE IF NOT EXISTS fotos_comunidade (
        id SERIAL PRIMARY KEY,
        url_imagem TEXT NOT NULL,
        descricao TEXT,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
`;

async function criarBanco() {
    try {
        console.log("⏳ A conectar à AWS RDS...");
        await client.connect();
        console.log("✅ Conectado com sucesso! A criar tabelas...");
        
        await client.query(sqlCriacao);
        
        console.log("🎉 SUCESSO! Todas as tabelas foram criadas na nuvem.");
    } catch (err) {
        console.error("❌ Erro ao criar tabelas:", err);
    } finally {
        await client.end();
    }
}

criarBanco();