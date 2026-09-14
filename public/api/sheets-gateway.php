<?php
/**
 * GSP Investment Portal - Secure Google Sheets Gateway
 * Server-Side Proxy for Google Sheets Integration & Lead Forwarding
 * 
 * Features:
 * 1. Hides Google Sheets & Webhook URLs from client browser network traffic.
 * 2. Caches products server-side (60-second TTL) for super-fast page loads.
 * 3. Formats Google Drive, Google Photos, and =IMAGE() links to high-speed CDN URLs.
 * 4. Forwards lead submissions server-to-server with backup storage.
 * 5. Requires BCrypt Admin token for managing private settings.
 */

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
$authFile = $dataDir . '/admin_auth.json';
$cacheFile = $dataDir . '/products_cache.json';
$enquiriesFile = $dataDir . '/enquiries.json';

// Helper: Verify Admin Session Token
function verifyAdminToken($token, $authFile) {
    if (empty($token) || !file_exists($authFile)) return false;
    $raw = @file_get_contents($authFile);
    if (!$raw) return false;
    $data = json_decode($raw, true);
    if (!isset($data['sessions'][$token])) return false;
    $sess = $data['sessions'][$token];
    return (isset($sess['expires_at']) && $sess['expires_at'] > time());
}

// Helper: Get Settings
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

// Helper: Save Settings
function saveSettings($file, $data) {
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Helper: Convert Google Drive / Google Search / Google Photos / Dropbox / Web URLs to Direct High-Speed CDN URLs
function formatProductImageUrl($rawUrl) {
    if (empty($rawUrl) || !is_string($rawUrl)) return "";
    $url = trim($rawUrl);

    // 1. Google Sheets formulas: =IMAGE("https://...") or =HYPERLINK("https://...")
    if (preg_match('/=(?:IMAGE|HYPERLINK)\s*\(\s*["\']([^"\']+)["\']/i', $url, $m)) {
        $url = trim($m[1]);
    }

    // Strip quotes & spaces
    $url = trim($url, "\"'\t\n\r ");
    if (empty($url)) return "";

    // 2. Google Search / Image redirect link (e.g. google.com/imgres?imgurl=https%3A%2F%2F... or google.com/url?q=...)
    if (str_contains($url, 'google.') && (str_contains($url, 'imgurl=') || str_contains($url, 'url?q=') || str_contains($url, 'imgrefurl='))) {
        $parsed = parse_url($url);
        if (!empty($parsed['query'])) {
            parse_str($parsed['query'], $qParams);
            $target = $qParams['imgurl'] ?? $qParams['q'] ?? $qParams['url'] ?? '';
            if (!empty($target) && str_starts_with($target, 'http')) {
                $url = urldecode($target);
            }
        }
    }

    // 3. Google Drive Sharing Link: drive.google.com/file/d/{FILE_ID}
    if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i', $url, $m)) {
        return 'https://lh3.googleusercontent.com/d/' . $m[1] . '=w1000';
    }

    // 4. Google Drive open?id={FILE_ID}, uc?id={FILE_ID}, thumbnail?id={FILE_ID}, uc?export=view&id={FILE_ID}
    if (preg_match('/drive\.google\.com\/(?:open|uc|thumbnail|file)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i', $url, $m)) {
        return 'https://lh3.googleusercontent.com/d/' . $m[1] . '=w1000';
    }

    // 5. Google Drive view/sharing short links or /d/{FILE_ID}
    if (preg_match('/drive\.google\.com\/.*\/d\/([a-zA-Z0-9_-]+)/i', $url, $m)) {
        return 'https://lh3.googleusercontent.com/d/' . $m[1] . '=w1000';
    }

    // 6. Raw Google Drive File ID (28 to 45 chars)
    if (preg_match('/^[a-zA-Z0-9_-]{28,45}$/', $url) && !str_contains($url, 'http') && !str_contains($url, '/') && !str_contains($url, '.')) {
        return 'https://lh3.googleusercontent.com/d/' . $url . '=w1000';
    }

    // 7. Google UserContent link
    if (str_contains($url, 'googleusercontent.com') && !str_contains($url, '=w') && !str_contains($url, '=s')) {
        return $url . '=w1000';
    }

    // 8. Dropbox link
    if (str_contains($url, 'dropbox.com')) {
        $url = preg_replace('/[?&]dl=0/i', '', $url);
        $url = preg_replace('/[?&]raw=1/i', '', $url);
        return $url . (str_contains($url, '?') ? '&raw=1' : '?raw=1');
    }

    // 9. Imgur direct link
    if (str_contains($url, 'imgur.com') && !str_contains($url, 'i.imgur.com') && !str_contains($url, '.png') && !str_contains($url, '.jpg')) {
        $parts = explode('/', rtrim($url, '/'));
        $imgurId = preg_replace('/[^a-zA-Z0-9]/', '', end($parts));
        if (!empty($imgurId)) return 'https://i.imgur.com/' . $imgurId . '.png';
    }

    return $url;
}

