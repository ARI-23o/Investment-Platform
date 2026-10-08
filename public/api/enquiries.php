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

            // Create new lead / enquiry / loan application
            $entry = [
                'id' => $input['id'] ?? ('lead_' . time() . '_' . rand(100, 999)),
                'time' => $input['time'] ?? date('c'),
                'type' => $input['type'] ?? 'BUY',
                'title' => $input['title'] ?? $input['share'] ?? $input['loanType'] ?? 'General Enquiry',
                'quantity' => $input['quantity'] ?? 1,
                'fullName' => $input['fullName'] ?? $input['name'] ?? '',
                'mobile' => $input['mobile'] ?? '',
                'email' => $input['email'] ?? '',
                'pan' => $input['pan'] ?? '',
                'service' => $input['service'] ?? 'Unlisted Shares',
                'message' => $input['message'] ?? '',
                'status' => $input['status'] ?? 'New',
                // Loan specific fields
                'loanType' => $input['loanType'] ?? '',
                'loanAmount' => $input['loanAmount'] ?? '',
                'tenure' => $input['tenure'] ?? '',
                'employmentType' => $input['employmentType'] ?? '',
                'monthlyIncome' => $input['monthlyIncome'] ?? '',
                'city' => $input['city'] ?? '',
                'pincode' => $input['pincode'] ?? '',
                'existingEmi' => $input['existingEmi'] ?? '',
                'estimatedEmi' => $input['estimatedEmi'] ?? '',
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ];
            array_unshift($enquiries, $entry);
            saveEnquiries($enquiriesFile, $enquiries);

            // =========================================================================
            // INSTANT EMAIL NOTIFICATION TO gspbackoffice6@gmail.com
            // =========================================================================
            $to = 'gspbackoffice6@gmail.com';
            $host = $_SERVER['HTTP_HOST'] ?? 'gspinvestment.com';
            $cleanHost = preg_replace('/:[0-9]+$/', '', $host);
            $senderDomain = (!empty($cleanHost) && $cleanHost !== 'localhost' && !preg_match('/^[0-9\.]+$/', $cleanHost)) ? $cleanHost : 'gspinvestment.com';
            $fromEmail = "noreply@" . $senderDomain;

            $isLoan = (strtolower($entry['type']) === 'loan' || !empty($entry['loanAmount']) || !empty($entry['loanType']));
            $subjType = $isLoan ? "🚨 New Loan Application" : "💼 New Lead Enquiry";
            $subject = "{$subjType}: {$entry['title']} - {$entry['fullName']} [{$entry['mobile']}]";

            $formattedAmount = !empty($entry['loanAmount']) ? ("₹" . number_format(floatval($entry['loanAmount']), 2)) : ($entry['quantity'] > 1 ? "{$entry['quantity']} shares" : "N/A");
            
            $message = "
            <html>
            <head><title>{$subject}</title></head>
            <body style='font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #333;'>
              <div style='max-width: 620px; margin: 0 auto; background: #ffffff; padding: 25px 30px; border-radius: 12px; border: 1px solid #e1e8ed;'>
                <div style='text-align: center; border-bottom: 2px solid " . ($isLoan ? "#d97706" : "#0d652d") . "; padding-bottom: 15px; margin-bottom: 20px;'>
                  <h2 style='color: #063321; margin: 0; font-size: 22px;'>GSP Investment Portal</h2>
                  <p style='color: " . ($isLoan ? "#b45309" : "#0d652d") . "; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase; font-size: 13px;'>
                    " . ($isLoan ? "CREDIT & LOAN APPLICATION DESK" : "CENTRAL ENQUIRY & WEALTH DESK") . "
                  </p>
                </div>
                
                <p style='font-size: 14px; margin-top: 0;'>A new customer inquiry has just been submitted on the portal:</p>
                
                <table style='width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px;'>
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;'>Enquiry Type</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'><strong style='color: " . ($isLoan ? "#b45309" : "#0d652d") . ";'>" . strtoupper($entry['type']) . "</strong></td>
                  </tr>
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Product / Service</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'><strong>{$entry['title']}</strong></td>
                  </tr>
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Customer Name</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['fullName']}</td>
                  </tr>
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Mobile Number</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>
                      <a href='tel:{$entry['mobile']}' style='color: #0d652d; font-weight: bold; text-decoration: none;'>{$entry['mobile']}</a>
                      &nbsp;|&nbsp;
                      <a href='https://wa.me/" . preg_replace('/[^0-9]/', '', $entry['mobile']) . "' style='color: #16a34a; font-weight: bold; text-decoration: none;'>Chat on WhatsApp &rarr;</a>
                    </td>
                  </tr>
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Email Address</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'><a href='mailto:{$entry['email']}'>{$entry['email']}</a></td>
                  </tr>";

            if ($isLoan) {
                $message .= "
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Loan Amount Requested</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'><strong style='color: #b45309; font-size: 15px;'>{$formattedAmount}</strong></td>
                  </tr>
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Tenure</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['tenure']}</td>
                  </tr>
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Employment / Profession</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['employmentType']}</td>
                  </tr>
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Monthly Income / Turnover</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['monthlyIncome']}</td>
                  </tr>
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>City / Pincode</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['city']} " . (!empty($entry['pincode']) ? "({$entry['pincode']})" : "") . "</td>
                  </tr>";
            }

            if (!empty($entry['pan'])) {
                $message .= "
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>PAN / ID</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;'>{$entry['pan']}</td>
                  </tr>";
            }

            if (!empty($entry['message'])) {
                $message .= "
                  <tr>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Client Notes / Remarks</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'><em>{$entry['message']}</em></td>
                  </tr>";
            }

            $message .= "
                  <tr style='background-color: #f8fafc;'>
                    <td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Received At</td>
                    <td style='padding: 10px; border: 1px solid #e2e8f0;'>{$entry['time']}</td>
                  </tr>
                </table>
                
                <div style='text-align: center; margin-top: 25px;'>
                  <a href='https://wa.me/" . preg_replace('/[^0-9]/', '', $entry['mobile']) . "?text=Hello%20{$entry['fullName']}%2C%20thank%20you%20for%20contacting%20GSP%20Investment%20regarding%20{$entry['title']}.' 
                     style='background: #16a34a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;'>
                    Contact on WhatsApp
                  </a>
                  <a href='tel:{$entry['mobile']}' 
                     style='background: #0f4b32; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;'>
                    Call Customer
                  </a>
                </div>
                
                <hr style='border: none; border-top: 1px solid #eee; margin: 25px 0;' />
                <p style='font-size: 11px; color: #888; text-align: center; margin: 0;'>GSP Investment Portal • Automated Notification Gateway</p>
              </div>
            </body>
            </html>
            ";

            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=UTF-8\r\n";
            $headers .= "From: GSP Desk <{$fromEmail}>\r\n";
            $headers .= "Reply-To: {$entry['email']}\r\n";
            $headers .= "Return-Path: {$fromEmail}\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

            @mail($to, $subject, $message, $headers, "-f {$fromEmail}");

            // Try forwarding to Google Apps Script Webhook if configured
            $settingsFile = $dataDir . '/settings.json';
            if (file_exists($settingsFile)) {
                $settingsRaw = @file_get_contents($settingsFile);
                if ($settingsRaw) {
                    $setts = json_decode($settingsRaw, true);
                    $wh = $setts['googleSheetWebhook'] ?? '';
                    if (!empty($wh) && filter_var($wh, FILTER_VALIDATE_URL)) {
                        $postPayload = json_encode([
                            'action' => 'send_notification',
                            'to' => $to,
                            'subject' => $subject,
                            'htmlBody' => $message,
                            'lead' => $entry
                        ]);
                        $opts = [
                            'http' => [
                                'method' => 'POST',
                                'header' => "Content-Type: application/json\r\n",
                                'content' => $postPayload,
                                'timeout' => 3
                            ]
                        ];
                        $context = stream_context_create($opts);
                        @file_get_contents($wh, false, $context);
                    }
                }
            }

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
