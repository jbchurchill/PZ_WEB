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
    "esri/SpatialReference",
    "esri/geometry/Extent",
    "esri/geometry/Geometry",
    "esri/tasks/GeometryService",
    "esri/dijit/Scalebar",
    "esri/SnappingManager",
    "esri/dijit/Measurement",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
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
    esriConfig, has, Map, SpatialReference, Extent, Geometry, GeometryService, Scalebar, SnappingManager, Measurement, FeatureLayer, SimpleRenderer, GeometryService, ProjectParameters, SimpleLineSymbol, SimpleFillSymbol
  ) {
    parser.parse();
    //This sample may require a proxy page to handle communications with the ArcGIS Server services. You will need to  
    //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
    //for details on setting up a proxy page.
    esriConfig.defaults.io.proxyUrl = "/proxy";
    esriConfig.defaults.io.alwaysUseProxy = false;
    //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
    esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


    // NEW FOR PHP
    var avgX = ((Number(xMin) + Number(xMax)) / 2);
    var avgY = ((Number(yMin) + Number(yMax)) / 2);

    console.log(xMin, yMin, xMax, yMax);
    console.log(avgX, avgY);
    var passedExtent = new esri.geometry.Extent(Number(xMin), Number(yMin), Number(xMax), Number(yMax), new esri.SpatialReference({wkid:102685}) );
    var projectParams = new esri.tasks.ProjectParameters();
    projectParams.geometries = passedExtent;
    projectParams.outSR = new esri.SpatialReference({wkid:102100}); // map.spatialReference;  ummmmm map not defined yet
    // projectParams.spatialReference = new esri.SpatialReference({wkid:2248}); // map.spatialReference;
    
    // var defer = esri.config.defaults.geometryService.project(projectParams);
    // dojo.when(defer, function (projectedGeometry) {
    //   if (projectedGeometry.length > 0) {
    //     map.setExtent(projectedGeometry[0]);
    //   }
    // });
    
    
    
    // You may wish to change the id to map or mapDiv (if that is the map you are using
    map = new Map("map", { 
      basemap: "streets",
      center: [-79.23, 39.51], // center: [avgX, avgY], // center: [-79.23, 39.51],
      // extent: passedExtent,
      // spatialReference: new esri.SpatialReference({wkid:102685}),
      // spatialReference: new esri.SpatialReference(102100), // (102685),
      zoom: 12
    });
    
    // THIS IS THE PROBLEM AREA
    // map.setExtent(passedExtent);

     //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
    var basemapGallery = new BasemapGallery({
      showArcGISBasemaps: true,
      map: map
    }, "basemapGallery");

    // spatRef = new esri.SpatialReference({"wkid":2248});
    spatRef = new esri.SpatialReference({wkid:2248}); // THIS DOES NOT WORK EITHER
    // spatRef = new SpatialReference(102685);
    // window.app = {};
    // var passedExtent = new esri.geometry.Extent({"xmin": Number(xMin), "ymin": Number(yMin), "xmax": Number(xMax), "ymax": Number(yMax), "spatialReference":spatRef}); // "SpatialReference":{"wkid":2248}});
    var passedExtent = new esri.geometry.Extent({"xmin": Number(xMin), "ymin": Number(yMin), "xmax": Number(xMax), "ymax": Number(yMax), "spatialReference":spatRef}); // "SpatialReference":{"wkid":2248}});
    // window.app.bounds = new Extent({"xmin":Number(xMin),"ymin":Number(yMin),"xmax":Number(xMax),"ymax":Number(yMax),"spatialReference":{"wkid":102685}});
        // new esri.SpatialReference({wkid:102685}) ); // ({wkid:102685}) );    102100    2248   NOTHING WORKING
        // new esri.SpatialReference);
    var projectParams = new ProjectParameters();
    projectParams.geometries = passedExtent;
    projectParams.outSR = map.spatialReference;
    //  projectParams.spatialReference = map.spatialReference;
    
    var defer = esri.config.defaults.geometryService.project(projectParams);
    dojo.when(defer, function (projectedGeometry) {
      if (projectedGeometry.length > 0) {
        map.setExtent(projectedGeometry[0]);
      }
    });
    
    var scalebar = new Scalebar({
      map: map,
      attachTo: "bottom-right",
      scalebarStyle: "line",
      // "dual" displays both miles and kilmometers
      // "english" is the default, which displays miles
      // use "metric" for kilometers
      scalebarUnit: "english"
    }); 

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