// Helper: Scan row for any image URL if not found in standard columns
function scanRowForImageUrlPHP($row) {
    if (!is_array($row)) return "";
    foreach ($row as $k => $v) {
        $val = trim((string)$v);
        if (empty($val)) continue;
        if (
            str_contains($val, 'drive.google.com') ||
            str_contains($val, 'googleusercontent.com') ||
            str_starts_with($val, 'http://') ||
            str_starts_with($val, 'https://') ||
            str_starts_with($val, '=IMAGE') ||
            str_starts_with($val, '=HYPERLINK') ||
            preg_match('/\.(png|jpg|jpeg|webp|svg|gif|bmp)(\?.*)?$/i', $val)
        ) {
            return $val;
        }
    }
    return "";
}

// Helper: Case-Insensitive & Flexible Column Extractor
function getCleanField($row, ...$keys) {
    if (!is_array($row)) return "";
    $cleanMap = [];
    foreach ($row as $k => $v) {
        $cleanK = strtolower(preg_replace('/[^a-z0-9]/', '', (string)$k));
        $cleanMap[$cleanK] = $v;
    }
    foreach ($keys as $k) {
        $cleanK = strtolower(preg_replace('/[^a-z0-9]/', '', (string)$k));
        if (isset($cleanMap[$cleanK]) && trim((string)$cleanMap[$cleanK]) !== "") {
            return $cleanMap[$cleanK];
        }
    }
    return "";
}

// Helper: Normalize Raw Product Row into Standard Product Schema
function normalizeProductRow($row, $index = 0) {
    if (!is_array($row)) return null;

    $rawName = getCleanField($row, "name", "share name", "share_name", "company name", "company", "title", "product", "stock");
    if (empty($rawName) || trim((string)$rawName) === "") return null;
    $name = trim((string)$rawName);

    $rawShort = getCleanField($row, "short name", "short_name", "shortname", "code", "ticker", "symbol");
    $shortName = $rawShort ? trim((string)$rawShort) : explode(" ", $name)[0];

    $rawId = getCleanField($row, "id", "code", "isin") ?: $shortName ?: ("share_" . ($index + 1));
    $id = strtolower(preg_replace('/[^a-z0-9_-]/', '_', trim((string)$rawId)));
    $code = strtoupper(trim((string)(getCleanField($row, "code", "ticker", "symbol") ?: $shortName)));

    $rawPrice = getCleanField($row, "price", "share price", "share_price", "rate", "cmp", "current price", "price inr", "share price inr");
    $price = (float)preg_replace('/[^0-9.]/', '', (string)$rawPrice);

    $rawLot = getCleanField($row, "lot size", "lot_size", "lot", "min qty", "min_qty", "min quantity", "minimum quantity");
    $lotSize = (int)preg_replace('/[^0-9]/', '', (string)$rawLot);
    if ($lotSize <= 0) $lotSize = 100;

    $availableQty = trim((string)(getCleanField($row, "available quantity", "available_quantity", "available qty", "available_qty", "available", "qty", "quantity", "total shares") ?: "Available on Desk"));

    $rawImage = getCleanField($row, "image url", "image_url", "image", "imageurl", "logo", "logo url", "photo", "icon", "image link", "imagelink", "drive link", "googledrive", "google drive", "photo url", "picture", "img", "link", "media", "avatar");
    if (empty($rawImage)) {
        $rawImage = scanRowForImageUrlPHP($row);
    }
    $image = formatProductImageUrl($rawImage);

    $category = trim((string)(getCleanField($row, "category", "sector", "industry", "type") ?: "Unlisted Shares"));
    $sector = trim((string)(getCleanField($row, "sector", "category", "industry") ?: "Financial Services"));
    $isin = trim((string)(getCleanField($row, "isin", "isin code", "isin_code", "isin number") ?: ""));
    $status = strtoupper(trim((string)(getCleanField($row, "status", "active") ?: "ACTIVE")));

    $rawHigh52 = trim((string)getCleanField($row, "52w high", "52w_high", "52 high", "high52", "high"));
    $high52 = $rawHigh52 ? (str_starts_with($rawHigh52, "₹") ? $rawHigh52 : "₹" . $rawHigh52) : "";

    $rawLow52 = trim((string)getCleanField($row, "52w low", "52w_low", "52 low", "low52", "low"));
    $low52 = $rawLow52 ? (str_starts_with($rawLow52, "₹") ? $rawLow52 : "₹" . $rawLow52) : "";

    $rawMarketCap = trim((string)getCleanField($row, "market cap", "market_cap", "marketcap", "mcap", "market capitalization"));
    $marketCap = $rawMarketCap ? (str_starts_with($rawMarketCap, "₹") ? $rawMarketCap : "₹" . $rawMarketCap) : "";

    $description = trim((string)(getCleanField($row, "description", "about", "overview", "details") ?: "{$name} is an unlisted growth opportunity available for private secondary trading."));

    $rawPopular = getCleanField($row, "popular", "featured", "hot", "trending", "is popular");
    $popular = in_array(strtolower(trim((string)$rawPopular)), ["true", "yes", "1", "popular", "hot"], true);

    return [
        'id' => $id,
        'name' => $name,
        'shortName' => $shortName,
        'code' => $code,
        'category' => $category,
        'sector' => $sector,
        'price' => $price,
        'indicative' => true,
        'lotSize' => $lotSize,
        'availableQty' => $availableQty,
        'image' => $image,
        'isin' => $isin,
        'status' => $status,
        'high52' => $high52,
        'low52' => $low52,
        'marketCap' => $marketCap,
        'popular' => $popular,
        'description' => $description,
        'color' => 'emerald',
        'isFromSheet' => true,
        'isNew' => true,
        'createdAt' => time() * 1000
    ];
}

