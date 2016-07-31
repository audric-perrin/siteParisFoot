<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/general.php');
  require_once('../api/lag.php');
  $round = $_GET['round'];
  $saison = currentSaison();
  if (isset($_GET['saison'])) {
    $saison = $_GET['saison'];
  }
  $userId = 0;
  $userBets = array();
  $matchs = array();
  $userId = intval($_GET['user']);
  $matchsRoundQuery = 'SELECT * FROM result WHERE round = ' . $round . ' AND saison = "' . $saison . '" ORDER BY date';
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