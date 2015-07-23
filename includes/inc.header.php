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
		<meta property="og:image" content="http://gis.garrettcounty.org/includes/images/app/fb-og-img.png"/>
		<meta property="og:title" content="Garrett County Government GIS"/>
		<meta property="og:site_name" content="Garrett County Government GIS"/>
		<meta property="og:type" content="website"/>
		
		<link rel="icon" href="/includes/images/app/favicon.png" />
		
		<!-- CSS -->
		<link href="/includes/css/reset.min.css" rel="stylesheet" type="text/css" />
		<link href="/includes/css/unsemantic-grid-responsive-tablet-no-ie7.css" rel="stylesheet" type="text/css" />
		<link href="/includes/css/style.css" rel="stylesheet" type="text/css" />
		<link rel="icon" href="/includes/images/favicon.ico" />

		<script src="/includes/js/jquery-1.11.1.min.js"></script>
		<script src="/includes/js/listeners.js"></script>
		
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
					<?php foreach($navigation['links'] as $nav) { ?>
						
						<a class="nav <?php if(isset($nav['subnav'])) {  ?>hassubnav<?php } ?>" href="<?php echo $nav['link']; ?>"><span><?php echo $nav['title']; ?></span></a>
						
						<?php if(isset($nav['subnav'])) {  ?>
							<div class="subnav">
								<div class="grid-container">
									
									<?php if(isset($nav['subnav']['icon'])) { ?>
										<div class="grid-20 tablet-grid-20">
											<div class="subnav-icon">
												<img src="<?php echo $nav['subnav']['icon']['source']; ?>" alt="<?php echo $nav['subnav']['icon']['title']; ?> icon" />
												<span class="subnav-icon-title"><?php echo $nav['subnav']['icon']['title']; ?></span>
											</div>
										</div>
									<?php } ?>
									
									<?php foreach($nav['subnav']['groups'] as $group) { ?>
										<div class="grid-20">
											<div class="subnav-title"><?php echo $group['title']; ?></div>
											<?php foreach($group['links'] as $link) { ?>
												<a class="subnav-item" href="<?php echo $link['link']; ?>"><?php echo $link['title']; ?></a>
											<?php } ?>
										</div>
									<?php } ?>
									
								</div>
							</div>
						<?php } //subnav ?>
					<?php } //each top link ?>
				</div>
				
			</div>
		</div>
		
		<div id="body-container">