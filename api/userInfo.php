<?php
  session_start();
  header('Content-Type: application/json');
  // sleep(1);
  if (isset($_SESSION['id'])) {
    echo json_encode(array('id' => $_SESSION['id']));
  }
  else {
    echo json_encode(array('result' => 'not connected'));
  }
?>