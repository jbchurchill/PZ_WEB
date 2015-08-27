var map, zoom, center, scalebar, checkNull, formatProtectedSpecies, formatFLU, content;
var saParameters, mdImageLayer, mdImageBasemap, geocoder, mapLaunchStore, comboBox;
var parcelTemplate, addrTemplate, streetTemplate, pstreamTemplate, swpaTemplate, growthAreasTemplate, protectedSpeciesTemplate, SA_fLayer, basemapGallery;
var passedCenter, passedX, passedY, zoomLevel;
require(["esri/map",
  "esri/dijit/Scalebar",
  "esri/dijit/Popup",
  "esri/dijit/BasemapGallery",
  "dojo/dom",
	"dojo/on",
  "dojo/store/Memory",
  "dijit/form/ComboBox",
  "dijit/registry",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/geometry/webMercatorUtils",
	"esri/geometry/Point",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleMarkerSymbol",
  "esri/Color",
	"esri/graphic",
  "esri/tasks/IdentifyTask",
  "esri/tasks/IdentifyParameters",
  "esri/InfoTemplate",
  "esri/dijit/Geocoder",
  "dojo/parser",
  "dojo/domReady!"
  ], function (
  Map,
  Scalebar,
  Popup,
  BasemapGallery,
  dom,
	on,
  Memory,
  ComboBox,
  registry,
  BorderContainer,
  ContentPane,
  TitlePane,
  ArcGISDynamicMapServiceLayer,
  ArcGISTiledMapServiceLayer,
  ImageParameters,
  webMercatorUtils,
	Point,
  SimpleFillSymbol,
  SimpleLineSymbol,
	SimpleMarkerSymbol,
  Color,
	Graphic,
  IdentifyTask,
  IdentifyParameters,
  InfoTemplate,
  Geocoder,
  parser
) {
  parser.parse();
  var popup = new Popup({
    fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
  }, dojo.create("div"));

  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)
  function launchURL() {
    var selectedMap = dijit.byId('mapSelect').get('value'), baseURL, url, winTarget;
    switch (selectedMap) {
    case "Measurement":
      baseURL = "measure.php";
      winTarget = '_blank';
      break;
    case "Planning and Zoning":
      baseURL = "pz_map.php";
      winTarget = '_blank';
      break;
    case "Flood Hazard":
      baseURL = "FEMA_map.php";
      winTarget = '_blank';
      break;
    case "Sensitive Areas":
      baseURL = "sensitive.php";
      winTarget = '_self';
      break;
    case "Printable":
      baseURL = "printable.php";
      winTarget = '_blank';
      break;
    }
    // var url = "measure.php?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    window.open(url, winTarget);
  }

  function getExtent() {
    var center = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = map.getLevel();
    var x = document.getElementById("centroid");
    x.innerHTML = "Latitude: " + passedY + "<br />Longitude: " + passedX;
  }

  function makePopupDraggable() {
    var popupDiv, dnd;
    popupDiv = document.querySelector(".esriPopup");
    if (popupDiv) {
      dnd = new dojo.dnd.Moveable(dom.byId(popupDiv));
    }
    return dnd;
  }

  // center = [-79.2, 39.5];
  // zoom = 10;
  passedCenter = [passedX, passedY];
  registry.byId("launchButton").on("click", launchURL);

  function startTrackingExtent() {
    dojo.connect(map, "onExtentChange", getExtent);
  }

  map = new Map("mapDiv", {
    basemap: "streets",
    center: passedCenter, // center,
    zoom: zoomLevel, // zoom,
    infoWindow: popup
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

  // LAUNCH MAP
  map.on("load", startTrackingExtent);
	on(dom.byId("submitLatLongButton"), "click", zoomToLatLong);
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
    value: "Sensitive Areas",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();

  // checkNull infoTemplate Formatting Function (value, key, data) data returns a large object with the entire record (all fields).
  checkNull = function (value, key) {
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
    case "DR1LIBER":
      determineVal(value, "<hr><span class=\"sectionhead\">Deed Reference</span><br />Liber: ", true);
      break;
    case "DR1FOLIO":
      determineVal(value, "Folio: ", true);
      break;
    case "CITY":
      determineVal(value, "City: ", true);
      break;
    }
    return content;
  };

  formatProtectedSpecies = function (value, key) {
    if (key == "GROUP" && value == "Null") {
      content = "";
    } else if (key == "GROUP" && value == "GROUP 1") {
      content = "Type: Federally Protected Species";
    } else if (key == "GROUP" && value == "GROUP 2") {
      content = "Type: State Protected Species";
    }
    return content;
  };

  formatFLU = function (value, key) {
    if (key == "FLU" && value == "Null") {
      content = "";
    } else if (key == "FLU" && value == "A") {
      content = value + " &#045; Permitted Accessory Use";
    } else if (key == "FLU" && value == "AR") {
      content = value + " &#045; Agricultural Resource";
    } else if (key == "FLU" && value == "C") {
      content = value + " &#045; General Commercial";
    } else if (key == "FLU" && value == "CR1") {
      content = value + " &#045; Commercial Resort 1";
    } else if (key == "FLU" && value == "CR2") {
      content = value + " &#045; Commercial Resort 2";
    } else if (key == "FLU" && value == "LR1") {
      content = value + " &#045; Lake Residential 1";
    } else if (key == "FLU" && value == "LR2") {
      content = value + " &#045; Lake Residential 2";
    } else if (key == "FLU" && value == "N") {
      content = value + " &#045; Not Permitted";
    } else if (key == "FLU" && value == "P") {
      content = value + " &#045; Permitted by Right Use";
    } else if (key == "FLU" && value == "RR") {
      content = value + " &#045; Rural Resource";
    } else if (key == "FLU" && value == "SE") {
      content = value + " &#045; Special Exception";
    } else if (key == "FLU" && value == "TC") {
      content = value + " &#045; Town Center";
    } else if (key == "FLU" && value == "TR") {
      content = value + " &#045; Town Residential";
    } else if (key == "FLU" && value == "EC") {
      content = value + " &#045; Employment Center";
    } else if (key == "FLU" && value == "GC") {
      content = value + " &#045; General Commercial";
    } else if (key == "FLU" && value == "SR") {
      content = value + " &#045; Suburban Residential";
    }
    return content;
  };

  parcelTemplate = new InfoTemplate("Parcel Info",
        "<span class=\"sectionhead\">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />"
        + "${CITY:checkNull} Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br />"
        + "${DR1LIBER:checkNull} ${DR1FOLIO:checkNull} <hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />"
        + "Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES} Acres <br />"
        + "${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>"
        + "Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}");

  addrTemplate = new InfoTemplate("Address Info",
              "<span class=\"sectionhead\">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />"
              + "Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />"
              + "Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />");
  streetTemplate = new InfoTemplate("Street Info",
             "<span class=\"sectionhead\">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />"
              + "Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />");

  pstreamTemplate = new InfoTemplate("Stream Info",
            "<span class=\"sectionhead\">Layer: Perennial Streams</span><br /><br /><hr>"
            + "Stream Segment Length: ${SHAPE_Leng:NumberFormat(places:1)} feet");

  swpaTemplate = new InfoTemplate("Source Water Info",
            "<span class=\"sectionhead\">Layer: Source Water Protection Areas</span><br /><br />"
            + "Water System: ${WHPAs_Me_2} <br /> Geology: ${WHPAs_Me_6} <br /> Project Info: ${WHPAs_M_11} <br /> Location: ${WHPAs_M_12} <br />"
            + "Source: ${CWS_SRC_NA} <br /> Completion Date: ${CWS_COMP_D} <br /> Aquifer: ${CWS_AQUIFE} <br />");

  growthAreasTemplate = new InfoTemplate("Growth Areas Info",
            "<span class=\"sectionhead\">Layer: Growth Areas</span><br /><br />"
            + "Land Use: ${GENZONE} <br /> Acreage: ${ACRES:NumberFormat(places:2)} <br /> Zoning: ${FLU:formatFLU}");

  protectedSpeciesTemplate = new InfoTemplate("Protected Species Info",
            "<span class=\"sectionhead\">Layer: Protected Species</span><br /><br /><hr>"
            + "${GROUP:formatProtectedSpecies}");

  dclTemplate = new InfoTemplate("Deep Creek Lake",
            "<span class=\"sectionhead\">Layer: Deep Creek Lake</span><br /><br /><hr>"
            + "Estimated Acreage: ${Acreage:NumberFormat(places:0)}");
          

  saParameters = new ImageParameters();
  saParameters.layerIds = [0, 1, 2, 3, 4, 5, 6, 7];
  saParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;

  SA_fLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer", // {
    {"imageParameters": saParameters, opacity: 0.75});

  map.addLayer(SA_fLayer);

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

  function executeIdentifyTask(evt) {
    var deferred, myLayerIds, identifyParams, task = new IdentifyTask("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer");
    myLayerIds = [0, 1, 2, 3, 4, 5, 6, 7];

    identifyParams = new IdentifyParameters();
    identifyParams.tolerance = 3;
    identifyParams.returnGeometry = true;
    identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE; // .LAYER_OPTION_ALL; 
    identifyParams.layerIds = myLayerIds;
    // setting LAYER_OPTION_VISIBLE was an important change, eliminating attempts to identify layers not within scale range.
    identifyParams.width  = map.width;
    identifyParams.height = map.height;
    identifyParams.geometry = evt.mapPoint;
    identifyParams.mapExtent = map.extent;
    identifyParams.tolerance = 3;
    identifyParams.SpatialReference = 102100;

    // NEW TESTING
    deferred = task.execute(identifyParams);

    deferred.addCallback(function (response) {

      // response is an array of identify result objects    
      // Let's return an array of features.
      return dojo.map(response, function (result) {
        var feature = result.feature;

        if (result.layerName === 'addresspoints') {
          feature.setInfoTemplate(addrTemplate);
        } else if (result.layerName === 'Parcels') {
          feature.setInfoTemplate(parcelTemplate);
        } else if (result.layerName === 'centerlines') {
          feature.setInfoTemplate(streetTemplate);
        } else if (result.layerName === 'GrowthAreas') {
          feature.setInfoTemplate(growthAreasTemplate);
        } else if (result.layerName === 'Source Water Protection Areas') {
          feature.setInfoTemplate(swpaTemplate);
        } else if (result.layerName === 'Protected Species') {
          feature.setInfoTemplate(protectedSpeciesTemplate);
        } else if (result.layerName === 'Perennial Streams') {
          feature.setInfoTemplate(pstreamTemplate);
        } else if (result.layerName === 'Deep Creek Lake') {
          feature.setInfoTemplate(dclTemplate);
        }

        return feature;

      }, function (error) {console.log("Error: " + error); });

    }); // end of deferred callback function

    map.infoWindow.show(evt.mapPoint);
    map.infoWindow.setFeatures([ deferred ]);

  } // end of function executeIdentifyTask

  map.on("click", executeIdentifyTask);
  map.on("click", makePopupDraggable);

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

});