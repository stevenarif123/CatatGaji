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

stdin, stdout, stderr = client.exec_command(f"tail -n 60 {REMOTE_ROOT}/api.log")
print("\n--- Recent api.log ---")
print(clean(stdout.read().decode('utf-8', errors='ignore')))

client.close()
