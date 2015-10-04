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
    foreach ($vals as $row) {
      print_r($row);
      echo '<br/>';
    }
  }
?>