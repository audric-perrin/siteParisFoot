<?php
  header('Content-Type: application/json');
  require_once('../api/lag.php');
  require_once('../lib/usersInfo.php');
  $user = getUserInfo();
  echo json_encode(array('user' => $user));
 ?>