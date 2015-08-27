var findTask, findParams, checkNull, getExtent, require, doFind, map, center, zoom, grid, store, identifyTask, identifyParams, passedCenter, passedX, passedY, zoomLevel, xMin, yMin, xMax, yMax;
var addlIdArray = [];
var extArray = [];

function startTrackingExtent() {
  dojo.connect(map, "onExtentChange", getExtent);
}

function contains(a, obj) {
  var i;
  for (i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}

function popupCamera(url) {
  var desc = "Traffic Camera";
  window.open(url, desc, "width=500, height=380");
}


function getCamUrl(feed) {
  var desc = "Some Camera";
  var base =  "http://www.chart.state.md.us/video/video.php?feed=";
  var url = base + ltrim(feed);
  return url;
}

function executeIdentifyTask(evt) {
  "use strict";
  var i;
  identifyParams.geometry = evt.mapPoint;
  identifyParams.mapExtent = map.extent;

  // layers that can be identified by "click" that are NOT in the "Additional Layers" Content Pane
  // Critical Facilities, addresspoints, celltowers, centerlines, dbo.TaxParcel
  identifyParams.layerIds = [0, 2, 3, 5, 7]; // [0, 2, 3, 4, 6];
  // If a layer is checked in the "Additional Layers" pane, it will have been added
  // to the array (in updateLayerVisibility above), so add it to the list of those 
  // that can be clicked and identified.
  for (i = 0; i < addlIdArray.length; i++) {
    identifyParams.layerIds.push(addlIdArray[i].value);
  }
  // Sort the layers to identify by click
  var iP_ids = identifyParams.layerIds;
  iP_ids.sort(function (a, b) {
    return a - b;
  });
  var deferred = identifyTask.execute(identifyParams);

  // checkNull infoTemplate Formatting Function
  checkNull = function (value, key) {
    var content;
    function determineVal(val, strKey, addBreak) {
      if (val == "" | val == "Null") {
        content = "";
      } else {
        if (addBreak) {
          if (strKey == "SDAT Link: <a href=\"") {
            val += "\" target=\"_blank\">LINK</a>";
          }
          val += "<br />";
        }
        content = strKey + val;
      }
    }

    switch (key) {
    case "SOURCE_OF_DATA":
      determineVal(value, "Source of Data: ", true);
      break;
    case "TOWER_HEIGHT":
      determineVal(value, "Tower Height: ", false);
      break;
    case "HEIGHT_ELEV_UNITS":
      determineVal(value, ", ", true);
      break;
    case "TOWER_COMMUNITY":
      determineVal(value, "Community: ", true);
      break;
    case "GROUND_ELEV":
      determineVal(value, "Ground Elevation: ", false);
      break;
    case "SUBDIVSN":
      determineVal(value, "Subdivision: ", true);
      break;
    case "PLAT":
      determineVal(value, "Plat: ", true);
      break;
    case "BLOCK":
      determineVal(value, "Block: ", true);
      break;
    case "PLTLIBER":
      determineVal(value, "<hr><span class=\"sectionhead\">Plat Reference</span><br />Liber: ", true);
      break;
    case "PLTFOLIO":
      determineVal(value, "Folio: ", true);
      break;
    case "OWNNAME2":
      determineVal(value, " ", false);
      break;
    case "SDATWEBADR":
      determineVal(value, "SDAT Link: <a href=\"", true);
      break;
    }
    return content;
  }; // end of checkNull fx

  deferred.addCallback(function (response) {
    var template;
    // response is an array of identify result objects
    // Let's return an array of features.
    return dojo.map(response, function (result) {
      var feature = result.feature;
      feature.attributes.layerName = result.layerName;
      if (result.layerName === 'addresspoints') {
        template = new esri.InfoTemplate("Address Info", 
        "<span class=\"sectionhead\">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />"
        + "Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />"
        + "Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Critical_Facilities') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ");
        feature.setInfoTemplate(template);
      /* } else if (result.layerName === 'Gas_Wells') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Gas Wells</span><br /><br /><hr>Well Number: ${OBJECTID} <br />");
        feature.setInfoTemplate(template);
      */
      } else if (result.layerName === 'celltowers') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> "
        + "${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}"
        + "Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}");// + content);
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'centerlines') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />"
        + "Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'School Zones') {
        template = new esri.InfoTemplate("Board of Ed. Info.",
        "<span class=\"sectionhead\">Layer: School Zones</span><br /><br /><hr>Elementary School: ${School} <br />"
        + "Middle School: ${MS} <br />High School: ${HS}");
        feature.setInfoTemplate(template);                           
      } else if (result.layerName === 'Election_Districts') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> "
        + "Commissioner District: ${Comm_Dist} <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Zip Codes') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />"
        + "Zip Code: ${ZIPCODE1} <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Wind_Turbines') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />"
        + "Owner: ${Owner} <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'SHA_CamData') {
        template = new esri.InfoTemplate("Traffic Info",
        "<span class=\"sectionhead\">Layer: SHA Traffic Cameras</span><br /><br /><hr>ID: ${ID} <br />"
        + "Description: ${desc_} <br /> Latitude: ${lat} <br /> Longitude ${long} <br /><hr />"
        + "Link: <button onclick=\"popupCamera('${Feed:getCamUrl}');\">Open Camera</button>");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'County_Zoning_Layer') {
        template = new esri.InfoTemplate("Zoning Info", "<span class=\"sectionhead\">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Tax Map Grid') {
        template = new esri.InfoTemplate("Tax Map Info", "<span class=\"sectionhead\">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Garrett.DBO.TaxParcel') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />"
        + "City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class=\"sectionhead\">Deed Reference</span><br />"
        + "Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />"
        + "Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />"
        + "${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>"
        + "Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}"); 
        map.infoWindow.resize(250, 500);
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Water Service') {
        template = new esri.InfoTemplate("Water Service Info", "<span class=\"sectionhead\">Layer: Water Service </span><br /><br /><hr>Water System: ${System}");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Sewer Service') {
        template = new esri.InfoTemplate("Sewer Service Info", "<span class=\"sectionhead\">Layer: Sewer Service </span><br /><br /><hr>Sewer System: ${System}");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'Town Boundary') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />");
        feature.setInfoTemplate(template);
      } else if (result.layerName === 'County Boundary') {
        template = new esri.InfoTemplate("",
        "<span class=\"sectionhead\">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />");
        feature.setInfoTemplate(template);
      }
      return feature;
    });
    
  }); // end of deferred callback function
  // registry.byId("search").on("click", doFind);
  // InfoWindow expects an array of features from each deferred
  // object that you pass. If the response from the task execution 
  // above is not an array of features, then you need to add a callback
  // like the one above to post-process the response and return an
  // array of features.
  map.infoWindow.setFeatures([ deferred ]);
  map.infoWindow.show(evt.mapPoint);

} // end of function executeIdentifyTask

