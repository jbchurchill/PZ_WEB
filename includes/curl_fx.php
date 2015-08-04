<?php

function getSDAT ($inputUrl="") {
  // $fullUrl = "http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx?County=12&SearchType=ACCT&District=18&AccountNumber=020076";
  // $fullUrl = "http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx?County=12&SearchType=ACCT&District=06&AccountNumber=026761";
  // PROBLEM Parcels layer gives URL in form http://sdatcert3.resiusa.org/rp_rewrite/details.aspx?County=12&SearchType=ACCT&District=03&AccountNumber=013618
  // On the website that redirects to http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx?County=12&SearchType=ACCT&District=03&AccountNumber=013618
  // Curl isn't getting the data because it is based on the rewritten version
  // Solution = search and replace
  $fullUrl = str_replace('http://sdatcert3.resiusa.org/rp_rewrite/details.aspx', 'http://sdat.dat.maryland.gov/RealProperty/Pages/viewdetails.aspx', $inputUrl);
  // echo $fullUrl;
  $ch = curl_init($fullUrl);
  if (! $ch) {
    die( "Cannot allocate a new PHP-CURL handle" );
  }
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text'));

  $data = curl_exec($ch);
  // header("Content-type: text");
  curl_close($ch);

  libxml_use_internal_errors(true);
  libxml_clear_errors();

  $doc = DOMDocument::loadHTML($data);
  $xpath = new DOMXPath($doc);

  // THIS $query returns the precise value for owner name 1.
  $ownName1query = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName_0"][@class="text"]';
  $ownName2query = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblOwnerName2_0"][@class="text"]';
  $ownAddrquery = '//table/tr/td/span[@id="MainContent_MainContent_cphMainContentArea_ucSearchType_wzrdRealPropertySearch_ucDetailsSearch_dlstDetaisSearch_lblMailingAddress_0"][@class="text"]';

  $entries = $xpath->query($ownName1query);
  foreach($entries as $entry) {
    $ownname1 = $entry->nodeValue;
  }

  $entries = $xpath->query($ownName2query);
  foreach($entries as $entry) {
    $ownname2 = $entry->nodeValue;
  }

  $entries = $xpath->query($ownAddrquery);
  $pattern = '#<br\s*/?>#i';
  $replacement = ", ";
  $i=0;
  foreach($entries as $entry) {
    $ownAddr = $entry->nodeValue;
    if(!$entry->childNodes == 0) {
      $ownAddr = $doc->saveHTML($entry);      
    }
    $ownAddr2 = preg_replace($pattern, $replacement, $ownAddr, 15, $count); // replace <br/> with a comma
    $ownAddr3 = strip_tags($ownAddr2);
  }

  // echo "Owner Name 1: " . $ownname1 . "\n";
  // echo "Owner Name 2: " . $ownname2 . "\n";
  // echo "Owner Address: " . $ownAddr3 . "\n";
  // echo strval($ownAddr);
  // echo $count;
  return array($ownname1, $ownname2, $ownAddr3);
}