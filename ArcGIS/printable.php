<?php 
	ob_start(); 
	//instert HTML HEAD here
?>
    <link rel="stylesheet" href="javascript/dojo_1_10_4/dijit/themes/claro/claro.css"><!-- could have used js.arcgis.com/3.13/dijit/themes/claro/claro.css -->
    <!-- <link rel="stylesheet" href="javascript/dojo_1_10_4/dijit/themes/nihilo/nihilo.css"> -->
    <!-- <link rel="stylesheet" href="http://archive.dojotoolkit.org/nightly/dojotoolkit/dojox/layout/resources/ExpandoPane.css"> -->
    <link rel="stylesheet" href="javascript/dojo_1_10_4/dojox/layout/resources/ExpandoPane.css">
    <!-- <link rel="stylesheet" href="https://js.arcgis.com/3.10/js/esri/css/esri.css"> -->
    <link rel="stylesheet" href="https://js.arcgis.com/3.13/esri/css/esri.css">
    <link rel="stylesheet" href="../css/mapstyles.css">
    <style>
      .ds { background: #000; overflow: hidden; position: absolute; z-index: 2; }
      #ds-h div { width: 100%; }
      #ds-l div, #ds-r div { height: 100%; }
      #ds-r div { right: 0; }
      #ds .o1 { filter: alpha(opacity=10); opacity: .1; }
      #ds .o2 { filter: alpha(opacity=8); opacity: .08; }
      #ds .o3 { filter: alpha(opacity=6); opacity: .06; }
      #ds .o4 { filter: alpha(opacity=4); opacity: .04; }
      #ds .o5 { filter: alpha(opacity=2); opacity: .02; }
      #ds .h1 { height: 1px; }
      #ds .h2 { height: 2px; }
      #ds .h3 { height: 3px; }
      #ds .h4 { height: 4px; }
      #ds .h5 { height: 5px; }
      #ds .v1 { width: 1px; }
      #ds .v2 { width: 2px; }
      #ds .v3 { width: 3px; }
      #ds .v4 { width: 4px; }
      #ds .v5 { width: 5px; }
      /* make all dijit buttons the same width */
      .dijitButton .dijitButtonNode, #drawingWrapper, #printButton {
        width: 160px;
      }
      .esriPrint {
        padding: 0;
      }
    </style>

    <script src="https://js.arcgis.com/3.13/"></script>
    <script src="javascript/printable.yui.js" type="text/javascript"></script>    
