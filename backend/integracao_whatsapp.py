import requests
from twilio.rest import Client

API_URL = 'http://localhost:3000/api/projetos' # Corrigido
ACCOUNT_SID = 'SEU_TWILIO_SID'
AUTH_TOKEN = 'SEU_TWILIO_TOKEN'
FROM_WHATSAPP = 'whatsapp:+14155238886'
TO_WHATSAPP = 'whatsapp:+SEU_NUMERO'

client = Client(ACCOUNT_SID, AUTH_TOKEN)
response = requests.get(API_URL)
projetos = response.json()
msg = 'Projetos cadastrados:\n' + '\n'.join([p.get('nome', '') for p in projetos])
message = client.messages.create(body=msg, from_=FROM_WHATSAPP, to=TO_WHATSAPP)
print('Mensagem enviada para WhatsApp.')