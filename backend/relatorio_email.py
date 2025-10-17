import requests
from email.message import EmailMessage
import smtplib

API_URL = 'http://localhost:3000/api/projetos' # Corrigido
EMAIL_ADDRESS = 'seu_email@gmail.com'
EMAIL_PASSWORD = 'sua_senha'
DESTINATARIO = 'admin@conectasocial.com'

response = requests.get(API_URL)
projetos = response.json()
msg = EmailMessage()
msg['Subject'] = 'Relatório de Projetos'
msg['From'] = EMAIL_ADDRESS
msg['To'] = DESTINATARIO
msg.set_content('\n'.join([str(p) for p in projetos]))
with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
    smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    smtp.send_message(msg)
print('Relatório enviado por e-mail.')