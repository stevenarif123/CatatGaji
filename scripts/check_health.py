import paramiko

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"
REMOTE_ROOT = "/home/u496707900/domains/stevenarif.my.id/public_html/catatgaji"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)

def clean(text):
    return text.encode('ascii', errors='ignore').decode('ascii').strip()

print("[OK] Connected to Hostinger via SSH!")

stdin, stdout, stderr = client.exec_command(f"cat {REMOTE_ROOT}/api.log")
print("\n--- api.log Content ---")
print(clean(stdout.read().decode('utf-8', errors='ignore')))

stdin, stdout, stderr = client.exec_command("curl -s http://127.0.0.1:3000/health")
print("\n--- Local Health Check (http://127.0.0.1:3000/health) ---")
print(clean(stdout.read().decode('utf-8', errors='ignore')))

stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health")
print("\n--- Public Health Check (https://catatgaji.stevenarif.my.id/health) ---")
print(clean(stdout.read().decode('utf-8', errors='ignore')))

client.close()
