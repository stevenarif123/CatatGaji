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

# 1. Create proxy.php
proxy_php = """<?php
// Transparent Fastify Reverse Proxy Bridge for Hostinger LiteSpeed
$backend_host = 'http://127.0.0.1:3000';
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$ch = curl_init($backend_host . $request_uri);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$body = file_get_contents('php://input');
if ($body !== false && strlen($body) > 0) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$forward_headers = [];
$content_type_set = false;
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
        $lname = strtolower($name);
        if ($lname !== 'host' && $lname !== 'content-length') {
            $forward_headers[] = "$name: $value";
        }
        if ($lname === 'content-type') {
            $content_type_set = true;
        }
    }
}
if (!$content_type_set && !empty($_SERVER['CONTENT_TYPE'])) {
    $forward_headers[] = "Content-Type: " . $_SERVER['CONTENT_TYPE'];
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $forward_headers);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Layanan Backend Node.js Fastify belum merespon: ' . curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$header_text = substr($response, 0, $header_size);
$response_body = substr($response, $header_size);

http_response_code($http_code ?: 200);

$headers_list = explode("\\r\\n", $header_text);
foreach ($headers_list as $hdr) {
    if (!empty($hdr) && !preg_match('/^(Transfer-Encoding|Status):/i', $hdr)) {
        header($hdr);
    }
}

echo $response_body;
"""

htaccess_content = """<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Forward API & Health requests to proxy.php
  RewriteRule ^api/(.*)$ proxy.php [L,QSA]
  RewriteRule ^health$ proxy.php [L,QSA]

  # 2. Allow direct access to existing files & directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 3. SPA Fallback: All other routes to index.html
  RewriteRule ^ index.html [L]
</IfModule>

Options -Indexes
"""

print("Writing proxy.php and .htaccess to server...", flush=True)
cmd1 = f"cat << 'EOF' > {REMOTE_ROOT}/proxy.php\n{proxy_php}\nEOF"
client.exec_command(cmd1)

cmd2 = f"cat << 'EOF' > {REMOTE_ROOT}/.htaccess\n{htaccess_content}\nEOF"
client.exec_command(cmd2)

time.sleep(1)

print("\n--- Testing Public Health Endpoint (https://catatgaji.stevenarif.my.id/health) ---", flush=True)
stdin, stdout, stderr = client.exec_command("curl -s https://catatgaji.stevenarif.my.id/health")
print(clean(stdout.read().decode('utf-8', errors='ignore')), flush=True)

print("\n--- Testing Public API Registration Endpoint ---", flush=True)
stdin, stdout, stderr = client.exec_command("curl -s -X POST https://catatgaji.stevenarif.my.id/api/v1/auth/register-tenant -H 'Content-Type: application/json' -d '{}'")
print(clean(stdout.read().decode('utf-8', errors='ignore')), flush=True)

client.close()
