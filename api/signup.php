<?php  
  session_start();
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  if (
    isset($_POST['pseudo']) and $_POST['pseudo'] != ''
    and isset($_POST['email']) and $_POST['email'] != ''
    and isset($_POST['username']) and $_POST['username'] != ''
    and isset($_POST['password']) and $_POST['password'] != ''
  ) {
    $pseudo = $_POST['pseudo'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo json_encode(array('result' => 'Email invalide', 'field' => 'email'));
      exit;
    }
    if (strlen($pseudo) > 25) {
      echo json_encode(array('result' => 'Pseudo < 25 caractères', 'field' => 'pseudo'));
      exit;
    }
    $result = runQuery('
      SELECT username, email, pseudo FROM user 
      WHERE pseudo = "' . addslashes($pseudo) . '"
      OR email = "' . addslashes($email) . '"
      OR username = "' . addslashes($username) . '"
    ');
    $count = 0;
    $duplicate = null;
    foreach ($result as $row) {
      $count ++;
      $duplicate = $row;
    }
    if ($count > 0) {
      if ($duplicate['pseudo'] == $pseudo) {
        echo json_encode(array('result' => 'Pseudo indisponible', 'field' => 'pseudo'));
        exit;
      }
      if ($duplicate['email'] == $email) {
        echo json_encode(array('result' => 'Email déjà utilisée', 'field' => 'email'));
        exit;
      }
      if ($duplicate['username'] == $username) {
        echo json_encode(array('result' => 'Identifiant indisponible', 'field' => 'username'));
        exit;
      }
    }
    runQuery('
      INSERT INTO user(username, password, email, pseudo) 
      VALUES ("' . addslashes($username) . '", "' . addslashes($password) . '", "' . addslashes($email) . '", "' . addslashes($pseudo) . '") 
    ');
    $result = runQuery('
      SELECT id FROM user 
      WHERE username = "' . addslashes($username) . '" 
      AND password = "' . addslashes($password) . '" LIMIT 1');
    $id = 0;
    foreach ($result as $row) {
      $id = $row['id'];
    }
    $_SESSION['id'] = $id;
    echo json_encode(array('result' => 'ok'));
  }
  else {
    echo json_encode(array('result' => 'Veuillez remplir tout les champs'));
  }
?>