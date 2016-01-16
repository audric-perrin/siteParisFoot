<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/usersInfo.php');
  require_once('../api/lag.php');
  if (isset($_GET['matchId'])) {
    $matchId = $_GET['matchId'];
  }
  else {
    echo ('Pas de matchId');
  }
  $bets = array();
  $match = array();
  $result = runQuery('SELECT * FROM bet WHERE matchId = ' . $matchId);
  foreach ($result as $row) {
    $bet = [
      'userId' => $row['userId'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur'],
      'coteResult' => $row['coteResult'],
      'coteScore' => $row['coteScore']
    ];
    $bets[] = $bet;
  }
  $result = runQuery('SELECT * FROM result WHERE id = ' . $matchId);
  foreach ($result as $row) {
    $match = [
      'matchId' => $row['id'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
  }
  $users = getUsersInfo();
  echo json_encode(array('bets' => $bets, 'match' => $match, 'users' => $users));
?>