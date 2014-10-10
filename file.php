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
?>  
<?php
  // $File = "E:\map-data\Planning\Zoning\WEB_FILES\YourFile.txt";
  $File = "YourFile.txt"; // USE THIS ONE FOR LOCALHOST
  $Handle = fopen($File, 'a+');
  // $Data = "Jane Doe\r\n";
  fwrite($Handle, $Data);
  // $Data = "Bilbo Jones\r\n";
  // fwrite($Handle, $Data);
  if ($DataAdded === true) {
    print "Data Added";
  } else {
    print "Data may not have been added. Check the file.";
  }
  fclose($Handle);
?>
