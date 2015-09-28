<?php
	$url = "http://www.flashscore.com/soccer/france/ligue-1/results/";
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
	$output = curl_exec($curl);
	curl_close($curl);
  $output = explode('<div id="tournament-page-data-results">', $output)[1];
  $output = explode('</div>', $output)[0];
  $data = explode('~', $output);
  $score = array();
  foreach ($data as $row) {
    if (strpos($row,'AA') === 0) {
      $score[] = array(
      'journee' => parseLine($row, 'ER'),
      'domicile' => parseLine($row, 'WU'),
      'exterieur' => parseLine($row, 'WV'),
      'scoreDomicile' => parseLine($row, 'AG'),
      'scoreExterieur' => parseLine($row, 'AH'));
    }
  }
  foreach ($score as $row) {
    echo $row['journee'];
    echo '<br/>';
    echo $row['domicile'] . ' - ' . $row['exterieur'];
    echo '<br/>';
    echo $row['scoreDomicile'] . ' - ' . $row['scoreExterieur'];
    echo '<br/>';
  }
 function parseLine($row, $code){
    preg_match('/' . $code . '÷([^¬]+)¬/', $row, $value);
    $value = $value[1];
    return $value;
 }
 ?>

 <!-- WU÷guingamp¬ -->