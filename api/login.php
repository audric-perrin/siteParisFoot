<?php
  session_start();
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  if (isset($_POST['username']) and isset($_POST['password'])) {
    $result = runQuery('SELECT id FROM user WHERE username = "' . $_POST['username'] . '" AND password = "' . $_POST['password'] . '"');
    $count = 0;
    $id = null;
    foreach ($result as $row) {
      $count ++;
      $id = $row['id'];
    }
    if ($count == 0) {
      echo json_encode(array('result' => 'Combinaison Pseudo/Mot de passe incorrecte. Réessayer.'));
    }
    else {
      $_SESSION['id'] = $id;
      echo json_encode(array('result' => 'ok'));
    }
  }
  else {
    echo json_encode(array('result' => 'FATAL ERROR!'));
  }
?>
