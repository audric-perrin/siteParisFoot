<?php
  require_once('../sql.php');
  updateCote();
  function updateCote(){
    //Bordel matthis
  	$url = "http://xml.cdn.betclic.com/odds_fr.xml";
  	$curl = curl_init($url);
  	curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
  	$output = curl_exec($curl);
  	curl_close($curl);
    preg_match("#(<event name=\"Ligue 1\".*?</event>)#", $output, $result);
    $data = $result[0];
    $p = xml_parser_create();
    xml_parse_into_struct($p, $data, $vals, $index);
    xml_parser_free($p);
    $matchs = array();
    $match = null;
    $betType = null;
    $cote = null;
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
      'Saint-Etienne' => 'st-etienne',
      'Gazélec Ajaccio' => 'gfc-ajaccio',
      'Bordeaux' => 'bordeaux',
      'Montpellier' => 'montpellier',
      'Marseille' => 'marseille',
      'Lorient' => 'lorient',
      'Rennes' => 'rennes',
      'Nice' => 'nice');
    //Recupere les donnees des cotes
    foreach ($vals as $row) {
      if ($row['tag'] == 'MATCH') {
        if ($row['type'] == 'open') {
          $name = $row['attributes']['NAME'];
          $team = explode(' - ', $name);
          if (count($team) != 2){
            continue;
          }
          $matchs[] = array(
            'date' => $row['attributes']['START_DATE'],
            'domicile' => $nameTeam[$team[0]],
            'exterieur' => $nameTeam[$team[1]],
            'resultCote' => array(),
            'scoreCote' => array());
        }
        else {
          $match = null;
        }
      }
      if ($row['tag'] == 'BET') {
        if ($row['type'] == 'open') {
          $code = $row['attributes']['CODE'];
          if ($code == 'Ftb_Mr3') {
            $betType = 'result';
          }
          elseif ($code == 'Ftb_Csc') {
            $betType = 'score';
          }
          else {
            $betType = null;
          }
        }
        elseif ($row['type'] == 'close') {
          $betType = null;
        }
      }
      if ($row['tag'] == 'CHOICE') {
        if ($betType == 'result') {
          $matchs[count($matchs) - 1]['resultCote'][$row['attributes']['NAME']] = $row['attributes']['ODD'];
        }
        elseif ($betType == 'score') {
          $matchs[count($matchs) - 1]['scoreCote'][$row['attributes']['NAME']] = $row['attributes']['ODD'];
        }
      }
    }
    //Insert donnees
    foreach ($matchs as $row) {
      $selectId = 'SELECT id 
      FROM result 
      WHERE teamDomicile = "' . $row['domicile'] . '" 
      AND teamExterieur = "' . $row['exterieur'] . '" 
      AND saison = "2015/2016"';
      $result = runQuery($selectId);
      $id = null;
      foreach ($result as $rowResult) {
        $id = $rowResult['id'];
      }
      if (!$id) {
        continue;
      }
      runQuery('UPDATE result SET `date` = "' . $row['date'] . '" WHERE id = '. $id);
      //Cote result
      $result = runQuery('SELECT * FROM coteResult WHERE id = '. $id);
      $coteId = null;
      foreach ($result as $rowCoteResult) {
        $coteId = $rowCoteResult['id'];
      }
      if ($coteId) {
        runQuery('UPDATE `coteResult` 
          SET `domicile`=' . $row["resultCote"]["%1%"] . ',`egalite`=' . $row["resultCote"]["Nul"] . ',`exterieur`=' . $row["resultCote"]["%2%"] . '
          WHERE id = '. $coteId);
      }
      else {
        $insertQuery = 'INSERT INTO `coteResult` 
          VALUES (' . $id . ',' . $row["resultCote"]["%1%"] . ',' . $row["resultCote"]["Nul"] . ',' . $row["resultCote"]["%2%"] . ')';
        runQuery($insertQuery);
      }
      //Cote score
      foreach ($row['scoreCote'] as $score => $cote) {
        $score = explode(' - ', $score);
        $scoreDomicile = $score[0];
        $scoreExterieur = $score[1];
        $result = runQuery('SELECT * FROM coteScore 
          WHERE id = ' . $id . ' AND scoreDomicile =' . $scoreDomicile . ' AND scoreExterieur =' . $scoreExterieur);
        $coteId = null;
        foreach ($result as $rowcoteScore) {
          $coteId = $rowcoteScore['id'];
        }
        if ($coteId) {
          runQuery('UPDATE `coteScore` 
            SET `scoreDomicile`=' . $scoreDomicile . ',`scoreExterieur`=' . $scoreExterieur . ',`cote`=' . $cote . '
            WHERE id = '. $coteId);
        }
        else {
          $insertQuery = 'INSERT INTO `coteScore` 
            VALUES (' . $id . ',' . $scoreDomicile . ',' . $scoreExterieur . ',' . $cote . ')';
          runQuery($insertQuery);
        }
      }
    }
  }
?>