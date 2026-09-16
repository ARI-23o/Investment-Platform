<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$enquiriesFile = $dataDir . '/enquiries.json';

function getEnquiries($file) {
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        if ($raw) {
            $data = json_decode($raw, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function saveEnquiries($file, $data) {
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$enquiries = getEnquiries($enquiriesFile);

switch ($method) {
    case 'GET':
        echo json_encode($enquiries);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;
        if (!empty($input)) {
            // Check if this is a status update
            if (($input['action'] ?? '') === 'update_status' || isset($input['status']) && isset($input['id']) && !isset($input['fullName'])) {
                $id = $input['id'] ?? '';
                $newStatus = $input['status'] ?? 'New';
                $found = false;
                foreach ($enquiries as &$enq) {
                    if (($enq['id'] ?? '') === $id) {
                        $enq['status'] = $newStatus;
                        $enq['status_updated_at'] = date('c');
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    saveEnquiries($enquiriesFile, $enquiries);
                    echo json_encode(['success' => true, 'id' => $id, 'status' => $newStatus]);
                    exit;
                }
            }

            // Create new lead / enquiry
            $entry = [
                'id' => $input['id'] ?? ('lead_' . time() . '_' . rand(100, 999)),
                'time' => $input['time'] ?? date('c'),
                'type' => $input['type'] ?? 'BUY',
                'title' => $input['title'] ?? $input['share'] ?? 'General Enquiry',
                'quantity' => $input['quantity'] ?? 1,
                'fullName' => $input['fullName'] ?? $input['name'] ?? '',
                'mobile' => $input['mobile'] ?? '',
                'email' => $input['email'] ?? '',
                'pan' => $input['pan'] ?? '',
                'service' => $input['service'] ?? 'Unlisted Shares',
                'message' => $input['message'] ?? '',
                'status' => $input['status'] ?? 'New',
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ];
            array_unshift($enquiries, $entry);
            saveEnquiries($enquiriesFile, $enquiries);
            echo json_encode(['success' => true, 'enquiry' => $entry]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Empty lead payload']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if ($id === 'all') {
            $enquiries = [];
            saveEnquiries($enquiriesFile, $enquiries);
            echo json_encode(['success' => true, 'message' => 'All enquiries cleared.']);
        } elseif (!empty($id)) {
            $enquiries = array_values(array_filter($enquiries, function($e) use ($id) {
                return ($e['id'] ?? '') !== $id;
            }));
            saveEnquiries($enquiriesFile, $enquiries);
            echo json_encode(['success' => true, 'message' => "Enquiry {$id} deleted."]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Missing ID']);
        }
        break;

    default:
        echo json_encode(['status' => 'online']);
        break;
}
