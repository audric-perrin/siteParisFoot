<?php
	// Open the SQL connection
	$conn = mysqli_connect('localhost', 'root', 'root', 'parions-sport-gratuit') or die(mysql_error());
	mysqli_set_charset($conn, 'utf8');
  // Execution de la query
	function runQuery($query){
		global $conn;
		return $conn->query($query);
	}
  // Retourne une ligne
  function runSingleLineQuery($query){
    global $conn;
    $result = mysqli_query($conn, $query);
    if ($result) {
      return mysqli_fetch_assoc($result);
    }
    else {
      return null;
    }
  }
?>
