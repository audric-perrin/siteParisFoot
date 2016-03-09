<?php
  session_start();
  header('Content-Type: application/json');
  require_once('../api/lag.php');
  require_once('../php/sql.php');
  require_once('../lib/usersInfo.php');
  if (isset($_POST['email']) && $_POST['email'] !== '') {
    $result = runQuery('SELECT email FROM user WHERE email = "' . addslashes($_POST['email']) . '"');
    $count = 0;
    foreach ($result as $row) {
      $count++;
    }
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
      echo json_encode(array('result' => 'Email invalide'));
    }
    else if ($count > 0) {
      echo json_encode(array('result' => 'Email déjà utilisé'));
    }
    else {
      $result = runQuery('
        UPDATE `user` 
        SET `email`= "' . addslashes($_POST['email']) . '"
        WHERE id = ' . $_SESSION['id']);
      echo json_encode(array('result' => 'ok'));
    }
  }
  else if (isset($_POST['pseudo']) && $_POST['pseudo'] !== '') {
    $result = runQuery('SELECT pseudo FROM user WHERE pseudo = "' . addslashes($_POST['pseudo']) . '"');
    $count = 0;
    foreach ($result as $row) {
      $count++;
    }
    if (strlen($_POST['pseudo']) > 25) {
      echo json_encode(array('result' => 'Pseudo < 25 caractères'));
    }
    else if ($count > 0) {
      echo json_encode(array('result' => 'Pseudo déjà utilisé'));
    }
    else {
      $result = runQuery('
        UPDATE `user` 
        SET `pseudo`= "' . addslashes($_POST['pseudo']) . '"
        WHERE id = ' . $_SESSION['id']);
      echo json_encode(array('result' => 'ok'));
    }
  }
  else if (isset($_POST['username']) && $_POST['username'] !== '') {
    $result = runQuery('SELECT username FROM user WHERE username = "' . addslashes($_POST['username']) . '"');
    $count = 0;
    foreach ($result as $row) {
      $count++;
    }
    if ($count > 0) {
      echo json_encode(array('result' => 'Identifiant déjà utilisé'));
    }
    else {    
      $result = runQuery('
        UPDATE `user` 
        SET `username`= "' . addslashes($_POST['username']) . '"
        WHERE id = ' . $_SESSION['id']);
      echo json_encode(array('result' => 'ok'));
    }
  }
  else if (isset($_POST['password']) && $_POST['password'] !== '' && $_POST['confirm'] !== '') {
    if ($_POST['password'] == $_POST['confirm']) {    
      $result = runQuery('
        UPDATE `user` 
        SET `password`= "' . addslashes($_POST['password']) . '"
        WHERE id = ' . $_SESSION['id']);
      echo json_encode(array('result' => 'ok'));
    }
    else {
      echo json_encode(array('result' => 'Confirmation incorrect'));
    }
  }
  else {  
    $user = getUserInfo();
    echo json_encode(array('user' => $user));
  }
?>