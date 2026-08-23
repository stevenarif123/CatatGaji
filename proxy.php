<?php
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

$headers_list = explode("\r\n", $header_text);
foreach ($headers_list as $hdr) {
    if (!empty($hdr) && !preg_match('/^(Transfer-Encoding|Status):/i', $hdr)) {
        header($hdr);
    }
}

echo $response_body;
