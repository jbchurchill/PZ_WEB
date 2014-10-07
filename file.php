<?php
  $File = "E:\map-data\Planning\Zoning\WEB_FILES\YourFile.txt";
  $Handle = fopen($File, 'a+');
  $Data = "Jane Doe\r\n";
  fwrite($Handle, $Data);
  $Data = "Bilbo Jones\r\n";
  fwrite($Handle, $Data);
  print "Data Added";
  fclose($Handle);
?>