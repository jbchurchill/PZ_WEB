var map, zoom, center, require, dojo, scalebar, checkNull, content;
var passedCenter, passedX, passedY, zoomLevel;
require(["esri/map",
  "esri/dijit/Scalebar",
  "esri/dijit/Popup",
  "esri/dijit/BasemapGallery",
  "dojo/store/Memory",
  "dojo/DeferredList",
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
  Memory,
  DeferredList,
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
  var mapLaunchStore = new Memory({
    data: [
      {name:"Measurement", id:"MSMT", baseURL: "measure.php"},
      {name:"Planning and Zoning", id:"PZMAP", baseURL: "pz_map.php"}
    ]
  });
  var comboBox = new ComboBox({
    id: "mapSelect",
    name: "map",
    value: "Measurement",
    store: mapLaunchStore,
    searchAttr: "name"
  }, "mapSelect").startup();        
  
  // runs when Measure Button is clicked (see the second line inside of the "initSelectToolbar" fx and the getExtent fx below)
  function launchURL () {
    var selectedMap = dijit.byId('mapSelect').get('value');
    var baseURL;
    switch (selectedMap) {
    case "Measurement":
      baseURL = "measure.php";
      break;
    case "Planning and Zoning":
      baseURL = "pz_map.php";
      break;
    }
    // var url = "measure.php?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    var url = baseURL + "?px=" + passedX + "&py=" + passedY + "&zl=" + zoomLevel;
    window.open(url,'_blank');
  }
  
// THIS IS FOR THE deferredList 
              function showResults(r) {
                var results = [];
                r = dojo.filter(r, function (result) {
                    return r[0];
                }); //filter out any failed tasks
                for (i=0;i<r.length;i++) {
                    results = results.concat(r[i][1]);
                }
                results = dojo.map(results, function(result) {
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    var template = (result.layerName == "KS_FIELD_OUTLINES_SPRING2005_GEONAD27") ? new esri.dijit.PopupTemplate({
                        title: "Name: {FIELD_NAME}",
                        fieldInfos: [{
                            fieldName: "CUMM_GAS",
                            visible: true,
                            label: "2005 Gas Prod"
                        },{
                            fieldName: "CUMM_OIL",
                            visible: true,
                            label: "2005 Oil Prod"
                        }]
                    }) : new esri.dijit.PopupTemplate({
                        title: "Name: {Field Name}",
                        fieldInfos: [{
                            fieldName: "Cumulative Gas (mcf)",
                            visible: true,
                            label: "Current Gas Prod"
                        },{
                            fieldName: "Cumulative Oil (bbl)",
                            visible: true,
                            label: "Current Oil Prod"
                        }]
            }); //Select template based on layer name
                    feature.setInfoTemplate(template);
                    return feature;
                });
                if(results.length === 0) {
                    map.infoWindow.clearFeatures();
                } else {
                    map.infoWindow.setFeatures(results);
                }
                map.infoWindow.show(idParams.geometry);
                return results;
            }
            function updateDynLayerVisibility() {
                var inputs = dojo.query(".dyn_item");
                for (i=0;i<inputs.length;i++) {
                    if (inputs[i].checked) {
                        map.getLayer(map.layerIds[inputs[i].id]).show();
                    } else {
                        map.getLayer(map.layerIds[inputs[i].id]).hide();
                    }
                }
                if(map.infoWindow.isShowing) {
                    runIdentifies({mapPoint: idParams.geometry}); //Rerun identify if infowindow is showing
                }
            }
// THIS IS FOR THE deferredList   
  
  
  
  
  
  function getExtent (extent) {
    var center=webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
    passedX = parseFloat(center.x.toFixed(5));
    passedY = parseFloat(center.y.toFixed(5));
    zoomLevel = map.getLevel();
  }

  // checkNull infoTemplate Formatting Function
  checkNull = function (value, key, data) {
    function determineVal(val, strKey, addBreak) {
      if (val == "Null") {
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
    case "SDAT_URL":
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
  }


  map.on("click", runIdentifies); // executeIdentifyTask);

  var flzTemplate = new esri.InfoTemplate("", "<span class=\"sectionhead\">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE} <br/>");
  var parcelTemplate = new esri.InfoTemplate("", 
        "<span class=\"sectionhead\">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />"
        + "${CITY:checkNull} Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br />"
        + "${DR1LIBER:checkNull} ${DR1FOLIO:checkNull} <hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />"
        + "Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES} Acres <br />"
        + "${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>"
        + "Year Built: ${YRBLT_CAMA} <br /> ${SDAT_URL:checkNull}");

  var addrTemplate = new esri.InfoTemplate("Address Info", 
              "<span class=\"sectionhead\">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />"
              + "Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />"
              + "Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />");
  var streetTemplate = new esri.InfoTemplate("",
             "<span class=\"sectionhead\">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />"
              + "Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />");

  var pstreamTemplate = new esri.InfoTemplate("",
            "<span class=\"sectionhead\">Layer: Perennial Streams</span><br /><br />");

  var swpaTemplate = new esri.InfoTemplate("Source Water Info",
            "<span class=\"sectionhead\">Layer: Source Water Protection Areas</span><br /><br />"
            + "Water System: ${WHPAs_Me_2} <br /> Geology: ${WHPAs_Me_6} <br /> Project Info: ${WHPAs_M_11} <br /> Location: ${WHPAs_M_12} <br />"
            + "Source: ${CWS_SRC_NA} <br /> Completion Date: ${CWS_COMP_D} <br /> Aquifer: ${CWS_AQUIFE} <br />");

  var growthAreasTemplate = new esri.InfoTemplate("Growth Areas Info",
            "<span class=\"sectionhead\">Layer: Growth Areas</span><br /><br />");
            
  var protectedSpeciesTemplate = new esri.InfoTemplate("Protected Species Info",
            "<span class=\"sectionhead\">Layer: Protected Species</span><br /><br />");
            
        function runIdentifies(evt) {
          // var defTask1 = new dojo.Deferred(), defTask2 = new dojo.Deferred;
          // var dlTasks = new dojo.DeferredList([defTask1, defTask2]);
          // var PZ_task = new IdentifyTask("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer");
          var defTasks = dojo.map(tasks, function (task) {
                    return new dojo.Deferred();
                }); //map each identify task to a new dojo.Deferred
          var dlTasks = new dojo.DeferredList(defTasks);
          dlTasks.then(showResults);
          
          // SOMETHING DIFFERENT
          var pz_url = "pz"; // "http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer";
          var sa_url = "sa"; // "http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer";
          // var PZ_task = new IdentifyTask("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");
          //var SAreas_task = new IdentifyTask("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer");
          var tasks = [pz_url, sa_url];
          for (i=0; i<tasks.length; i++) {
            executeIdentifyTask(tasks[i], evt);
          }
          map.infoWindow.show(evt.mapPoint);
          // HAVE TO FIGURE OUT HOW TO DO THIS TOO
          // map.infoWindow.setFeatures([ deferred ]);
          // map.infoWindow.setFeatures([ deferred, deferred2 ]);
        } // end of runIdentifies fx 
        
        var imageParameters = new ImageParameters();
        imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        
        var pzParameters = new ImageParameters(), saParameters = new ImageParameters;
        pzParameters.layerIds = [4, 8];
        pzParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        saParameters.layerIds = [0, 1, 2, 3, 4];
        saParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        
        var layerPZ = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
          {"imageParameters": pzParameters, opacity: 0.75});

        var SA_fLayer = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer", // {
          {"imageParameters": saParameters, opacity: 0.75});
          // infoTemplate: SA_template, // DO NOT USE THIS
          // outFields: ["*"]
          //});
        map.addLayer(SA_fLayer);
        // var layerSAreas = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer", 
        //   {"imageParameters": imageParameters, opacity: 0.75});
        
        // var layerPZ = new ArcGISDynamicMapServiceLayer("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",
        //   {"imageParameters": pzParameters, opacity: 0.75});
        
        // map.addLayer(layerSAreas);
        
        // COMMENTED
        map.addLayer(layerPZ);
        // COMMENTED
        
        var basemapGallery = new BasemapGallery({
          showArcGISBasemaps: true,
          map: map
        }, "basemapGallery");

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
                
        
      function executeIdentifyTask(url, evt) {

        if (url == "pz") {
          var task = new esri.tasks.IdentifyTask("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");
          myLayerIds = [4, 8];
        } else if (url == "sa") {
          var task = new esri.tasks.IdentifyTask("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer");
          myLayerIds = [0, 1, 2, 3, 4];
        }

        // console.log(url);
        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 3;
        identifyParams.returnGeometry = true;
        // identifyParams.layerIds = [1, 2, 3, 4, 5, 6, 8, 10];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE; // .LAYER_OPTION_ALL; 
        identifyParams.layerIds = myLayerIds;
        // setting LAYER_OPTION_VISIBLE was an important change, eliminating attempts to identify layers not within scale range.
        identifyParams.width  = map.width;
        identifyParams.height = map.height;
        identifyParams.geometry = evt.mapPoint;
        identifyParams.mapExtent = map.extent;
        identifyParams.tolerance = 3;
        identifyParams.SpatialReference = 102100;        
        
        // layers that can be identified by "click"
        // identifyParams.layerIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // identifyParams.layerIds = [4, 8];
        
        // for Sensitive Areas
        //identifyParams2 = new IdentifyParameters();
        //identifyParams2.tolerance = 3;
        //identifyParams2.returnGeometry = true;
        //identifyParams2.layerIds = [0, 1, 2, 3, 4];
        //identifyParams2.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE; // .LAYER_OPTION_ALL; 
        // setting LAYER_OPTION_VISIBLE was an important change, eliminating attempts to identify layers not within scale range.
        //identifyParams2.width  = map.width;
        //identifyParams2.height = map.height;
        //identifyParams2.geometry = evt.mapPoint;
        //identifyParams2.mapExtent = map.extent;
        //identifyParams2.tolerance = 3;
        //identifyParams2.SpatialReference = 102100;        

        // // // // var task = new IdentifyTask(url);
        // var deferred = PZ_task.execute(identifyParams);
        // NEW TESTING
        var deferred = task.execute(identifyParams);
       
       
       // var deferred2 = PZ_task.execute(identifyParams2);
       // var deferred = SAreas_task.execute(identifyParams2);
       // var defList = new dojo.DeferredList([deferred2, deferred]);
        
        deferred.addCallback(function(response) {
        
          // response is an array of identify result objects    
          // Let's return an array of features.
          return dojo.map(response, function(result) {
            var feature = result.feature;
            // feature.attributes.layerName = result.layerName;
            
            console.log(result.layerName);
            // conole.log(result.layerIds[1].layerName);
            //if (result.layerName === 'NFHL Availability'){
            //   var template = new esri.InfoTemplate("",
            //   "<span class=\"sectionhead\">Layer: NFHL Availability</span><br /><br /><hr>Study ID: ${STUDY_ID} <br />");
            //   feature.setInfoTemplate(template);
            // }
            if (result.layerName === 'addresspoints'){
              feature.setInfoTemplate(addrTemplate);
            } 
            else if (result.layerName === 'Parcels'){
              feature.setInfoTemplate(parcelTemplate);
            }
            else if (result.layerName === 'centerlines') {
              feature.setInfoTemplate(streetTemplate);
            }
            else if (result.layerName === 'GrowthAreas') {
              feature.setInfoTemplate(growthAreasTemplate);
            }
            else if (result.layerName === 'Source Water Protection Areas') {
              feature.setInfoTemplate(swpaTemplate);
            }
            else if (result.layerName === 'Protected Species') {
              feature.setInfoTemplate(protectedSpeciesTemplate);
            }
            // else {
            //   console.log("Layer:" + result.layerName);
              // this doesn't appear to work
            // }
            return feature;   
          // } // feature.length > 0
            
          }, function(error) {console.log("Error: " + error);});
          // });
          
        }); // end of deferred callback function

        /*
        // DEFERRED2 TOTALLY EXPERIMENTAL
        deferred2.addCallback(function(response) {
          console.log("DEffeRReD2: " + response);
          console.log("D2: " + result.layername);
          return dojo.map(response, function(result) {
            alert("WTF");
            var feature = result.feature;
            if (result.layerName === 'Perennial Streams') {
              feature.setInfoTemplate(pstreamTemplate);
            }
            else if (result.layerName === 'Source Water Protection Areas ') {
              feature.setInfoTemplate(swpaTemplate);
            }
            else if (result.layerName === 'Growth Areas ') {
              feature.setInfoTemplate(growthAreasTemplate);
            }
            
            return feature;
          }, function(error) {console.log("Error: " + error);});
        }); // end of deferred2 callback function
        */
        // registry.byId("search").on("click", doFind);
        // InfoWindow expects an array of features from each deferred
        // object that you pass. If the response from the task execution 
        // above is not an array of features, then you need to add a callback
        // like the one above to post-process the response and return an
        // array of features.
        
        // map.infoWindow.setFeatures([ deferred, deferred2 ]);
        // map.infoWindow.setFeatures([ deferred2, deferred ]);
        // map.infoWindow.setFeatures([ deferred, deferred2 ]);
        

        // map.infoWindow.show(evt.mapPoint);
        map.infoWindow.setFeatures([ deferred ]);
/*
        defList.then(function(result){
          // map.infoWindow.setFeatures( [ deferred2 ]);
          console.log("DEFERRED LIST RAN!");
          // Executed when all deferred resolved
          map.infoWindow.setFeatures([ deferred, deferred2 ]);
          // map.infoWindow.setFeatures([ deferred2 ]);
          // map.infoWindow.show(evt.mapPoint);
        });
*/
        
      }; // end of function executeIdentifyTask
      // Add Geocoder  
      geocoder = new Geocoder({
        map: map
      }, "geosearch");
      geocoder.startup();
      // End Geocoder
        
        
      });
