<?php
  require_once('../api/requireConnected.php');
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
        'dataBet' => $dataBet,
        'userInfo' => ['userId' => $bet['userId']]
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
      $result = call_user_func_array($recordFunc, [$userName, $data]);
      if (count($data) == 0) {
        $result['userId'] = 0;
      }
      else {
        $result['userId'] = $data[0]['userInfo']['userId'];
      }
      $results[] = $result;
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
    buildRecordTable('match', 'Meilleur cote score exact', $listUsersBet, 'BestExactScore'),
    buildRecordTable('match', 'Meilleur cote résultat correct', $listUsersBet, 'BestCorrectResult'),
    buildRecordTable('round', 'Meilleur journée', $listUsersBet, 'BestRound'),
    buildRecordTable('month', 'Meilleur mois', $listUsersBet, 'BestMonth'),
    buildRecordTable('round', 'Plus grand nombre de résultats corrects sur une journée', $listUsersBet, 'BestNumberCorrectResultRound'),
    buildRecordTable('month', 'Plus grand nombre de résultats corrects sur un mois', $listUsersBet, 'BestNumberCorrectResultMonth'),
    buildRecordTable('month', 'Plus grand nombre de scores exacts sur un mois', $listUsersBet, 'BestNumberScoreExactMonth'),
    buildRecordTable('team', 'Plus grosse série de résultats corrects avec la même équipe impliquée', $listUsersBet, 'TeamWinSeries'),
  ];
  echo json_encode($listRecord);
?>
