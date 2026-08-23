import paramiko
import time

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

# Test different .htaccess configurations
test_configs = [
    ("Config 1: http://127.0.0.1:3000", """<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
RewriteRule ^health$ http://127.0.0.1:3000/health [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
</IfModule>"""),

    ("Config 2: http://localhost:3000", """<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
RewriteRule ^health$ http://localhost:3000/health [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
</IfModule>"""),

    ("Config 3: proxy:http://127.0.0.1:3000", """<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^api/(.*)$ proxy:http://127.0.0.1:3000/api/$1 [P,L]
RewriteRule ^health$ proxy:http://127.0.0.1:3000/health [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
</IfModule>"""),
]

for name, htaccess in test_configs:
    print(f"\n==================== Testing {name} ====================")
    cmd = f"cat << 'EOF' > {REMOTE_ROOT}/.htaccess\n{htaccess}\nEOF"
    client.exec_command(cmd)
    time.sleep(1)
    
    stdin, stdout, stderr = client.exec_command("curl -s -o /dev/null -w '%{http_code}' https://catatgaji.stevenarif.my.id/health")
    code = stdout.read().decode('utf-8', errors='ignore').strip()
    print(f"HTTP Status: {code}")

    stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health | head -n 5")
    print(clean(stdout.read().decode('utf-8', errors='ignore')))

client.close()
