var map, console, require, dojo, dijit;
var passedCenter, passedX, passedY, zoomLevel, bMap, bMapName, myBaseMap, twlBaseMap;
require([
  "dojo/dom",
  "esri/Color",
  "dojo/keys",
  "dojo/parser",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/dijit/BasemapGallery",
  "esri/dijit/BasemapLayer",
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
  BasemapLayer,
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
  var basemapGallery, scalebar, mdImagelayer, mdImageBasemap, sfs, imageParameters, visibleLayers, parcelsLayer, snapManager, layerInfos, measurement, geocoder;
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
    }
    url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel + "&bMap=" + bMap;
    window.open(url, winTarget);
  }  
  // streets,satellite,hybrid,topo,gray,oceans,national-geographic,osm 

  switch (bMap) {
  case "basemap_0":
    bMapName = "MD Imagery";
    break;
  case "basemap_1":
    bMapName = "osm";
    break;
  case "basemap_2":
    bMapName = "oceans";
    break;
  case "basemap_3":
    bMapName = "national-geographic";
    break;
  case "basemap_4":
    bMapName = "gray";
    break;
  case "basemap_5":
    bMapName = "terrain";
    break;
  case "basemap_6":
    bMapName = "topo";
    break;
  case "basemap_7":
    bMapName = "streets";
    break;
  case "basemap_8":
    bMapName = "hybrid";
    break;    
  case "basemap_9":
    bMapName = "satellite";
    break;
  default: // use streets as the default
    bMapName = "streets";
    bMap = "basemap_7";
    break;
  }

  passedCenter = [passedX, passedY];
  registry.byId("launchButton").on("click", launchURL);
  // Custom BaseMaps
  mdImagelayer = new ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");
  if (bMapName === "terrain") {
    map = new Map("map", {
      basemap: new Basemap({id: 'terrain',
                  layers: [new BasemapLayer({url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer'}),
                    new BasemapLayer({url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer'})
                  ]
            }), 
      center: passedCenter, // [-79.2, 39.5]
      zoom: zoomLevel // 12
    });
  } else if (bMapName === "MD Imagery") {  
    map = new Map("map", {
      basemap: new Basemap({id: 'MD Imagery', layers: [mdImagelayer]}), 
      center: passedCenter, // [-79.2, 39.5]
      zoom: zoomLevel // 12
    });
  } else { // basemap is one of the ones that works (i.e. not MD Imagery or Terrain with Labels). 
    map = new Map("map", {
      basemap: bMapName,
      center: passedCenter, // [-79.2, 39.5]
      zoom: zoomLevel // 12
    });
  }
  console.log("Current bMap: " + bMap);
  //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
  basemapGallery = new BasemapGallery({
    showArcGISBasemaps: true,
    map: map
  }, "basemapGallery");

  basemapGallery.on("selection-change",function(){
    myBaseMap = basemapGallery.getSelected(); 
    // console.log(myBaseMap.title + ", ID: " + myBaseMap.id);
    bMap = myBaseMap.id;
  });

  function getExtent () {
    var center = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = map.getLevel();
    console.log("Zoom: " + zoomLevel + ";  XY: " + passedX + ", " + passedY + ", " + bMap);
  }

  function startTrackingExtent() {
    dojo.connect(map, "onExtentChange", getExtent);
  }

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
      {name: "Sensitive Areas", id: "SENSI", baseURL: "sensitive.php"}
    ]
  });
  comboBox = new ComboBox({
    id: "mapSelect",
    name: "map",
    value: "Measurement",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();        

  // mdImagelayer = new ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");
  // basemapGallery.remove("basemap_5");
  mdImageBasemap = new Basemap({
    layers: [mdImagelayer],
    title: "MD Imagery",
    thumbnailUrl: "http://gis.garrettcounty.org/arcgis/images/image_v2.png"
  });

  basemapGallery.add(mdImageBasemap);
  basemapGallery.startup();

  basemapGallery.on("error", function (msg) {
    console.log("basemap gallery error:  ", msg);
  });

  sfs = new SimpleFillSymbol(
    "solid",
    new SimpleLineSymbol("solid", new Color([145, 105, 135]), 2), // ([195, 176, 23]), 2),
    null
  );

  imageParameters = new ImageParameters();
  imageParameters.layerIds = [1, 4, 5, 6, 8];
  imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;

  visibleLayers = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
      {"imageParameters": imageParameters, opacity: 0.55}); // , opacity:.55}); // NEW
  map.addLayer(visibleLayers);

  parcelsLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/8", {
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
  geocoder = new Geocoder({
    map: map
  }, "geosearch");
  geocoder.startup();
  // End Geocoder

});