// Helper: HTTP Request via cURL or Stream Context
function fetchExternalData($url, $isPost = false, $postBody = null, $timeout = 12) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GSP-Investment-Gateway/2.0');
        if ($isPost) {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($postBody) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $postBody);
            }
        }
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($response !== false && $httpCode >= 200 && $httpCode < 400) {
            return $response;
        }
    }

    // Fallback: file_get_contents with stream context
    $opts = [
        'http' => [
            'method' => $isPost ? 'POST' : 'GET',
            'timeout' => $timeout,
            'ignore_errors' => true,
            'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) GSP-Investment-Gateway/2.0\r\n"
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ];
    if ($isPost && $postBody) {
        $bodyStr = is_array($postBody) ? http_build_query($postBody) : $postBody;
        $opts['http']['header'] .= "Content-Type: application/x-www-form-urlencoded\r\nContent-Length: " . strlen($bodyStr) . "\r\n";
        $opts['http']['content'] = $bodyStr;
    }
    $context = stream_context_create($opts);
    return @file_get_contents($url, false, $context);
}

// Helper: Parse Google Visualization API output
function parseGVizResponse($text) {
    if (empty($text)) return [];
    $start = strpos($text, '{');
    $end = strrpos($text, '}');
    if ($start === false || $end === false) return [];
    $json = json_decode(substr($text, $start, $end - $start + 1), true);
    if (!isset($json['table']['cols']) || !isset($json['table']['rows'])) return [];

    $headers = [];
    foreach ($json['table']['cols'] as $i => $c) {
        $headers[$i] = !empty($c['label']) ? trim($c['label']) : (!empty($c['id']) ? trim($c['id']) : "Col_{$i}");
    }

    $items = [];
    foreach ($json['table']['rows'] as $row) {
        if (!isset($row['c']) || !is_array($row['c'])) continue;
        $rowObj = [];
        $hasData = false;
        foreach ($row['c'] as $idx => $cell) {
            $h = $headers[$idx] ?? "Col_{$idx}";
            $val = "";
            if (isset($cell['v']) && $cell['v'] !== null) $val = $cell['v'];
            elseif (isset($cell['f']) && $cell['f'] !== null) $val = $cell['f'];
            $rowObj[$h] = $val;
            if ($val !== "" && $val !== null) $hasData = true;
        }
        if ($hasData) $items[] = $rowObj;
    }
    return $items;
}

// Helper: Parse CSV Output
function parseCSVResponse($csvText) {
    if (empty($csvText)) return [];
    $lines = preg_split('/\r\n|\r|\n/', trim($csvText));
    if (count($lines) < 2) return [];
    $headers = str_getcsv(array_shift($lines));
    $items = [];
    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $values = str_getcsv($line);
        $row = [];
        $hasData = false;
        foreach ($headers as $idx => $header) {
            $val = $values[$idx] ?? '';
            $row[$header] = $val;
            if (trim($val) !== '') $hasData = true;
        }
        if ($hasData) $items[] = $row;
    }
    return $items;
}

