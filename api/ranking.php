<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  require_once('../lib/userRanking.php');
  $matchIds = array();
  $currentRound = currentRound();
  $currentMonth = currentMonth();
  $currentSaison = currentSaison();
  if ($_GET['type'] == 'round') {
    $round = isset($_GET['option']) ? $_GET['option'] : $currentRound;
    $result = runQuery('SELECT id FROM result WHERE round = ' . $round);
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if ($_GET['type'] == 'month') {
    $month = isset($_GET['option']) ? $_GET['option'] : $currentMonth;
    $result = runQuery('SELECT id FROM result WHERE MONTH(date) = ' . $month);
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if ($_GET['type'] == 'personnel' && isset($_SESSION['id'])) {
    $result = runQuery(
        'SELECT date 
        FROM result 
        INNER JOIN bet ON result.id = bet.matchId
        WHERE bet.userId = ' . $_SESSION['id'] . ' ORDER BY date LIMIT 1'
      );
    foreach ($result as $row) {
      $firstMatchDate = $row['date'];
    }
    $result = runQuery('SELECT id FROM result WHERE `date` >= "' . $firstMatchDate . '"');
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if ($_GET['type'] == 'saison') {
    $saison = isset($_GET['option']) ? $_GET['option'] : $currentSaison;
    $result = runQuery('SELECT id FROM result WHERE saison = "' . $saison . '"');
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if ($_GET['type'] == 'demiSaison') {
    $demiSaison = $currentRound > 19 ? 2 : 1;
    $saison = $currentSaison;
    if (isset($_GET['option'])) {
      $explode = explode('_', $_GET['option']);
      $saison = $explode[0];
      $demiSaison = $explode[1];
    }
    $result = runQuery(
      'SELECT id 
      FROM result 
      WHERE saison = "' . $saison . '" 
      AND MONTH(date)' . ($demiSaison == "2" ? ">" : "<=") . '19');
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if ($_GET['type'] == 'general') {
    $result = runQuery('SELECT id FROM result');
    foreach ($result as $row) {
      $matchIds[] = $row['id'];
    }
  }
  if (count($matchIds) > 0) {
    $ranking = getUserRanking($matchIds);
  }
  else {
    $ranking = array('ranking' => array());
  }
  echo json_encode($ranking);
?>