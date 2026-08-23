import paramiko
import sys

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print(f"Connecting to {HOST}:{PORT} as {USER}...")
    client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
    print("[OK] SSH Connection Successful!")

    commands = [
        "uname -a",
        "which node npm",
        "node -v",
        "npm -v",
        "pwd",
        "ls -la ~/domains/stevenarif.my.id/public_html/catatgaji",
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
except Exception as e:
    print("[ERROR] Connection Error:", e)
    sys.exit(1)