// Parse Incoming Request
$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true) ?? $_POST;
$action = $input['action'] ?? $_GET['action'] ?? 'get_products';
$settings = getSettings($settingsFile);

switch ($action) {
    // -------------------------------------------------------------
    // ACTION 1: GET PRODUCTS (SECURE SERVER-SIDE PROXY + CACHING)
    // -------------------------------------------------------------
    case 'get_products':
    case 'products':
        $force = isset($_GET['force']) || (isset($input['force']) && $input['force']);
        $cacheTTL = 60; // 60 seconds server caching

        // Return from cache if fresh and not forced
        if (!$force && file_exists($cacheFile)) {
            $cacheAge = time() - filemtime($cacheFile);
            if ($cacheAge < $cacheTTL) {
                $cachedRaw = @file_get_contents($cacheFile);
                $cachedData = json_decode($cachedRaw, true);
                if (is_array($cachedData) && !empty($cachedData['products'])) {
                    $cachedData['cached'] = true;
                    $cachedData['cache_age'] = $cacheAge;
                    echo json_encode($cachedData);
                    exit;
                }
            }
        }

        $webhookUrl = trim($settings['googleSheetWebhook'] ?? '');
        if (empty($webhookUrl)) {
            echo json_encode([
                'success' => true,
                'count' => 0,
                'products' => [],
                'message' => 'No Google Sheet URL is configured on server gateway.',
                'isDefault' => true
            ]);
            exit;
        }

        $rawList = [];

        // CASE A: Direct Google Spreadsheet URL (docs.google.com/spreadsheets/d/{id})
        if (preg_match('/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/', $webhookUrl, $sm)) {
            $sheetId = $sm[1];
            $tabs = ["Unlisted product", "Unlisted Product", "Products", "Shares", "Sheet1"];
            $fetchSuccess = false;

            foreach ($tabs as $tab) {
                $gvizUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/gviz/tq?tqx=out:json&sheet=" . urlencode($tab) . "&t=" . time();
                $respText = fetchExternalData($gvizUrl);
                if ($respText) {
                    $parsed = parseGVizResponse($respText);
                    if (!empty($parsed)) {
                        $rawList = $parsed;
                        $fetchSuccess = true;
                        break;
                    }
                }
            }

            if (!$fetchSuccess) {
                $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&t=" . time();
                $respText = fetchExternalData($csvUrl);
                if ($respText) {
                    $parsed = parseCSVResponse($respText);
                    if (!empty($parsed)) {
                        $rawList = $parsed;
                    }
                }
            }
        } 
        // CASE B: Google Apps Script Web App Webhook
        else {
            $separator = str_contains($webhookUrl, '?') ? '&' : '?';
            $fetchUrl = $webhookUrl . $separator . "action=products&t=" . time();
            $respText = fetchExternalData($fetchUrl);

            if ($respText) {
                $jsonData = json_decode($respText, true);
                if (is_array($jsonData)) {
                    if (isset($jsonData['products']) && is_array($jsonData['products'])) {
                        $rawList = $jsonData['products'];
                    } elseif (isset($jsonData['data']) && is_array($jsonData['data'])) {
                        $rawList = $jsonData['data'];
                    } elseif (isset($jsonData['rows']) && is_array($jsonData['rows'])) {
                        $rawList = $jsonData['rows'];
                    } elseif (isset($jsonData['items']) && is_array($jsonData['items'])) {
                        $rawList = $jsonData['items'];
                    } elseif (isset($jsonData['shares']) && is_array($jsonData['shares'])) {
                        $rawList = $jsonData['shares'];
                    } else {
                        $rawList = $jsonData;
                    }
                } else {
                    $rawList = parseGVizResponse($respText);
                    if (empty($rawList)) {
                        $rawList = parseCSVResponse($respText);
                    }
                }
            }
        }

        if (!empty($rawList)) {
            $normalized = [];
            foreach ($rawList as $idx => $row) {
                $norm = normalizeProductRow($row, $idx);
                if ($norm) $normalized[] = $norm;
            }

            if (!empty($normalized)) {
                $result = [
                    'success' => true,
                    'count' => count($normalized),
                    'products' => $normalized,
                    'lastSync' => date('c'),
                    'cached' => false,
                    'isDefault' => false
                ];

                @file_put_contents($cacheFile, json_encode($result, JSON_PRETTY_PRINT));
                echo json_encode($result);
                exit;
            }
        }

        echo json_encode([
            'success' => true,
            'count' => 0,
            'products' => [],
            'message' => 'No rows found in the configured Google Sheet.',
            'isDefault' => true
        ]);
        break;

    // -------------------------------------------------------------
    // ACTION 2: SYNC LEAD TO GOOGLE SHEET SERVER-TO-SERVER
    // -------------------------------------------------------------
    case 'sync_lead':
        $lead = $input['lead'] ?? $input;
        $webhookUrl = trim($settings['googleSheetWebhook'] ?? '');

        // Backup lead locally to server enquiries.json
        $enquiries = [];
        if (file_exists($enquiriesFile)) {
            $rawEnq = @file_get_contents($enquiriesFile);
            if ($rawEnq) $enquiries = json_decode($rawEnq, true) ?? [];
        }
        $leadEntry = [
            'id' => $lead['id'] ?? ('lead_' . time()),
            'time' => $lead['time'] ?? date('c'),
            'type' => $lead['type'] ?? 'BUY',
            'title' => $lead['title'] ?? $lead['share'] ?? 'General Enquiry',
            'quantity' => $lead['quantity'] ?? 1,
            'fullName' => $lead['fullName'] ?? $lead['name'] ?? '',
            'mobile' => $lead['mobile'] ?? '',
            'email' => $lead['email'] ?? '',
            'pan' => $lead['pan'] ?? '',
            'service' => $lead['service'] ?? 'Unlisted Shares',
            'message' => $lead['message'] ?? '',
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ];
        array_unshift($enquiries, $leadEntry);
        @file_put_contents($enquiriesFile, json_encode($enquiries, JSON_PRETTY_PRINT));

        // Forward to Google Sheet Webhook if configured
        $synced = false;
        if (!empty($webhookUrl)) {
            $postPayload = [
                'timestamp' => date('d/m/Y H:i:s'),
                'type' => $leadEntry['type'],
                'share' => $leadEntry['title'],
                'quantity' => $leadEntry['quantity'],
                'fullName' => $leadEntry['fullName'],
                'mobile' => $leadEntry['mobile'],
                'email' => $leadEntry['email'],
                'message' => $leadEntry['message'],
                'pan' => $leadEntry['pan'],
                'service' => $leadEntry['service']
            ];

            $response = fetchExternalData($webhookUrl, true, $postPayload, 10);
            $synced = ($response !== false);
        }

        echo json_encode([
            'success' => true,
            'synced' => $synced,
            'message' => $synced ? 'Lead synced to Google Sheet & saved.' : 'Lead saved securely to server.'
        ]);
        break;

    // -------------------------------------------------------------
    // ACTION 3: SAVE SETTINGS (REQUIRES AUTHENTICATED ADMIN TOKEN)
    // -------------------------------------------------------------
    case 'save_settings':
    case 'save_webhook':
        $token = trim($input['token'] ?? '');
        if (!verifyAdminToken($token, $authFile)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized. Active Admin Session Required.']);
            exit;
        }

        $newWebhook = trim($input['googleSheetWebhook'] ?? $input['webhookUrl'] ?? '');
        $settings['googleSheetWebhook'] = $newWebhook;
        $settings['updated_at'] = date('c');
        saveSettings($settingsFile, $settings);

        // Invalidate product cache so fresh sheet data loads
        if (file_exists($cacheFile)) {
            @unlink($cacheFile);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Google Sheet Webhook URL saved securely on server.',
            'googleSheetWebhook' => $newWebhook
        ]);
        break;

    // -------------------------------------------------------------
    // ACTION 4: GET SETTINGS (REQUIRES AUTHENTICATED ADMIN TOKEN)
    // -------------------------------------------------------------
    case 'get_settings':
        $token = trim($input['token'] ?? $_GET['token'] ?? '');
        if (!verifyAdminToken($token, $authFile)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'googleSheetWebhook' => $settings['googleSheetWebhook'] ?? '',
            'updated_at' => $settings['updated_at'] ?? ''
        ]);
        break;

    // -------------------------------------------------------------
    // DEFAULT / HEALTH CHECK
    // -------------------------------------------------------------
    default:
        echo json_encode([
            'status' => 'online',
            'service' => 'GSP Secure Google Sheets Gateway',
            'version' => '2.0',
            'cache_active' => file_exists($cacheFile),
            'has_webhook' => !empty($settings['googleSheetWebhook'])
        ]);
        break;
}
