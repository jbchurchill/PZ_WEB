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
    <meta http-equiv="X-UA-Compatible" content="IE=7, IE=9, IE=10">
    <!--The viewport meta tag is used to improve the presentation and behavior of the samples 
      on iOS devices-->
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
    <title>Planning and Zoning &#045; Click to Identify</title>
    <link rel="stylesheet" href="https://js.arcgis.com/3.10/js/dojo/dijit/themes/claro/claro.css">
    <!-- <link rel="stylesheet" href="http://archive.dojotoolkit.org/nightly/dojotoolkit/dojox/layout/resources/ExpandoPane.css"> -->
    <link rel="stylesheet" href="javascript/dojo_1_10_4/dojox/layout/resources/ExpandoPane.css">
    <link rel="stylesheet" href="https://js.arcgis.com/3.10/js/esri/css/esri.css">
    <style>
      html, body {
        height:100%;
        width:100%;
        margin:0;
        padding:0;
      }
      #mapDiv {
        height:100%;
        width: 100%;
        margin: 0.75em 0;
        padding: 0;
        border-top: 1px solid red;
      }
      #mapControls {
        height: 10%;
        width: 100%;
        background-color: red;
      }
      form#basemap {
        padding-top: 10px;
        padding-left: 5px;
      }
      .sectionhead {
        font-weight: bold;
        font-size: larger;
      }
      #messages{
        background-color: white;
        margin: 0.4em;
        padding: 0 0.2em;
      }
      .selType{
        float:left;
        margin: 0 2em 0 1em;
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
      #addLayers {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
    
    
    <script src="https://js.arcgis.com/3.10/"></script>
    <!-- <script src="javascript/php_functions.js" type="text/javascript"></script> -->
    <script src="javascript/allpz.yui.js" type="text/javascript"></script>
  </head>

  <body class="claro">
    <script>
      var passedX = '<?php echo $px; ?>';
      var passedY = '<?php echo $py; ?>';
      var zoomLevel = '<?php echo $zoom; ?>';
    </script>
    <div data-dojo-type="dijit/layout/BorderContainer" 
         data-dojo-props="design:'headline', gutters:false" 
         style="width:100%;height:100%;margin:0;">
      <div data-dojo-type="dijit/layout/ContentPane" id="cp"
        data-dojo-props="region: 'top'">
      <button id="selectPointsButton" data-dojo-type="dijit/form/Button">Select Points/Polys</button>
      <button id="clearSelectionButton" data-dojo-type="dijit/form/Button">Clear Selection</button>
      <div class="selType">
          <input type="radio" id="rectangle" data-dojo-type="dijit/form/RadioButton" name="selectType"  checked="true">Rectangle<br />
          <input type="radio" id="polygon" data-dojo-type="dijit/form/RadioButton" name="selectType">Polygon<br />
      </div>
      <div class="selType">
          <input type="radio" id="points" data-dojo-type="dijit/form/RadioButton" name="geomType" checked="true" />Address Points<br />
          <input type="radio" id="polys" data-dojo-type="dijit/form/RadioButton" name="geomType" />Parcels<br />
      </div>
      <span style="font-size: 0.8em; float:right; text-align:center">
      Click the triangle at the lower right corner<br /> to search roads or parcels.
      </span>
      </div><!-- #cp CONTENT PANE -->
      <!-- onclick="runTest();"  -->
      <div id="mapDiv" data-dojo-type="dijit/layout/ContentPane" 
           data-dojo-props="region:'center'" 
           style="padding:0;">
        <div id="geosearch"></div>
        <div style="position:absolute; right:20px; top:10px; z-Index:999;">
          <span id="messages"></span>  
          <div data-dojo-type="dijit/TitlePane" 
               data-dojo-props="title:'Switch Basemap', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="basemapGallery" ></div>
            </div><!-- ContentPane 1 -->
          </div><!-- TitlePane 1 "Switch Basemap" -->  
          <div data-dojo-type="dijit/TitlePane"
              data-dojo-props="title:'Additional Layers', closable:false,  open:false">
            <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
              <div id="addLayers" >
                <h3>Additional Layers : </h3>
                <span id="layer_list"><!-- updated layer order -->
                  <!--<input type='checkbox' class='list_item' id='layer2CheckBox' value=2 />Gas Wells&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/GAS_WELLS.png" /><br/>-->
                  <input type='checkbox' class='list_item' id='layer1CheckBox' value=1 />Wind Turbines&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/Wind_Turbines.png" height="10" width="10" /><br/>
                  <input type='checkbox' class='list_item' id='layer5CheckBox' value=5 />Zip Codes&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/zip_codes.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer7CheckBox' value=7 />Water Service&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/tax_map.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer8CheckBox' value=8 />Sewer Service&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/tax_map.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer9CheckBox' value=9 />Tax Map&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/tax_map.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer10CheckBox' value=10 />Zoning&nbsp;&nbsp;(See legend below)<br />
                  <input type='checkbox' class='list_item' id='layer11CheckBox' value=11 />Election Districts&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/Election_Districts.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer12CheckBox' value=12 />Town Boundaries&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/tax_map.png" height="16" width="16" /><br />
                  <input type='checkbox' class='list_item' id='layer13CheckBox' value=13 />County Boundary&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/CountyBoundary.jpg" height="16" width="16" /><br />
                </span><hr /><br />
                <div id="ZoningLegend">
                  <img src="https://maps.garrettcounty.org/arcgis/images/Zoning.PNG" /><br/>
                  <h4>Layers that are always on:</h4>
                  <ul>
                    <li>Critical Facilities
                      <ul>
                        <lh>Types:</lh>
                        <li>1 &#045; Parks &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/parks.png" height="16" width="16" /></li>
                        <li>2L &#045; Libraries &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/library.png" height="16" width="16" /></li>
                        <li>2S &#045; Schools &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/school.png" height="16" width="16" /></li>
                        <li>3 &#045; Post Office or Govt. Bldg.&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/post_office_govt_building.png" height="16" width="19" /></li>
                        <li>4 &#045; Water, Sewer, Dump, Recycle&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/water_sewer_dump.png" height="16" width="16" /></li>
                        <li>5 &#045; Police &amp; Criminal Justice &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/police_criminal_justice.png" height="16" width="16" /></li>
                        <li>6 &#045; Roads &amp; Highways Facilities &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/roads_highways_facilities.png" height="16" width="16" /></li>
                        <li>6A &#045; Roads &amp; Highways Facilities &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/airport.png" height="16" width="16" /></li>
                        <li>7 &#045; Nursing Homes &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/nursing_home.png" height="16" width="16" /></li>
                        <li>8 &#045; Communications Towers &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/communications_tower.png" height="16" width="16" /></li>
                        <li>9 &#045; Fire &amp; Rescue Facilities &nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/CountyBoundary.jpg" height="16" width="16" /></li>
                      </ul>
                    </li>
                    <li>Addresses&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/AddressPoints.png" /></li>
                    <li>Cell Towers&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/CELLTOWERS.png" /></li>
                    <li>Street Centerlines&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/centerlines.png" height="8" width="34" /></li>
                    <li>Tax Parcels&nbsp;&nbsp;<img src="https://maps.garrettcounty.org/arcgis/images/parcels.png" height="16" width="16" /></li>
                  </ul>
                </div>
              </div><!-- addLayers -->
            </div><!-- Content Pane - Additional Layers -->
          </div><!-- Title Pane - Additional Layers -->
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
        </div><!-- unnamed div -->
      </div><!-- mapDiv -->
      
    <div data-dojo-type="dojox.layout.ExpandoPane" title="Search Functionality"
        data-dojo-props="region:'bottom', design:'footer', gutters:true, liveSplitters:true, startExpanded:false, easeIn:'expoInOut', easeOut:'expoInOut', duration:800" 
        style="height:390px;">

    <!-- <div data-dojo-type="dijit/TitlePane"
        data-dojo-props="title:'Search Roads', closable:false,  open:false" style="height:30px;"> -->

    <div data-dojo-type="dijit.layout.AccordionContainer" data-dojo-props="closable:false,  open:false">

          <div data-dojo-type="dijit/layout/ContentPane" title="Search Roads" data-dojo-props="region:'center'" style="height:280px; margin-top:0; padding:0;">
      Road name: <input type="text" id="roadName" size="60" value="ROCK LODGE ROAD" />      
          <button id="search" data-dojo-type="dijit.form.Button" type="button" data-dojo-attach-point="button" >Search
          <!--<button id="search" type="button" onclick="doFind;">Search -->
          </button>
      

     <table data-dojo-type="dojox/grid/DataGrid" data-dojo-id="grid"  id="grid" data-dojo-props="rowsPerPage:'15', rowSelector:'20px'">
      <thead>
        <tr>
          <!--<th field="PARCELID">Parcel ID</th>-->
          <th field="STREET_ALL">NAME</th>
          <!--<th field="OWNERNME1" >Owner 1</th>-->
          <th width="130px" field="MAINTENANCE">MAINTENANCE</th>
          <!--<th field="OWNERNME2">Owner 2</th>-->
          <th field="FROM_LEFT_P" >FROM LEFT</th>
          <th field="TO_LEFT_P">TO LEFT</th>
          <th width="130px" field="FROM_RIGHT_P">FROM RIGHT</th>
          <th field="TO_RIGHT_P">TO RIGHT</th>
          <!--<th field="RESYRBLT ">Year Built</th>--?
          <!--<th field="SITEADDRESS" width="100%">Address</th>-->
        </tr>
      </thead>
    </table>
    </div><!-- Content Pane Search Stuff -->
    
    
    <!-- NEW -->
          <div data-dojo-type="dijit/layout/ContentPane" title="Search Parcels" data-dojo-props="region:'center'" style="height:80px; margin-top:0; padding:0;">
      Parcel: <input type="text" id="parcelInfo" size="60" value="0025" />      
          <button id="search2" data-dojo-type="dijit.form.Button" type="button" data-dojo-attach-point="button" >Search
          <!--<button id="search" type="button" onclick="doFind;">Search -->
          </button>
      

     <table data-dojo-type="dojox/grid/DataGrid" data-dojo-id="grid1"  id="grid1" data-dojo-props="rowsPerPage:'15', rowSelector:'20px'">
      <thead>
        <tr>
          <!--<th field="PARCELID">Parcel ID</th>-->
          <th field="ACCTID" width="120px">ACCOUNT ID</th>
          <!--<th field="OWNERNME1" >Owner 1</th>-->
          <th field="MAP">MAP</th>
          <!--<th field="OWNERNME2">Owner 2</th>-->
          <th field="PARCEL">PARCEL</th>
          <th field="OWNNAME1" width="130px">OWNERNAME 1</th>
          <th field="OWNNAME2" width="130px">OWNERNAME 2</th>
          <!--<th field="RESYRBLT ">Year Built</th>--?
          <!--<th field="SITEADDRESS" width="100%">Address</th>-->
        </tr>
      </thead>
    </table>
    </div><!-- Content Pane Search Stuff -->
    
    </div><!-- Accordion Container -->
    </div><!-- Content Pane 190px containing all table and search content -->
    </div><!-- Border Container -->
  </body>
</html>