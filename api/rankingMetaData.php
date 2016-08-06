<?php
  require_once('../api/requireConnected.php');
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');
  require_once('../lib/general.php');
  $currentMonth = currentMonth();
  $currentRound = currentRound();
  //Selection des classements par saison
  $saison = array();
  $result = runQuery('SELECT DISTINCT saison FROM result WHERE scoreDomicile > -1 ');
  foreach ($result as $row) {
    $saison[] = array('label' => 'Saison ' . $row['saison'], 'value' => $row['saison']);
  }
  //Selection des classements par journées
  $countSaison = 0;
  $round = array();
  foreach ($saison as $row) {
    $countSaison++;
    if ($countSaison == count($saison)) {
      for ($i = 1; $i <= $currentRound; $i ++) { 
        $round[] = array('label' => 'Journée ' . $i . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
      }
    }
    else {
      for ($i = 1; $i <= 38; $i ++) { 
        $round[] = array('label' => 'Journée ' . $i . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
      }
    }
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
  $countSaison = 0;
  $mois = array();
  foreach ($saison as $row) {
    $countSaison++;
    if ($countSaison == count($saison)) {
      if ($currentMonth > 6) {
        for ($i = 8; $i <= $currentMonth; $i ++) {
          $mois[] = array('label' => $monthName[$i - 1] . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
        }
      }
      else {
        for ($i = 8; $i <= 12; $i ++) {
          $mois[] = array('label' => $monthName[$i - 1] . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
        }
        $i = 0;
        for ($i = 1; $i <= $currentMonth; $i ++) {
          $mois[] = array('label' => $monthName[$i - 1] . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
        }
      }
    }
    else {
      for ($i = 8; $i <= 12; $i++) {
        $mois[] = array('label' => $monthName[$i - 1] . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
      }
      for ($i = 1; $i <= 5; $i++) {
        $mois[] = array('label' => $monthName[$i - 1] . ' saison ' . $row['value'], 'value' => $i . '_' . $row['value']);
      }
    }
  }
  //Selection des classements par demi-saison
  $demiSaison = array();
  $i = 0;
  foreach ($saison as $row) {
    $i++;
    $demiSaison[] = array('label' => '1er partie saison ' . $row['value'], 'value' => $row['value'] . '_1');
    if ($i == count($saison)) {
      if ($currentRound > 19) {
        $demiSaison[] = array('label' => '2em partie saison ' . $row['value'], 'value' => $row['value'] . '_2');
      }
    }
    else {
      $demiSaison[] = array('label' => '2em partie saison ' . $row['value'], 'value' => $row['value'] . '_2');
    }
  }
  echo json_encode(array('saison' => $saison, 'demiSaison' => $demiSaison, 'month' => $mois, 'round' => $round));
?>