<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  getId();
  function getId() {
   $betId = array();
   $futurMatchId = array();
   $matchs = array();
   $result = runQuery(
    'SELECT DISTINCT(result.id) 
    FROM result INNER JOIN coteScore 
    ON result.id = coteScore.id 
    WHERE result.scoreDomicile = "-1"
    ORDER BY date');
   foreach ($result as $row) {
    $matchs[] = bet($row['id']);
   }
   echo json_encode(array('matchs' => $matchs));
  }
  function bet($id) {
    $data = array();
    $match = array();
    $coteResult = array();
    $coteScore = array();
    $coteScores = array();
    //Data match
    $matchQuery = 'SELECT * FROM result WHERE id = ' . $id;
    $result = runQuery($matchQuery);
    foreach ($result as $row) {
      $match['date'] = $row['date'];
      $match['teamDomicile'] = $row['teamDomicile'];
      $match['teamExterieur'] = $row['teamExterieur'];
      $match['id'] = $row['id'];
      $data['match'] = $match;
    }
    //Data cote result
    $coteResultQuery = 'SELECT * FROM coteResult WHERE id = ' . $id;
    $result = runQuery($coteResultQuery);
    foreach ($result as $row) {
      $decimal = 2;
      strlen($row['domicile']) > 4 ? $decimal = 1 : $decimal = 2; 
      $coteResult['coteDomicile'] = number_format(($row['domicile']), $decimal);
      strlen($row['egalite']) > 4 ? $decimal = 1 : $decimal = 2; 
      $coteResult['coteEgalite'] = number_format(($row['egalite']), $decimal);
      strlen($row['exterieur']) > 4 ? $decimal = 1 : $decimal = 2; 
      $coteResult['coteExterieur'] = number_format(($row['exterieur']), $decimal);
      $data['coteResult'] = $coteResult;
    }
    //Data cote score
    $coteScoreQuery = 'SELECT * FROM coteScore WHERE id = ' . $id;
    $result = runQuery($coteScoreQuery);
    foreach ($result as $row) {
      if (strlen($row['cote']) > 5) {
        $cote = number_format(($row['cote']), 0);
      }
      elseif (strlen($row['cote']) > 4) {
        $cote = number_format(($row['cote']), 1);
      }
      else {
        $cote = number_format(($row['cote']), 2);
      }
      if ($row['cote'] != 0) {   
        $coteScore = [
          'scoreDomicile' => number_format(($row['scoreDomicile']), 0),
          'scoreExterieur' => number_format(($row['scoreExterieur']), 0),
          'cote' => $cote
        ];
        $coteScores[] = $coteScore;
        $data['coteScore'] = $coteScores;
      }
    }
    return $data;
  }