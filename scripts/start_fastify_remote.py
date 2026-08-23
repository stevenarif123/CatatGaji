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
    # 1. Add PATH to ~/.bash_profile and ~/.bashrc
    'echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH" >> ~/.bash_profile',
    'echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH" >> ~/.bashrc',

    # 2. Write .env in catatgaji directory
    """cat << 'EOF' > ~/domains/stevenarif.my.id/public_html/catatgaji/.env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info
JWT_SECRET=kunci_rahasia_jwt_catatgaji_produksi_1234567890
CORS_ORIGIN=https://catatgaji.stevenarif.my.id
EOF""",

    # 3. Write .htaccess in catatgaji directory
    """cat << 'EOF' > ~/domains/stevenarif.my.id/public_html/catatgaji/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Reverse Proxy seluruh request /api/... dan /health ke Fastify Node.js di Port 3000
  RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
  RewriteRule ^health$ http://127.0.0.1:3000/health [P,L]

  # 2. File statis fisik yang ada di server
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 3. SPA Fallback: Rute UI React
  RewriteRule ^ index.html [L]
</IfModule>

Options -Indexes
EOF""",

    # 4. Kill existing node processes if any
    "pkill -f 'apps/api/dist/main.js' || true",

    # 5. Start Fastify in background using nohup
    "cd ~/domains/stevenarif.my.id/public_html/catatgaji && nohup /opt/alt/alt-nodejs20/root/usr/bin/node apps/api/dist/main.js > api.log 2>&1 &",
]

for cmd in commands:
    print(f"\n--- Running Command ---")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if out:
        print(out)
    if err:
        print("STDERR:", err)

# Wait 3 seconds for server startup
time.sleep(3)

# 6. Check api.log and health endpoint
print("\n--- Checking api.log ---")
stdin, stdout, stderr = client.exec_command("cat ~/domains/stevenarif.my.id/public_html/catatgaji/api.log")
print(stdout.read().decode('utf-8', errors='ignore').strip())

print("\n--- Testing Local curl http://127.0.0.1:3000/health ---")
stdin, stdout, stderr = client.exec_command("curl -s http://127.0.0.1:3000/health")
print(stdout.read().decode('utf-8', errors='ignore').strip())

print("\n--- Testing Public curl https://catatgaji.stevenarif.my.id/health ---")
stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health")
print(stdout.read().decode('utf-8', errors='ignore').strip())

client.close()
