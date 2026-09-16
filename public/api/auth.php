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

$authFile = $dataDir . '/admin_auth.json';

function getAuthData($file) {
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        if ($raw) {
            $data = json_decode($raw, true);
            if (is_array($data) && !empty($data["password_hash"])) {
                return $data;
            }
        }
    }
    $defaultHash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
    $initial = [
        'password_hash' => $defaultHash,
        'updated_at' => date('c'),
        'sessions' => []
    ];
    @file_put_contents($file, json_encode($initial, JSON_PRETTY_PRINT));
    return $initial;
}

function saveAuthData($file, $data) {
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function cleanSessions(&$sessions) {
    $now = time();
    $valid = [];
    foreach ($sessions as $token => $sess) {
        if (isset($sess['expires_at']) && $sess['expires_at'] > $now) {
            $valid[$token] = $sess;
        }
    }
    $sessions = $valid;
}


$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true) ?? $_POST;

$action = $input['action'] ?? $_GET['action'] ?? 'status';

$authData = getAuthData($authFile);
if (!isset($authData['sessions'])  || !is_array($authData["sessions"])) {
    $authData["sessions"] = [];
}
cleanSessions($authData['sessions']);

switch ($action) {
    case 'login':
        $password = trim($input['password'] ?? '');
        if (empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password is required.']);
            exit;
        }

        if (password_verify($password, $authData['password_hash'])) {
            $token = bin2hex(random_bytes(32));
            $expiresAt = time() + 1800; // 30 minutes inactivity window
            $authData['sessions'][$token] = [
                'created_at' => date('c'),
                'expires_at' => $expiresAt,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ];
            saveAuthData($authFile, $authData);

            echo json_encode([
                'success' => true,
                'token' => $token,
                'expires_at' => $expiresAt,
                'message' => 'Authentication successful'
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid Admin Password. Please check and try again.']);
        }
        break;

    case 'verify_session':
        $token = trim($input['token'] ?? '');
        if (!empty($token) && isset($authData['sessions'][$token])) {
            // Rolling 30-minute extension on active verification
            $authData['sessions'][$token]['expires_at'] = time() + 1800;
            saveAuthData($authFile, $authData);
            echo json_encode(['success' => true, 'valid' => true, 'expires_in' => 1800]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'valid' => false, 'error' => 'Session expired due to 30 minutes of inactivity.']);
        }
        break;

    case 'change_password':
        $token = trim($input['token'] ?? '');
        $currentPassword = trim($input['currentPassword'] ?? '');
        $newPassword = trim($input['newPassword'] ?? '');


        $isSessionValid = (!empty($token) && isset($authData['sessions'][$token]));
        $isCurrentPasswordValid = (!empty($currentPassword) && password_verify($currentPassword, $authData['password_hash']));


        if (!$isSessionValid && !$isCurrentPasswordValid) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Current password verification failed.']);
            exit;
        }


        if (strlen($newPassword) < 4) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'New password must be at least 4 characters long.']);
            exit;
        }


        $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $authData['password_hash'] = $newHash;
        $authData['updated_at'] = date('c');


        $authData['sessions'] = [];
        $newToken = bin2hex(random_bytes(32));
        $expiresAt = time() + 1800; // 30 minutes
        $authData['sessions'][$newToken] = [
            'created_at' => date('c'),
            'expires_at' => $expiresAt,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ];
        saveAuthData($authFile, $authData);

        echo json_encode([
            'success' => true,
            'token' => $newToken,
            'message' => 'Admin password has been securely updated and hashed with BCrypt on the server!'
        ]);
        break;


    case 'reset_to_default':
        $token = trim($input['token'] ?? '');
        if (empty($token) || !isset($authData['sessions'][$token])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized']);
            exit;
        }

        $defaultHash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
        $authData['password_hash'] = $defaultHash;
        $authData['updated_at'] = date('c');
        $authData['sessions'] = [];
        saveAuthData($authFile, $authData);

        echo json_encode(['success' => true, 'message' => 'Password reset to default successfully.']);
        break;


    case 'logout':
        $token = trim($input['token'] ?? '');
        if (!empty($token) && isset($authData['sessions'][$token])) {
            unset($authData['sessions'][$token]);
            saveAuthData($authFile, $authData);
        }
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;


    default:
        echo json_encode([
            'status' => 'online',
            'service' => 'GSP Investment Secure BCrypt Auth Gateway',
            'secure' => true,
            'updated_at' => $authData['updated_at'] ?? 'initial'
        ]);
        break;
}
