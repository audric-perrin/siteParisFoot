<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  function currentRound() {
    $currentRound = 1;
    $result = runQuery('SELECT round FROM result WHERE scoreDomicile != -1 ORDER BY date DESC LIMIT 1');
    foreach ($result as $row) {
      $currentRound = $row['round'];
    }
    return $currentRound;
  }
  function currentMonth() {
    $currentMonth = 0;
    $result = runQuery('SELECT date FROM result WHERE scoreDomicile != -1 ORDER BY date DESC LIMIT 1');
    foreach ($result as $row) {
      $currentMonth = date("m",strtotime($row['date']));
    }
    return $currentMonth;
  }
  function currentSaison() {
    $currentSaison = 0;
    $result = runQuery('SELECT saison FROM result WHERE scoreDomicile != -1 ORDER BY date DESC LIMIT 1');
    foreach ($result as $row) {
      $currentSaison = $row['saison'];
    }
    return $currentSaison;
  }
  function maxRound() {
    $maxRound = 1;
    $result = runQuery('SELECT round FROM result ORDER BY round DESC LIMIT 1');
    foreach ($result as $row) {
      $maxRound = $row['round'];
    }
    return $maxRound;
  }
  function getUsers() {
    $users = array();
    $result = runQuery('SELECT * FROM user');
    foreach ($result as $row) {
      $users[$row['id']] = $row['pseudo'];
    }
    return $users;
  }
?>