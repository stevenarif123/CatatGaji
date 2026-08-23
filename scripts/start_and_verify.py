import paramiko
import os
import time
import sys

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"
REMOTE_ROOT = "/home/u496707900/domains/stevenarif.my.id/public_html/catatgaji"

print(f"Connecting to {HOST}:{PORT}...", flush=True)
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
print("[OK] Connected to Hostinger via SSH!", flush=True)

# 1. SFTP Upload
sftp = client.open_sftp()

def sftp_upload_dir(local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        if os.path.isdir(local_path):
            sftp_upload_dir(local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)
            print(f"Uploaded: {item}", flush=True)

print("Uploading packages/shared/dist...", flush=True)
sftp_upload_dir("d:\\Projects\\CatatGaji\\packages\\shared\\dist", f"{REMOTE_ROOT}/packages/shared/dist")
sftp.put("d:\\Projects\\CatatGaji\\packages\\shared\\package.json", f"{REMOTE_ROOT}/packages/shared/package.json")
sftp.put("d:\\Projects\\CatatGaji\\.htaccess", f"{REMOTE_ROOT}/.htaccess")
sftp.close()
print("[OK] Upload complete!", flush=True)

# 2. Setup symlink and restart Fastify
cmds = [
    f"mkdir -p {REMOTE_ROOT}/node_modules/@catatgaji",
    f"ln -sfn {REMOTE_ROOT}/packages/shared {REMOTE_ROOT}/node_modules/@catatgaji/shared",
    f"pkill -f 'apps/api/dist/main.js' || true",
    f"cd {REMOTE_ROOT} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js </dev/null >api.log 2>&1 &",
]

for cmd in cmds:
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()

print("Waiting for Fastify to start...", flush=True)
time.sleep(3)

# 3. Check logs & health
stdin, stdout, stderr = client.exec_command(f"cat {REMOTE_ROOT}/api.log")
print("\n--- api.log ---", flush=True)
print(stdout.read().decode('utf-8', errors='ignore').strip(), flush=True)

stdin, stdout, stderr = client.exec_command("curl -s http://127.0.0.1:3000/health")
print("\n--- Local Health Check (http://127.0.0.1:3000/health) ---", flush=True)
print(stdout.read().decode('utf-8', errors='ignore').strip(), flush=True)

stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health")
print("\n--- Public Health Check (https://catatgaji.stevenarif.my.id/health) ---", flush=True)
print(stdout.read().decode('utf-8', errors='ignore').strip(), flush=True)

client.close()
print("\n[ALL DONE] Server is running!", flush=True)
