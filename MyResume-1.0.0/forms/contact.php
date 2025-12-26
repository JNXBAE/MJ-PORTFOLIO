<?php
// forms/contact.php
// PHPMailer SMTP version. Requires composer install: composer require phpmailer/phpmailer

header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php'; // adjust path if needed

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status'=>'error','message'=>'Method Not Allowed']);
    exit;
}

// sanitize inputs
$name    = trim(filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING));
$email   = trim(filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL));
$subject = trim(filter_var($_POST['subject'] ?? 'Portfolio Contact', FILTER_SANITIZE_STRING));
$message = trim(filter_var($_POST['message'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

if (!$email) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Please enter a valid email address.']);
    exit;
}

if (!$name || !$message) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Please fill in all required fields.']);
    exit;
}

/*
 * SMTP configuration
 * Replace these with your SMTP provider details.
 *
 * For Gmail:
 *  - set $smtpHost = 'smtp.gmail.com';
 *  - set SMTPAuth true, SMTPSecure 'ssl' or 'tls', Port 465 (ssl) or 587 (tls)
 *  - For Gmail use App Password (recommended) not your main password.
 */

$smtpHost = 'smtp.gmail.com';
$smtpUser = 'YOUR_EMAIL@gmail.com';        // e.g. jubair247987@gmail.com
$smtpPass = 'YOUR_APP_PASSWORD';           // create App Password in Gmail
$smtpPort = 587;                           // 587 for TLS, 465 for SSL
$smtpSecure = 'tls';                       // 'ssl' or 'tls'

$recipientEmail = 'jubair247987@gmail.com'; // where you want to receive contact emails
$recipientName  = 'Mohamed Jubair K';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;

    // Recipients
    $mail->setFrom($smtpUser, 'Website Contact Form');
    $mail->addAddress($recipientEmail, $recipientName);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "[Website] " . $subject;
    $body  = "<p><strong>Name:</strong> " . htmlentities($name) . "</p>";
    $body .= "<p><strong>Email:</strong> " . htmlentities($email) . "</p>";
    $body .= "<p><strong>Subject:</strong> " . htmlentities($subject) . "</p>";
    $body .= "<p><strong>Message:</strong><br>" . nl2br(htmlentities($message)) . "</p>";
    $mail->Body = $body;
    $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";

    $mail->send();

    echo json_encode(['status'=>'success','message'=>'Message sent. Thank you!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>"Mailer Error: {$mail->ErrorInfo}"]);
}
