<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/general.php');
  require_once('../api/lag.php');
  $currentSaison = currentSaison();
  if (isset($_GET['matchId'])) {
    $matchId = $_GET['matchId'];
  }
  else {
    echo ('Pas de matchId');
  }
  $match = array();
  $result = runQuery('SELECT * FROM result 
    WHERE id = ' . $matchId
  );
  foreach ($result as $row) {
    $match = [
      'matchId' => $row['id'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur'],
      'date' => $row['date']
    ];
  }
  $matchAller = array();
  $result = runQuery('SELECT * FROM result 
    WHERE teamExterieur = "' . $match['teamDomicile'] . '"
    AND teamDomicile = "' . $match['teamExterieur'] . '"
    AND scoreDomicile > -1 
    AND saison = "' . $currentSaison . '"'
  );
  foreach ($result as $row) {
    $matchAller = [
      'matchId' => $row['id'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
  }
  $matchsDomicile = array();
  $result = runQuery('SELECT * FROM result
    WHERE teamDomicile = "' . $match['teamDomicile'] . '"
    AND scoreDomicile > -1 
    AND saison = "' . $currentSaison . '"
    ORDER BY round DESC'
  );
  foreach ($result as $row) {
    $matchDomicile = [
      'matchId' => $row['id'],
      'round' => $row['round'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
    $matchsDomicile[] = $matchDomicile;
  }
  $matchsExterieur = array();
  $result = runQuery('SELECT * FROM result
    WHERE teamExterieur = "' . $match['teamExterieur'] . '"
    AND scoreDomicile > -1
    AND saison = "' . $currentSaison . '"
    ORDER BY round DESC'
  );
  foreach ($result as $row) {
    $matchExterieur = [
      'matchId' => $row['id'],
      'round' => $row['round'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
    $matchsExterieur[] = $matchExterieur;
  }
  $matchsDomicileTeam = array();
  $result = runQuery('SELECT * FROM result
    WHERE teamDomicile = "' . $match['teamDomicile'] . '"
    AND scoreDomicile > -1
    OR teamExterieur = "' . $match['teamDomicile'] . '"
    AND scoreDomicile > -1
    ORDER BY round DESC LIMIT 5'
  );
  foreach ($result as $row) {
    $matchDomicileTeam = [
      'matchId' => $row['id'],
      'round' => $row['round'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
    $matchsDomicileTeam[] = $matchDomicileTeam;
  }
  $matchsExterieurTeam = array();
  $result = runQuery('SELECT * FROM result
    WHERE teamExterieur = "' . $match['teamExterieur'] . '"
    AND scoreDomicile > -1
    OR teamDomicile = "' . $match['teamExterieur'] . '"
    AND scoreDomicile > -1
    ORDER BY round DESC LIMIT 5'
  );
  foreach ($result as $row) {
    $matchExterieurTeam = [
      'matchId' => $row['id'],
      'round' => $row['round'],
      'teamDomicile' => $row['teamDomicile'],
      'teamExterieur' => $row['teamExterieur'],
      'scoreDomicile' => $row['scoreDomicile'],
      'scoreExterieur' => $row['scoreExterieur']
    ];
    $matchsExterieurTeam[] = $matchExterieurTeam;
  }
  echo json_encode(array(
    'match' => $match, 
    'matchAller' => $matchAller, 
    'matchsDomicile' => $matchsDomicile, 
    'matchsDomicileTeam' => $matchsDomicileTeam,  
    'matchsExterieur' => $matchsExterieur,
    'matchsExterieurTeam' => $matchsExterieurTeam
  ));
 ?>