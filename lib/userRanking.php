<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/general.php');
  function compareUserPoint($user1, $user2) {
    if ($user1['globalPoint'] == $user2['globalPoint']) {
      if (isset($user1['betCount'])) {
        if ($user1['betCount'] == $user2['betCount']) {
          return 0;
        }
        return $user1['betCount'] < $user2['betCount'] ? -1 : 1;
      }
    }
    return $user1['globalPoint'] > $user2['globalPoint'] ? -1 : 1;
  }
  function compareUserRanking($user1, $user2) {
    if ($user1['rank'] == $user2['rank']) {
      return 0;
    }
    return $user1['rank'] > $user2['rank'] ? 1 : -1;
  }
  function getUserRanking($idSelected) {
    $currentRound = currentRound();
    $users = getUsers();
    $oldRanking = [];
    $newRanking = [];
    $result = runQuery(
      'SELECT userId, matchId, coteResult, coteScore, round,
      bet.scoreDomicile AS betScoreDomicile, 
      bet.scoreExterieur AS betScoreExterieur, 
      result.scoreDomicile AS resultScoreDomicile,
      result.scoreExterieur AS resultScoreExterieur
      FROM bet 
      INNER JOIN result WHERE id IN (' . implode(',', $idSelected) . ') AND bet.matchId = result.id'
    );
    foreach ($result as $row) {
      //Variable sql
      $userId = intval($row['userId']);
      $coteResult = floatval($row['coteResult']);
      $coteScore = floatval($row['coteScore']);
      $round = intval($row['round']);
      $betScoreDomicile = intval($row['betScoreDomicile']);
      $betScoreExterieur = intval($row['betScoreExterieur']);
      $resultScoreDomicile = intval($row['resultScoreDomicile']);
      $resultScoreExterieur = intval($row['resultScoreExterieur']);
      $myBet = false;
      if ($row['userId'] == $_SESSION['id']) {
        $myBet = true;
      }
      if ($resultScoreDomicile >= 0) {
        //Variable de calcul
        $scorePoint = 0;
        if ($betScoreDomicile == $resultScoreDomicile && $betScoreExterieur == $resultScoreExterieur) {
          $scorePoint = $coteScore;
        }
        $betPoint = 0;
        if ($betScoreDomicile > $betScoreExterieur && $resultScoreDomicile > $resultScoreExterieur ||
          $betScoreDomicile == $betScoreExterieur && $resultScoreDomicile == $resultScoreExterieur ||
          $betScoreDomicile < $betScoreExterieur && $resultScoreDomicile < $resultScoreExterieur) {
          $betPoint = $coteResult;
        }
        if (!isset($oldRanking[$userId])) {
          $oldRanking[$userId] = [
            'userId' => $userId,
            'globalPoint' => 0
          ];
        }
        if ($round < $currentRound) {
          $oldRanking[$userId]['globalPoint'] += $scorePoint + $betPoint;
        } 
        if (!isset($newRanking[$userId])) {
          $newRanking[$userId] = [
            'userId' => $userId,
            'username' => $users[$userId],
            'betCount' => 0,
            'betWon' => 0,
            'betPoint' => 0,
            'scoreWon' => 0,
            'scorePoint' => 0,
            'globalPoint' => 0,
            'myBet' => $myBet
          ];
        }
        $newRanking[$userId]['betCount'] ++;
        $newRanking[$userId]['betWon'] += $betPoint > 0 ? 1 : 0;
        $newRanking[$userId]['betPoint'] += $betPoint;
        $newRanking[$userId]['scoreWon'] += $scorePoint > 0 ? 1 : 0;
        $newRanking[$userId]['scorePoint'] += $scorePoint;
        $newRanking[$userId]['globalPoint'] += $betPoint + $scorePoint;
      }
    }
    $sortedNewRanking = array_values($newRanking);
    usort($sortedNewRanking, 'compareUserPoint');
    $sortedOldRanking = array_values($oldRanking);
    usort($sortedOldRanking, 'compareUserPoint');
    $currentRanking = 0;
    $currentScore = 0;
    foreach ($sortedOldRanking as $row) {
      if ($currentRanking == 0) {
        $currentRanking = 1;
        $currentScore = $row['globalPoint'];
      }
      if ($currentScore != $row['globalPoint']) {
        $currentRanking++;
        $currentScore = $row['globalPoint'];
      }
      $oldRanking[$row['userId']]['rank'] = $currentRanking;
    }
    $currentRanking = 0;
    $currentScore = 0;
    $index = 0;
    foreach ($sortedNewRanking as $row) {
      $index++;
      if ($currentRanking == 0) {
        $currentRanking = 1;
        $currentScore = $row['globalPoint'];
      }
      if ($currentScore != $row['globalPoint']) {
        $currentRanking = $index;
        $currentScore = $row['globalPoint'];
      }
      $newRanking[$row['userId']]['rank'] = $currentRanking;
      $newRanking[$row['userId']]['evolution'] = $oldRanking[$row['userId']]['rank'] - $newRanking[$row['userId']]['rank'];
    }
    $newRanking = array_values($newRanking);
    usort($newRanking, 'compareUserRanking');
    $oldRanking = array_values($oldRanking);
    usort($oldRanking, 'compareUserRanking');
    return $userRanking = array('ranking' => $newRanking);
  }
?>