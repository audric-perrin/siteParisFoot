<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  // sleep(1);
  $round = $_GET['round'];
  $userId = 0;
  $userBets = array();
  $matchs = array();
  if ($_GET['user'] == 'me') {
    $userId = $_SESSION['id'];
  }
  $matchsRoundQuery = 'SELECT * FROM result WHERE round = ' . $round . ' ORDER BY date';
  $result = runQuery($matchsRoundQuery);
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
  $result = runQuery('SELECT * FROM bet WHERE userId = ' . $userId);
  foreach ($result as $row) {
    $userBets[$row['matchId']] = [
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur'],
      'coteResult' => $row['coteResult'],
      'coteScore' => $row['coteScore']
    ];
  }
  echo json_encode(array('userBets' => $userBets, 'matchs' => $matchs));
?>