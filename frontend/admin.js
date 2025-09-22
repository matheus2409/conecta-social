// frontend/admin.js
import { criarProjeto } from './apiService.js'; // Importa a função da apiService

// É fundamental que você configure estas variáveis em um local seguro
// ou, para este projeto, pode inicializá-las aqui, mas o ideal
// seria carregá-las de um arquivo de configuração ou variáveis de ambiente.
const SUPABASE_URL = 'https://negmwaobqphcvasmmcbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZ213YW9icXBoY3Zhc21tY2J6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjcyMjkxNSwiZXhwIjoyMDcyMjk4OTE1fQ.z0iHBNwkz_DnMuznuXdIlrrIKhLDyiByyxK6ntG_GDs';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    const logoutButton = document.getElementById('logout-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const localizacao = document.getElementById('localizacao').value;
        const categoria = document.getElementById('categoria').value;
        const imagemFile = document.getElementById('imagem').files[0];

        try {
            let imagem_url = '';
            if (imagemFile) {
                // 1. Fazer o upload do arquivo para o Supabase Storage
                const filePath = `public/${Date.now()}-${imagemFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagens-projetos')
                    .upload(filePath, imagemFile);

                if (uploadError) {
                    throw new Error('Erro no upload da imagem: ' + uploadError.message);
                }

                // 2. Obter a URL pública do arquivo
                const { data: urlData } = supabase.storage
                    .from('imagens-projetos')
                    .getPublicUrl(filePath);
                
                imagem_url = urlData.publicUrl;
            }

            // 3. Criar o objeto do projeto
            const novoProjeto = {
                titulo,
                descricao,
                imagem_url,
                localizacao,
                categoria,
            };
            
            // 4. Salvar os dados do projeto usando a apiService
            await criarProjeto(novoProjeto);

            alert('Projeto criado com sucesso!');
            form.reset();
        } catch (error) {
            console.error('Erro:', error);
            alert(`Falha ao criar projeto: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Adicionar Projeto';
        }
    });

    // Lógica de Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Importa a função de logout dinamicamente e a executa
            import('./auth.js').then(auth => auth.logout());
        });
    }
});