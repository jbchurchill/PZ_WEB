var map, console, require;
var passedCenter, passedX, passedY, zoomLevel;
require([
  "dojo/dom",
  "esri/Color",
  "dojo/keys",
  "dojo/parser",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/dijit/BasemapGallery",
  "esri/config",
  "esri/sniff",
  "esri/map",
  "esri/tasks/GeometryService",
  "esri/dijit/Scalebar",
  "esri/dijit/Basemap",
  "esri/SnappingManager",
  "esri/dijit/Measurement",
  "esri/geometry/webMercatorUtils",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "dojo/store/Memory",
  "dijit/form/ComboBox",
  "dijit/registry",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "esri/dijit/Geocoder",
  "dojo/domReady!"
  ], function (
  dom,
  Color,
  keys,
  parser,
  ArcGISDynamicMapServiceLayer,
  ArcGISTiledMapServiceLayer,
  ImageParameters,
  BasemapGallery,
  esriConfig,
  has,
  Map,
  GeometryService,
  Scalebar,
  Basemap,
  SnappingManager,
  Measurement,
  webMercatorUtils,
  FeatureLayer,
  SimpleRenderer,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Memory,
  ComboBox,
  registry,
  BorderContainer,
  ContentPane,
  TitlePane,
  Geocoder
) {
  parser.parse();
  // SET Variables
  var basemapGallery, scalebar, mdImagelayer, mdImageBasemap, sfs, imageParameters, visibleLayers, parcelsLayer, snapManager, layerInfos, measurement, geocoders, geocoder;
  var mapLaunchStore, comboBox;

  //This sample may require a proxy page to handle communications with the ArcGIS Server services. You will need to  
  //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
  //for details on setting up a proxy page.
  esriConfig.defaults.io.proxyUrl = "/proxy";
  esriConfig.defaults.io.alwaysUseProxy = false;
  //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
  esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)

  function launchURL () {
    var selectedMap = dijit.byId('mapSelect').get('value'), baseURL, url, winTarget;
    switch (selectedMap) {
    case "Measurement":
      winTarget = '_self';
      baseURL = "measure.php";
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
      winTarget = '_blank';
      break;
    case "Printable":
      baseURL = "printable.php";
      winTarget = '_blank';
      break;
    }
    // var url = "measure.php?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    var url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel; //  + "&bMap=" + bMap;
    window.open(url, winTarget);
  }

  passedCenter = [passedX, passedY];
  registry.byId("launchButton").on("click", launchURL);
  
  function startTrackingExtent() {
    dojo.connect(map, "onExtentChange", getExtent);
  }
  // console.log(passedCenter);
  // console.log(zoomLevel);

  // You may wish to change the id to map or mapDiv (if that is the map you are using
  map = new Map("map", {
    basemap: "streets",
    center: passedCenter, // [-79.2, 39.5]
    zoom: zoomLevel // 12
  });

  //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
  basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

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
  var mapLaunchStore = new Memory({
    data: [
      {name: "Flood Hazard", id: "FEMA", baseURL: "FEMA_map.php"},
      {name: "Measurement", id: "MSMT", baseURL: "measure.php"},
      {name: "Planning and Zoning", id: "PZMAP", baseURL: "pz_map.php"},
      {name: "Sensitive Areas", id: "SENSI", baseURL: "sensitive.php"},
      {name: "Printable", id: "PRINT", baseURL: "printable.php"}
    ]
  });
  var comboBox = new ComboBox({
    id: "mapSelect",
    name: "map",
    value: "Measurement",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();        
  
  
  function getExtent (extent) {
    var center=webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = map.getLevel();
    // console.log("Zoom: " + zoomLevel + ";  XY: " + passedX + ", " + passedY);
  }

  mdImagelayer = new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");
  
  mdImage2011 = new esri.layers.ArcGISTiledMapServiceLayer("http://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");

  mdImageBasemap = new esri.dijit.Basemap({
    layers: [mdImagelayer],
    title: "MD 2014 Imagery",
    thumbnailUrl: "http://maps.garrettcounty.org/arcgis/images/image2014.png"
  });

  mdImageBasemap2011 = new esri.dijit.Basemap({
    layers: [mdImage2011],
    title: "MD 2011 Imagery",
    thumbnailUrl: "http://maps.garrettcounty.org/arcgis/images/image_v2.png"
  });
  basemapGallery.add(mdImageBasemap);
  basemapGallery.add(mdImageBasemap2011);

  basemapGallery.startup();

  basemapGallery.on("error", function (msg) {
    console.log("basemap gallery error:  ", msg);
  });


  sfs = new SimpleFillSymbol(
    "solid",
    new SimpleLineSymbol("solid", new Color([195, 176, 23]), 2),
    null
  );

  imageParameters = new ImageParameters();
  imageParameters.layerIds = [0, 2, 3, 4, 6]; // [1, 4, 5, 6, 8];
  imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;

  // visibleLayers = new ArcGISDynamicMapServiceLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
  visibleLayers = new ArcGISDynamicMapServiceLayer("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
      {"imageParameters": imageParameters, opacity: 0.55}); // , opacity:.55}); // NEW
  map.addLayer(visibleLayers);

  // parcelsLayer = new FeatureLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/8", {
    parcelsLayer = new FeatureLayer("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/6", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ["*"]
  });
  parcelsLayer.setRenderer(new SimpleRenderer(sfs));
  map.addLayers([parcelsLayer]);

  //dojo.keys.copyKey maps to CTRL on windows and Cmd on Mac., but has wrong code for Chrome on Mac
  snapManager = map.enableSnapping({
    snapKey: has("mac") ? keys.META : keys.CTRL
  });
  layerInfos = [{
    layer: parcelsLayer
  }];
  snapManager.setLayerInfos(layerInfos);

  measurement = new Measurement({
    map: map
  }, dom.byId("measurementDiv"));
  measurement.startup();

  // Add Geocoder
  geocoders = [{
    url: "http://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocatorWithEsri/GeocodeServer",
    name: "MDiMap Composite Locator", 
    singleLineFieldName: "SingleLine",
  }];
  geocoder = new Geocoder({
    map: map,
    geocoders: geocoders,
    arcgisGeocoder: false
  }, "geosearch");
  geocoder.startup();
  // End Geocoder - console.log(geocoder.activeGeocoder.url);
});