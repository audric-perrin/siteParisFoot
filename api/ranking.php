<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  require_once('../lib/userRanking.php');
  $currentRound = currentRound();
  $round = array();
  for ($i = 1; $i <= maxround(); $i++) {
    $round[] = $i;
  }
  $generalRanking = getUserRanking([14,15,16,17,18]);
  echo json_encode($generalRanking);
?>