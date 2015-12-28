<?php
  session_start();
  header('Content-Type: application/json');
  if (!isset($_SESSION['id'])) {
    echo json_encode(array('error' => 'loggedOut'));
    exit;
  }
?>