<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/general.php');
  function getUsersInfo() {
    $result = runQuery('SELECT * FROM user ORDER BY pseudo');
    foreach ($result as $row) {
      $users[] = array(
        'id' => $row['id'],
        'pseudo' => $row['pseudo']
      );
    }
    return $users;
  }
?>