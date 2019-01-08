<?php

class SendEmail extends CApplicationComponent {
    private $username;
    private $password;
    private $fromName;

    public function __construct() {
        $this->username='sunny.sweden19@gmail.com';
        $this->password='Sunny1@388';
        $this->fromName='FillUP';
    }
    
    /**
     * Set sending smtp account
     * @param string $username
     * @param string $password
     * @param string $fromName
     */
    public function setAccount($username, $password, $fromName) {
        if(isset($username))
            $this->username=$username;
        if(isset($password))
            $this->password=$password;
        if(isset($fromName))
            $this->fromName=$fromName;
    }
    
    /**
     * Send email
     * @param string $from
     * @param string $to
     * @param string $subject
     * @param type $msg
     * @return boolean
     */
    public function sendEmail($from, $to, $subject, $msg) {
		
		// prepare email
		$headers = "From: " . strip_tags($from) . "\r\n";
		$headers .= "Reply-To: ". strip_tags($from) . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		// prepare email body
		$message = '<html><body>';
		$message .= $msg;
		$message .= "</body></html>";
		
		Yii::import('application.extensions.phpmailer.JPhpMailer');
		$mail = new JPhpMailer;
        
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'tls';
        $mail->Host = "smtp.gmail.com";
        $mail->Mailer = "smtp";
        // $mail->Port = 465;
        $mail->Port= 587;
        
		// $mail->IsSMTP();
		
        // $mail->SMTPDebug = 1;
		$mail->Username = $this->username;
		$mail->Password = $this->password;
		$mail->SetFrom($from, 'sunny.sweden19');
		$mail->Subject = $subject;
		$mail->AltBody = 'To view the message, please use an HTML compatible email viewer!';
		$mail->MsgHTML($message);

		$mail->AddAddress($to,'');
		if($mail->Send()) {
            return true;
        } else {
            return mail($to, $subject, $message, $headers);
        }
	}
}