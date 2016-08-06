<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  $currentMonth = currentMonth();
  $currentRound = currentRound();
  //Selection des classements par saison
  $saison = array();
  $result = runQuery('SELECT DISTINCT saison FROM result');
  foreach ($result as $row) {
    $saison[] = array('label' => 'Saison ' . $row['saison'], 'value' => $row['saison']);
  }
  echo json_encode(array('saison' => $saison));
?>