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
  if (isset($_GET['bMap'])) {
  } else {
    $bmap = "streets";
  }
?>
<!DOCTYPE html>
<html> 
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!--The viewport meta tag is used to improve the presentation and behavior of the samples 
    on iOS devices-->
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
    <title>Measure Tool</title>
    <link rel="stylesheet" href="http://js.arcgis.com/3.10/js/dojo/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.10/js/esri/css/esri.css">
    <style>
      html,body {
        height:100%;
        width:100%;
        margin:0;
      }
      body {
        background-color:#FFF;
        overflow:hidden;
        font-family:"Trebuchet MS";
      }
      #map {
        border:solid 2px #808775;
        -moz-border-radius:4px;
        -webkit-border-radius:4px;
        border-radius:4px;
        margin:5px;
        padding:0px;
      }
      #titlePane{
        width:240px;
      }
      .claro .dijitTitlePaneTitle {
        background: #fff;
        font-weight:600;
        border: none;
        border-bottom:solid 1px #29201A;
        border-top:solid 1px #29201A;
      }
      .claro .dijitTitlePaneTitleHover {
        background:#eee;
      }
      .claro .dijitTitlePaneTitleActive {
        background:#808775;
      }
      .claro .dijitTitlePaneContentOuter {
        border-right: none;
        border-bottom: none;
        border-left: none;
      }
      #geosearch {
        display: block;
        position: absolute;
        z-index: 2;
        top: 20px;
        left: 74px;
      }      
      .esriScalebar {
        padding: 10px 40px;
      }
      .esriScalebarLine {
        background-color: white;
      }      
    </style>
    <script src="http://js.arcgis.com/3.10/"></script>
    <!--<script type="text/javascript" src="http://gis.garrettcounty.org/arcgis/javascript/pmeasure.js"></script>-->
    <script type="text/javascript" src="javascript/pmeasure_stash.js"></script><!-- local -->
  </head>
  
  <body class="claro">
  <script>
    var passedX = '<?php echo $px; ?>';
    var passedY = '<?php echo $py; ?>';
    var zoomLevel = '<?php echo $zoom; ?>';
    var bMap = '<?php echo $bmap; ?>';
  </script>
    <div id="mainWindow" data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'headline',gutters:false"
    style="width:100%; height:100%;">
      <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
        <div id="geosearch"></div>
        <div style="position:absolute; right:20px; top:10px; z-Index:999;">
        
          <div data-dojo-type="dijit/TitlePane" 
               data-dojo-props="title:'Switch Basemap', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="basemapGallery" ></div>
            </div><!-- ContentPane 1 -->
          </div><!-- TitlePane 1 "Switch Basemap" -->  
        
        
          <div id="titlePane" data-dojo-type="dijit/TitlePane" data-dojo-props="title:'Measurement', closable:'false', open:'false'">
            <div id="measurementDiv"></div>
            <span style="font-size:smaller;padding:5px 5px;">Press <b>CTRL</b> to enable snapping.</span>
          </div>
          <div data-dojo-type="dijit/TitlePane" 
             data-dojo-props="title:'Navigation', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <button id="launchButton" data-dojo-type="dijit/form/Button">Launch</button>
              <input id="mapSelect"><br />
              <ul>
                <li><a href="../help.html">Help ?</a></li>
                <li><a href="../">Home</a></li>
              </ul>
              <p>
                By default, the Launch Button will reload this page in the same window, updating the extent in the address bar. 
                This works well for copying and pasting a link to a specific location on this map.
                Choose a different map to launch the current extent in a new window or tab (depending on your browser preferences).
                The different maps have different uses (see the <a href="../help.html">Help &amp; Documentation</a> for more information).
              </p>
            </div><!-- ContentPane 3 -->
          </div><!-- TitlePane Navigation -->          
        </div><!-- positioning div -->
      </div>
    </div>
  </body>
</html>