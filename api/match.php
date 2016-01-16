<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $round = $_GET['round'];
  $matchsRoundQuery = 'SELECT * FROM result WHERE round = ' . $round . ' ORDER BY date';
  $result = runQuery($matchsRoundQuery);
  $matchs = array();
  foreach ($result as $row) {
    $match = [
    'matchId' => $row['id'],
    'teamDomicile' => $row['teamDomicile'],
    'teamExterieur' => $row['teamExterieur'],
    'scoreDomicile' => $row['scoreDomicile'],
    'scoreExterieur' => $row['scoreExterieur'],
    'date' => $row['date']
    ];
    $matchs[] = $match;
  }
  echo json_encode(array('match' => $matchs));
 ?>