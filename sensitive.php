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
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>Simple Map</title>
    <link rel="stylesheet" href="http://js.arcgis.com/3.10/js/dojo/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.10/js/esri/css/esri.css">

    <style>
      html, body, #mapDiv {
        height: 100%;
        width: 100%;
        margin: 0;
        padding:0px;
      }
      #mapDiv {
        border:solid 2px #808775;
        -moz-border-radius:4px;
        -webkit-border-radius:4px;
        border-radius:4px;
        margin:5px;
        padding:0px;
      }
      body {
        background-color: #FFF;
        overflow: hidden;
        font-family: "Trebuchet MS";
      }
      #geosearch {
        display: block;
        position: absolute;
        z-index: 2;
        top: 20px;
        left: 74px;
      }
      #basemapGallery{
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
      .esriScalebar {
        padding: 10px 40px;
      }
      .esriScalebarLine {
        background-color: white;
      }            
    </style>
    <script type="text/javascript" src="http://js.arcgis.com/3.10/"></script>
    <script type="text/javascript" src="javascript/sensitive.js"></script>
  </head>

  <body class="claro">
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
               data-dojo-props="title:'Sensitive Areas Legend', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="Sensitive_Areas_Legend" >
                <img src="images/SensitiveAreasLegend.jpg" /><br />
                <p>
                  The Protected Species areas are created from buffers of known protected species. 
                  These do not indicate presence or absence of any species at any location on the map.
                  They are simply intended as a guide to the possible presence or absence of a State or Federally protected species.
                </p>
              </div>
            </div><!-- ContentPane 2 -->            
          </div><!-- TitlePane 1 "Switch Basemap" -->            
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
          
        </div><!-- positioning_div -->
        
      </div><!-- mapDiv -->  
    </div><!-- mainWindow -->
  </body>
</html>