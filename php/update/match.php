<?php
  require_once('../sql.php');
  $url = 'http://www.flashscore.com/soccer/france/ligue-1/fixtures/';
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
  $output = curl_exec($curl);
  curl_close($curl);
  $output = explode('<div id="tournament-page-data-fixtures">', $output)[1];
  $output = explode('</div>', $output)[0];
  $data = explode('~', $output);
  //Definition array match
  $match = array();
  foreach ($data as $row) {
    if (strpos($row,'AA') === 0) {
      $match[] = array(
      'journee' => extratNumber(parseLine($row, 'ER')),
      'domicile' => parseLine($row, 'AE'),
      'exterieur' => parseLine($row, 'AF'),
      'saison' => '2015/2016');
    }
  }
  $nameTeam = array(
      'Bastia' => 'bastia',
      'Paris SG' => 'paris-sg',
      'Monaco' => 'monaco',
      'Lyon' => 'lyon',
      'Nantes' => 'nantes',
      'Troyes' => 'troyes',
      'Toulouse' => 'toulouse',
      'Angers' => 'angers',
      'Guingamp' => 'guingamp',
      'Lille' => 'lille',
      'Reims' => 'reims',
      'Caen' => 'caen',
      'St Etienne' => 'st-etienne',
      'GFC Ajaccio' => 'gfc-ajaccio',
      'Bordeaux' => 'bordeaux',
      'Montpellier' => 'montpellier',
      'Marseille' => 'marseille',
      'Lorient' => 'lorient',
      'Rennes' => 'rennes',
      'Nice' => 'nice');
  //Boucle all ligne $score
  foreach ($match as $row) {
    $domicile = $row['domicile'];
    $row['domicile'] = $nameTeam[$domicile];
    $exterieur = $row['exterieur'];
    $row['exterieur'] = $nameTeam[$exterieur];
    insertScore($row);
  }
  function insertScore($row){
    $selectAll = 'SELECT * FROM result 
    WHERE round = ' . $row['journee'] . ' 
    AND teamDomicile = "' . $row['domicile'] . '" 
    AND teamExterieur = "' . $row['exterieur'] . '"
    AND saison = "' . $row['saison'] . '"';
    $result = runQuery($selectAll);
    $found = false;
    foreach ($result as $row){
      $found = true;
    }
    if (!$found){
      $insertLine = 'INSERT INTO result(round, teamDomicile, scoreDomicile, teamExterieur, scoreExterieur, saison)
      VALUES (' . $row['journee'] . ',"' . $row['domicile'] . '",-1,"' . $row['exterieur'] . '",-1,"' . $row['saison'] . '")';
      runQuery($insertLine);
    }
  }
  // Extraction numéro journée
  function extratNumber($chaine){
    preg_match_all('#[0-9]+#',$chaine,$extract);
    $nombre = $extract[0][0];
    return $nombre;
  }
  //Parse chaque ligne correspondant à un match
  function parseLine($row, $code){
    preg_match('/' . $code . '÷([^¬]+)¬/', $row, $value);
    $value = $value[1];
    return $value;
  }
  runQuery('UPDATE lastUpdate SET updateDate = NOW() WHERE script = "match"');