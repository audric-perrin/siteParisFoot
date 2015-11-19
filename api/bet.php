<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  sleep(1);
  $matchInfo = array();
  $ids = getMatchIds();
  getMatchInfo($ids);
  getCoteResult($ids);
  getCoteScore($ids);
  getBet($ids, 1);
  echo json_encode($matchInfo);
  function getMatchIds() {
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
    }
    return $matchIds;
  }
  function getMatchInfo($ids) {
    global $matchInfo;
    $result = runQuery('SELECT * FROM result WHERE id IN (' . implode(',', $ids) . ')');
    foreach ($result as $row) {
      $id = $row['id'];
      unset($row['id']);
      $matchInfo[$id] = $row;
      $matchInfo[$id]['coteScore'] = array();
    }
  }
  function getCoteResult($ids) {
    global $matchInfo;
    $result = runQuery('SELECT * FROM coteResult WHERE id IN (' . implode(',', $ids) . ')');
    foreach ($result as $row) {
      $id = $row['id'];
      unset($row['id']);
      $matchInfo[$id]['coteResult'] = $row;
    }
  }
  function getCoteScore($ids) {
    global $matchInfo;
    $result = runQuery('SELECT * FROM coteScore WHERE id IN (' . implode(',', $ids) . ')');
    foreach ($result as $row) {
      $id = $row['id'];
      unset($row['id']);
      $matchInfo[$id]['coteScore'][] = $row;
    }
  }
  function getBet($ids, $userId) {
    global $matchInfo;
    $result = runQuery('SELECT * FROM bet WHERE matchId IN (' . implode(',', $ids) . ') AND userId = ' . $userId);
    foreach ($result as $row) {
      $id = $row['matchId'];
      unset($row['matchId']);
      unset($row['userId']);
      $matchInfo[$id]['bet'] = $row;
    }
  }