<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST['subject']), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);
    
    // Validate data
    $errors = [];
    
    // Name validation
    if (empty($name)) {
        $errors[] = "Please enter your name.";
    } elseif (strlen($name) < 2) {
        $errors[] = "Name must be at least 2 characters.";
    }
    
    // Email validation
    if (empty($email)) {
        $errors[] = "Please enter your email address.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    // Subject validation
    if (empty($subject)) {
        $errors[] = "Please enter a subject.";
    } elseif (strlen($subject) < 3) {
        $errors[] = "Subject must be at least 3 characters.";
    }
    
    // Message validation
    if (empty($message)) {
        $errors[] = "Please enter your message.";
    } elseif (strlen($message) < 10) {
        $errors[] = "Message must be at least 10 characters.";
    }
    
    // If there are no errors, send the email
    if (empty($errors)) {
        // Your email address (where you want to receive messages)
        $to = "waqasahmed.rk@gmail.com";
        
        // Email subject with prefix for easy filtering
        $email_subject = "Portfolio Contact: " . $subject;
        
        // Email headers
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Portfolio Contact Form <no-reply@yourdomain.com>\r\n";
        $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Email body with professional HTML formatting
        $email_body = '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Message</title>
            <style>
                body {
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .email-container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .email-header {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                .email-content {
                    padding: 30px;
                }
                .message-details {
                    background-color: #f8fafc;
                    border-left: 4px solid #2563eb;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .detail-row {
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .detail-row:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .label {
                    font-weight: 600;
                    color: #1e293b;
                    display: block;
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                .value {
                    color: #475569;
                    font-size: 16px;
                }
                .message-content {
                    background-color: #f1f5f9;
                    padding: 20px;
                    border-radius: 6px;
                    margin-top: 20px;
                    border: 1px solid #e2e8f0;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #64748b;
                    font-size: 14px;
                    background-color: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                }
                .cta-button {
                    display: inline-block;
                    background-color: #2563eb;
                    color: white;
                    text-decoration: none;
                    padding: 12px 30px;
                    border-radius: 5px;
                    font-weight: 500;
                    margin-top: 20px;
                }
                .message-text {
                    white-space: pre-wrap;
                    line-height: 1.8;
                    color: #334155;
                }
                .timestamp {
                    color: #94a3b8;
                    font-size: 13px;
                    text-align: right;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>📬 New Message from Portfolio Contact Form</h1>
                    <p>A recruiter or potential client has contacted you</p>
                </div>
                
                <div class="email-content">
                    <div class="message-details">
                        <div class="detail-row">
                            <span class="label">👤 Contact Person</span>
                            <span class="value">' . htmlspecialchars($name) . '</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">📧 Email Address</span>
                            <span class="value">
                                <a href="mailto:' . htmlspecialchars($email) . '" style="color: #2563eb; text-decoration: none;">
                                    ' . htmlspecialchars($email) . '
                                </a>
                            </span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="label">📝 Subject</span>
                            <span class="value">' . htmlspecialchars($subject) . '</span>
                        </div>
                    </div>
                    
                    <div class="message-content">
                        <div class="label">💬 Message:</div>
                        <div class="message-text">' . nl2br(htmlspecialchars($message)) . '</div>
                    </div>
                    
                    <div class="timestamp">
                        📅 Received: ' . date("F j, Y, g:i a") . '
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:' . htmlspecialchars($email) . '" class="cta-button">
                            ✉️ Reply to ' . htmlspecialchars($name) . '
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This email was automatically generated from your portfolio website contact form.</p>
                    <p>💼 <strong>Waqas Ahmed - AI & Full Stack Developer Portfolio</strong></p>
                </div>
            </div>
        </body>
        </html>';
        
        // Attempt to send the email
        if (mail($to, $email_subject, $email_body, $headers)) {
            // Success - Also send auto-reply to the sender
            sendAutoReply($name, $email, $subject);
            
            // Return success response
            echo json_encode([
                'success' => true,
                'message' => '✅ Thank you for your message! I have received it and will get back to you within 24 hours.'
            ]);
        } else {
            // Email sending failed
            echo json_encode([
                'success' => false,
                'message' => '❌ Sorry, there was an error sending your message. Please try again later or contact me directly at waqasahmed.rk@gmail.com'
            ]);
        }
    } else {
        // Return validation errors
        echo json_encode([
            'success' => false,
            'message' => '❌ Please fix the following errors:<br>' . implode('<br>', $errors)
        ]);
    }
} else {
    // If not a POST request, redirect to homepage
    header('Location: index.html');
    exit();
}

// Function to send auto-reply to the sender
function sendAutoReply($name, $email, $subject) {
    $auto_reply_subject = "Thank you for contacting Waqas Ahmed";
    
    $auto_reply_body = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px; background: #f8fafc; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Thank You for Contacting Me!</h2>
            </div>
            <div class="content">
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                
                <p>Thank you for reaching out through my portfolio website. I have received your message regarding:</p>
                
                <p><strong>"' . htmlspecialchars($subject) . '"</strong></p>
                
                <p>I appreciate you taking the time to contact me. I typically respond to all inquiries within 24 hours.</p>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Browse my portfolio projects</li>
                    <li>Check out my GitHub repository</li>
                    <li>Connect with me on LinkedIn</li>
                </ul>
                
                <p><strong>Best regards,</strong><br>
                Waqas Ahmed<br>
                AI Developer & Full Stack Engineer<br>
                Email: waqasahmed.rk@gmail.com<br>
                Phone: (+92) 03476421106</p>
            </div>
            <div class="footer">
                <p>This is an automated response. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>';
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Waqas Ahmed <waqasahmed.rk@gmail.com>\r\n";
    $headers .= "Reply-To: waqasahmed.rk@gmail.com\r\n";
    
    mail($email, $auto_reply_subject, $auto_reply_body, $headers);
}

// Function to log contact form submissions (optional)
function logContactSubmission($name, $email, $subject, $message, $status) {
    $log_file = 'contact_log.csv';
    $timestamp = date('Y-m-d H:i:s');
    $ip_address = $_SERVER['REMOTE_ADDR'];
    
    $log_entry = [
        $timestamp,
        $ip_address,
        $name,
        $email,
        $subject,
        substr($message, 0, 100) . '...', // First 100 chars
        $status
    ];
    
    // Create log file if it doesn't exist
    if (!file_exists($log_file)) {
        $header = "Timestamp,IP Address,Name,Email,Subject,Message Preview,Status\n";
        file_put_contents($log_file, $header);
    }
    
    // Append log entry
    $file = fopen($log_file, 'a');
    fputcsv($file, $log_entry);
    fclose($file);
}
?>