<?php
  require_once('../sql.php');
  updateScore();
  function updateScore(){
    //Bordel matthis
  	$url = "http://www.flashscore.com/soccer/france/ligue-1/results/";
  	$curl = curl_init($url);
  	curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
  	$output = curl_exec($curl);
  	curl_close($curl);
    $output = explode('<div id="tournament-page-data-results">', $output)[1];
    $output = explode('</div>', $output)[0];
    $data = explode('~', $output);
    //Definition array resultat score
    $score = array();
    foreach ($data as $row) {
      if (strpos($row,'AA') === 0) {
        $score[] = array(
        'journee' => extratNumber(parseLine($row, 'ER')),
        'domicile' => parseLine($row, 'WU'),
        'exterieur' => parseLine($row, 'WV'),
        'scoreDomicile' => parseLine($row, 'AG'),
        'scoreExterieur' => parseLine($row, 'AH'),
        'saison' => '2015/2016');
      }
    }
    //Boucle all ligne $score
    foreach ($score as $row) {
      insertScore($row);
    }
  }
  // Extraction numéro journée
  function extratNumber($chaine){
    preg_match_all('#[0-9]+#',$chaine,$extract);
    $nombre = $extract[0][0];
    return $nombre;
  }
  // Mise à jour base de donnée
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
      VALUES (' . $row['journee'] . ',"' . $row['domicile'] . '",' . $row['scoreDomicile'] . ',"' . $row['exterieur'] . '",' . $row['scoreExterieur'] . ',"' . $row['saison'] . '")';
      runQuery($insertLine);
    }
  }
  //Parse chaque ligne correspondant à un match
  function parseLine($row, $code){
    preg_match('/' . $code . '÷([^¬]+)¬/', $row, $value);
    $value = $value[1];
    return $value;
  }
?>
