<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');

  $sessionId = $_SESSION['id'];

  //Récupération des data
  function fetchUsers() {
    $users = array();
    $usersQuery = 'SELECT * FROM user';
    $result = runQuery($usersQuery);
    foreach ($result as $row) {
      $user = [
        'id' => $row['id'],
        'userName' => $row['pseudo']
      ];
      $users[] = $user;
    }
    return $users;
  }

  function fetchMatchs() {
    $matchs = array();
    $matchsQuery = 'SELECT * FROM result ORDER BY date';
    $result = runQuery($matchsQuery);
    foreach ($result as $row) {
      $match = [
        'id' => $row['id'],
        'saison' => $row['saison'],
        'date' => $row['date'],
        'month' => date_parse($row['date'])["month"],
        'teamDomicile' => $row['teamDomicile'],
        'teamExterieur' => $row['teamExterieur'],
        'scoreDomicile' => $row['scoreDomicile'],
        'scoreExterieur' => $row['scoreExterieur'],
        'round' => $row['round']
      ];
      $matchs[] = $match;
    }
    return $matchs;
  }

  function fetchBets() {    
    $bets = array();
    $betsQuery = 'SELECT * FROM bet';
    $result = runQuery($betsQuery);
    foreach ($result as $row) {
      $bet = [
        'userId' => $row['userId'],
        'matchId' => $row['matchId'],
        'scoreDomicile' => $row['scoreDomicile'],
        'scoreExterieur' => $row['scoreExterieur'],
        'coteResult' => $row['coteResult'],
        'coteScore' => $row['coteScore']
      ];
      $bets[] = $bet;
    }
    return $bets;
  }

  function processData($users, $matchs, $bets) {
    $listUsersBet = array();
    $userMap = array();
    foreach ($users as $user) {
      $userMap[$user['id']] = $user;
      $listUsersBet[$user['id']] = array();
    }
    $matchMap = array();
    foreach ($matchs as $match) {
      $dataMatch = [
        'saison' => $match['saison'],
        'date' => $match['date'],
        'month' => $match['month'],
        'teamDomicile' => $match['teamDomicile'],
        'teamExterieur' => $match['teamExterieur'],
        'scoreDomicile' => $match['scoreDomicile'],
        'scoreExterieur' => $match['scoreExterieur'],
        'round' => $match['round']
      ];
      $matchMap[$match['id']] = $dataMatch;
    }
    foreach ($bets as $bet) {
      $dataBet = [
        'scoreDomicileBet' => $bet['scoreDomicile'],
        'scoreExterieurBet' => $bet['scoreExterieur'],
        'coteResult' => $bet['coteResult'],
        'coteScore' => $bet['coteScore']
      ];
      $dataMatch = $matchMap[$bet['matchId']];
      $data = [
        'dataMatch' => $dataMatch,
        'dataBet' => $dataBet
      ];
      $listUsersBet[$userMap[$bet['userId']]['id']][] = $data;
    }
    return $listUsersBet;
  }

  //Traitement data
  function userRoundPoints($listUsersBet, $sessionId) {
    $listRoundPoints = array();
    $dataUserMatch = array();
    foreach ($listUsersBet as $id => $data) {
      if ($id == $sessionId) {
        $dataUserMatch = $data;
      }
    }
    foreach ($dataUserMatch as $row) {
      $round = $row['dataMatch']['round'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($listRoundPoints[$round])) {
        $listRoundPoints[$round] =[
          'round' => $round,
          'value' => 0
        ];
      }
      $isCorrectResult = (
        ($scoreDomicile - $scoreExterieur > 0
        && $scoreDomicileBet - $scoreExterieurBet > 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur < 0
        && $scoreDomicileBet - $scoreExterieurBet < 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur == 0 
        && $scoreDomicileBet - $scoreExterieurBet == 0      
        && $scoreDomicile >= 0)
      );
      if ($isCorrectResult) {
        $listRoundPoints[$round]['value'] = $listRoundPoints[$round]['value'] + $row['dataBet']['coteResult'];
      }
      $isScoreExact = (
        $scoreDomicileBet == $scoreDomicile
        && $scoreExterieurBet == $scoreExterieur
      );
      if ($isScoreExact) {
        $listRoundPoints[$round]['value'] = $listRoundPoints[$round]['value'] + $row['dataBet']['coteScore'];
      }
    }
    return $listRoundPoints;
  }
  
  $users = fetchUsers();
  $matchs = fetchMatchs();
  $bets = fetchBets();
  $listUsersBet = processData($users, $matchs, $bets);
  $listStats = [
    'userRoundPoints' => userRoundPoints($listUsersBet, $sessionId)
  ];
  echo json_encode($listStats);
?>
