var map, console, esri, require;
var passedCenter, passedX, passedY, zoomLevel;
require([
  "dojo/dom",
  "esri/Color",
  "dojo/keys",
  "dojo/parser",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/dijit/BasemapGallery",
  "esri/config",
  "esri/sniff",
  "esri/map",
  "esri/tasks/GeometryService",
  "esri/dijit/Scalebar",
  "esri/SnappingManager",
  "esri/dijit/Measurement",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
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
  ImageParameters,
  BasemapGallery,
  esriConfig,
  has,
  Map,
  GeometryService,
  Scalebar,
  SnappingManager,
  Measurement,
  FeatureLayer,
  SimpleRenderer,
  SimpleLineSymbol,
  SimpleFillSymbol,
  BorderContainer,
  ContentPane,
  TitlePane,
  Geocoder
) {
  parser.parse();
  //This sample may require a proxy page to handle communications with the ArcGIS Server services. You will need to  
  //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
  //for details on setting up a proxy page.
  esriConfig.defaults.io.proxyUrl = "/proxy";
  esriConfig.defaults.io.alwaysUseProxy = false;
  //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
  esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

  passedCenter = [passedX, passedY];
  console.log(passedCenter);
  console.log(zoomLevel);

  // You may wish to change the id to map or mapDiv (if that is the map you are using
  map = new Map("map", {
    basemap: "streets",
    center: passedCenter, // [-79.2, 39.5]
    zoom: zoomLevel // 12
  });

  // SET Variables
  var basemapGallery, scalebar, mdImagelayer, mdImageBasemap, sfs, imageParameters, visibleLayers, parcelsLayer, snapManager, layerInfos, measurement, geocoder;
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

  mdImagelayer = new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");

  mdImageBasemap = new esri.dijit.Basemap({
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
    new SimpleLineSymbol("solid", new Color([195, 176, 23]), 2),
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