<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $currentRound = 1;
  $result = runQuery('SELECT round FROM result WHERE scoreDomicile != -1 ORDER BY date DESC LIMIT 1');
  foreach ($result as $row) {
    $currentRound = $row['round'];
  }
  $maxRound = 1;
  $result = runQuery('SELECT round FROM result ORDER BY round DESC LIMIT 1');
  foreach ($result as $row) {
    $maxRound = $row['round'];
  }
  echo json_encode(array('currentRound' => intval($currentRound), 'maxRound' => intval($maxRound)));
?>