require([
  "esri/map",
  "esri/dijit/Scalebar",
  "esri/dijit/BasemapGallery",
  "esri/dijit/Popup",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/tasks/query",
  "esri/toolbars/draw",
  "esri/tasks/IdentifyTask",
  "esri/tasks/FindTask",
  "esri/tasks/FindParameters",
  "esri/layers/FeatureLayer",
  "esri/tasks/IdentifyResult",
  "esri/tasks/IdentifyParameters",
  "esri/dijit/InfoWindow",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "esri/InfoTemplate",
  "dojo/_base/array",
  "dojo/_base/connect",
  "dojox/grid/DataGrid",
  "dojox/layout/ExpandoPane",
  "dojo/data/ItemFileReadStore",
  "esri/Color",
  "dojo/on",
  "dojo/dom",
  "dojo/query",
  "dojo/store/Memory",
  "dijit/form/ComboBox",
  "dijit/registry",
  "dojo/parser",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/layout/AccordionContainer",
  "dijit/TitlePane",
  "dijit/form/Button",
  "dijit/form/RadioButton",
  "esri/dijit/Geocoder",
  "dojo/domReady!"
], function (
  Map,
  Scalebar,
  BasemapGallery,
  Popup,
  webMercatorUtils,
  Point,
  ArcGISDynamicMapServiceLayer,
  ImageParameters,
  Query,
  Draw,
  IdentifyTask,
  FindTask,
  FindParameters,
  FeatureLayer,
  IdentifyResult,
  IdentifyParameters,
  InfoWindow,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  Graphic,
  InfoTemplate,
  arrayUtil,
  connect,
  DataGrid,
  ExpandoPane,
  ItemFileReadStore,
  Color,
  on,
  dom,
  query,
  Memory,
  ComboBox,
  registry,
  parser,
  BorderContainer,
  ContentPane,
  AccordionContainer,
  TitlePane,
  Button,
  RadioButton,
  Geocoder
) {
  parser.parse();

  // doZoom variable allows us to zoom to extent of selected features (default) 
  // or not when that is unwanted (like when clicking "Clear Selection")
  var doZoom, popup, scalebar, basemapGallery, mdImagelayer, mdImageBasemap, imageParameters, visibleLayerIds, landBaseLayer, selectionToolbar, addSelectionToolbar, removeSelectionToolbar, geocoders, geocoder, arrStructNum, plusOrMinus;
  doZoom = 1, arrStructNum = []; // pointSum = 0, arrStructNum = [], strAddresses = "";

  registry.byId("search").on("click", doFind);
  registry.byId("search2").on("click", doFind);
  passedCenter = [passedX, passedY];

  popup = new Popup({
    fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
  }, dojo.create("div"));

  map = new Map("mapDiv", {
    basemap: "streets",
    center: passedCenter, // center,
    zoom: zoomLevel, // zoom,
    infoWindow: popup
  });

  function zoomToLatLong() {
    var txtLL, txtComma, txtLat, txtLong, sms, point, graphicLL, maxZoom;
    txtLL = document.getElementById("textLatLong").value;
    txtLL = txtLL.replace(/\s+/g, ''); // get rid of white space so it is just lat,long
    txtComma = txtLL.indexOf(",");

    if (txtComma > 0) {
      txtLat = parseFloat(txtLL.slice(0, txtComma)); // using parseFloat may take some alpha garbage out of the string
      txtLong = parseFloat(txtLL.substring(txtComma + 1));
	      // console.log("latitude: " + txtLat);
	      // console.log("longitude: " + txtLong);
      sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([10,10,10,0.75]), 1), new Color([255,0,0,0.5]));
      point = new Point(txtLong, txtLat, map.spatialRefernce);
      graphicLL = new Graphic(point, sms, null, null);

      map.graphics.add(graphicLL);

      if (graphicLL.geometry.type === 'point') {
        maxZoom = map.getMaxZoom();
        map.centerAndZoom(graphicLL.geometry, maxZoom - 1);
      } else {
        map.setExtent(graphicsUtils.graphicsExtent([graphicLL]));
      }      
    } else {
      return "";
    } // end if
  } // end zoomToLatLong function

  function showLocation(position) {
    var x = document.getElementById("textLatLong");
    x.value = position.coords.latitude + ", " + position.coords.longitude;	
  }

  function getLocation() {
    map.graphics.clear();
    var x = document.getElementById("centroid");
    if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(showLocation);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  on(dom.byId("getLocationButton"), "click", getLocation);

  // findTask = new FindTask("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");
  findTask = new FindTask("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");
  map.on("load", function () {
    //Create the find parameters
    findParams = new FindParameters();
    findParams.returnGeometry = true;
    findParams.layerIds = [5, 7]; // CHANGED [4, 6]; // CHANGED [6, 8]; // Shows the Roads (7) when it first loads
    findParams.searchFields = ["RDNAMELOCAL", "PARCEL"]; // "ACCTID", "MAINTENANCE", "FRADDL_P", "TOADDL_P", "FRADDR_P", "TOADDR_P"];
    findParams.outSpatialReference = map.spatialReference;
    console.log("find sr: ", findParams.outSpatialReference);
    on(dom.byId("submitLatLongButton"), "click", zoomToLatLong);
  });

  scalebar = new Scalebar({
    map: map,
    attachTo: "bottom-right",
    scalebarStyle: "line",
    // "dual" displays both miles and kilmometers
    // "english" is the default, which displays miles
    // use "metric" for kilometers
    scalebarUnit: "english"
  });

   //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
  basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

  mdImagelayer = new esri.layers.ArcGISTiledMapServiceLayer("https://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");
  
  mdImage2011 = new esri.layers.ArcGISTiledMapServiceLayer("https://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");

  mdImageBasemap = new esri.dijit.Basemap({
    layers: [mdImagelayer],
    title: "MD 2014 Imagery",
    thumbnailUrl: "https://maps.garrettcounty.org/arcgis/images/image2014.png"
  });

  mdImageBasemap2011 = new esri.dijit.Basemap({
    layers: [mdImage2011],
    title: "MD 2011 Imagery",
    thumbnailUrl: "https://maps.garrettcounty.org/arcgis/images/image_v2.png"
  });
  basemapGallery.add(mdImageBasemap);
  basemapGallery.add(mdImageBasemap2011);

  basemapGallery.startup();

  basemapGallery.on("error", function (msg) {
    console.log("basemap gallery error:  ", msg);
  });

  // TURN LAYERS OFF AND ON
  imageParameters = new ImageParameters();
  imageParameters.layerIds = [0, 2, 3, 5, 7]; // [0, 2, 3, 4, 6]; // [1, 4, 5, 6, 8];
  imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE
  visibleLayerIds = []; // [1, 2, 3, 4, 5, 6, 8];
  // TURN LAYERS OFF AND ON

  // IDENTIFY LAYERS
  // landBaseLayer = new ArcGISDynamicMapServiceLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
  landBaseLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
    {"imageParameters": imageParameters, opacity: 0.55}); // , opacity:.55}); // NEW
  map.addLayer(landBaseLayer);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // SELECT POINTS SECTION
  // Determine how many points were selected and list the Addresses for each point
  
  function sumSelectedPoints(event) {
    "use strict";
    var pointSum, strAddresses, strFormInfo, addrIndex, i;
    //show the selected address points in the map display
    arrayUtil.forEach(event.features, function (feature) {
      addrIndex = arrStructNum.indexOf(feature.attributes.ADDRESS);
      if (arrStructNum.length == 0) {
        // strAddresses += feature.attributes.ADDRESS + "<br />";
        arrStructNum.push(feature.attributes.ADDRESS);
        // pointSum += 1;
      } else if (arrStructNum.indexOf(feature.attributes.ADDRESS) == -1) { // current value is not in the Array
        // START SEPARATE IF STATEMENT
        if (plusOrMinus == 1) {
          // strAddresses += feature.attributes.ADDRESS + "<br />";
          arrStructNum.push(feature.attributes.ADDRESS);
          // pointSum += 1;
        } else if (plusOrMinus == 0) {
          // DO NOTHING ... Attempt to remove an address that is not in the array
        }
        // END SEPARATE IF STATEMENT        
      } else { // Array has at least one value and the present value is one of them
        // START SEPARATE IF STATEMENT
        if (plusOrMinus == 0) {
          // strAddresses = strAddresses.replace(feature.attributes.ADDRESS + "<br \/>", '');
          arrStructNum.splice(addrIndex, 1);
          // pointSum -= 1;          
        } else if (plusOrMinus == 1) {
          // Do nothing. This was an attempt to add a value to array that is already present.
        }
        // SEPARATE IF STATEMENT
      }
      // console.log(addrIndex);
      // console.log("Array: " + arrStructNum);
      // console.log("Addresses: " + strAddresses);
    });
    // ATTEMPT TO RE-WRITE strAddresses
    strAddresses = "";
    pointSum = arrStructNum.length;
    for (i = 0; i < arrStructNum.length; i++) {
      strAddresses += arrStructNum[i] + "<br \/>";
    }
    strFormInfo = "Save these point records<br />"
        + "<form action=\"file.php\" method=\"post\" target=\"_blank\"><input id=\"save\" type=\"submit\"></input><input type=\"checkbox\" name=\"append_data\" checked=\"true\" value=\"address\">Write new file?<br /><input id=\"hidden_field\" name=\"hidden_field\" type=\"hidden\" value=\"" + strAddresses + "\" /></form>";
    // ToDo - Do this next line ONLY if >0 records are selected.
    if (pointSum > 0) {
      dom.byId('formContent').innerHTML = strFormInfo;
    } else {
      dom.byId('formContent').innerHTML = "";
    }
    dom.byId('messages').innerHTML = "<strong>Number of Selected Points: " +
                                            // pointSum + "</strong><br />" + strAddresses + "<br /><button id=\"save\" data-dojo-type=\"dijit.form.Button\" type=\"button\" data-dojo-attach-point=\"button\">Save</button><br />";
                                            pointSum + "</strong><br />" + strAddresses + "<br />";
                                            
                                            //+ "<form action=\"file.php\" method=\"post\" target=\"_blank\"><input id=\"save\" type=\"submit\"></input><input type=\"checkbox\" name=\"append_data\" checked=\"true\" value=\"address\">Write new file?<br /><input id=\"hidden_field\" name=\"hidden_field\" type=\"hidden\" value=\"" + strAddresses + "\" /></form><br />";
  }

  function sumSelectedParcelInfo(event) {
    "use strict";
    var parcelSum, parcelValue, arrParcelData, strParcelInfo, strFormInfo, strStrippedInfo, parcelIndex, i, x, n; // n, x;
    parcelSum = 0;
    strParcelInfo = "";
    // strStrippedInfo = "M, P, Link<br />";
    strStrippedInfo = "";
    n = 0;

    arrayUtil.forEach(event.features, function (feature) {

      parcelValue = [ String(feature.attributes.MAP), String(feature.attributes.PARCEL), String(feature.attributes.SDATWEBADR) ];
      parcelIndex = arrStructNum.indexOf(parcelValue);

      for (x = 0; x < arrStructNum.length; x++) {
        if (String(arrStructNum[x]) === String(parcelValue)) {
          parcelIndex = x;
        }
      }

      if (parcelIndex >= 0) {
        if (plusOrMinus === 0) {
          arrStructNum.splice(parcelIndex, 1);
        }
      } else { // Parcel Index = -1
        if (plusOrMinus === 1) {
          if (parcelIndex === 'undefined') { // if (typeof parcelIndex === 'undefined') {
            arrStructNum.push(parcelValue);
          } else if (parcelIndex === -1) {
            arrStructNum.push(parcelValue);
          }
        }
      }

      n += 1;
    });

    parcelSum = arrStructNum.length;
    strParcelInfo = "<strong>Number of Selected Parcels: " + parcelSum + "</strong><br />";

    for (i = 0; i < arrStructNum.length; i++) {
      strParcelInfo += "<strong>MAP: </strong>" + arrStructNum[i][0] + "<br \/>" +
          "<strong>PARCEL: </strong>" + arrStructNum[i][1] + "<br />" +
          "<strong>LINK: </strong><a href=\"" + arrStructNum[i][2] + "\" target=\"_blank\">Link</a><br /><hr />";
      strStrippedInfo += arrStructNum[i][0] + ", " + arrStructNum[i][1] + ", " + arrStructNum[i][2] + "<br />";
    }
    strFormInfo = "Save these parcel records<br />"
      + "<form action=\"file.php\" method=\"post\" target=\"_blank\"><input id=\"save\" type=\"submit\"></input><input type=\"checkbox\" name=\"append_data\" checked=\"true\" value=\"parcel\">Write new file?<br /><input id=\"hidden_field\" name=\"hidden_field\" type=\"hidden\" value=\"" + strStrippedInfo + "\" /></form><br />";
     if (parcelSum > 0) {
      dom.byId('formContent').innerHTML = strFormInfo;
    } else {
      dom.byId('formContent').innerHTML = "";
    }
    dom.byId('messages').innerHTML = strParcelInfo;
  }


  var fieldsSelectionSymbol, content, infoTemplate, featureLayer, typeIsParcels = false;
  function setupSelections() {
    if (typeIsParcels) {
      fieldsSelectionSymbol =
          new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));
      content = "Map: ${MAP}<br />Parcel: ${PARCEL}<br />" +
          "Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";
      infoTemplate = new InfoTemplate("${FIELD_NAME}", content);

      // Parcels = Layer 7 (was 6) (and before that was 8)
      // featureLayer = new FeatureLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/8", {
        featureLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/7", {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"]
      });
      featureLayer.on("selection-complete", sumSelectedParcelInfo);
    } else {
      fieldsSelectionSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0, 255, 255]));
      fieldsSelectionSymbol.setSize(9);
      content = "Address: ${ADDRESS}<br />" +
        "City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";
      infoTemplate = new InfoTemplate("${FIELD_NAME}", content);
      // Address Points = Layer 2 (was 4) (still 2)
      // featureLayer = new FeatureLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/4", {
        featureLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/2", {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"]
      });
      featureLayer.on("selection-complete", sumSelectedPoints);
    }

    featureLayer.setSelectionSymbol(fieldsSelectionSymbol);
    featureLayer.on("selection-clear", function () {
      dom.byId('messages').innerHTML = "<i>No Selected Point or Parcels</i>";
    });
    map.addLayer(featureLayer);

  } // End of setupSelections function


  on(dom.byId("polys"), "click", function () {
    typeIsParcels = true;
    featureLayer.clearSelection();
    setupSelections();

  });
  on(dom.byId("points"), "click", function () {
    typeIsParcels = false;
    featureLayer.clearSelection();
    setupSelections();
  });

  // SELECT POINTS/POLYS CODE
  // If Rectangle radio button is selected select by rectangle, if not, select by polygon
  on(dom.byId("selectPointsButton"), "click", function () {
    "use strict";
    plusOrMinus = 1;
    // console.log("click registered for selectPointsButton");
    var SelectRectangle;
    arrStructNum = [];
    SelectRectangle = document.getElementById("rectangle").checked;
    if (SelectRectangle) {
      selectionToolbar.activate(Draw.EXTENT);
    } else {
      selectionToolbar.activate(Draw.FREEHAND_POLYGON);
    }
  });

  on(dom.byId("addPointsButton"), "click", function () {
    "use strict";
    plusOrMinus = 1;
    // console.log("click registered for addPointsButton");
    var SelectRectangle;
    SelectRectangle = document.getElementById("rectangle").checked;
    if (SelectRectangle) {
      addSelectionToolbar.activate(Draw.EXTENT);
    } else {
      addSelectionToolbar.activate(Draw.FREEHAND_POLYGON);
    }
  });

  on(dom.byId("removePointsButton"), "click", function () {
    "use strict";
    plusOrMinus = 0;
    // console.log("click registered for removePointsButton");
    var SelectRectangle;
    SelectRectangle = document.getElementById("rectangle").checked;
    if (SelectRectangle) {
      removeSelectionToolbar.activate(Draw.EXTENT);
    } else {
      removeSelectionToolbar.activate(Draw.FREEHAND_POLYGON);
    }
  });
  
  on(dom.byId("clearSelectionButton"), "click", function () {
    featureLayer.clearSelection();
    pointSum = 0;
    arrStructNum = [];
    strAddresses = "";
    map.graphics.clear();
    doZoom = 0;
    dom.byId("formContent").innerHTML = "";
    showResults("");
  });

  // LAUNCH MAP
  // map.on("load", startTrackingExtent); // NOT NEEDED HERE BECAUSE I PUT IT IN THE initSelectToolbar function
  var mapLaunchStore, comboBox;
  mapLaunchStore = new Memory({
    data: [
      {name: "Flood Hazard", id: "FEMA", baseURL: "FEMA_map.php"},
      {name: "Measurement", id: "MSMT", baseURL: "measure.php"},
      {name: "Planning and Zoning", id: "PZMAP", baseURL: "pz_map.php"},
      {name: "Sensitive Areas", id: "SENSI", baseURL: "sensitive.php"},
      {name: "Printable", id: "PRINT", baseURL: "printable.php"}
    ]
  });
  comboBox = new ComboBox({
    id: "mapSelect",
    name: "map",
    value: "Local Planning",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();

  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)

  function launchURL () {
    var selectedMap = dijit.byId('mapSelect').get('value'), baseURL, url, winTarget;
    switch (selectedMap) {
    case "Local Planning":
      winTarget = '_self';
      baseURL = "local_pz.php";
			break;
    case "Measurement":
      winTarget = '_blank';
      baseURL = "../measure.php";
      break;
    case "Planning and Zoning":
      baseURL = "../pz_map.php";
      winTarget = '_blank';
      break;
    case "Flood Hazard":
      baseURL = "../FEMA_map.php";
      winTarget = '_blank';
      break;
    case "Sensitive Areas":
      baseURL = "../sensitive.php";
      winTarget = '_blank';
      break;
    case "Printable":
      baseURL = "../printable.php";
      winTarget = '_blank';
      break;
    }
    // var url = "measure.php?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    var url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel; //  + "&bMap=" + bMap;
    window.open(url, winTarget);
  }

  registry.byId("launchButton").on("click", launchURL);

  function getExtent(extent) {
    var center = webMercatorUtils.webMercatorToGeographic(extent.getCenter());
    // was map.extent.getCenter()
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = map.getLevel();
    var x = document.getElementById("centroid");
    x.innerHTML = "Latitude: " + passedY + "<br />Longitude: " + passedX;
  }

  function initSelectToolbar(event) {
    var selectQuery, addSelectQuery, removeSelectQuery; // selectionToolbar and the other 2 are already defined globally
    setupSelections();
    dojo.connect(map, "onExtentChange", getExtent);

    selectionToolbar = new Draw(event.map);
    selectQuery = new Query();
    on(selectionToolbar, "DrawEnd", function (geometry) {
      selectionToolbar.deactivate();
      selectQuery.geometry = geometry;
      featureLayer.selectFeatures(selectQuery,
        FeatureLayer.SELECTION_NEW);
    });

    addSelectionToolbar = new Draw(event.map);
    addSelectQuery = new Query();
    on(addSelectionToolbar, "DrawEnd", function (geometry) {
      addSelectionToolbar.deactivate();
      addSelectQuery.geometry = geometry;
      featureLayer.selectFeatures(addSelectQuery,
        FeatureLayer.SELECTION_ADD);
    });

    removeSelectionToolbar = new Draw(event.map);
    removeSelectQuery = new Query();
    on(removeSelectionToolbar, "DrawEnd", function (geometry) {
      removeSelectionToolbar.deactivate();
      removeSelectQuery.geometry = geometry;
      featureLayer.selectFeatures(removeSelectQuery,
        FeatureLayer.SELECTION_SUBTRACT);
    });
  }
  map.on("load", initSelectToolbar);



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // IDENTIFY LAYERS
  map.on("click", executeIdentifyTask);
  // identifyTask = new IdentifyTask("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");
  identifyTask = new IdentifyTask("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");

  identifyParams = new IdentifyParameters();
  identifyParams.tolerance = 3;
  identifyParams.returnGeometry = true;
  // identifyParams.layerIds = [1, 2, 3, 4, 5, 6, 8, 10];
  identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
  identifyParams.width  = map.width;
  identifyParams.height = map.height;


  /////////////////////////////////////////////////////////////////////////////////////
  // SEARCH FEATURE

  var whichSearch; // for searching roads and parcels. Used to determine which search is being run.
  function doFind() {
    //Set the search text to the value in the box
    if (this.id == 'search') {
      findParams.searchText = dom.byId("roadName").value;
      whichSearch = "grid";
    } else if (this.id == 'search2') {
      findParams.searchText = dom.byId("parcelInfo").value;
      whichSearch = "grid1";
    }
    findTask.execute(findParams, showResults);
  }

  function showResults(results) {
    //This function works with an array of FindResult that the task returns
    map.graphics.clear();
    var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([98, 194, 204]), 3);

    //create array of attributes
    var items = arrayUtil.map(results, function (result) {
      var graphic = result.feature;
      graphic.setSymbol(symbol);
      map.graphics.add(graphic);
      return result.feature.attributes;
    });

    //Create data object to be used in store
    if (whichSearch == "grid") {
      var data = {
        identifier : "OBJECTID", //This field needs to have unique values
        label : "OBJECTID", //Name field for display. Not pertinent to a grid but may be used elsewhere.
        items : items
      };
    } else if (whichSearch == "grid1") {
      var data = {
        identifier: "ACCTID",
        label: "ACCTID",
        items: items
      };
    }

    //Create data store and bind to grid.
    var store = new ItemFileReadStore({
      data: data
    });
    var grid = registry.byId(whichSearch);
    if(grid) {
      if (!(whichSearch === "")) {
        grid.setStore(store);
        grid.on("rowclick", onRowClickHandler);
      }
    }
    //Zoom back to the initial map extent
    if (doZoom == 1) {
      map.centerAndZoom(center, zoom);
    }
    doZoom = 1;
  }

  //Zoom to the parcel when the user clicks a row
  function onRowClickHandler(evt) {
    var clickedGridRow, selectedFeature;
    if (whichSearch == "grid") {
      clickedGridRow = evt.grid.getItem(evt.rowIndex).OBJECTID;
      selectedFeature = arrayUtil.filter(map.graphics.graphics, function (graphic) {
        return ((graphic.attributes) && graphic.attributes.OBJECTID === clickedGridRow);
      });
    } else if (whichSearch == "grid1") {
      clickedGridRow = evt.grid.getItem(evt.rowIndex).ACCTID;
      selectedFeature = arrayUtil.filter(map.graphics.graphics, function (graphic) {
        return ((graphic.attributes) && graphic.attributes.ACCTID === clickedGridRow);
      });
    }
    if (selectedFeature.length) {
      map.setExtent(selectedFeature[0].geometry.getExtent(), true);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////    

  // TURN LAYERS ON AND OFF
  on(dom.byId("layer1CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer4CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer6CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer8CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer9CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer10CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer11CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer12CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer13CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer14CheckBox"), "change", updateLayerVisibility);
  on(dom.byId("layer15CheckBox"), "change", updateLayerVisibility);

  function updateLayerVisibility() {
    var i;
    var inputs = query(".list_item");
    var inputCount = inputs.length;
    //in this application, layer 2 is always on.
    visibleLayerIds = [0, 2, 3, 5, 7]; // [0, 2, 3, 4, 6];
    addlIdArray = []; // array used to track layers turned on in the "Additional Layers" pane.
    // It informs the identifyParams.layerIds array in the executeIdentifyTask function below.
    for (i = 0; i < inputCount; i++) {
      if (inputs[i].checked) {
        visibleLayerIds.push(inputs[i].value);
        if (!(contains(addlIdArray, inputs[i].value))) {
          addlIdArray.push(inputs[i]);
        }
      }
    }

    if (visibleLayerIds.length === 0) {
      visibleLayerIds.push(-1);
    }
    if (addlIdArray.length === 0) {
      addlIdArray.push(-1);
    }      
    landBaseLayer.setVisibleLayers(visibleLayerIds);
  }        

  // TURN LAYERS ON AND OFF
  // Add Geocoder  
  geocoders = [{
    url: "https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer",
    name: "MDiMap Composite Locator", 
    singleLineFieldName: "SingleLine",
  }];
  geocoder = new Geocoder({
    map: map,
    geocoders: geocoders,
    arcgisGeocoder: false
  }, "geosearch");
  geocoder.startup();
  // End Geocoder
}); // end of require function
