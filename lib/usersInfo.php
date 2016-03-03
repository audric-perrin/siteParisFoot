<?php
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
  function getUserInfo() {
    if (isset($_SESSION['id'])) {
      $result = runQuery('SELECT * FROM user WHERE id = ' . $_SESSION['id']);
      foreach ($result as $row) {        
        $user = array(
          'id' => $row['id'],
          'username' => $row['username'],
          'password' => $row['password'],
          'email' => $row['email'],
          'pseudo' => $row['pseudo']);
        return $user;
      }
    }
    else {
      return 'not connected';
    }
  }
?>