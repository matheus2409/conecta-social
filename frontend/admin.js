// frontend/admin.js
import { criarProjeto } from './apiService.js';
import { logout } from './auth.js';

// Coloque aqui as suas credenciais do Supabase
// Lembre-se que o ideal é não deixar essas chaves expostas no código em um projeto real
const SUPABASE_URL = 'https://negmwaobqphcvasmmcbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZ213YW9icXBoY3Zhc21tY2J6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjcyMjkxNSwiZXhwIjoyMDcyMjk4OTE1fQ.z0iHBNwkz_DnMuznuXdIlrrIKhLDyiByyxK6ntG_GDs';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- FUNÇÃO PARA BUSCAR O ENDEREÇO POR CEP ---
async function buscarEnderecoPorCEP(cep) {
    const cepError = document.getElementById('cep-error');
    const localizacaoInput = document.getElementById('localizacao');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    // Limpa campos e esconde erro antes de nova busca
    cepError.classList.add('d-none');
    localizacaoInput.value = 'Buscando...';
    cidadeInput.value = '';
    estadoInput.value = '';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('CEP não encontrado.');
        
        const data = await response.json();
        if (data.erro) throw new Error('CEP inválido.');

        // Preenche os campos do formulário com os dados retornados
        localizacaoInput.value = data.logradouro ? `${data.logradouro}, ${data.bairro}` : data.bairro;
        cidadeInput.value = data.localidade;
        estadoInput.value = data.uf;

    } catch (error) {
        cepError.textContent = error.message;
        cepError.classList.remove('d-none');
        localizacaoInput.value = ''; // Limpa se der erro
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    const logoutButton = document.getElementById('logout-button');
    const cepInput = document.getElementById('cep');

    // --- EVENTO PARA O CAMPO CEP ---
    cepInput.addEventListener('blur', (e) => {
        const cepValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cepValue.length === 8) {
            buscarEnderecoPorCEP(cepValue);
        } else if (cepValue.length > 0) {
            const cepError = document.getElementById('cep-error');
            cepError.textContent = 'O CEP deve conter 8 números.';
            cepError.classList.remove('d-none');
        }
    });

    // --- LÓGICA DE ENVIO DO FORMULÁRIO ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const projeto = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            categoria: document.getElementById('categoria').value,
            cep: document.getElementById('cep').value,
            localizacao: document.getElementById('localizacao').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            imagem_url: '', // Será preenchido após o upload
        };
        
        const imagemFile = document.getElementById('imagem').files[0];

        try {
            // 1. Faz o upload da imagem (se houver)
            if (imagemFile) {
                const filePath = `public/${Date.now()}-${imagemFile.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('imagens-projetos') // Nome do seu bucket no Supabase
                    .upload(filePath, imagemFile);

                if (uploadError) {
                    throw new Error('Erro no upload da imagem: ' + uploadError.message);
                }

                const { data: urlData } = supabase.storage
                    .from('imagens-projetos')
                    .getPublicUrl(filePath);
                
                projeto.imagem_url = urlData.publicUrl;
            }

            // 2. Envia os dados do projeto para o backend
            await criarProjeto(projeto);

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

    // --- LÓGICA DE LOGOUT ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }
});