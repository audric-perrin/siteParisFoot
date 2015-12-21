<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $result = runQuery('SELECT * FROM user ORDER BY pseudo');
  $users = array();
  foreach ($result as $row) {
    if ($row['id'] == $_SESSION['id']) {
      array_unshift($users, array('id' => $row['id'], 'pseudo' => 'Mes paris'));
    }
    else {
      $users[] = array(
        'id' => $row['id'],
        'pseudo' => $row['pseudo']
      );
    }
  }
  echo json_encode(array('users' => $users));
?>