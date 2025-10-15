from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# URL da tua API Node.js para obter os projetos
API_PROJETOS_URL = 'http://localhost:3000/api/projetos'

def obter_projetos():
    """Busca todos os projetos da API principal."""
    try:
        response = requests.get(API_PROJETOS_URL)
        response.raise_for_status()  # Lança um erro se a resposta não for 200
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar projetos: {e}")
        return []

@app.route('/recomendar', methods=['POST'])
def recomendar():
    """Recebe os interesses de um voluntário e devolve os projetos recomendados."""
    dados = request.json
    interesses_voluntario = dados.get('interesses', [])
    
    if not interesses_voluntario:
        return jsonify([])

    projetos = obter_projetos()
    
    # O "cérebro" da IA: A mesma lógica de pontuação que tínhamos antes
    recomendacoes = []
    for projeto in projetos:
        pontuacao = 0
        interesses_lower = [i.lower() for i in interesses_voluntario]
        
        if projeto.get('categoria') and projeto.get('categoria').lower() in interesses_lower:
            pontuacao += 10
        
        for interesse in interesses_lower:
            if interesse in projeto.get('descricao', '').lower():
                pontuacao += 2
        
        if pontuacao > 0:
            recomendacoes.append({**projeto, 'pontuacao': pontuacao})

    # Ordena pela pontuação
    recomendacoes_ordenadas = sorted(recomendacoes, key=lambda p: p['pontuacao'], reverse=True)
    
    return jsonify(recomendacoes_ordenadas)

if __name__ == '__main__':
    # Roda o serviço de IA numa porta diferente, ex: 5000
    app.run(port=5000, debug=True)