// frontend/editar-projeto.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');
    const form = document.getElementById('edit-form');
    const submitButton = form.querySelector('button[type="submit"]'); // Pega o botão de submit

    if (!projetoId) {
        alert('ID do projeto não fornecido!');
        window.location.href = 'gerenciar.html';
        return;
    }

    try {
        const response = await fetch(`/projetos/${projetoId}`);
        if (!response.ok) {
            throw new Error('Projeto não encontrado.');
        }
        const projeto = await response.json();
        
        // Preenche o formulário com os dados do projeto
        document.getElementById('titulo').value = projeto.titulo;
        document.getElementById('descricao').value = projeto.descricao;
        document.getElementById('imagem_url').value = projeto.imagem_url;
        document.getElementById('localizacao').value = projeto.localizacao;
        document.getElementById('categoria').value = projeto.categoria;

    } catch (error) {
        console.error('Erro ao buscar dados do projeto:', error);
        alert('Não foi possível carregar os dados do projeto. Tente novamente.');
        window.location.href = 'gerenciar.html';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Desabilita o botão para evitar múltiplos cliques
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const projetoAtualizado = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            imagem_url: document.getElementById('imagem_url').value,
            localizacao: document.getElementById('localizacao').value,
            categoria: document.getElementById('categoria').value,
        };

        try {
            const response = await fetch(`/projetos/${projetoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projetoAtualizado),
            });

            if (!response.ok) {
                // Se a resposta não for OK, tenta ler a mensagem de erro do backend
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ocorreu um erro no servidor.');
            }
            
            alert('Projeto atualizado com sucesso!');
            window.location.href = 'gerenciar.html';

        } catch (error) {
            console.error('Erro ao atualizar o projeto:', error);
            alert(`Erro ao atualizar o projeto: ${error.message}`);
        } finally {
            // Reabilita o botão independentemente do resultado
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar Alterações';
        }
    });
});