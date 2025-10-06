import requests
import pytest

API_URL = 'http://localhost:3001/api/projetos'

def test_get_projetos():
    response = requests.get(API_URL)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Adicione mais testes para POST, PUT, DELETE, autenticação, etc.
