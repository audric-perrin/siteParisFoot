<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  // sleep(1);
  if (isset($_POST['matchId']) and isset($_POST['scoreDomicile']) and isset($_POST['scoreExterieur'])) {
    $matchId = intval($_POST['matchId']);
    $scoreDomicile = intval($_POST['scoreDomicile']);
    $scoreExterieur = intval($_POST['scoreExterieur']);
    $result = runQuery('SELECT * FROM bet WHERE matchId = ' . $matchId . ' AND userId = ' . $_SESSION['id']);
    $count = 0;
    foreach ($result as $row) {
      $count ++;
    }
    if ($count !== 0) {
      echo json_encode(array('result' => 'Si tu essayes encore, tu pourras plus jamais faire caca. A méditer...'));
      exit;
    }
    $coteResultQuery = runQuery('SELECT * FROM coteResult WHERE id = ' . $_POST['matchId']);
    $coteScoreQuery = runQuery('SELECT cote FROM coteScore 
      WHERE id = ' . $matchId . ' 
      AND scoreDomicile = ' . $scoreDomicile . '
      AND scoreExterieur = ' . $scoreExterieur);
    $coteResult = 0;
    foreach ($coteResultQuery as $row) {
      if ($scoreDomicile > $scoreExterieur) {
        $coteResult = $row['domicile'];
      }
      else if ($scoreDomicile == $scoreExterieur) {
        $coteResult = $row['egalite'];
      }
      else {
        $coteResult = $row['exterieur'];
      }
    }
    $coteScore = 0;
    foreach ($coteScoreQuery as $row) {
      $coteScore = $row['cote'];
    }
    $query = 'INSERT INTO bet (userId, matchId, scoreDomicile, scoreExterieur, coteResult, coteScore)
      VALUES ( '. $_SESSION['id'] . ', ' . $matchId . ', ' . $scoreDomicile . ', ' . $scoreExterieur . ', ' . $coteResult . ', ' . $coteScore . ')';
    runQuery($query);
  }
  $matchInfo = array();
  $ids = getMatchIds();
  getMatchInfo($ids);
  getCoteResult($ids);
  getCoteScore($ids);
  getBet($ids, $_SESSION['id']);
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