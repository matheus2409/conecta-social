// backend/alinharBanco.js
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

const sqlCorrecao = `
    -- 1. Tentar renomear 'nome' para 'titulo' (se existir)
    DO $$
    BEGIN
      IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projetos' AND column_name='nome') THEN
          ALTER TABLE projetos RENAME COLUMN nome TO titulo;
      END IF;
    END $$;

    -- 2. Tentar renomear 'descricao_completa' para 'descricao' (se existir)
    DO $$
    BEGIN
      IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projetos' AND column_name='descricao_completa') THEN
          ALTER TABLE projetos RENAME COLUMN descricao_completa TO descricao;
      END IF;
    END $$;

    -- 3. Garantir que a coluna 'categoria' existe
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS categoria TEXT;

    -- 4. Garantir que a coluna 'link_site' existe
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS link_site TEXT;

    -- 5. Garantir que 'contato_coordenador' existe (vi que tens 'contato' e 'contato_coordenador', vamos usar o coordenador)
    ALTER TABLE projetos ADD COLUMN IF NOT EXISTS contato_coordenador TEXT;
`;

async function arrumar() {
    try {
        console.log("⏳ A conectar ao banco...");
        await client.connect();
        
        console.log("🔧 A alinhar as colunas com o código...");
        await client.query(sqlCorrecao);
        
        console.log("✅ FEITO! O banco agora aceita 'titulo', 'descricao' e 'categoria' corretamente.");
    } catch (err) {
        console.error("❌ Erro:", err);
    } finally {
        await client.end();
    }
}

arrumar();