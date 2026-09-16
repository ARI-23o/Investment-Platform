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

$usersFile = $dataDir . '/users.json';

function getUsers($file) {
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        if ($raw) {
            $data = json_decode($raw, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function saveUsers($file, $data) {
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$users = getUsers($usersFile);

switch ($method) {
    case 'GET':
        $phone = $_GET['phone'] ?? $_GET['mobile'] ?? '';
        if ($phone) {
            $found = null;
            foreach ($users as $u) {
                if (($u['phone'] ?? $u['mobile'] ?? '') === $phone) {
                    $found = $u;
                    break;
                }
            }
            if ($found) {
                echo json_encode(['success' => true, 'user' => $found]);
            } else {
                echo json_encode(['success' => false, 'error' => 'User not found']);
            }
        } else {
            echo json_encode($users);
        }
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;
        if (!empty($input)) {
            $phone = $input['phone'] ?? $input['mobile'] ?? '';
            $foundIndex = -1;
            foreach ($users as $idx => $u) {
                if (($u['phone'] ?? $u['mobile'] ?? '') === $phone && !empty($phone)) {
                    $foundIndex = $idx;
                    break;
                }
            }

            $userRecord = [
                'id' => $input['id'] ?? ('user_' . time() . '_' . rand(100, 999)),
                'name' => $input['name'] ?? $input['fullName'] ?? '',
                'phone' => $phone,
                'email' => $input['email'] ?? '',
                'pan' => $input['pan'] ?? '',
                'bank' => $input['bank'] ?? '',
                'accountNumber' => $input['accountNumber'] ?? '',
                'dpId' => $input['dpId'] ?? '',
                'registeredAt' => $input['registeredAt'] ?? date('c'),
                'updatedAt' => date('c')
            ];

            if ($foundIndex >= 0) {
                $users[$foundIndex] = array_merge($users[$foundIndex], $userRecord);
            } else {
                array_unshift($users, $userRecord);
            }

            saveUsers($usersFile, $users);
            echo json_encode(['success' => true, 'user' => $userRecord]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Empty payload']);
        }
        break;

    default:
        echo json_encode(['status' => 'online']);
        break;
}
