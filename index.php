<?php
require_once ('php/sql.php');
?>

<!DOCTYPE html>
<html>
<head>
  <title>Paris L1</title>
</head>
<body>
  <?php selectRound() ?>
</body>
</html>

<?php
  function selectRound(){
    echo "<select>";
      for ($round = 1; $round < 10000; $round++) { 
        echo "<option>Journée " . $round . "</option>";
      }
    echo "</select>";
  }
?>