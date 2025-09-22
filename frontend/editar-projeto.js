// frontend/editar-projeto.js
import { getProjetoPorId, atualizarProjeto } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get('id');
    const form = document.getElementById('edit-form');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!projetoId) {
        alert('ID do projeto não fornecido!');
        window.location.href = 'gerenciar.html';
        return;
    }

    try {
        // Busca os dados do projeto usando a função do apiService
        const projeto = await getProjetoPorId(projetoId);
        
        // Preenche o formulário com os dados do projeto
        document.getElementById('titulo').value = projeto.titulo;
        document.getElementById('descricao').value = projeto.descricao;
        document.getElementById('imagem_url').value = projeto.imagem_url;
        document.getElementById('localizacao').value = projeto.localizacao;
        document.getElementById('categoria').value = projeto.categoria;

    } catch (error) {
        console.error('Erro ao buscar dados do projeto:', error);
        alert(`Não foi possível carregar os dados do projeto: ${error.message}`);
        window.location.href = 'gerenciar.html';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            // Atualiza o projeto usando a função do apiService
            await atualizarProjeto(projetoId, projetoAtualizado);
            
            alert('Projeto atualizado com sucesso!');
            window.location.href = 'gerenciar.html';

        } catch (error) {
            console.error('Erro ao atualizar o projeto:', error);
            alert(`Erro ao atualizar o projeto: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar Alterações';
        }
    });
});