var map;
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
    "esri/SnappingManager",
    "esri/dijit/Measurement",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/tasks/GeometryService",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/dijit/Scalebar",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "dijit/form/CheckBox", 
    "dojo/domReady!"
  ], function(
    dom, Color, keys, parser, ArcGISDynamicMapServiceLayer, ImageParameters, BasemapGallery,
    esriConfig, has, Map, SnappingManager, Measurement, FeatureLayer, SimpleRenderer, GeometryService, SimpleLineSymbol, SimpleFillSymbol
  ) {
    parser.parse();
    //This sample may require a proxy page to handle communications with the ArcGIS Server services. You will need to  
    //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
    //for details on setting up a proxy page.
    esriConfig.defaults.io.proxyUrl = "/proxy";
    esriConfig.defaults.io.alwaysUseProxy = false;
    //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
    esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

    // You may wish to change the id to map or mapDiv (if that is the map you are using
    map = new Map("map", { 
      basemap: "streets",
      center: [-79.23, 39.51],
      zoom: 12
    });
    
     //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
    var basemapGallery = new BasemapGallery({
      showArcGISBasemaps: true,
      map: map
    }, "basemapGallery");
    
    var mdImagelayer = new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");
    
    var mdImageBasemap = new esri.dijit.Basemap({
      layers: [mdImagelayer],
      title: "MD Imagery",
      thumbnailUrl: "http://gis.garrettcounty.org/arcgis/images/image_v2.png"
    });
    basemapGallery.add(mdImageBasemap);
    
    basemapGallery.startup();
    
    basemapGallery.on("error", function(msg) {
      console.log("basemap gallery error:  ", msg);
    });
    
    
    var sfs = new SimpleFillSymbol(
      "solid",
      new SimpleLineSymbol("solid", new Color([195, 176, 23]), 2), 
      null
    );
    
    var imageParameters = new ImageParameters();
    imageParameters.layerIds = [1, 4, 5, 6, 8];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
    
    var visibleLayers = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
    {"imageParameters": imageParameters, opacity:.55}); // , opacity:.55}); // NEW
    map.addLayer(visibleLayers);

    var parcelsLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/8", {
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"]
    });
    parcelsLayer.setRenderer(new SimpleRenderer(sfs));
    map.addLayers([parcelsLayer]);

    //dojo.keys.copyKey maps to CTRL on windows and Cmd on Mac., but has wrong code for Chrome on Mac
    var snapManager = map.enableSnapping({
      snapKey: has("mac") ? keys.META : keys.CTRL
    });
    var layerInfos = [{
      layer: parcelsLayer
    }];
    snapManager.setLayerInfos(layerInfos);

    var measurement = new Measurement({
      map: map
    }, dom.byId("measurementDiv"));
    measurement.startup();
  });