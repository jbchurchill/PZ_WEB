var map, center, zoom, identifyTask, identifyParams;

function executeIdentifyTask(evt) {
  var i;
  identifyParams.geometry = evt.mapPoint;
  identifyParams.mapExtent = map.extent;


  // layers that can be identified by "click" that are NOT in the "Additional Layers" Content Pane
  // Critical Facilities, addresspoints, celltowers, centerlines, dbo.TaxParcel
  // THIS MAY NOT EVEN BE NECESSARY FOR THE TRAIL BROWSER
  identifyParams.layerIds = [0];


  var deferred = identifyTask.execute(identifyParams);

  deferred.addCallback(function (response) {
    var template;
    // response is an array of identify result objects
    // Let's return an array of features.
    return dojo.map(response, function (result) {
      var feature = result.feature;
      feature.attributes.layerName = result.layerName;
      if (result.layerName === 'Garrett.DBO.Trails') {
        template = new esri.InfoTemplate("Trail Info", 
        "<span class=\"sectionhead\">Layer: Trails</span><br /><br /><hr>Name: ${Name} <br /><br /> System: ${system} <br />" + "Mileage: ${miles} <br /><hr><br />"
        + "<div><span style=\"float: left;\">Information Provided by <br /><a href=\"\http://garretttrails.org\">Garrett Trails</a></span><img src=\"../../uploads/2/8/3/9/2839881/6974422.png\" style=\"float: right;\" width=\"40\" /></div>");
        map.infoWindow.resize(250, 500);
        feature.setInfoTemplate(template);
      } else {console.log("WTF");}
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

}; // end of function executeIdentifyTask


require([
  "esri/map",
  "esri/dijit/Scalebar",
  "esri/dijit/BasemapGallery",
  "esri/dijit/Popup",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ImageParameters",
  "esri/tasks/IdentifyTask",
  "esri/layers/FeatureLayer",
  "esri/tasks/IdentifyResult",
  "esri/tasks/IdentifyParameters",
  "esri/dijit/InfoWindow",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/InfoTemplate",
  "esri/Color",
  "dojo/on",
  "dojo/dom",
  "dojo/parser"
], function (
  Map,
  Scalebar,
  BasemapGallery,
  Popup,
  ArcGISDynamicMapServiceLayer,
  ImageParameters,
  IdentifyTask,
  FeatureLayer,
  IdentifyResult,
  IdentifyParameters,
  InfoWindow,
  SimpleFillSymbol,
  SimpleLineSymbol,
  InfoTemplate,
  Color,
  on,
  dom,
  parser
) {
  parser.parse();
  var popup, scalebar, basemapGallery, mdImagelayer, mdImageBasemap, imageParameters, visibleLayerIds, landBaseLayer;

  function makePopupDraggable() {
    var popupDiv, dnd;
    popupDiv = document.querySelector(".esriPopup");
    if (popupDiv) {
      dnd = new dojo.dnd.Moveable(dom.byId(popupDiv));
    }
    return dnd;
  }

  popup = new Popup({
    fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
  }, dojo.create("div"));
  
  map = new Map("map-canvas", {
    basemap: "streets",
    center: [-79.280, 39.500], // passedCenter, // center,
    zoom: 10, // zoomLevel, // zoom,
    infoWindow: popup
  });
  
  landBaseLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/GarrettTrails/GarrettTrails/MapServer",
    {"imageParameters": imageParameters, opacity: 0.55}); // , opacity:.55}); // NEW
  map.addLayer(landBaseLayer);

  map.on("click", executeIdentifyTask);
  map.on("click", makePopupDraggable);

    identifyTask = new IdentifyTask("https://maps.garrettcounty.org/arcweb/rest/services/GarrettTrails/GarrettTrails/MapServer");

  identifyParams = new IdentifyParameters();
  identifyParams.tolerance = 3;
  identifyParams.returnGeometry = true;
  identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
  identifyParams.width  = map.width;
  identifyParams.height = map.height;


}); // end of require code block;