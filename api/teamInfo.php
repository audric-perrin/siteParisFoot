<?php
  require_once('../php/sql.php');
  sleep(1);
  function teamInfo() {
    $selectName = 'SELECT * FROM teamInfo';
    $result = runQuery($selectName);
    $teamInfo = array();
    foreach ($result as $row) {
      $teamInfo[$row['name']] = array('trueName' => $row['trueName'], 'littleName' => $row['littleName']);
    }
    return $teamInfo;
  }
  header('Content-Type: application/json');
  echo json_encode(teamInfo());
 ?>