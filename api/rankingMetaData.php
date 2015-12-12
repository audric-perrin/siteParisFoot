<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  $saison = [
    array('label' => 'Classement 2014/2015', 'value' => '2014/2015'),
    array('label' => 'Classement 2015/2016', 'value' => '2015/2016')
  ];
  $demiSaison = [
    array('label' => 'Classement 1er 2014/2015', 'value' => '2014/2015_0'),
    array('label' => 'Classement 2em 2014/2015', 'value' => '2014/2015_1'),
    array('label' => 'Classement 1er 2015/2016', 'value' => '2015/2016_0'),
    array('label' => 'Classement 2em 2015/2016', 'value' => '2015/2016_1')
  ];
  $mois = [
    array('label' => 'Classement Septembre', 'value' => '9'),
    array('label' => 'Classement Octobre', 'value' => '10'),
    array('label' => 'Classement Novembre', 'value' => '11')

  ];
  $round = [
    array('label' => 'Classement Journée 14', 'value' => '14'),
    array('label' => 'Classement Journée 15', 'value' => '15'),
    array('label' => 'Classement Journée 16', 'value' => '16')
  ];
  echo json_encode(array(3 => $saison, 4 => $demiSaison, 5 => $mois, 6 => $round));
?>