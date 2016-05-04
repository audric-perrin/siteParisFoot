<?php
  header('Content-Type: application/json');
  require_once('../php/sql.php');
  require_once('../api/lag.php');

  //Récupération des data
  function fetchUsers() {
    $users = array();
    $usersQuery = 'SELECT * FROM user';
    $result = runQuery($usersQuery);
    foreach ($result as $row) {
      $user = [
        'id' => $row['id'],
        'userName' => $row['pseudo']
      ];
      $users[] = $user;
    }
    return $users;
  }

  function fetchMatchs() {
    $matchs = array();
    $matchsQuery = 'SELECT * FROM result ORDER BY date';
    $result = runQuery($matchsQuery);
    foreach ($result as $row) {
      $match = [
        'id' => $row['id'],
        'saison' => $row['saison'],
        'date' => $row['date'],
        'month' => date_parse($row['date'])["month"],
        'teamDomicile' => $row['teamDomicile'],
        'teamExterieur' => $row['teamExterieur'],
        'scoreDomicile' => $row['scoreDomicile'],
        'scoreExterieur' => $row['scoreExterieur'],
        'round' => $row['round']
      ];
      $matchs[] = $match;
    }
    return $matchs;
  }

  function fetchBets() {    
    $bets = array();
    $betsQuery = 'SELECT * FROM bet';
    $result = runQuery($betsQuery);
    foreach ($result as $row) {
      $bet = [
        'userId' => $row['userId'],
        'matchId' => $row['matchId'],
        'scoreDomicile' => $row['scoreDomicile'],
        'scoreExterieur' => $row['scoreExterieur'],
        'coteResult' => $row['coteResult'],
        'coteScore' => $row['coteScore']
      ];
      $bets[] = $bet;
    }
    return $bets;
  }

  function processData($users, $matchs, $bets) {
    $listUsersBet = array();
    $userMap = array();
    foreach ($users as $user) {
      $userMap[$user['id']] = $user;
      $listUsersBet[$user['userName']] = array();
    }
    $matchMap = array();
    foreach ($matchs as $match) {
      $dataMatch = [
        'saison' => $match['saison'],
        'date' => $match['date'],
        'month' => $match['month'],
        'teamDomicile' => $match['teamDomicile'],
        'teamExterieur' => $match['teamExterieur'],
        'scoreDomicile' => $match['scoreDomicile'],
        'scoreExterieur' => $match['scoreExterieur'],
        'round' => $match['round']
      ];
      $matchMap[$match['id']] = $dataMatch;
    }
    foreach ($bets as $bet) {
      $dataBet = [
        'scoreDomicileBet' => $bet['scoreDomicile'],
        'scoreExterieurBet' => $bet['scoreExterieur'],
        'coteResult' => $bet['coteResult'],
        'coteScore' => $bet['coteScore']
      ];
      $dataMatch = $matchMap[$bet['matchId']];
      $data = [
        'dataMatch' => $dataMatch,
        'dataBet' => $dataBet
      ];
      $listUsersBet[$userMap[$bet['userId']]['userName']][] = $data;
    }
    return $listUsersBet;
  }

  //Traitement data
  function compareScore($scoreExact1, $scoreExact2) {
    if ($scoreExact1['value'] == $scoreExact2['value']) {
      if ($scoreExact1['userName'] == $scoreExact2['userName']) {
        return 0;
      }
      return $scoreExact1['userName'] < $scoreExact2['userName'] ? -1 : 1;
    }
    return $scoreExact1['value'] > $scoreExact2['value'] ? -1 : 1;
  }

  function buildRecordTable($type, $title, $listUsersBet, $recordFunc) {
    $results = array();
    foreach ($listUsersBet as $userName => $data) {
      $results[] = call_user_func_array($recordFunc, [$userName, $data]);
    }
    usort($results, 'compareScore');
    $currentRank = 0;
    $currentScore = $results[0]['value'];
    foreach ($results as $index => $result) {
      if ($result['value'] != $currentScore) {
        $currentRank++;
        $currentScore = $result['value'];
      }
      $results[$index]['rank'] = $currentRank + 1;
    }
    return [
      'type' => $type,
      'title' => $title,
      'ranking' => $results
    ];
  }

  //Fonctions calcul records
  function BestExactScore($userName, $data) {
    $coteScore = 0;
    $match = array();
    foreach ($data as $row) {
      $isBetterCoteScore = (
        $row['dataBet']['coteScore'] > $coteScore 
        && $row['dataBet']['scoreDomicileBet'] == $row['dataMatch']['scoreDomicile']
        && $row['dataBet']['scoreExterieurBet'] == $row['dataMatch']['scoreExterieur']
      );
      if ($isBetterCoteScore) {
        $coteScore = $row['dataBet']['coteScore'];
        $match = $row['dataMatch'];
      }
    }
    $extra = array();
    if ($coteScore > 0) {    
      $extra = [
        'teamDomicile' => $match['teamDomicile'],
        'teamExterieur' => $match['teamExterieur'],
        'scoreDomicile' => $match['scoreDomicile'],
        'scoreExterieur' => $match['scoreExterieur']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $coteScore,
      'extra' => $extra
    ];
  }

  function BestCorrectResult($userName, $data) {
    $coteResult = 0;
    $match = array();
    foreach ($data as $row) {
      $isBetterCorrectResult = (
        ($row['dataBet']['coteResult'] > $coteResult 
        && $row['dataMatch']['scoreDomicile'] - $row['dataMatch']['scoreExterieur'] > 0
        && $row['dataBet']['scoreDomicileBet'] - $row['dataBet']['scoreExterieurBet'] > 0
        && $row['dataMatch']['scoreDomicile'] >= 0)
        ||
        ($row['dataBet']['coteResult'] > $coteResult 
        &&$row['dataMatch']['scoreDomicile'] - $row['dataMatch']['scoreExterieur'] < 0
        && $row['dataBet']['scoreDomicileBet'] - $row['dataBet']['scoreExterieurBet'] < 0
        && $row['dataMatch']['scoreDomicile'] >= 0)
        ||
        ($row['dataBet']['coteResult'] > $coteResult 
        &&$row['dataMatch']['scoreDomicile'] - $row['dataMatch']['scoreExterieur'] == 0 
        && $row['dataBet']['scoreDomicileBet'] - $row['dataBet']['scoreExterieurBet'] == 0      
        && $row['dataMatch']['scoreDomicile'] >= 0)
      );
      if ($isBetterCorrectResult) {
        $coteResult = $row['dataBet']['coteResult'];
        $match = $row['dataMatch'];
      }
    }
    $extra = array();
    if ($coteResult > 0) {    
      $extra = [
        'teamDomicile' => $match['teamDomicile'],
        'teamExterieur' => $match['teamExterieur'],
        'scoreDomicile' => $match['scoreDomicile'],
        'scoreExterieur' => $match['scoreExterieur']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $coteResult,
      'extra' => $extra
    ];
  }

  function BestRound($userName, $data) {
    $rounds = array();
    foreach ($data as $row) {
      $round = $row['dataMatch']['round'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($rounds[$round])) {
        $rounds[$round] = [
          'value' => 0,
          'dataRound' => $row
        ];
      }
      $isCorrectResult = (
        ($scoreDomicile - $scoreExterieur > 0
        && $scoreDomicileBet - $scoreExterieurBet > 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur < 0
        && $scoreDomicileBet - $scoreExterieurBet < 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur == 0 
        && $scoreDomicileBet - $scoreExterieurBet == 0      
        && $scoreDomicile >= 0)
      );
      if ($isCorrectResult) {
        $rounds[$round]['value'] = $rounds[$round]['value'] + $row['dataBet']['coteResult'];
      }
      $isScoreExact = (
        $scoreDomicileBet == $scoreDomicile
        && $scoreExterieurBet == $scoreExterieur
      );
      if ($isScoreExact) {
        $rounds[$round]['value'] = $rounds[$round]['value'] + $row['dataBet']['coteScore'];
      }
    }
    $bestRoundScore = 0;
    $index = 0;
    foreach ($rounds as $round) {
      if ($round['value'] > $bestRoundScore) {
        $bestRoundScore = $round['value'];
        $dataRound = $round['dataRound'];
      }
    }
    $extra = array();
    if ($bestRoundScore > 0) {    
      $extra = [
        'round' => $dataRound['dataMatch']['round'],
        'saison' => $dataRound['dataMatch'] ['saison']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestRoundScore,
      'extra' => $extra
    ];
  }

  function BestMonth($userName, $data) {
    $months = array();
    foreach ($data as $row) {
      $month = $row['dataMatch']['month'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($months[$month])) {
        $months[$month] = [
          'value' => 0,
          'dataMonth' => $row
        ];
      }
      $isCorrectResult = (
        ($scoreDomicile - $scoreExterieur > 0
        && $scoreDomicileBet - $scoreExterieurBet > 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur < 0
        && $scoreDomicileBet - $scoreExterieurBet < 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur == 0 
        && $scoreDomicileBet - $scoreExterieurBet == 0      
        && $scoreDomicile >= 0)
      );
      if ($isCorrectResult) {
        $months[$month]['value'] = $months[$month]['value'] + $row['dataBet']['coteResult'];
      }
      $isScoreExact = (
        $scoreDomicileBet == $scoreDomicile
        && $scoreExterieurBet == $scoreExterieur
      );
      if ($isScoreExact) {
        $months[$month]['value'] = $months[$month]['value'] + $row['dataBet']['coteScore'];
      }
    }
    $bestMonthScore = 0;
    $index = 0;
    foreach ($months as $month) {
      if ($month['value'] > $bestMonthScore) {
        $bestMonthScore = $month['value'];
        $dataMonth = $month['dataMonth'];
      }
    }
    $extra = array();
    if ($bestMonthScore > 0) {    
      $extra = [
        'date' => $dataMonth['dataMatch']['date'],
        'saison' => $dataMonth['dataMatch'] ['saison']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestMonthScore,
      'extra' => $extra
    ];
  }

  function BestNumberCorrectResultRound($userName, $data) {
    $rounds = array();
    foreach ($data as $row) {
      $round = $row['dataMatch']['round'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($rounds[$round])) {
        $rounds[$round] = [
          'value' => 0,
          'dataRound' => $row
        ];
      }
      $isCorrectResult = (
        ($scoreDomicile - $scoreExterieur > 0
        && $scoreDomicileBet - $scoreExterieurBet > 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur < 0
        && $scoreDomicileBet - $scoreExterieurBet < 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur == 0 
        && $scoreDomicileBet - $scoreExterieurBet == 0      
        && $scoreDomicile >= 0)
      );
      if ($isCorrectResult) {
        $rounds[$round]['value'] = $rounds[$round]['value'] + 1;
      }
    }
    $bestRoundScore = 0;
    $index = 0;
    foreach ($rounds as $round) {
      if ($round['value'] > $bestRoundScore) {
        $bestRoundScore = $round['value'];
        $dataRound = $round['dataRound'];
      }
    }
    $extra = array();
    if ($bestRoundScore > 0) {    
      $extra = [
        'round' => $dataRound['dataMatch']['round'],
        'saison' => $dataRound['dataMatch'] ['saison']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestRoundScore,
      'extra' => $extra
    ];
  }

  function BestNumberCorrectResultMonth($userName, $data) {
    $months = array();
    foreach ($data as $row) {
      $month = $row['dataMatch']['month'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($months[$month])) {
        $months[$month] = [
          'value' => 0,
          'dataMonth' => $row
        ];
      }
      $isCorrectResult = (
        ($scoreDomicile - $scoreExterieur > 0
        && $scoreDomicileBet - $scoreExterieurBet > 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur < 0
        && $scoreDomicileBet - $scoreExterieurBet < 0
        && $scoreDomicile >= 0)
        ||
        ($scoreDomicile - $scoreExterieur == 0 
        && $scoreDomicileBet - $scoreExterieurBet == 0      
        && $scoreDomicile >= 0)
      );
      if ($isCorrectResult) {
        $months[$month]['value'] = $months[$month]['value'] + 1;
      }
    }
    $bestMonthScore = 0;
    $index = 0;
    foreach ($months as $month) {
      if ($month['value'] > $bestMonthScore) {
        $bestMonthScore = $month['value'];
        $dataMonth = $month['dataMonth'];
      }
    }
    $extra = array();
    if ($bestMonthScore > 0) {    
      $extra = [
        'date' => $dataMonth['dataMatch']['date'],
        'saison' => $dataMonth['dataMatch'] ['saison']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestMonthScore,
      'extra' => $extra
    ];
  }

  function BestNumberScoreExactMonth($userName, $data) {
    $months = array();
    foreach ($data as $row) {
      $month = $row['dataMatch']['month'];
      $scoreDomicile = $row['dataMatch']['scoreDomicile'];
      $scoreExterieur = $row['dataMatch']['scoreExterieur'];
      $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
      $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
      if (!isset($months[$month])) {
        $months[$month] = [
          'value' => 0,
          'dataMonth' => $row
        ];
      }
      $isScoreExact = (
        $scoreDomicileBet == $scoreDomicile
        && $scoreExterieurBet == $scoreExterieur
      );
      if ($isScoreExact) {
        $months[$month]['value'] = $months[$month]['value'] + 1;
      }
    }
    $bestMonthScore = 0;
    $index = 0;
    foreach ($months as $month) {
      if ($month['value'] > $bestMonthScore) {
        $bestMonthScore = $month['value'];
        $dataMonth = $month['dataMonth'];
      }
    }
    $extra = array();
    if ($bestMonthScore > 0) {    
      $extra = [
        'date' => $dataMonth['dataMatch']['date'],
        'saison' => $dataMonth['dataMatch'] ['saison']
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestMonthScore,
      'extra' => $extra
    ];
  }

  function TeamWinSeries($userName, $data) {
    $rounds = array();
    $teams = array();
    foreach ($data as $row) {
      $round = $row['dataMatch']['round'];
      if (!isset($rounds[$round])) {
        $rounds[$round] = array();
      }
      $rounds[$round][] = $row;
    }
    foreach ($rounds as $round => $matchs) {
      foreach ($matchs as $row) {
        $teamDomicile = $row['dataMatch']['teamDomicile'];
        $teamExterieur = $row['dataMatch']['teamExterieur'];
        $scoreDomicile = $row['dataMatch']['scoreDomicile'];
        $scoreExterieur = $row['dataMatch']['scoreExterieur'];
        $scoreDomicileBet = $row['dataBet']['scoreDomicileBet'];
        $scoreExterieurBet = $row['dataBet']['scoreExterieurBet'];
        if (!isset($teams[$teamDomicile])) {
          $teams[$teamDomicile] = [
            'value' => 0,
            'bestValue' => 0,
            'team' => $teamDomicile
          ];
        }
        if (!isset($teams[$teamExterieur])) {
          $teams[$teamExterieur] = [
            'value' => 0,
            'bestValue' => 0,
            'team' => $teamExterieur
          ];
        }
        $isCorrectResult = (
          ($scoreDomicile - $scoreExterieur > 0
          && $scoreDomicileBet - $scoreExterieurBet > 0
          && $scoreDomicile >= 0)
          ||
          ($scoreDomicile - $scoreExterieur < 0
          && $scoreDomicileBet - $scoreExterieurBet < 0
          && $scoreDomicile >= 0)
          ||
          ($scoreDomicile - $scoreExterieur == 0 
          && $scoreDomicileBet - $scoreExterieurBet == 0      
          && $scoreDomicile >= 0)
        );
        if ($isCorrectResult) {
          $teams[$teamDomicile]['value'] = $teams[$teamDomicile]['value'] + 1;
          if ($teams[$teamDomicile]['value'] > $teams[$teamDomicile]['bestValue']) {
            $teams[$teamDomicile]['bestValue'] = $teams[$teamDomicile]['value'];
          }
          $teams[$teamExterieur]['value'] = $teams[$teamExterieur]['value'] + 1;
          if ($teams[$teamExterieur]['value'] > $teams[$teamExterieur]['bestValue']) {
            $teams[$teamExterieur]['bestValue'] = $teams[$teamExterieur]['value'];
          }
        }
        else {
          $teams[$teamDomicile]['value'] = 0;
          $teams[$teamExterieur]['value'] = 0;
        }
      }
    }
    $bestSeries = 0;
    $index = 0;
    foreach ($teams as $team) {
      if ($team['bestValue'] > $bestSeries) {
        $bestSeries = $team['bestValue'];
        $dataTeam = $team['team'];
      }
    }
    $extra = array();
    if ($bestSeries > 0) {    
      $extra = [
        'team' => $dataTeam
      ];
    }
    return [
      'userName' => $userName,
      'value' => $bestSeries,
      'extra' => $extra
    ];
  }

  $users = fetchUsers();
  $matchs = fetchMatchs();
  $bets = fetchBets();
  $listUsersBet = processData($users, $matchs, $bets);
  $listRecord = [
    buildRecordTable('match', 'Meilleurs cotes scores exacts', $listUsersBet, 'BestExactScore'),
    buildRecordTable('match', 'Meilleurs cotes résultats corrects', $listUsersBet, 'BestCorrectResult'),
    buildRecordTable('round', 'Meilleurs journées', $listUsersBet, 'BestRound'),
    buildRecordTable('month', 'Meilleurs mois', $listUsersBet, 'BestMonth'),
    buildRecordTable('round', 'Plus grand nombre de résultats corrects sur une journée', $listUsersBet, 'BestNumberCorrectResultRound'),
    buildRecordTable('month', 'Plus grand nombre de résultats corrects sur un mois', $listUsersBet, 'BestNumberCorrectResultMonth'),
    buildRecordTable('month', 'Plus grand nombre de scores exacts sur un mois', $listUsersBet, 'BestNumberScoreExactMonth'),
    buildRecordTable('team', 'Plus grosse série de résultats corrects avec la même équipe impliquée', $listUsersBet, 'TeamWinSeries'),
  ];
  echo json_encode($listRecord);











// function listCountScoreExact($matchs, $users, $bets) {
  //   $listCountScoreExact = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']) {
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       //Test si ligne user existe
  //       if (isset($listCountScoreExact[$userName])) {
  //         //Test si ligne saison existe
  //         if (isset($listCountScoreExact[$userName][$match['saison']])) {
  //           //Test si ligne journée existe
  //           if (!isset($listCountScoreExact[$userName][$match['saison']][$match['month']])) {
  //             $listCountScoreExact[$userName][$match['saison']][$match['month']] = 0;
  //           }
  //         }
  //         else {
  //           $listCountScoreExact[$userName][$match['saison']][$match['month']] = 0;
  //         }
  //       }
  //       else {
  //         $listCountScoreExact[$userName][$match['saison']][$match['month']] = 0;
  //       }
  //       // Test si résultat correct
  //       if (
  //         $match['id'] == $bet['matchId'] 
  //         && $match['scoreDomicile'] == $bet['scoreDomicile'] 
  //         && $match['scoreExterieur'] == $bet['scoreExterieur']
  //       ) {
  //           $listCountScoreExact[$userName][$match['saison']][$match['month']] ++;
  //       }
  //     }
  //   }
  //   $rankingCountScoreExact = array();
  //   foreach ($listCountScoreExact as $userName => $value1) {
  //     foreach ($listCountScoreExact[$userName] as $saison => $value2) {
  //       foreach ($listCountScoreExact[$userName][$saison] as $month => $value3) {
  //         $extra = [
  //           'saison' => $saison,
  //           'month' => $month,
  //           'type' => 'month'
  //         ];
  //         $rankingCountScoreExact[] = [
  //           'userName' => $userName,
  //           'score' => $value3,
  //           'extra' => $extra
  //         ];
  //       }
  //     }
  //   }
  //   usort($rankingCountScoreExact, 'compareScore');
  //   return [
  //     'title' => 'Plus grand nombre de score exact sur un mois',
  //     'ranking' => $rankingCountScoreExact
  //   ];
  // }

  // function listCountResultMonth($matchs, $users, $bets) {
  //   $listCountResultMonth = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']) {
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       //Test si ligne user existe
  //       if (isset($listCountResultMonth[$userName])) {
  //         //Test si ligne saison existe
  //         if (isset($listCountResultMonth[$userName][$match['saison']])) {
  //           //Test si ligne journée existe
  //           if (!isset($listCountResultMonth[$userName][$match['saison']][$match['month']])) {
  //             $listCountResultMonth[$userName][$match['saison']][$match['month']] = 0;
  //           }
  //         }
  //         else {
  //           $listCountResultMonth[$userName][$match['saison']][$match['month']] = 0;
  //         }
  //       }
  //       else {
  //         $listCountResultMonth[$userName][$match['saison']][$match['month']] = 0;
  //       }
  //       // Test si résultat correct
  //       if (
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] > 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] > 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] < 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] < 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] == 0 
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] == 0      
  //         && $match['scoreDomicile'] >= 0)
  //       ) {
  //           $listCountResultMonth[$userName][$match['saison']][$match['month']] ++;
  //       }
  //     }
  //   }
  //   $rankingCountResult = array();
  //   foreach ($listCountResultMonth as $userName => $value1) {
  //     foreach ($listCountResultMonth[$userName] as $saison => $value2) {
  //       foreach ($listCountResultMonth[$userName][$saison] as $month => $value3) {
  //         $extra = [
  //           'saison' => $saison,
  //           'month' => $month,
  //           'type' => 'month'
  //         ];
  //         $rankingCountResult[] = [
  //           'userName' => $userName,
  //           'score' => $value3,
  //           'extra' => $extra
  //         ];
  //       }
  //     }
  //   }
  //   usort($rankingCountResult, 'compareScore');
  //   return [
  //     'title' => 'Plus grand nombre de résultat correct sur un mois',
  //     'ranking' => $rankingCountResult
  //   ];
  // }

  // function listCountResultRound($matchs, $users, $bets) {
  //   $listCountResultRound = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']) {
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       //Test si ligne user existe
  //       if (isset($listCountResultRound[$userName])) {
  //         //Test si ligne saison existe
  //         if (isset($listCountResultRound[$userName][$match['saison']])) {
  //           //Test si ligne journée existe
  //           if (!isset($listCountResultRound[$userName][$match['saison']][$match['round']])) {
  //             $listCountResultRound[$userName][$match['saison']][$match['round']] = 0;
  //           }
  //         }
  //         else {
  //           $listCountResultRound[$userName][$match['saison']][$match['round']] = 0;
  //         }
  //       }
  //       else {
  //         $listCountResultRound[$userName][$match['saison']][$match['round']] = 0;
  //       }
  //       // Test si résultat correct
  //       if (
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] > 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] > 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] < 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] < 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] == 0 
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] == 0      
  //         && $match['scoreDomicile'] >= 0)
  //       ) {
  //           $listCountResultRound[$userName][$match['saison']][$match['round']] ++;
  //       }
  //     }
  //   }
  //   $rankingCountResult = array();
  //   foreach ($listCountResultRound as $userName => $value1) {
  //     foreach ($listCountResultRound[$userName] as $saison => $value2) {
  //       foreach ($listCountResultRound[$userName][$saison] as $round => $value3) {
  //         $extra = [
  //           'saison' => $saison,
  //           'round' => $round,
  //           'type' => 'round'
  //         ];
  //         $rankingCountResult[] = [
  //           'userName' => $userName,
  //           'score' => $value3,
  //           'extra' => $extra
  //         ];
  //       }
  //     }
  //   }
  //   usort($rankingCountResult, 'compareScore');
  //   return [
  //     'title' => 'Plus grand nombre de résultat correct sur une journée',
  //     'ranking' => $rankingCountResult
  //   ];
  // }

  // function listRound($matchs, $users, $bets) {
  //   $listRound = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']) {
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       //Test si ligne user existe
  //       if (isset($listRound[$userName])) {
  //         //Test si ligne saison existe
  //         if (isset($listRound[$userName][$match['saison']])) {
  //           //Test si ligne journée existe
  //           if (!isset($listRound[$userName][$match['saison']][$match['round']])) {
  //             $listRound[$userName][$match['saison']][$match['round']] = 0;
  //           }
  //         }
  //         else {
  //           $listRound[$userName][$match['saison']][$match['round']] = 0;
  //         }
  //       }
  //       else {
  //         $listRound[$userName][$match['saison']][$match['round']] = 0;
  //       }
  //       // Test si résultat correct
  //       if (
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] > 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] > 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] < 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] < 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] == 0 
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] == 0      
  //         && $match['scoreDomicile'] >= 0)
  //       ) {
  //         //Test si score correct
  //         if (
  //           $match['id'] == $bet['matchId'] 
  //           && $match['scoreDomicile'] == $bet['scoreDomicile'] 
  //           && $match['scoreExterieur'] == $bet['scoreExterieur']
  //         ) {
  //           $listRound[$userName][$match['saison']][$match['round']] = $listRound[$userName][$match['saison']][$match['round']] + $bet['coteScore'] + $bet['coteResult'];
  //         }
  //         else {
  //           $listRound[$userName][$match['saison']][$match['round']] = $listRound[$userName][$match['saison']][$match['round']] + $bet['coteResult'];
  //         }
  //       }
  //     }
  //   }
  //   $rankingRound = array();
  //   foreach ($listRound as $userName => $value1) {
  //     foreach ($listRound[$userName] as $saison => $value2) {
  //       foreach ($listRound[$userName][$saison] as $round => $value3) {
  //         $extra = [
  //           'saison' => $saison,
  //           'round' => $round,
  //           'type' => 'round'
  //         ];
  //         $rankingRound[] = [
  //           'userName' => $userName,
  //           'score' => $value3,
  //           'extra' => $extra
  //         ];
  //       }
  //     }
  //   }
  //   usort($rankingRound, 'compareScore');
  //   return [
  //     'title' => 'Meilleurs journées',
  //     'ranking' => $rankingRound
  //   ];
  // }


  // function listScoreExact($matchs, $users, $bets) {
  //   $listScoreExact = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']) {
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       if (
  //         $match['id'] == $bet['matchId'] 
  //         && $match['scoreDomicile'] == $bet['scoreDomicile'] 
  //         && $match['scoreExterieur'] == $bet['scoreExterieur']
  //       ) {
  //         $extra = [
  //           'teamDomicile' => $match['teamDomicile'],
  //           'teamExterieur' => $match['teamExterieur'],
  //           'scoreDomicile' => $match['scoreDomicile'],
  //           'scoreExterieur' => $match['scoreExterieur'],
  //           'type' => 'match'
  //         ];
  //         $scoreExact = [
  //           'userId' => $bet['userId'],
  //           'userName' => $userName,
  //           'extra' => $extra,
  //           'score' => $bet['coteScore']
  //         ];
  //         $listScoreExact[] = $scoreExact;
  //       }
  //     }
  //   }
  //   usort($listScoreExact, 'compareScore');
  //   return [
  //     'title' => 'Meilleurs cotes résultats',
  //     'ranking' => $listScoreExact
  //   ];
  // }

  // function listCorrectResult($matchs, $users, $bets) {
  //   $listCorrectResult = array();
  //   foreach ($bets as $bet) {
  //     foreach ($users as $user) {
  //       if($user['id'] == $bet['userId']){
  //         $userName = $user['userName'];
  //       }
  //     }
  //     foreach ($matchs as $match) {
  //       if (
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] > 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] > 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] < 0
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] < 0
  //         && $match['scoreDomicile'] >= 0)
  //         ||
  //         ($match['id'] == $bet['matchId']
  //         && $match['scoreDomicile'] - $match['scoreExterieur'] == 0 
  //         && $bet['scoreDomicile'] - $bet['scoreExterieur'] == 0      
  //         && $match['scoreDomicile'] >= 0)
  //       ) {
  //         $teamDomicile = $match['teamDomicile'];
  //         $teamExterieur = $match['teamExterieur'];
  //         $extra = [
  //           'teamDomicile' => $teamDomicile,
  //           'teamExterieur' => $teamExterieur,
  //           'scoreDomicile' => $match['scoreDomicile'],
  //           'scoreExterieur' => $match['scoreExterieur'],
  //           'type' => 'match'
  //         ];
  //         $scoreResult = [
  //           'userId' => $bet['userId'],
  //           'userName' => $userName,
  //           'extra' => $extra,
  //           'score' => $bet['coteResult']
  //         ];
  //         $listCorrectResult[] = $scoreResult;
  //       }
  //     }
  //   }
  //   usort($listCorrectResult, 'compareScore');
  //   return [
  //     'title' => 'Meilleurs cotes scores exacts',
  //     'ranking' => $listCorrectResult
  //   ];
  // }
?>
