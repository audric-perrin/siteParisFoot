<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  //Selection des classements par journées
  $currentRound = currentRound();
  $round = array();
  for ($i = 1; $i <= $currentRound; $i ++) { 
    $round[] = array('label' => 'Journée ' . $i, 'value' => $i);
  }
  //Tableau monthName
  $monthName = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];
  //Selection des classements par mois
  $currentMonth = currentMonth();
  $mois = array();
  if ($currentMonth > 6) {
    for ($i = 7; $i < $currentMonth; $i ++) {
      $mois[] = array('label' => $monthName[$i], 'value' => $i);
    }
  }
  else {
    for ($i = 7; $i < 11; $i ++) {
      $mois[] = array('label' => $monthName[$i], 'value' => $i);
    }
    $i = 0;
    for ($i = 0; $i <= $currentMonth; $i ++) {
      $mois[] = array('label' => $monthName[$i], 'value' => $i);
    }
  }
  //Selection des classements par saison
  $currentSaison = currentSaison();
  $saison = [
    array('label' => 'Saison ' . $currentSaison, 'value' => $currentSaison)
  ];
  //Selection des classements par demi-saison
  $demiSaison = array();
  $demiSaison[] = array('label' => '1er partie saison ' . $currentSaison, 'value' => $currentSaison . '_1');
  if ($currentRound > 19) {
    $demiSaison[] = array('label' => '2em partie saison ' . $currentSaison, 'value' => $currentSaison . '_2');
  }
  echo json_encode(array(3 => $saison, 4 => $demiSaison, 5 => $mois, 6 => $round));
?>