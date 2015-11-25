<?php
  if (isset($_POST[hidden_field])) {
    $DataTemp = trim(stripslashes($_POST[hidden_field]));
    $Data = preg_filter("/<br \/>/", "\r\n", $DataTemp);
    // $pattern = array("/<br \/>/", "/<strong>/", "/<\/strong>/", "/<a href=/");
    // $replace = array("\r\n", "", "", "");
    // $DataTemp = preg_filter("/<strong>/", "", $DataTemp);
    // $DataTemp = preg_filter("/<\/strong>/", "", $DataTemp);
    // $Data = preg_filter("/<a href=/", "", $DataTemp);
    $DataAdded = true;
  }
  if (isset($_POST[fname])) {
    $file = trim(stripslashes($_POST[fname]));
    $fileExt = substr($file, -4);
    if (!($fileExt === ".txt")) { // If what was put in the form does not end with .txt, add ".txt".
      $file = $file . ".txt";
    }
  }

  if (isset($_POST[append_data])) {
    $doAppend = trim(stripslashes($_POST[append_data]));
  }
  //  $doAppendAnswer = "<br />Data was not appended. The file was deleted and new data was written.";
  //  $fileAccess = 'w';
  // } else {
  //   $doAppendAnswer = "<br />Data was appended to the file.";
    // $fileAccess = 'a+';
    // echo $doAppend;
  // } There was previously an ending and beginning php tag here and removing them somehow fixed a whitespace issue.
  // $file = "E:\map-data\Planning\Zoning\WEB_FILES\YourFile.txt";
  if ($file === ".txt") { // if they put nothing in, ".txt" is what this should be.
    $file = "YourFile.txt"; // USE THIS ONE FOR LOCALHOST
  }  
  $handle = fopen($file, 'w'); // 'a+'); // use write instead of append
  // $Data = "Jane Doe\r\n";
  if ($doAppend === "parcel") {
    fwrite($handle, "M, P, Lot, Link, Owner Name 1, Owner Name 2, Owner Address, Owner City State Zip\r\n");
  }
  if ($doAppend === "address") {
    fwrite($handle, "Addresses:\r\n");
  }

  include("../../includes/curl_fx.php");
  if ($doAppend === "parcel") {
    // echo strlen($Data);
    $lines = explode(PHP_EOL, $Data);
    // while (($buffer = fgets($handle)) !== false) {
    foreach($lines as $line) {
      if(strpos($line, "http") > 0) {
        $start = stripos(strval($line), "http");
        $fullLength = strlen($line);
        $urlLength = ($fullLength - $start);
        $fullUrl = substr($line, $start, $urlLength);
        $arraySDAT = getSDAT($fullUrl);
        $line .= ", " . $arraySDAT[0] . ", " . $arraySDAT[1] . ", " . $arraySDAT[2] . "\r\n";
        fwrite($handle, $line);
      }  
    }
  } elseif ($doAppend === "address") {
    fwrite($handle, $Data);
  }

?>
<?php
  
  // $Data = "Bilbo Jones\r\n";
  // fwrite($handle, $Data);
  // if ($DataAdded === true) {
  //   print "<h2>YourFile.txt</h2>Data has been added.<br />Close this window or tab to return to the web map.<br />";
  // } else {
  //   print "Data may not have been added. Check the file.<br />";
  // }
  fclose($handle);
  // print $doAppendAnswer;
  // print "<br />";
  
  if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($file).'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}
  
?>
