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
  if (isset($_POST[append_data])) {
    $doAppend = trim(stripslashes($_POST[append_data]));
    $doAppendAnswer = "<br />Data was not appended. The file was deleted and new data was written.";
    $fileAccess = 'w';
  } else {
    $doAppendAnswer = "<br />Data was appended to the file.";
    $fileAccess = 'a+';
  }
?>  
<?php
  // $File = "E:\map-data\Planning\Zoning\WEB_FILES\YourFile.txt";
  $File = "YourFile.txt"; // USE THIS ONE FOR LOCALHOST
  $Handle = fopen($File, $fileAccess); // 'a+'); // use write instead of append
  // $Data = "Jane Doe\r\n";
  if ($fileAccess === 'w' && $doAppend === "parcel") {
    fwrite($Handle, "M, P, Link\r\n");
  }
  if ($fileAccess === 'a+' && $doAppend === "address") {
    fwrite($Handle, "Addresses:");
  }

  include("../../includes/curl_fx.php");
  if ($doAppend === "parcel") {
    // echo strlen($Data);
    $lines = explode(PHP_EOL, $Data);
    // while (($buffer = fgets($Handle)) !== false) {
    foreach($lines as $line) {
      if(strpos($line, "http") > 0) {
        $start = stripos(strval($line), "http");
        $fullLength = strlen($line);
        $urlLength = ($fullLength - $start);
        $fullUrl = substr($line, $start, $urlLength);
        $arraySDAT = getSDAT($fullUrl);
        $line .= ", " . $arraySDAT[0] . ", " . $arraySDAT[1] . ", " . $arraySDAT[2] . "\n";
        fwrite($Handle, $line);
      }  
    }
  }

?>
<?php
  
  // $Data = "Bilbo Jones\r\n";
  // fwrite($Handle, $Data);
  if ($DataAdded === true) {
    print "<h2>YourFile.txt</h2>Data has been added.<br />Close this window or tab to return to the web map.<br />";
  } else {
    print "Data may not have been added. Check the file.<br />";
  }
  fclose($Handle);
  print $doAppendAnswer;
  print "<br />";
  
?>
