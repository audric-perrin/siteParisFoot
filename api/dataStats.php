<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');

  $userSelected = array();
  $userSelected = [
    'userId1' => 1,
    'userId2' => 5,
    'userId3' => 6,
    'userId4' => 8
  ];

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

  function buildData($statsFunc, $userSelected, $listUsersBet, $users) {
    $results = array();
    foreach ($userSelected as $userId) {
      $result = call_user_func_array($statsFunc, [$listUsersBet, $userId]);
      $userName = 'undefined';
      foreach ($users as $row) {
        if ($userId == $row['id']) {
          $userName = $row['userName'];
        }
      }
      $results[] = [
        'userName' => $userName,
        'data' => $result
      ];
    }
    return $results;
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

  function compareScore($scoreExact1, $scoreExact2) {
    if ($scoreExact1['value'] == $scoreExact2['value']) {
      if ($scoreExact1['userId'] == $scoreExact2['userId']) {
        return 0;
      }
      return $scoreExact1['userId'] < $scoreExact2['userId'] ? -1 : 1;
    }
    return $scoreExact1['value'] > $scoreExact2['value'] ? -1 : 1;
  }

  function userRank($listUsersBet, $sessionId) {
    $roundMaxPoint = array();
    $roundMin = 20;
    $roundMax = 37;
    $listRank = array();
    for ($currentRound = $roundMin; $currentRound <= $roundMax; $currentRound++) {
      $roundMaxPoint = array();
      foreach ($listUsersBet as $id => $data) {
        $value = calculRoundMaxPoint($data, $id, $roundMin, $currentRound);
        if ($value != 0) {      
          $roundMaxPoint[] = [
            'userId' => $id,
            'value' => $value,
            'round' => $currentRound
          ];
        }
      }
      usort($roundMaxPoint, 'compareScore');
      foreach ($roundMaxPoint as $rank => $data) {
        if ($data['userId'] == $sessionId) {
          $listRank[] = [
            'round' => $data['round'],
            'value' => $rank + 1
          ];
        }
      }
    }
    return $listRank;
  }

  function calculRoundMaxPoint($data, $userId, $roundMin, $roundMax) {
    $value = 0;
    foreach ($data as $row) {
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if ($roundMin <= $row['dataMatch']['round'] && $roundMax >= $row['dataMatch']['round']) {
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
          $value = $value + $row['dataBet']['coteResult'];
        }
        $isScoreExact = (
          $scoreDomicileBet == $scoreDomicile
          && $scoreExterieurBet == $scoreExterieur
        );
        if ($isScoreExact) {
          $value = $value + $row['dataBet']['coteScore'];
        }
      }
    }
    return $value;
  }
  
  $users = fetchUsers();
  $matchs = fetchMatchs();
  $bets = fetchBets();
  $listUsersBet = processData($users, $matchs, $bets);
  $listStats = [
    'usersRoundPoints' => buildData('userRoundPoints', $userSelected, $listUsersBet, $users),
    'usersRank' => buildData('userRank', $userSelected, $listUsersBet, $users)
  ];
  echo json_encode($listStats);
?>
