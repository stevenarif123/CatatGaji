import paramiko
import os
import time

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"
REMOTE_ROOT = "/home/u496707900/domains/stevenarif.my.id/public_html/catatgaji"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
print("[OK] Connected to Hostinger via SSH!")

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
            print(f"Uploaded: {item} -> {remote_path}")

# 1. Upload packages/shared/dist and packages/shared/package.json
print("\n--- Uploading compiled packages/shared/dist ---")
sftp_upload_dir("d:\\Projects\\CatatGaji\\packages\\shared\\dist", f"{REMOTE_ROOT}/packages/shared/dist")
sftp.put("d:\\Projects\\CatatGaji\\packages\\shared\\package.json", f"{REMOTE_ROOT}/packages/shared/package.json")
sftp.put("d:\\Projects\\CatatGaji\\.htaccess", f"{REMOTE_ROOT}/.htaccess")
sftp.close()

# 2. Setup symlink and restart server
commands = [
    f"mkdir -p {REMOTE_ROOT}/node_modules/@catatgaji",
    f"ln -sfn {REMOTE_ROOT}/packages/shared {REMOTE_ROOT}/node_modules/@catatgaji/shared",
    f"cat {REMOTE_ROOT}/packages/shared/package.json",
    f"pkill -f 'apps/api/dist/main.js' || true",
    f"cd {REMOTE_ROOT} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js > api.log 2>&1 &",
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

# Wait 3 seconds
time.sleep(3)

print("\n--- Checking api.log ---")
stdin, stdout, stderr = client.exec_command(f"cat {REMOTE_ROOT}/api.log")
print(stdout.read().decode('utf-8', errors='ignore').strip())

print("\n--- Testing Local curl http://127.0.0.1:3000/health ---")
stdin, stdout, stderr = client.exec_command("curl -s http://127.0.0.1:3000/health")
print(stdout.read().decode('utf-8', errors='ignore').strip())

print("\n--- Testing Public curl https://catatgaji.stevenarif.my.id/health ---")
stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health")
print(stdout.read().decode('utf-8', errors='ignore').strip())

client.close()
