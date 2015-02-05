var map, zoom, center, scalebar, checkNull, content;
var mdImagelayer, mapLaunchStore, comboBox, flzTemplate, parcelTemplate, addrTemplate, streetTemplate, fpFEMA_task, mdImageBasemap, identifyParams, geocoder;
var basemapGallery, layerFEMA, imageParameters;
var passedCenter, passedX, passedY, zoomLevel;
require(["esri/map",
  "esri/dijit/Scalebar",
  "esri/dijit/Popup",
  "esri/dijit/BasemapGallery",
  "esri/dijit/Basemap",
  "dojo/dom",
  "dojo/store/Memory",
  "dijit/form/ComboBox",
  "dijit/registry",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/geometry/webMercatorUtils",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
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
  Basemap,
  dom,
  Memory,
  ComboBox,
  registry,
  BorderContainer,
  ContentPane,
  TitlePane,
  FeatureLayer,
  ArcGISDynamicMapServiceLayer,
  ArcGISTiledMapServiceLayer,
  ImageParameters,
  webMercatorUtils,
  SimpleFillSymbol,
  SimpleLineSymbol,
  Color,
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

  // center = [-79.2, 39.5];
  // zoom = 10;
  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)
  function launchURL() {
    var selectedMap = dijit.byId('mapSelect').get('value'), baseURL, url, winTarget;
    switch (selectedMap) {
    case "Measurement":
      winTarget = '_blank';
      baseURL = "measure.php";
      break;
    case "Planning and Zoning":
      baseURL = "pz_map.php";
      winTarget = '_blank';
      break;
    case "Flood Hazard":
      baseURL = "FEMA_map.php";
      winTarget = '_self';
      break;
    case "Sensitive Areas":
      baseURL = "sensitive.php";
      winTarget = '_blank';
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
  }

  function makePopupDraggable() {
    var popupDiv, dnd;
    popupDiv = document.querySelector(".esriPopup");
    if (popupDiv) {
      dnd = new dojo.dnd.Moveable(dom.byId(popupDiv));
    }
    return dnd;
  }

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

  // LAUNCH MAP
  map.on("load", startTrackingExtent);
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
    value: "Flood Hazard",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();

  // checkNull infoTemplate Formatting Function
  checkNull = function (value, key) {
    function determineVal(val, strKey, addBreak) {
      if (val == "Null" | val == "") {
        content = "";
      } else {
        if (addBreak) {
          if (strKey == "SDAT Link: <a href=\"") {
            val += "\" target=\"_blank\">LINK</a>";
          }
          if (strKey == "Subtype: " & val == "0.2 PCT ANNUAL CHANCE FLOOD HAZARD") { // ) {
            // This subtype is redundant with the FLD_ZONE2 Field.
            strKey = "";
            val = "";
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
    case "ZONE_SUBTY":
      determineVal(value, "Subtype: ", true);
    }
    return content;
  };


  flzTemplate = new InfoTemplate("", "<span class=\"sectionhead\">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE2} <br/> ${ZONE_SUBTY:checkNull}");
  parcelTemplate = new InfoTemplate("",
        "<span class=\"sectionhead\">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />"
        + "City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class=\"sectionhead\">Deed Reference</span><br />"
        + "Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />"
        + "Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />"
        + "${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>"
        + "Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}");

  addrTemplate = new InfoTemplate("Address Info",
              "<span class=\"sectionhead\">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />"
              + "Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />"
              + "Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />");
  streetTemplate = new InfoTemplate("",
              "<span class=\"sectionhead\">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />"
              + "Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />");

  // FEMA service does not work very well in my experience.
  // fpFEMA_task = new IdentifyTask("https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/");
  fpFEMA_task = new IdentifyTask("http://maps.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/");
  // featureLayer = new FeatureLayer("https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28",


  imageParameters = new ImageParameters();
  imageParameters.layerIds = [0, 1, 2, 3];
  imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;


  // var landBaseLayer = new ArcGISDynamicMapServiceLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
  layerFEMA = new ArcGISDynamicMapServiceLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/",
    {"imageParameters": imageParameters, opacity: 0.75});

  map.addLayer(layerFEMA);

  basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

  mdImagelayer = new ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");

  mdImageBasemap = new Basemap({
    layers: [mdImagelayer],
    title: "MD Imagery",
    thumbnailUrl: "http://maps.garrettcounty.org/arcgis/images/image_v2.png"
  });
  basemapGallery.add(mdImageBasemap);

  basemapGallery.startup();

  basemapGallery.on("error", function (msg) {
    console.log("basemap gallery error:  ", msg);
  });


  function executeIdentifyTask(evt) {
    identifyParams = new IdentifyParameters();
    identifyParams.tolerance = 3;
    identifyParams.returnGeometry = true;
    // identifyParams.layerIds = [1, 2, 3, 4, 5, 6, 8, 10];
    identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE; // .LAYER_OPTION_ALL; 
    // setting LAYER_OPTION_VISIBLE was an important change, eliminating attempts to identify layers not within scale range.
    identifyParams.width  = map.width;
    identifyParams.height = map.height;
    identifyParams.geometry = evt.mapPoint;
    identifyParams.mapExtent = map.extent;
    identifyParams.tolerance = 3;
    identifyParams.SpatialReference = 102100;


    // layers that can be identified by "click"
    identifyParams.layerIds = [0, 1, 2, 3];

    var deferred = fpFEMA_task.execute(identifyParams);

    deferred.addCallback(function (response) {
      // response is an array of identify result objects    
      // Let's return an array of features.
      return dojo.map(response, function (result) {
        var feature = result.feature;
        // feature.attributes.layerName = result.layerName;

        if (result.layerName === 'Flood Hazard Areas') {
          // console.log("Flood Zone: " + feature.attributes.FLD_ZONE2);
          // var template = new InfoTemplate("", "<span class=\"sectionhead\">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE} <br/>");
          feature.setInfoTemplate(flzTemplate);
        } else if (result.layerName === 'addresspoints') {
          // var template = new InfoTemplate("",
          feature.setInfoTemplate(addrTemplate);
        } else if (result.layerName === 'Garrett.DBO.TaxParcel') {
          feature.setInfoTemplate(parcelTemplate);
        } else if (result.layerName === 'centerlines') {
          feature.setInfoTemplate(streetTemplate);
        }

        return feature;
      // } // feature.length > 0

      }, function (error) {console.log("Error: " + error); });
      // });

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

  map.on("click", executeIdentifyTask);
  map.on("click", makePopupDraggable);

// Add Geocoder
  geocoder = new Geocoder({
    map: map
  }, "geosearch");
  geocoder.startup();
  // End Geocoder

});