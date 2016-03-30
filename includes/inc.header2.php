<?php
	//get navigation
	if(isset($_SERVER['APPL_PHYSICAL_PATH'])) {
		$wwwPath = $_SERVER['APPL_PHYSICAL_PATH'];
	}
	elseif(isset($_SERVER['DOCUMENT_ROOT'])) {
		$wwwPath = $_SERVER['DOCUMENT_ROOT'];
	}
	else {
		$wwwPath = __DIR__;
	}
  if (substr($wwwPath, -1) != "/") { // if path doesn't have a slash, add it ... fixes Apache
    $wwwPath = $wwwPath . "/"; 
  }
//	/set_include_path( $wwwPath );

	$navjson = file_get_contents($wwwPath.'includes/navigation.json');
	$navigation = json_decode($navjson, true);
?>
<!doctype html>
<html>
	<head>

		<!-- <base href="http://maps.garrettcounty.org/" /> -->

		<title><?php if(isset($htmlTitle)) { echo $htmlTitle; } else { echo "Garrett County Government &#045; Webmaps"; } ?></title>

		<!-- META -->
		<META NAME="DESCRIPTION" CONTENT="Live, work, and play, during all four beautiful seasons in Garrett County, Maryland. Nestled in the Appalachian Mountains, Garrett County is the westernmost county in Maryland. The County  is governed by an elected Board of County Commissioners, whose three members serve four-year terms and must live in the District which they represent.">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta charset="UTF-8">

		<!--FB-->
		<meta property="fb:app_id" content="369458316457002">
		<meta property="og:url" content="<?php echo $_SERVER['REQUEST_URI']; ?>"/>
		<meta property="og:description" content="Live, work, and play, during all four beautiful seasons in Garrett County, Maryland. Nestled in the Appalachian Mountains, Garrett County is the westernmost county in Maryland. The County  is governed by an elected Board of County Commissioners, whose three members serve four-year terms and must live in the District which they represent."/>
		<meta property="og:image" content="http://maps.garrettcounty.org/includes/images/app/fb-og-img.png"/>
		<meta property="og:title" content="Garrett County Government GIS"/>
		<meta property="og:site_name" content="Garrett County Government GIS"/>
		<meta property="og:type" content="website"/>
		
		<link rel="icon" href="/includes/images/app/favicon.png" />
		
		<!-- CSS -->
		<link href="/includes/css/reset.min.css" rel="stylesheet" type="text/css" />
		<link href="/includes/css/unsemantic-grid-responsive-tablet-no-ie7.css" rel="stylesheet" type="text/css" />
		<link href="/includes/css/style.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="/includes/css/gcmenu2.css" />
		<link rel="icon" href="/includes/images/favicon.ico" />

		<script src="/includes/js/jquery-1.11.1.min.js"></script>
    <!-- <script src="../sandbox/menu_testing/js/gc2_jquery.min.js"></script> -->
		<script src="/includes/js/listeners.js"></script>
    <script src="/includes/js/gc_menu2.js" type="text/javascript"></script>
		
		<?php if(isset($htmlHEAD)) { echo $htmlHEAD; } ?>
		
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-34398188-11', 'auto');
			ga('require', 'displayfeatures');
			ga('send', 'pageview');
	  </script>

	</head>

	<body class="<?php if(isset($htmlBodyClass)) { echo $htmlBodyClass; } ?>">
		
		<div id="gcgov-header">
			<div class="grid-container">
				
				<div class="grid-40 tablet-grid-50">
					<a class="logo" href="/">
						<img src="/includes/images/logo.png" class="logo-img" alt="Garrett County Seal" />
						<span class="logo-title">Garrett County Government</span>
						<span class="logo-subtitle">Geographic Information System (GIS)</span>
					</a>
				</div>
				
				<div class="grid-60 tablet-grid-50">
        <!-- Start Sample content -->
        <div class="container">
          
        <a class="toggleMenu" href="#" style="display: none; ">Menu</a>
        <ul class="nav" style="">
          <li class="">
            <a href="#" class="parent">Maps</a>
            <ul>
              <li>
                <a href="#" class="parent">General Info</a>
                <ul>
                  <li><a href="pz_map2.php">Planning & Zoning</a></li>
                  <li><a href="measure.php">Measurements</a></li>
                </ul>
              </li>
              <li>
                <a href="#" class="parent">Hazard Maps</a>
                <ul>
                  <li><a href="FEMA_map.php">Flood Hazard Map</a></li>
                  <li><a href="sensitive.php">Sensitive Areas</a></li>
                </ul>
              </li>
              <li>
                <a href="#" class="parent">Printing</a>
                <ul>
                  <li><a href="printable.php">Printable Map</a></li>
                  <li><a href="app/">PDF Grid Maps</a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="">
            <a href="#" class="parent">Help</a>
            <ul>
              <li>
                <a href="http://localhost/video/Webmaps2.mp4">Video</a>
              </li>
              <li>
                <a href="../help.php">Documentation</a>
               </li>
              
            </ul>
          </li>
          
          </ul>
        </div>
        <!-- End Sample content -->          
		          
				</div><!-- container -->
        </div>
			</div>
		<div id="body-container">