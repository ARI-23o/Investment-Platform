<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$settingsFile = $dataDir . '/settings.json';
$cacheFile = $dataDir . '/products_cache.json';

function getSettings($file) {
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        if ($raw) {
            $data = json_decode($raw, true);
            if (is_array($data)) return $data;
        }
    }
    return [
        'googleSheetWebhook' => '',
        'updated_at' => date('c')
    ];
}

function saveSettings($file, $data) {
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$settings = getSettings($settingsFile);

if ($method === 'GET') {
    echo json_encode($settings);
} elseif ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?? $_POST;
    if (is_array($input)) {
        $settings = array_merge($settings, $input);
        $settings['updated_at'] = date('c');
        saveSettings($settingsFile, $settings);
        
        // Invalidate cache
        if (file_exists($cacheFile)) {
            @unlink($cacheFile);
        }
        echo json_encode(['success' => true, 'settings' => $settings]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    }
}
