<?php
$name = strip_tags($_POST['name']);
$phone = strip_tags($_POST['phone']);
$to_email = strip_tags($_POST['to-email']);
$site_name = strip_tags($_POST['site-name']);
$mes = strip_tags($_POST['message']);
$comments = strip_tags($_POST['comments']);

// Send Message
$toaddress = $to_email;
$subject = $site_name . ' заявка на обратный звонок.';
$mailcontent = "<b>Имя:</b> $name <br>
                <b>Телефон:</b> $phone";
$from = "default_themea@mai.ru <default_themea@mai.ru>";

$headers = "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: $from\r\n";
//$headers .= "Reply-To: $email\r\n";

if ($name != "" && $comments == "") { 
  mail($toaddress, "=?utf-8?B?".base64_encode($subject)."?=", $mailcontent, $headers);
}

?>