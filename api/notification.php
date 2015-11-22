<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $countBet = 0;
  $ids = getMatchIds();
  countUserBet($ids);
  function getMatchIds() {
    global $countBet;
    $result = runQuery(
    'SELECT DISTINCT(result.id) 
    FROM result 
    INNER JOIN coteScore ON result.id = coteScore.id 
    INNER JOIN coteResult ON result.id = coteResult.id 
    WHERE result.scoreDomicile = "-1"
    ORDER BY date');
    $matchIds = array();
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
      $countBet ++;
    }
    return $matchIds;
  }
  function countUserBet($ids) {
    global $countBet;
    $notificationBet = $countBet;
    $result = runQuery('SELECT * FROM bet WHERE matchId IN (' . implode(',', $ids) . ') AND userId = ' . $_SESSION['id']);
    foreach ($result as $row) {
      $notificationBet = $notificationBet - 1;
    }
    echo json_encode(array('notificationBet' => $notificationBet));
  }
?>