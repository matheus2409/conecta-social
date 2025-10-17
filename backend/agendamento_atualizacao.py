import schedule
import time
import requests

API_URL = 'http://localhost:3000/api/projetos' # Corrigido

def atualizar_dados():
    response = requests.get(API_URL)
    print('Dados atualizados:', response.json())

schedule.every(1).hours.do(atualizar_dados)

print('Agendamento iniciado. Pressione Ctrl+C para parar.')
while True:
    schedule.run_pending()
    time.sleep(1)