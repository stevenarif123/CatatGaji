import paramiko

HOST = "145.223.108.248"
PORT = 65002
USER = "u496707900"
PASS = "Mantapfb1_"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)

commands = [
    "ls -la /opt/alt/ 2>/dev/null",
    "ls -la /opt/alt/alt-nodejs* 2>/dev/null",
    "ls -la /usr/local/ 2>/dev/null",
    "find /opt -name 'node' 2>/dev/null",
    "find /usr -name 'node' 2>/dev/null",
    "ls -la ~/.nvm 2>/dev/null",
    "cat /etc/os-release",
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
