import paramiko
import time

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
print("[OK] Connected to Hostinger via SSH!")

commands = [
    # 1. Check alt-nodejs20 version
    "/opt/alt/alt-nodejs20/root/usr/bin/node -v",
    "/opt/alt/alt-nodejs20/root/usr/bin/npm -v",
    
    # 2. Add to .bashrc so node & npm are in PATH permanently
    'grep -q "alt-nodejs20" ~/.bashrc || echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH" >> ~/.bashrc',
    
    # 3. Go to catatgaji folder and run npm install
    "cd ~/domains/stevenarif.my.id/public_html/catatgaji && /opt/alt/alt-nodejs20/root/usr/bin/npm install --omit=dev",
    
    # 4. Check if node_modules was created
    "ls -la ~/domains/stevenarif.my.id/public_html/catatgaji/node_modules | head -n 15",
]

for cmd in commands:
    print(f"\n--- Running: {cmd} ---")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if out:
        print(out)
    if err:
        print("STDERR:", err)

client.close()
