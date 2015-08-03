<?php
$fullUrl = "http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx?County=12&SearchType=ACCT&District=18&AccountNumber=020076";
// $fullUrl = "http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx?County=12&SearchType=ACCT&District=06&AccountNumber=026761";
$ch = curl_init($fullUrl);
if (! $ch) {
	die( "Cannot allocate a new PHP-CURL handle" );
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);


$data = curl_exec($ch);
header("Content-type: text");
// print( $data );
curl_close($ch);

/*
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $fullurl);
*/
// $output = curl_exec ($ch);
// echo curl_error($ch) . " " . $output;" - output: " . $output;

?>

<?php

libxml_use_internal_errors(true);
// $dom->loadHTML('...');
libxml_clear_errors();

$html = '<div style="demo">
<div class="row">
    <div title="abc@examples.com" class="text">ABC</div>
</div>
<div class="row">
    <div title="pqr@examples.com" class="text">PQR</div>
</div></div>
';

$doc = DOMDocument::loadHTML($data); // $html // trying to substitute in $data
$xpath = new DOMXPath($doc);
// libxml_use_internal_errors(true);

// $ownname1 = $doc->getElementsByTagName('td')->item(0);
// THIS $query returns the precise value for owner name 1.
$ownName1query = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0"][@class="text"]';
$ownName2query = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName2_0"][@class="text"]';
$ownAddrquery = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblMailingAddress_0"][@class="text"]';

$entries = $xpath->query($ownName1query);
foreach($entries as $entry) {
  // echo "{$entry->nodeValue} <br />";
  $ownname1 = $entry->nodeValue;
}

$entries = $xpath->query($ownName2query);
foreach($entries as $entry) {
  // echo "{$entry->nodeValue} <br />";
  $ownname2 = $entry->nodeValue;
}

$entries = $xpath->query($ownAddrquery);
// $entries = mb_convert_encoding($entries, 'HTML-ENTITIES', "UTF-8");
// $pattern = '/<br/\>';
$pattern = '#<br\s*/?>#i';
$replacement = ", ";
$i=0;
foreach($entries as $entry) {
  // echo "{$entry->nodeValue} <br />";
  /* echo split('#<br\s*/questionmark>#i', strval($entry)); */
  // $entries->item($i)->nodeValue = $edits[$i];
  // $entry = mb_convert_encoding($entry, 'HTML-ENTITIES', "UTF-8");
  // $ownAddr = $entry->nodeValue;
  $ownAddr = $entry->nodeValue;
  if(!$entry->childNodes == 0) {
    $ownAddr = $doc->saveHTML($entry);
    echo "YES"; 
    // echo $entry->firstChild-textContent;
    // echo $entry->firstChild - Creates <br/> but throws an error.
    // echo $ownAddr->textContent; This apparently does nothing.
    echo "YES";
    
  }
  $ownAddr2 = preg_replace($pattern, $replacement, $ownAddr, 15, $count);
  // $i++;
  // $ownAddr3 = mb_convert_encoding($ownAddr2, 'HTML-ENTITIES', "UTF-8"); 
  $ownAddr3 = strip_tags($ownAddr2);
}

echo "Owner Name 1: " . $ownname1 . "\n";
echo "Owner Name 2: " . $ownname2 . "\n";
echo "Owner Address: " . $ownAddr3 . "\n";
// echo strval($ownAddr);
echo $count;



/*
foreach($xpath->query('//div[@class="mdgov_OverflowTable"]/table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0"') as $span) {
// foreach($ownname1->item(0)) { // '//span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0"') as $span) {
  echo $span->value . PHP_EOL;
}
*/


/*
foreach($xpath->query('//div[@style="demo"]/div[@class="row"]/div[@class="text"]/@title') as $div){
  echo $div->value . PHP_EOL;
}
*/