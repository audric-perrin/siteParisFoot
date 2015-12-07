<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../lib/general.php');
  function compareTeam($team1, $team2) {
    if ($team1['points'] == $team2['points']) {
      if ($team1['difference'] == $team2['difference']) {
        if($team1['bp'] == $team2['bp']) {
          return 0;
        }
        return $team1['bp'] > $team2['bp'] ? -1 : 1;
      }
      return $team1['difference'] > $team2['difference'] ? -1 : 1;
    }
    return $team1['points'] > $team2['points'] ? -1 : 1;
  }
  function getRankingL1($type) {
    $roundLimit = 0;
    if ($type == 'realTime') {
      $roundLimit = currentRound();
    }
    else if ($type == 'delayed') {
      $roundLimit = currentRound() - 1;
    }
    $rankingL1 = array();
    $result = runQuery('SELECT * FROM result WHERE scoreDomicile >= 0 && round <= ' . $roundLimit);
    foreach ($result as $row) {
      $round = intval($row['round']);
      $teamDomicile = $row['teamDomicile'];
      $teamExterieur = $row['teamExterieur'];
      $scoreDomicile = intval($row['scoreDomicile']);
      $scoreExterieur = intval($row['scoreExterieur']);
      if (!isset($rankingL1[$teamDomicile])) {
        $rankingL1[$teamDomicile] = [
          'name' => $row['teamDomicile'],
          'round' => 0,
          'win' => 0,
          'equality' => 0,
          'loose' => 0,
          'bp' => 0,
          'bc' => 0,
          'difference' => 0,
          'points' => 0
        ];
      }
      if (!isset($rankingL1[$teamExterieur])) {
        $rankingL1[$teamExterieur] = [
          'name' => $row['teamExterieur'],
          'round' => 0,
          'win' => 0,
          'equality' => 0,
          'loose' => 0,
          'bp' => 0,
          'bc' => 0,
          'difference' => 0,
          'points' => 0
        ];
      }
      $rankingL1[$teamDomicile]['round']++;
      $rankingL1[$teamExterieur]['round']++;
      if ($scoreDomicile > $scoreExterieur) {
        $rankingL1[$teamDomicile]['win']++;
        $rankingL1[$teamDomicile]['points'] = $rankingL1[$teamDomicile]['points'] + 3;
        $rankingL1[$teamExterieur]['loose']++;
      }
      else if ($scoreDomicile < $scoreExterieur) {
        $rankingL1[$teamExterieur]['win']++;
        $rankingL1[$teamExterieur]['points'] = $rankingL1[$teamExterieur]['points'] + 3;
        $rankingL1[$teamDomicile]['loose']++;
      }
      else {
        $rankingL1[$teamDomicile]['equality']++;
        $rankingL1[$teamDomicile]['points']++;
        $rankingL1[$teamExterieur]['equality']++;
        $rankingL1[$teamExterieur]['points']++;
      }
      $rankingL1[$teamDomicile]['bp'] = $rankingL1[$teamDomicile]['bp'] + $scoreDomicile;
      $rankingL1[$teamDomicile]['bc'] = $rankingL1[$teamDomicile]['bc'] + $scoreExterieur;
      $rankingL1[$teamExterieur]['bp'] = $rankingL1[$teamExterieur]['bp'] + $scoreExterieur;
      $rankingL1[$teamExterieur]['bc'] = $rankingL1[$teamExterieur]['bc'] + $scoreDomicile;
    }
    $ranking = array();
    foreach ($rankingL1 as $team => $row) {
      $rankingL1[$team]['difference'] = $row['bp'] - $row['bc'];
      $ranking[] = $rankingL1[$team];
    }
    usort($ranking, 'compareTeam');
    $index = 0;
    foreach ($ranking as $index => $row) {
      $ranking[$index]['rank'] = $index + 1;
    }
    return $rankingL1 = array('rankingL1' => $ranking);
  }