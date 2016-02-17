<?php
  header('Content-Type: application/json');
  require_once('../api/lag.php');
  require_once('../php/sql.php');
  require_once('../lib/usersInfo.php');
  if (isset($_POST['email'])) {
    $result = runQuery('
      UPDATE `user` 
      SET `email`= "' . addslashes($_POST['email']) . '"
      WHERE id = ' . $_SESSION['id']);
    echo json_encode(array('result' => 'ok'));
  }
  else if (isset($_POST['pseudo'])) {
    $result = runQuery('
      UPDATE `user` 
      SET `pseudo`= "' . addslashes($_POST['pseudo']) . '"
      WHERE id = ' . $_SESSION['id']);
    echo json_encode(array('result' => 'ok'));
  }
  else if (isset($_POST['username'])) {
    $result = runQuery('
      UPDATE `user` 
      SET `username`= "' . addslashes($_POST['username']) . '"
      WHERE id = ' . $_SESSION['id']);
    echo json_encode(array('result' => 'ok'));
  }
  else {  
    $user = getUserInfo();
    echo json_encode(array('user' => $user));
  }
?>