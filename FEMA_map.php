<?php 
	ob_start(); 
	//instert HTML HEAD here
?>
    <link rel="stylesheet" href="javascript/dojo_1_10_4/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="https://js.arcgis.com/3.13/esri/css/esri.css">
    <link rel="stylesheet" href="../css/mapstyles.css">

    <script type="text/javascript" src="https://js.arcgis.com/3.13/"></script>
    <script type="text/javascript" src="javascript/fema.yui.js"></script>

<?php 
	$htmlHEAD = ob_get_contents();
	ob_end_clean();
	
	//body class
	$htmlBodyClass = 'claro';
  $htmlTitle = 'Flood Hazard Map';
	
	//build the header
	include('../includes/inc.header.php'); 
	
	//you are now inside the html body:
?>
<?php
  if (isset($_GET['px'])) {
    $px = trim(stripslashes($_GET[px]));
  } else {
    $px = -79.2;
  }
  if (isset($_GET['py'])) {
    $py = trim(stripslashes($_GET[py]));
  } else {
    $py = 39.5;
  }  
  if (isset($_GET['zl'])) {
    $zoom = trim(stripslashes($_GET[zl]));
  } else {
    $zoom = 10;
  }
?>
    <script>
      var passedX = '<?php echo $px; ?>';
      var passedY = '<?php echo $py; ?>';
      var zoomLevel = '<?php echo $zoom; ?>';
    </script>
    <div id="mainWindow" data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'headline',gutters:false"
        style="width:100%; height:100%;">
      <div id="mapDiv" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
        <div id="geosearch"></div>

        <div id="positioning_div" style="position:absolute; right:20px; top:10px; z-Index:999;">
          <div data-dojo-type="dijit/TitlePane" 
               data-dojo-props="title:'Switch Basemap', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="basemapGallery" ></div>
            </div><!-- ContentPane 1 -->
          </div><!-- TitlePane 1 "Switch Basemap" -->  
          <div data-dojo-type="dijit/TitlePane" 
               data-dojo-props="title:'Flood Hazard Legend', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="Flood_Hazard_Legend" >
                <img src="images/FEMA_legend.PNG" /><br />
                <ul>
                  <li>A indicates the 100&#045;year Flood Hazard Area</li>
                  <li>AE indicates the 100&#045;year Flood Hazard
                  Area as determined by detailed methods.</li>
                  <li>The 0.2 PCT Annual Hazard is also known as 
                  the 500&#045;year Flood Hazard Area.</li>
                </ul>
              </div>
            </div><!-- ContentPane 2 -->            
          </div><!-- TitlePane 1 "Switch Basemap" -->  
          <div data-dojo-type="dijit/TitlePane" 
             data-dojo-props="title:'Navigation', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <button id="launchButton" data-dojo-type="dijit/form/Button">Launch</button>
              <input id="mapSelect"><br />
              <ul>
                <li><a href="../help.php">Help ?</a></li>
                <li><a href="../">Home</a></li>
              </ul>
              <p>
                By default, the Launch Button will reload this page in the same window, updating the extent in the address bar. 
                This works well for copying and pasting a link to a specific location on this map.
                Choose a different map to launch the current extent in a new window or tab (depending on your browser preferences).
                The different maps have different uses (see the <a href="../help.php">Help &amp; Documentation</a> for more information).
              </p>              
            </div><!-- ContentPane 3 -->
          </div><!-- TitlePane Navigation -->
          
        </div><!-- positioning_div -->
        
      </div><!-- mapDiv -->  
    </div><!-- mainWindow -->
  </body>
</html>