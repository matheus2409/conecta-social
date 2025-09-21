// frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');

    // Inicialize o cliente Supabase com as suas credenciais
    // É seguro expor essas chaves no frontend, desde que você configure as Row Level Security (RLS) no seu banco de dados.
    const supabaseUrl = 'SUA_URL_SUPABASE'; 
    const supabaseKey = 'SUA_CHAVE_PUBLICA_SUPABASE';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

            // 3. Salvar os dados do projeto (incluindo a URL da imagem) no seu backend
            const response = await fetch('/projetos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descricao, imagem_url, localizacao, categoria }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar o projeto.');
            }

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
});