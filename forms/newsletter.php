<?php
/**
 * Optimized for GoDaddy hosting
 * Author: Arthur Belanger
 * Email: arthur.belanger@maine.edu
 * https://github.com/MusicalViking/maineBreadOfLife
 * Date: 2025-06-04
 */

ob_start();

// Ensure session works on GoDaddy
if (ini_get('session.save_path') == '') {
    $sessionPath = __DIR__ . '/sessions';
    if (!file_exists($sessionPath)) {
        mkdir($sessionPath, 0755, true);
    }
    ini_set('session.save_path', $sessionPath);
}
session_start();

// Load configuration
define('BREAD_OF_LIFE_LOADED', true);
require_once(__DIR__ . '/../config.php');

// Generate CSRF token if not set
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Error logging function
function logError($message) {
    $logFile = __DIR__ . '/newsletter_errors.log';
    if (!file_exists(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    error_log(date('[Y-m-d H:i:s] ') . $message . "\n", 3, $logFile);
    $_SESSION['error'] = $message;
}

// Validate CSRF token
if ($_SERVER['REQUEST_METHOD'] === 'POST' && (
    !isset($_POST['csrf_token']) ||
    $_POST['csrf_token'] !== $_SESSION['csrf_token']
)) {
    logError('Security validation failed. Please try again.');
    $redirect_url = $_SERVER['HTTP_REFERER'] ?? '../index.html';
    $redirect_url .= (strpos($redirect_url, '?') !== false ? '&' : '?') . 'status=error&message=' . urlencode('Security validation failed. Please try again.');
    header('Location: ' . $redirect_url);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // reCAPTCHA validation
    if (defined('RECAPTCHA_SECRET_KEY') && isset($_POST['g-recaptcha-response'])) {
        $recaptchaResponse = $_POST['g-recaptcha-response'];
        $secretKey = RECAPTCHA_SECRET_KEY;
        $verifyResponse = false;

        if (function_exists('curl_version')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'secret' => $secretKey,
                'response' => $recaptchaResponse,
                'remoteip' => $_SERVER);
            $responseKeys = json_decode($result, true);
            $verifyResponse = true;
        } else {
            $url = 'https://www.google.com/recaptcha/api/siteverify';
            $data = [
                'secret' => $secretKey,
                'response' => $recaptchaResponse,
                'remoteip' => $_SERVER['REMOTE_ADDR']
            ];
            $options = [
                'http' => [
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data)
                ]
            ];
            $context = stream_context_create($options);
            $result = @file_get_contents($url, false, $context);
            if ($result !== false) {
                $responseKeys = json_decode($result, true);
                $verifyResponse = true;
            }
        }

        if ($verifyResponse && intval($responseKeys["success"]) !== 1) {
            logError('reCAPTCHA verification failed. Please try again.');
            $redirect_url = $_SERVER['HTTP_REFERER'] ?? '../index.html';
            $redirect_url .= (strpos($redirect_url, '?') !== false ? '&' : '?') . 'status=error&message=' . urlencode('reCAPTCHA verification failed. Please try again.');
            header('Location: ' . $redirect_url);
            exit();
        }
    }

    // Validate email
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        logError('Please enter a valid email address.');
        $redirect_url = $_SERVER['HTTP_REFERER'] ?? '../index.html';
        $redirect_url .= (strpos($redirect_url, '?') !== false ? '&' : '?') . 'status=error&message=' . urlencode('Please enter a valid email address.');
        header('Location: ' . $redirect_url);
        exit();
    }

    // Prevent duplicate submissions
    if (isset($_SESSION['last_email_submission']) && $_SESSION['last_email_submission'] === $email && time() - $_SESSION['last_submission_time'] < 3600) {
        $redirect_url = $_SERVER['HTTP_REFERER'] ?? '../index.html';
        $redirect_url .= (strpos($redirect_url, '?') !== false ? '&' : '?') . 'status=success&message=' . urlencode('You are already subscribed with this email address.');
        header('Location: ' . $redirect_url);
        exit();
    }

    // Prepare and send email
    $to = 'receptionist@mainebreadoflife.org';
    $subject = "New Newsletter Subscription";
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: Bread of Life <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'mainebreadoflife.org') . ">\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $message = "New newsletter subscription from: $email\r\n";
    $message .= "Submitted on: " . date('Y-m-d H:i:s') . "\r\n";
    $message .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\r\n";

    usleep(100000);
    $additional_params = ini_get('sendmail_path') ? '-fno-reply@' . ($_SERVER['HTTP_HOST'] ?? 'mainebreadoflife.org') : null;
    $mail_sent = mail($to, $subject, $message, $headers, $additional_params);

    $_SESSION['last_email_submission'] = $email;
    $_SESSION['last_submission_time'] = time();

    if ($mail_sent) {
        $subscriber_subject = "Thank you for subscribing to Bread of Life Newsletter";
        $subscriber_message = "Dear Subscriber,\r\n\r\n";
        $subscriber_message .= "Thank you for subscribing to the Bread of Life newsletter. ";
        $subscriber_message .= "You will now receive updates about our events, programs, and opportunities to help.\r\n\r\n";
        $subscriber_message .= "If you did not subscribe to this newsletter, we apologize and please disregard this email.\r\n\r\n";
        $subscriber_message .= "Warm regards,\r\n";
        $subscriber_message .= "The Bread of Life Team\r\n";
        $subscriber_message .= "https://mainebreadoflife.org";

        @mail($email, $subscriber_subject, $subscriber_message, $headers, $additional_params);
        $status = 'success';
        $message = 'Thank you for subscribing! You will receive a confirmation email shortly.';
    } else {
        $error_message = "Unable to process subscription.";
        if (function_exists('error_get_last') && error_get_last()['message']) {
            $error_message .= " Mail system error: " . error_get_last()['message'];
        }
        logError($error_message);
        $status = 'error';
        $message = 'Unable to process your subscription. Please try again later.';
    }

    $redirect_url = $_SERVER['HTTP_REFERER'] ?? '../index.html';
    $redirect_url .= (strpos($redirect_url, '?') !== false ? '&' : '?') . "status=$status&message=" . urlencode($message);
    header('Location: ' . $redirect_url);
    exit();
}

ob_end_flush();
?>
