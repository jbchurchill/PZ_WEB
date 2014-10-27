var app = {};
var mpArray;
var passedCenter;
app.map = null; app.toolbar = null; app.tool = null; app.symbols = null; app.printer = null;
require([
  "esri/map",
  "esri/toolbars/draw",
  "esri/dijit/Print",
  "esri/dijit/Geocoder",
  "esri/dijit/Legend",
  "esri/geometry/webMercatorUtils",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/ImageParameters",
  "esri/tasks/PrintTemplate",
  "esri/tasks/LegendLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol", 
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",
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
  Print,
  Geocoder,
  Legend,
  webMercatorUtils,
  ArcGISTiledMapServiceLayer,
  ArcGISDynamicMapServiceLayer,
  FeatureLayer,
  ImageParameters,
  PrintTemplate,
  LegendLayer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  TextSymbol,
  Font,
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
  var isLabel = false;
  passedCenter = [passedX, passedY];

  app.map = new Map("map", {
    center: passedCenter, // [-79.2, 39.5],
    zoom: zoomLevel // 12
  });
  app.map.on("load", function() {
    app.toolbar = new Draw(app.map);
    app.toolbar.on("draw-end", addToMap);
    app.map.on("mouse-move", showCoordinates);
    app.map.on("mouse-drag", showCoordinates);
    dojo.connect(app.map, "onExtentChange", getExtent);
  });
  function clearMapGraphics () {
    app.map.graphics.clear();
  }
  function showCoordinates(evt) {
    //the map is in web mercator but display coordinates in geographic (lat, long)
    var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
    //display mouse coordinates in the right panel
    dom.byId("coordsinfo").innerHTML = mp.x.toFixed(5) + ", " + mp.y.toFixed(5);
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

  var legendLayer = new LegendLayer();
  // legendLayer.layerId = "Parcels & Addresses"; // THIS WORKS. IT MUST BE THE SAME STRING AS RETURNED BY PZ_fLayer.id
  legendLayer.layerId = "Zoning";
  // legendLayer.subLayerIds = [4, 10];

  var PZ_fLayer, CT_fLayer, WT_fLayer, CL_fLayer, PS_fLayer, ZN_fLayer, SP_fLayer, PR_fLayer, GA_fLayer, FH_fLayer;
  var myCounter = 0;
  function setupPrint () {
    if (myCounter > 0) { // you already created the Print Widget
      return;
    }
    myCounter += 1;
    var printTitle;
    var myInput = registry.byId("mapTitle");
    var dataAuthorText = "Data from Garrett County Office of Planning and Land Management. Accuracy is not guaranteed (see http://gis.garrettcounty.org/).";
    var copyRightText = "Title and Graphics created by User at " + ip;
    printTitle = myInput.get("value"); // in order to use get
    var layouts = [{
      name: "Letter ANSI A Landscape", 
      label: "Landscape (PDF)", 
      format: "pdf", 
      options: { 
        legendLayers: [legendLayer], // empty array means no legend
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
        legendLayers: [legendLayer],
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
        legendLayers: [legendLayer],
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
        legendLayers: [legendLayer],
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
      url: "http://gis.garrettcounty.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    }, dom.byId("printButton"));
    app.printer.startup();
  } // end function setupPrint

  on(dom.byId("prepMap"), "click", setupPrint);
  on(dom.byId("clearGraphics"), "click", clearMapGraphics);
  on(dom.byId("textLabel"), "click", addTextLabel);

  var url = "http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer";
  var tiledLayer = new ArcGISTiledMapServiceLayer(url, { "id": "MD Imagery" });
  app.map.addLayer(tiledLayer);
  var saParameters, pzParameters;
  saParameters = new ImageParameters();
  saParameters.layerIds = [1, 4, 5, 6, 7]; // [0, 1, 2, 3, 4, 5, 6, 7];
  saParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
  pzParameters = new ImageParameters();
  pzParameters.layerIds = [4, 8]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  pzParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;

  PZ_fLayer = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
    {"imageParameters": pzParameters, opacity: 0.75, id: "Parcels & Addresses"});

  CT_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/5", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Cell Towers"
  });

  WT_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/3", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Wind Turbines"
  });

  CL_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/6", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Street Centerlines"
  });

  PS_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/1", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Perennial Streams"
  });

  ZN_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/10", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.3,
    id: "Zoning"
  });

  SP_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/4", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.45, 
    id: "Source Water Prot. Areas"
  });

  PR_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/6", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.45, 
    id: "Protected Species"
  });

  GA_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/7", {
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.75, 
    id: "Growth Areas"
  });
    // {"imageParameters": saParameters, opacity: 0.75, id: "Source Water Protection Areas"});

  FH_fLayer = new FeatureLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/2", {
    mode: FeatureLayer.MODE_ONDEMAND,
    id: "Flood Hazard",
    opacity: 0.75
    // outFields: ["*"]
  });

  app.map.addLayers([PZ_fLayer, CT_fLayer, WT_fLayer, CL_fLayer, PS_fLayer, ZN_fLayer, SP_fLayer, PR_fLayer, GA_fLayer, FH_fLayer]);
  
  // create a check box for each map layer
  arrayUtils.forEach(["Parcels & Addresses", "Cell Towers", "Wind Turbines", "Street Centerlines", "Perennial Streams", "Zoning", "Source Water Prot. Areas", "Protected Species", "Growth Areas", "Flood Hazard", "MD Imagery"], function(id) {
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
    zoomLevel = app.map.getLevel();
    console.log(passedX + ", " + passedY + ", " + zoomLevel)
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
    } else {
      isLabel = false;
    }
    app.tool = type.replace("freehand", "");
    app.toolbar.activate(type);
    app.map.hideZoomSlider();
  }

  function addToMap(evt) {
    var labelText, coordsCheckBox, textSymbolText;
    var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
    app.toolbar.deactivate();
    app.map.showZoomSlider();

    if (isLabel) {
      labelText = prompt("Enter a Text Label", "");
      coordsCheckBox = registry.byId("includeCoords");
      if (coordsCheckBox.get("checked")) {
        textSymbolText = "X: " + mpArray[0] + ", Y: " + mpArray[1]  + "  -  " + labelText;
      } else {
        textSymbolText = labelText;
      }
      var textSymbol = new TextSymbol(
        textSymbolText,
        font, new Color([0, 0, 0]));
      var graphic = new Graphic(evt.geometry, textSymbol);
      var graphic2 = new Graphic(evt.geometry, app.symbols[app.tool]);
      app.map.graphics.add(graphic);
      app.map.graphics.add(graphic2);
    } else {
      var graphic = new Graphic(evt.geometry, app.symbols[app.tool]);
      app.map.graphics.add(graphic);
    }
  }

   // Add Geocoder
  var geocoder = new Geocoder({
    map: app.map 
  }, "geosearch");
  geocoder.startup();
  // End Geocoder
}); // End of require function