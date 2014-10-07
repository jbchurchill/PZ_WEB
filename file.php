<?php
  if (isset($_POST[hidden_field])) {
    $Data = trim(stripslashes($_POST[hidden_field]));
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
  print "Data Added";
  fclose($Handle);
?>
