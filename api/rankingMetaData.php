<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $saison = [
    array('label' => '2014/2015', 'value' => '2014/2015'),
    array('label' => '2015/2016', 'value' => '2015/2016')
  ];
  $demiSaison = [
    array('label' => '1er 2014/2015', 'value' => '2014/2015_0'),
    array('label' => '2em 2014/2015', 'value' => '2014/2015_1'),
    array('label' => '1er 2015/2016', 'value' => '2015/2016_0'),
    array('label' => '2em 2015/2016', 'value' => '2015/2016_1')
  ];
  $mois = [
    array('label' => 'Septembre', 'value' => '9'),
    array('label' => 'Octobre', 'value' => '10'),
    array('label' => 'Novembre', 'value' => '11')

  ];
  $round = [
    array('label' => 'Journée 14', 'value' => '14'),
    array('label' => 'Journée 15', 'value' => '15'),
    array('label' => 'Journée 16', 'value' => '16')
  ];
  echo json_encode(array('saison' => $saison, 'demiSaison' => $demiSaison, 'mois' => $mois, 'round' => $round));
?>