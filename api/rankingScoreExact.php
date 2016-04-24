<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  function compareScore($scoreExact1, $scoreExact2) {
    if ($scoreExact1['coteScore'] == $scoreExact2['coteScore']) {
      if ($scoreExact1['matchId'] == $scoreExact2['matchId']) {
        return 0;
      }
      return $scoreExact1['matchId'] < $scoreExact2['matchId'] ? -1 : 1;
    }
    return $scoreExact1['coteScore'] > $scoreExact2['coteScore'] ? -1 : 1;
  }
  $listScoreExact = array();
  $users = array();
  $matchs = array();
  $usersQuery = 'SELECT * FROM user';
  $result = runQuery($usersQuery);
  foreach ($result as $row) {
    $user = [
      'id' => $row['id'],
      'userName' => $row['pseudo']
    ];
    $users[] = $user;
  }
  $matchsQuery = 'SELECT * FROM result';
  $result = runQuery($matchsQuery);
  foreach ($result as $row) {
    $match = [
      'id' => $row['id'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur']
    ];
    $matchs[] = $match;
  }
  $scoreExactQuery = 
  'SELECT * 
  FROM bet
  INNER JOIN result ON result.id = bet.matchId
  INNER JOIN user ON user.id = bet.userId
  WHERE result.scoreDomicile = bet.scoreDomicile AND result.scoreExterieur = bet.scoreExterieur
  ORDER BY date';
  $result = runQuery($scoreExactQuery);
  foreach ($result as $row) {
    foreach ($users as $user) {
      if($user['id'] == $row['userId']){
        $userName = $user['userName'];
      }
    }
    foreach ($matchs as $match) {
      if ($match['id'] == $row['matchId']) {
        $teamDomicile = $match['teamDomicile'];
        $teamExterieur = $match['teamExterieur'];
      }
    }
    $scoreExact = [
      'userId' => $row['userId'],
      'userName' => $userName,
      'teamDomicile' => $teamDomicile,
      'teamExterieur' => $teamExterieur,
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur'],
      'matchId' => $row['matchId'],
      'coteScore' => $row['coteScore'],
    ];
    $listScoreExact[] = $scoreExact;
  }
  usort($listScoreExact, 'compareScore');
  echo json_encode($listScoreExact);
?>