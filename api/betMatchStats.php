<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  require_once('../lib/teamRanking.php');
  require_once('../lib/userRanking.php');
  $matchInfo = getUserRanking([15]);
  echo json_encode($matchInfo);
?>