<?php 
	$htmlHEAD = ob_get_contents();
	ob_end_clean();
	
	//body class
	$htmlBodyClass = 'claro'; // nihilo
  $htmlTitle = 'Printable Map';
	
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
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}
?>
    <script>
      var passedX = '<?php echo $px; ?>';
      var passedY = '<?php echo $py; ?>';
      var zoomLevel = '<?php echo $zoom; ?>';
      var ip = '<?php echo $ip; ?>';
    </script>
    <div id="mainWindow"
         data-dojo-type="dijit/layout/BorderContainer" 
         data-dojo-props="design:'headline',gutters:false"
         style="width: 100%; height: 100%; margin: 0;">
      <div id="header" 
           data-dojo-type="dijit/layout/ContentPane"
           data-dojo-props="region:'top'">
        Garrett County WebMap &#045; Printable Map
        <div id="subheader">PDF or JPG</div>
        <div id="instxns">
          Start by turning off layers you don't want to print. Give the map a meaningful title, and then click &#8220;Prep Map&#8221;. When the map is ready to print the button will say &#8220;printout&#8221; (if not, re&#045;load the page). Click that to open the map in a new tab or window and print or save your map.</div>
      </div>
      <div id="map" class="shadow" 
           data-dojo-type="dijit/layout/ContentPane"
           data-dojo-props="region:'center'"
           style="padding:0;">
        <div id="geosearch"></div>
        <div id="positioning_div">
            <div data-dojo-type="dijit/TitlePane" 
                 data-dojo-props="title:'Switch Basemap', closable:false,  open:false">
              <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
                <div id="basemapGallery" ></div>
              </div><!-- ContentPane 1 -->
            </div><!-- TitlePane 1 "Switch Basemap" -->
           <div data-dojo-type="dijit/TitlePane" class="claro"
               data-dojo-props="title:'Navigation', closable:false,  open:false">
              <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
                <button id="launchButton" data-dojo-type="dijit/form/Button">Launch</button><br />
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
              </div><!-- ContentPane 2 -->
            </div><!-- TitlePane Navigation -->
            <div data-dojo-type="dijit/TitlePane" 
                 data-dojo-props="title:'Enter Lat Long', closable:false,  open:false">
              <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
                <div id="enterLatLong" >
									<form>
										<input type="text" id="textLatLong"><br />
										<input type="button" value="Submit" label="Submit" id="submitLatLongButton" dojoType="dijit.form.Button" />
									</form><br />
									<span id="latlongInstructions">
										<a href="#" class="tooltip">
											<span>
												<img class="callout" src="images/callout.gif" alt="Tooltip graphic" />
												Coordinates shown are for <br />
												<strong>&#8220;Swallow Falls State Park&#8221;</strong>
											</span>
                    	Enter Lat, Long in Decimal Degrees<br />
                  	</a>          
                	</span>
              	</div><br />
								<span class="textInfo">
                	e.g. 39.499059, -79.418682
              	</span>
								<br /><br />
								<div class="viewLatLong">
									<h4>Current Map Centroid:</h4>
									<span id="centroid"></span><br />
									<button id="getLocationButton">Your Location</button>
									<p>Click the button to get the coordinates<br /> of your current location. Then click &#8220;<strong>Submit</strong>&#8221;</p>
									<!-- <button onclick="getLocation()">Your Location</button> -->
								</div><!-- viewLatLong -->
              </div><!-- ContentPane 4 -->
            </div><!-- TitlePane "Enter Lat Long" -->                      
          </div><!-- claro -->
        <!-- drop shadow divs -->
        <div id="ds">
          <div id="ds-h">
            <div class="ds h1 o1"></div>
            <div class="ds h2 o2"></div>
            <div class="ds h3 o3"></div>
            <div class="ds h4 o4"></div>
            <div class="ds h5 o5"></div>
          </div>
          <div id="ds-r">
            <div class="ds v1 o1"></div>
            <div class="ds v2 o2"></div>
            <div class="ds v3 o3"></div>
            <div class="ds v4 o4"></div>
            <div class="ds v5 o5"></div>
          </div>
        </div> <!-- end drop shadow divs -->

      </div>
      <div data-dojo-type="dojox.layout.ExpandoPane" title="Printing Options"
             data-dojo-props="region:'right', design:'footer', gutters:true, liveSplitters:true, startExpanded:true, easeIn:'expoInOut', easeOut:'expoInOut', duration:600">
             <!-- style="width:220px;"> -->
        <div id="rightPane"
             data-dojo-type="dijit/layout/ContentPane"
             data-dojo-props="region:'right'">
          <div id="mapTitleDiv">
            <label>Map Title</label>
            <input id="mapTitle" name="mapTitle" data-dojo-type="dijit/form/TextBox" style="width: 10.4em; margin-left: 0.2em;" type="text">
            <button id="prepMap" data-dojo-type="dijit/form/Button">Prep Map</button>
            <button id="clearGraphics" data-dojo-type="dijit/form/Button">Clear Graphics</button>
          </div>
  
          <div id="printButton"></div>
          <hr />
          
          <div id="drawingWrapper">
            Add some graphics (click to edit):
            <div id="point" class="drawing">Point</div>
            <div id="freehandpolyline" class="drawing">Freehand Polyline</div>
            <div id="freehandpolygon" class="drawing">Freehand Polygon</div>
            <div id="line" class="drawing">Straight Line</div>
            <div id="circle" class="drawing">Circle</div>
            <div id="rectangle" class="drawing">Rectangle</div>
            <div id="arrow" class="drawing">Arrow</div>
          </div>
          <button id="textLabel" data-dojo-type="dijit/form/Button">Text Label</button><br />
          <input type="checkbox" id="includeCoords" checked data-dojo-type="dijit.form.CheckBox">
          <label for="includeCoords">Include Coordinates?</label>
          <div id="coordsinfo"></div>
          <hr />
          <div id="layerToggle">
            Toggle Layers: <br />
            <!-- checkbox and labels inserted programmatically -->
          </div>
          <div id="legendDiv"></div>
        </div>
      </div><!-- end of Expando Pane-->     
    </div><!-- mainWindow -->
  </body>
</html>