const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com a AWS RDS
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,      // O "Endpoint" do teu RDS na AWS
    database: process.env.DB_NAME,  // O nome do banco (ex: postgres)
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false   // Necessário para conectar com segurança ao RDS
    }
});

// Teste de conexão ao iniciar
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Erro ao conectar ao banco AWS:', err.stack);
    }
    console.log('✅ Conectado com sucesso ao banco AWS RDS!');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};