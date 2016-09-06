var app = {};
var mpArray;
var passedCenter;
// var gLayer;
app.map = null; app.toolbar = null; app.tool = null; app.symbols = null; app.printer = null;
require([
  "esri/map",
  "esri/toolbars/draw",
  "esri/toolbars/edit",
  "esri/dijit/Scalebar",
  "esri/dijit/Print",
  "esri/dijit/Geocoder",
  "esri/dijit/BasemapGallery",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/ImageParameters",
  "esri/layers/GraphicsLayer",
  "esri/layers/LabelClass",
  "esri/tasks/PrintTemplate",
  "esri/tasks/LegendLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol", 
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",
  "esri/renderers/SimpleRenderer",
  "esri/graphic",
  "esri/config",
  "dojo/_base/array",
  "esri/Color",
  "dojo/parser", 
  "dojo/query",
  "dojo/dom",
  "dojo/on",
  "dojo/dom-construct",
  "dojo/store/Memory",
  "dijit/registry",
  "dijit/form/CheckBox",
  "dijit/form/ComboBox",
  "dijit/form/Button",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "dojox/layout/ExpandoPane",
  "dojo/domReady!"
], function(
  Map,
  Draw,
  editToolbar,
  Scalebar,
  Print,
  Geocoder,
  BasemapGallery,
  webMercatorUtils,
  Point,
  ArcGISTiledMapServiceLayer,
  ArcGISDynamicMapServiceLayer,
  FeatureLayer,
  ImageParameters,
  GraphicsLayer,
  LabelClass,
  PrintTemplate,
  LegendLayer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  TextSymbol,
  Font,
  SimpleRenderer,
  Graphic,
  esriConfig,
  arrayUtils,
  Color,
  parser, 
  query,
  dom,
  on,
  domConstruct,
  Memory,
  registry,
  CheckBox,
  ComboBox,
  Button,
  ExpandoPane
) {
  parser.parse();

  esriConfig.defaults.io.proxyUrl = "/proxy";
  var basemapGallery, legZoning, legSpecies, legGrowth, legEOP, scalebar;
  var isLabel = false;
  passedCenter = [passedX, passedY];

  app.map = new Map("map", {
    basemap: "streets",
    center: passedCenter, // [-79.2, 39.5],
	showLabels: true,
    zoom: zoomLevel // 12
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

      app.map.graphics.add(graphicLL);

      if (graphicLL.geometry.type === 'point') {  
        maxZoom = app.map.getMaxZoom();  
        app.map.centerAndZoom(graphicLL.geometry, maxZoom - 1);  
      } else {  
        app.map.setExtent(graphicsUtils.graphicsExtent([graphicLL]));  
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
    app.map.graphics.clear();
    var x = document.getElementById("centroid");
    if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(showLocation);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  on(dom.byId("getLocationButton"), "click", getLocation);


  app.map.on("load", function() {
    app.toolbar = new Draw(app.map);
    app.toolbar.on("draw-end", addToMap);
    app.map.on("mouse-move", showCoordinates);
    app.map.on("mouse-drag", showCoordinates);
    dojo.connect(app.map, "onExtentChange", getExtent);
    on(dom.byId("submitLatLongButton"), "click", zoomToLatLong);
    // dojo.connect(app.map, "onLoad", createToolbar);
    // dojo.connect(app.map, "layers-add-result", createToolbar);
    createToolbar(app.map);
  });
  function clearMapGraphics () {
    app.map.graphics.clear();
    // app.map.graphicsLayer.clear(); // THIS IS NOT WORKING
  }
  function showCoordinates(evt) {
    //the map is in web mercator but display coordinates in geographic (lat, long)
    var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
    //display mouse coordinates in the right panel
    dom.byId("coordsinfo").innerHTML = mp.y.toFixed(5) + ", " + mp.x.toFixed(5);
    mpArray = [mp.x.toFixed(5), mp.y.toFixed(5)];
  }

  function addTextLabel () {
    // ADD EVENT LISTENER FOR CLICK ON MAP TO IDENTIFY LABEL PLACEMENT.
    // THE EVENT LISTENER WILL HAVE THE PROMPT
    app.toolbar = new Draw(app.map);
    activateTool("label");
    app.toolbar.on("draw-end", addToMap);
    on.once(dom.byId("map"), "click", showCoordinates);
  }
  
  scalebar = new Scalebar({
    map: app.map,
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
    map: app.map
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


  legZoning = new LegendLayer();
  legZoning.layerId = "Zoning";
  // legendLayer.layerId = "Parcels & Addresses"; // THIS WORKS. IT MUST BE THE SAME STRING AS RETURNED BY PZ_fLayer.id
  // legendLayer.subLayerIds = [4, 10];
  legSpecies = new LegendLayer();
  legSpecies.layerId = "Protected Species";
  legGrowth = new LegendLayer();
  legGrowth.layerId = "Growth Areas";
  legEOP = new LegendLayer();
  legEOP.layerId = "Edge of Pavement";
  legSourceWater = new LegendLayer();
  legSourceWater.layerId = "Source Water Prot. Areas";

  var PZ_fLayer, CT_fLayer, WT_fLayer, CL_fLayer, PS_fLayer, ZN_fLayer, SP_fLayer, PR_fLayer, GA_fLayer, FH_fLayer, BF_fLayer, EP_fLayer, CN_fLayer, HY_fLayer, SO_fLayer, WSC_fLayer;
  var myCounter = 0;
  function setupPrint () {
    // if (typeof app.printer !== "undefined") {
    //   app.printer.destroy();
    // }
    // if (myCounter > 0) { // you already created the Print Widget
    if (myCounter > 0) { // you already created the Print Widget
      // return;
      app.printer.destroy();
    }
    myCounter += 1;
    var printTitle;
    var myInput = registry.byId("mapTitle");
    var dataAuthorText = "Data from Garrett County Office of Planning and Land Management. Accuracy is not guaranteed (see https://maps.garrettcounty.org/).";
    var copyRightText = "Title and Graphics created by User at " + ip;
    printTitle = myInput.get("value"); // in order to use get
    var layouts = [{
      name: "Letter ANSI A Landscape", 
      label: "Landscape (PDF)", 
      format: "pdf", 
      options: { 
        legendLayers: [legZoning, legSpecies, legGrowth, legEOP, legSourceWater], // empty array means no legend
        scalebarUnit: "Miles",
        titleText: printTitle + ", Landscape PDF",
        copyrightText: copyRightText,
        authorText: dataAuthorText
      }
    }, {
      name: "Letter ANSI A Portrait", 
      label: "Portrait (Image)", 
      format: "jpg", 
      options:  { 
        legendLayers: [legZoning, legSpecies, legGrowth, legEOP, legSourceWater],
        scaleBarUnit: "Miles",
        titleText: printTitle + ", Portrait JPG",
        copyrightText: copyRightText,
        authorText: dataAuthorText
      }
    }, {
      name: "Letter ANSI A Landscape", 
      label: "Landscape (Image)", 
      format: "jpg", 
      options:  { 
        legendLayers: [legZoning, legSpecies, legGrowth, legEOP, legSourceWater],
        scaleBarUnit: "Miles",
        titleText: printTitle + ", Landscape JPG",
        copyrightText: copyRightText,
        authorText: dataAuthorText
      }
    }, {
      name: "Letter ANSI A Portrait", 
      label: "Portrait (PDF)", 
      format: "pdf", 
      options:  { 
        legendLayers: [legZoning, legSpecies, legGrowth, legEOP, legSourceWater],
        scaleBarUnit: "Miles",
        titleText: printTitle + ", Portrait PDF",
        copyrightText: copyRightText,
        authorText: dataAuthorText
      }            
    }];

    // create the print templates
    var templates = arrayUtils.map(layouts, function(lo) {
      var t = new PrintTemplate();
      t.layout = lo.name;
      t.label = lo.label;
      t.format = lo.format;
      t.layoutOptions = lo.options;
      return t;
    });

    app.printer = new Print({
      map: app.map,
      templates: templates,
      // url: "http://maps.garrettcounty.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      url: "https://maps.garrettcounty.org/arcweb/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    }, dom.byId("printButton"));
    app.printer.startup();
  } // end function setupPrint

  on(dom.byId("prepMap"), "click", setupPrint);
  on(dom.byId("clearGraphics"), "click", clearMapGraphics);
  on(dom.byId("textLabel"), "click", addTextLabel);

  var saParameters, pzParameters, epParameters, cnParameters, hyParameters, labels, labelField;
  saParameters = new ImageParameters();
  saParameters.layerIds = [1, 4, 5, 6, 7]; // [0, 1, 2, 3, 4, 5, 6, 7];
  saParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  pzParameters = new ImageParameters();
  pzParameters.layerIds = [2, 7]; // addresspoints, parcels - OLD [4, 8]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  pzParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  labelField = "RDNAMELOCAL";
  epParameters = new ImageParameters();
  epParameters.layerIds = [2, 3, 4, 5, 6, 7, 8, 9];
  epParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  cnParameters = new ImageParameters();
  cnParameters.layerIds = [11, 12, 13, 14];
  cnParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  hyParameters = new ImageParameters();
  hyParameters.layerIds = [0, 1, 2, 3, 4]
  hyParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  soParameters = new ImageParameters();
  soParameters.layerIds = [0];
  soParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  
  // PZ_fLayer = new ArcGISDynamicMapServiceLayer("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
  PZ_fLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
    {"imageParameters": pzParameters, opacity: 0.75, id: "Parcels & Addresses"});

  CT_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/3", { // was 5 // (still 3)
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Cell Towers"
  });

  WT_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/1", { // was 3 // (still 1)
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Wind Turbines"
  });

  CL_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/5", { // was 6 // was 4
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: [labelField],
    showLabels: true,
    id: "Street Centerlines"
  });

  PS_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/1", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Perennial Streams"
  });

  ZN_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/11", { // still 10! // was 10
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.3,
    id: "Zoning"
  });

  SP_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/4", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.45, 
    id: "Source Water Prot. Areas"
  });

  PR_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/6", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.45, 
    id: "Protected Species"
  });

  GA_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/7", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.75, 
    id: "Growth Areas"
  });

  FH_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/FEMA/FEMA/MapServer/2", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Flood Hazard",
    opacity: 0.75
  });

  BF_fLayer = new FeatureLayer("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.75, 
    id: "Building Footprints"
  });
  
  EP_fLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",
    {"imageParameters": epParameters, opacity: 0.75, id: "Edge of Pavement"});

  CN_fLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",
    {"imageParameters": cnParameters, opacity: 0.75, id: "Contours"});

  HY_fLayer = new ArcGISDynamicMapServiceLayer("https://maps.garrettcounty.org/arcweb/rest/services/Hydrography/Hydrography/MapServer",
    {"imageParameters": hyParameters, opacity: 0.75, id: "Hydrography"});

  SO_fLayer = new FeatureLayer("http://geodata.md.gov/imap/rest/services/Geoscientific/MD_SSURGOSoils/MapServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
	id: "SSurgo Soils",
    outFields: ["MUSYM"],
	showLabels: true,
	opacity: 0.75
  });

  WSC_fLayer = new FeatureLayer("http://geodata.md.gov/imap/rest/services/Hydrology/MD_Wetlands/MapServer/3/", {
    mode: FeatureLayer.MODE_ONDEMAND,
	id: "Wetlands of State Concern",
	opacity: 0.75
  });

  // create a text symbol to define the style of labels
  var statesColor = new Color([255, 170, 0, 255]); // ("#666"); Copied RGBT value from the Service Definition
  var statesLabel = new TextSymbol().setColor(statesColor);
  statesLabel.font.setSize("14pt");
  statesLabel.font.setFamily("tahoma"); // was arial

  var soilJSON = {
    "labelExpressionInfo": {"value": "{MUSYM}"}
  };

  //create instance of LabelClass (note: multiple LabelClasses can be passed in as an array)
  var labelClass = new LabelClass(soilJSON);
  labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json
  SO_fLayer.setLabelingInfo([ labelClass ]);
  // SO_fLayer.setRenderer(statesRenderer);

  app.map.addLayers([PZ_fLayer, CT_fLayer, WT_fLayer, CL_fLayer, PS_fLayer, ZN_fLayer, SP_fLayer, PR_fLayer, GA_fLayer, FH_fLayer, BF_fLayer, EP_fLayer, CN_fLayer, HY_fLayer, SO_fLayer, WSC_fLayer]);

  // console.log(EP_fLayer.id);
  // console.log(SP_fLayer.id);

  // create a check box for each map layer
  arrayUtils.forEach(["Parcels & Addresses", "Cell Towers", "Wind Turbines", "Street Centerlines", "Perennial Streams", "Zoning", "Source Water Prot. Areas", "Protected Species", "Growth Areas", "Flood Hazard", "Building Footprints", "Edge of Pavement", "Hydrography", "Contours", "SSurgo Soils", "Wetlands of State Concern"], function(id) {
    new CheckBox({
      id: "cb_" + id,
      name: "cb_" + id,
      checked: true,
      onChange: function(bool) { // This is some kind of bizarre syntax
        bool ? 
          app.map.getLayer(this.id.split("_")[1]).show() :
          app.map.getLayer(this.id.split("_")[1]).hide();
      }
    }, domConstruct.create("input", { 
      id: "lyr_" + id 
    })).placeAt(dom.byId("layerToggle"));

    // create a label for the check box
    var label = domConstruct.create('label', { 
      "for": "cb_" + id,
      "innerHTML": id
    });
    domConstruct.place(label, dom.byId("layerToggle"));
    domConstruct.place(domConstruct.create("br"), dom.byId("layerToggle"));
  });

  // set up symbols for the various geometry types
  app.symbols = {};
  app.symbols.point = new SimpleMarkerSymbol("square", 10, new SimpleLineSymbol(), new Color([0, 255, 0, 0.75]));
  app.symbols.polyline = new SimpleLineSymbol("solid", new Color([255, 128, 0]), 2);
  app.symbols.polygon = new SimpleFillSymbol().setColor(new Color([255,255,0,0.25]));
  app.symbols.circle = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.25]));
  app.symbols.line = new SimpleLineSymbol("solid", new Color([180, 10, 80]), 2);

  // find the divs for buttons
  query(".drawing").forEach(function(btn) {
    var button = new Button({
      label: btn.innerHTML,
      onClick: function() {
        activateTool(this.id);
      }
    }, btn);
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
    value: "Printable",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();

  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)

  function launchURL () {
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
      winTarget = '_blank';
      break;
    case "Sensitive Areas":
      baseURL = "sensitive.php";
      winTarget = '_blank';
      break;
    case "Printable":
      baseURL = "printable.php";
      winTarget = '_self';
      break;
    }
    url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    window.open(url, winTarget);
  }

  registry.byId("launchButton").on("click", launchURL);

  function getExtent(extent) {
    var center = webMercatorUtils.webMercatorToGeographic(extent.getCenter());
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = app.map.getLevel();
    var x = document.getElementById("centroid");
    x.innerHTML = "Latitude: " + passedY + "<br />Longitude: " + passedX;
  }

  function activateTool(type) {
    if (type === "label") {
      app.symbols.point = new SimpleMarkerSymbol("circle", 10, new SimpleLineSymbol(), new Color([255, 0, 0, 0.75]));
      type = "point";
      esri.bundle.toolbars.draw.addPoint = "Add a text label";
      isLabel = true;
    } else if (type === "point") {
      app.symbols.point = new SimpleMarkerSymbol("square", 10, new SimpleLineSymbol(), new Color([0, 255, 0, 0.75]));
      esri.bundle.toolbars.draw.addPoint = "Click to add a point";
      isLabel = false;
    } else if (type === "arrow") {
      app.symbols.arrow = new SimpleFillSymbol().setColor(new Color([0, 0, 180, 0.25]));
    } else if (type === "rectangle") {
      app.symbols.rectangle = new SimpleFillSymbol().setColor(new Color([0, 180, 39, 0.25]));
    } else {
      isLabel = false;
    }
    app.tool = type.replace("freehand", "");
    app.toolbar.activate(type);
    app.map.hideZoomSlider();
  }

  function createToolbar() {
    //resize the map when the browser resizes
    dojo.connect(dijit.byId('map'), 'resize', app.map, app.map.resize);     

    editToolbar = new esri.toolbars.Edit(app.map);
    //Activate the toolbar when you click on a graphic
    dojo.connect(app.map.graphics, "onClick", function(evt) {
      dojo.stopEvent(evt);
      activateToolbar(evt.graphic);
    });

    //deactivate the toolbar when you click outside a graphic
    dojo.connect(app.map,"onClick", function(evt){
      editToolbar.deactivate();
    });
  }

  function activateToolbar(graphic) {
    var options = {allowAddVertices: true, allowDeleteVertices: true};
    editToolbar.activate(
      esri.toolbars.Edit.EDIT_VERTICES | esri.toolbars.Edit.ROTATE,
      graphic, 
      options
    );
  }
  

  function addToMap(evt) {
    // app.gLayer = new GraphicsLayer();
    var labelText, textSymbol, coordsCheckBox, textSymbolText, graphic, graphic2;
    var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER, "Ariel");
    app.toolbar.deactivate();
    app.map.showZoomSlider();

    if (isLabel) {
      labelText = prompt("Enter a Text Label", "");
      coordsCheckBox = registry.byId("includeCoords");
      if (coordsCheckBox.get("checked")) {
        textSymbolText = "Lat: " + mpArray[1] + ", Long: " + mpArray[0]  + "  -  " + labelText;
      } else {
        textSymbolText = labelText;
      }
      textSymbol = new TextSymbol(
        textSymbolText,
        font, new Color([0, 0, 0]));
      graphic = new Graphic(evt.geometry, textSymbol);
      graphic2 = new Graphic(evt.geometry, app.symbols[app.tool]);
      // before changing to version 3.11 of the API, only the first of the two above graphics added would print (text OR graphic point but never both).
      app.map.graphics.add(graphic);
      app.map.graphics.add(graphic2);
    } else {
      graphic = new Graphic(evt.geometry, app.symbols[app.tool]);
      app.map.graphics.add(graphic);
    }
    isLabel = false;
  }


  // Add Geocoder
  geocoders = [{
    url: "https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer",
    name: "MDiMap Composite Locator", 
    singleLineFieldName: "SingleLine",
  }];
  geocoder = new Geocoder({
    map: app.map,
    geocoders: geocoders,
    arcgisGeocoder: false
  }, "geosearch");
  geocoder.startup();
  // End Geocoder
}); // End of require function