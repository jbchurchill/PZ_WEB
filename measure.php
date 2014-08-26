<?php
  if (isset($_GET['xMin'])) {
    $xMin = trim(stripslashes($_GET[xMin]));
  }
  if (isset($_GET['yMin'])) {
    $yMin = trim(stripslashes($_GET[yMin]));
  }
  if (isset($_GET['xMax'])) {
    $xMax = trim(stripslashes($_GET[xMax]));
  }
  if (isset($_GET['yMax'])) {
    $yMax = trim(stripslashes($_GET[yMax]));
  }
  // $passedExtent = trim(stripslashes($_GET['ext']));
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
      .esriScalebar {
        padding: 10px 40px;
      }
      .esriScalebarLine {
        background-color: white;
      }      
    </style>
    <script src="http://js.arcgis.com/3.10/"></script>
    <!--<script type="text/javascript" src="http://gis.garrettcounty.org/arcgis/javascript/pmeasure.js"></script>-->
    <script type="text/javascript" src="javascript/pmeasure.js"></script><!-- local -->
  </head>
  
  <body class="claro">
  <?php
    // $passedExtent = array("-8813759.700944385", "4792406.875323275", "-8812306.203078521", "4793063.756035045");
    // $passedExtent = array("-8819410.666559163","4792613.494165327","-8813596.67509507","4794481.424044095");
  ?>
  <script>
    var xMin = Number('<?php echo $xMin; ?>'); // '<?php echo $passedExtent[0]; ?>';
    var yMin = Number('<?php echo $yMin; ?>'); // '<?php echo $passedExtent[1]; ?>';
    var xMax = Number('<?php echo $xMax; ?>'); // '<?php echo $passedExtent[2]; ?>';
    var yMax = Number('<?php echo $yMax; ?>'); // '<?php echo $passedExtent[3]; ?>';
  </script>
    <div id="mainWindow" data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'headline',gutters:false"
    style="width:100%; height:100%;">
      <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
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
        </div>
      </div>
    </div>
  </body>
</html>