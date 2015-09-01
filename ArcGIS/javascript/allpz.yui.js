var findTask,findParams;var getExtent,doFind;var map,center,zoom;var grid,store;var identifyTask,identifyParams;var addlIdArray=[];var xMin,yMin,xMax,yMax;var extArray=[];var passedCenter,passedX,passedY,zoomLevel;function startTrackingExtent(){dojo.connect(map,"onExtentChange",getExtent)}function contains(b,d){var c;for(c=0;c<b.length;c++){if(b[c]===d){return true}}return false}function ltrim(a){return a.replace(/^\s+/,"")}function popupCamera(a){var b="Traffic Camera";window.open(a,b,"width=500, height=380")}function getCamUrl(c){var d="Some Camera";var b="http://www.chart.state.md.us/video/video.php?feed=";var a=b+ltrim(c);return a}function executeIdentifyTask(a){var c;identifyParams.geometry=a.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.layerIds=[0,2,3,5,7];for(c=0;c<addlIdArray.length;c++){identifyParams.layerIds.push(addlIdArray[c].value)}var d=identifyParams.layerIds;d.sort(function(f,e){return f-e});var b=identifyTask.execute(identifyParams);checkNull=function(h,e,g){var f;function i(k,l,j){if(k==""|k=="Null"){f=""}else{if(j){if(l=='SDAT Link: <a href="'){k+='" target="_blank">LINK</a>'}k+="<br />"}f=l+k}}switch(e){case"SOURCE_OF_DATA":i(h,"Source of Data: ",true);break;case"TOWER_HEIGHT":i(h,"Tower Height: ",false);break;case"HEIGHT_ELEV_UNITS":i(h,", ",true);break;case"TOWER_COMMUNITY":i(h,"Community: ",true);break;case"GROUND_ELEV":i(h,"Ground Elevation: ",false);break;case"SUBDIVSN":i(h,"Subdivision: ",true);break;case"PLAT":i(h,"Plat: ",true);break;case"BLOCK":i(h,"Block: ",true);break;case"PLTLIBER":i(h,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":i(h,"Folio: ",true);break;case"OWNNAME2":i(h," ",false);break;case"SDATWEBADR":i(h,'SDAT Link: <a href="',true);break}return f};b.addCallback(function(e){var f;return dojo.map(e,function(g){var h=g.feature;h.attributes.layerName=g.layerName;if(g.layerName==="addresspoints"){f=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Critical_Facilities"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ');h.setInfoTemplate(f)}else{if(g.layerName==="celltowers"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> ${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}');h.setInfoTemplate(f)}else{if(g.layerName==="centerlines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');h.setInfoTemplate(f)}else{if(g.layerName==="School Zones"){f=new esri.InfoTemplate("Board of Ed. Info.",'<span class="sectionhead">Layer: School Zones</span><br /><br /><hr>Elementary School: ${School} <br />Middle School: ${MS} <br />High School: ${HS}');h.setInfoTemplate(f)}else{if(g.layerName==="Election_Districts"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> Commissioner District: ${Comm_Dist} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Zip Codes"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />Zip Code: ${ZIPCODE1} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Wind_Turbines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />Owner: ${Owner} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="SHA_CamData"){f=new esri.InfoTemplate("Traffic Info",'<span class="sectionhead">Layer: SHA Traffic Cameras</span><br /><br /><hr>ID: ${ID} <br />Description: ${desc_} <br /> Latitude: ${lat} <br /> Longitude ${long} <br /><hr />Link: <button onclick="popupCamera(\'${Feed:getCamUrl}\');">Open Camera</button>');h.setInfoTemplate(f)}else{if(g.layerName==="County_Zoning_Layer"){f=new esri.InfoTemplate("Zoning Info",'<span class="sectionhead">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}');h.setInfoTemplate(f)}else{if(g.layerName==="Tax Map Grid"){f=new esri.InfoTemplate("Tax Map Info",'<span class="sectionhead">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}');h.setInfoTemplate(f)}else{if(g.layerName==="Garrett.DBO.TaxParcel"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');map.infoWindow.resize(250,500);h.setInfoTemplate(f)}else{if(g.layerName==="Water Service"){f=new esri.InfoTemplate("Water Service Info",'<span class="sectionhead">Layer: Water Service </span><br /><br /><hr>Water System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Sewer Service"){f=new esri.InfoTemplate("Sewer Service Info",'<span class="sectionhead">Layer: Sewer Service </span><br /><br /><hr>Sewer System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Town Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />');h.setInfoTemplate(f)}}}}}}}}}}}}}}}}return h})});map.infoWindow.setFeatures([b]);map.infoWindow.show(a.mapPoint)}require(["esri/map","esri/dijit/Scalebar","esri/dijit/BasemapGallery","esri/dijit/Popup","esri/geometry/webMercatorUtils","esri/geometry/Point","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ImageParameters","esri/tasks/query","esri/toolbars/draw","esri/tasks/IdentifyTask","esri/tasks/FindTask","esri/tasks/FindParameters","esri/layers/FeatureLayer","esri/tasks/IdentifyResult","esri/tasks/IdentifyParameters","esri/dijit/InfoWindow","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol","esri/graphic","esri/InfoTemplate","dojo/_base/array","dojo/_base/connect","dojox/grid/DataGrid","dojox/layout/ExpandoPane","dojo/data/ItemFileReadStore","esri/Color","dojo/on","dojo/dom","dojo/query","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dojo/parser","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/AccordionContainer","dijit/TitlePane","dijit/form/Button","dijit/form/RadioButton","esri/dijit/Geocoder","dojo/domReady!"],function(x,h,an,ag,aw,g,ak,au,S,am,H,r,q,ah,T,I,ao,C,ac,A,ax,M,Z,ar,ay,s,K,y,L,z,O,o,u,af,X,av,aj,aa,t,k,ai,Y){X.parse();var at,ae,b,j,w,aq,G,F,i,E,Q,V;at=1;af.byId("search").on("click",al);af.byId("search2").on("click",al);passedCenter=[passedX,passedY];ae=new ag({fillSymbol:new C(C.STYLE_SOLID,new ac(ac.STYLE_SOLID,new y([255,0,0]),2),new y([255,255,0,0.25]))},dojo.create("div"));passedCenter=[passedX,passedY];map=new x("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:ae});function N(){var aC,aB,aG,aF,aD,az,aE,aA;aC=document.getElementById("textLatLong").value;aC=aC.replace(/\s+/g,"");aB=aC.indexOf(",");if(aB>0){aG=parseFloat(aC.slice(0,aB));aF=parseFloat(aC.substring(aB+1));aD=new A(A.STYLE_SQUARE,12,new ac(ac.STYLE_SOLID,new y([10,10,10,0.75]),1),new y([255,0,0,0.5]));az=new g(aF,aG,map.spatialRefernce);aE=new ax(az,aD,null,null);map.graphics.add(aE);if(aE.geometry.type==="point"){aA=map.getMaxZoom();map.centerAndZoom(aE.geometry,aA-1)}else{map.setExtent(graphicsUtils.graphicsExtent([aE]))}}else{return""}}function a(aA){var az=document.getElementById("textLatLong");az.value=aA.coords.latitude+", "+aA.coords.longitude}function P(){map.graphics.clear();var az=document.getElementById("centroid");if(navigator.geolocation){navigator.geolocation.getCurrentPosition(a)}else{az.innerHTML="Geolocation is not supported by this browser."}}L(z.byId("getLocationButton"),"click",P);findTask=new r("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");map.on("load",function(){findParams=new q();findParams.returnGeometry=true;findParams.layerIds=[5,7];findParams.searchFields=["RDNAMELOCAL","PARCEL"];findParams.outSpatialReference=map.spatialReference;console.log("find sr: ",findParams.outSpatialReference);L(z.byId("submitLatLongButton"),"click",N)});b=new h({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});j=new an({showArcGISBasemaps:true,map:map},"basemapGallery");w=new esri.layers.ArcGISTiledMapServiceLayer("https://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("https://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");aq=new esri.dijit.Basemap({layers:[w],title:"MD 2014 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image_v2.png"});j.add(aq);j.add(mdImageBasemap2011);j.startup();j.on("error",function(az){console.log("basemap gallery error:  ",az)});G=new au();G.layerIds=[0,2,3,5,7];G.layerOption=au.LAYER_OPTION_SHOW;F=[];i=new ak("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:G,opacity:0.55});map.addLayer(i);function R(aB){var aC,aA,az;aC=0;aA=[];az="";Z.forEach(aB.features,function(aD){az+=aD.attributes.ADDRESS+"<br />";aA.push(aD.attributes.ADDRESS);aC+=1});z.byId("messages").innerHTML="<strong>Number of Selected Points: "+aC+"</strong><br />"+az}function f(){var aA,az;aA=document.querySelector(".esriPopup");if(aA){az=new dojo.dnd.Moveable(z.byId(aA))}return az}function W(aB){var aC,aA,az;aC=0;aA=[];az="";Z.forEach(aB.features,function(aD){az+="<strong>MAP: </strong>"+aD.attributes.MAP+"<br /><strong>PARCEL: </strong>"+aD.attributes.PARCEL+"<br /><strong>LOT: </strong>"+aD.attributes.LOT+'<br /><strong>LINK: </strong><a href="'+aD.attributes.SDATWEBADR+'" target="_blank">Link</a><br /><hr />';aA.push(aD.attributes.MAP);aC+=1});z.byId("messages").innerHTML="<strong>Number of Selected Parcels: "+aC+"</strong><br />"+az}var p,D,e,J,l=false;function c(){if(l){p=new C(C.STYLE_SOLID,new ac(ac.STYLE_DASHDOT,new y([255,0,0]),2),new y([255,255,0,0.5]));D="Map: ${MAP}<br />Parcel: ${PARCEL}<br />Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";e=new M("${FIELD_NAME}",D);J=new ah("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/7",{mode:ah.MODE_ONDEMAND,outFields:["*"]});J.on("selection-complete",W)}else{p=new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0,255,255]));p.setSize(9);D="Address: ${ADDRESS}<br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";e=new M("${FIELD_NAME}",D);J=new ah("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/2",{mode:ah.MODE_ONDEMAND,outFields:["*"]});J.on("selection-complete",R)}J.setSelectionSymbol(p);J.on("selection-clear",function(){z.byId("messages").innerHTML="<i>No Selected Point or Parcels</i>"});map.addLayer(J)}L(z.byId("polys"),"click",function(){l=true;J.clearSelection();c()});L(z.byId("points"),"click",function(){l=false;J.clearSelection();c()});L(z.byId("selectPointsButton"),"click",function(){var az;az=document.getElementById("rectangle").checked;if(az){E.activate(am.EXTENT)}else{E.activate(am.FREEHAND_POLYGON)}});L(z.byId("clearSelectionButton"),"click",function(){J.clearSelection();map.graphics.clear();at=0;ad("")});var U,n;U=new o({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});n=new u({id:"mapSelect",name:"map",value:"Planning and Zoning",store:U,searchAttr:"name"},"mapSelect").startup();function ap(){var aA=dijit.byId("mapSelect").get("value"),aB,az,aC;switch(aA){case"Measurement":aC="_blank";aB="measure.php";break;case"Planning and Zoning":aB="pz_map.php";aC="_self";break;case"Flood Hazard":aB="FEMA_map.php";aC="_blank";break;case"Sensitive Areas":aB="sensitive.php";aC="_blank";break;case"Printable":aB="printable.php";aC="_blank";break}var az=aB+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(az,aC)}af.byId("launchButton").on("click",ap);function v(aB){var aA=aw.webMercatorToGeographic(aB.getCenter());passedX=parseFloat(aA.x.toFixed(5));passedY=parseFloat(aA.y.toFixed(5));zoomLevel=map.getLevel();var az=document.getElementById("centroid");az.innerHTML="Latitude: "+passedY+"<br />Longitude: "+passedX}function B(aA){var az;c();dojo.connect(map,"onExtentChange",v);E=new am(aA.map);az=new S();L(E,"DrawEnd",function(aB){E.deactivate();az.geometry=aB;J.selectFeatures(az,ah.SELECTION_NEW)})}map.on("load",B);map.on("click",executeIdentifyTask);map.on("click",f);identifyTask=new H("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");identifyParams=new I();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=I.LAYER_OPTION_ALL;identifyParams.width=map.width;identifyParams.height=map.height;var d;function al(){if(this.id=="search"){findParams.searchText=z.byId("roadName").value;d="grid"}else{if(this.id=="search2"){findParams.searchText=z.byId("parcelInfo").value;d="grid1"}}findTask.execute(findParams,ad)}function ad(aC){map.graphics.clear();var aE=new ac(ac.STYLE_SOLID,new y([98,194,204]),3);var aA=Z.map(aC,function(aF){var aG=aF.feature;aG.setSymbol(aE);map.graphics.add(aG);return aF.feature.attributes});if(d=="grid"){var aD={identifier:"OBJECTID",label:"OBJECTID",items:aA}}else{if(d=="grid1"){var aD={identifier:"ACCTID",label:"ACCTID",items:aA}}}var az=new K({data:aD});var aB=af.byId(d);if(aB){if(!(d==="")){aB.setStore(az);aB.on("rowclick",m)}}if(at==1){map.centerAndZoom(center,zoom)}at=1}function m(aA){var aB,az;if(d=="grid"){aB=aA.grid.getItem(aA.rowIndex).OBJECTID;az=Z.filter(map.graphics.graphics,function(aC){return((aC.attributes)&&aC.attributes.OBJECTID===aB)})}else{if(d=="grid1"){aB=aA.grid.getItem(aA.rowIndex).ACCTID;az=Z.filter(map.graphics.graphics,function(aC){return((aC.attributes)&&aC.attributes.ACCTID===aB)})}}if(az.length){map.setExtent(az[0].geometry.getExtent(),true)}}L(z.byId("layer1CheckBox"),"change",ab);L(z.byId("layer4CheckBox"),"change",ab);L(z.byId("layer6CheckBox"),"change",ab);L(z.byId("layer8CheckBox"),"change",ab);L(z.byId("layer9CheckBox"),"change",ab);L(z.byId("layer10CheckBox"),"change",ab);L(z.byId("layer11CheckBox"),"change",ab);L(z.byId("layer12CheckBox"),"change",ab);L(z.byId("layer13CheckBox"),"change",ab);L(z.byId("layer14CheckBox"),"change",ab);L(z.byId("layer15CheckBox"),"change",ab);function ab(){var aA;var az=O(".list_item");var aB=az.length;F=[0,2,3,5,7];addlIdArray=[];for(aA=0;aA<aB;aA++){if(az[aA].checked){F.push(az[aA].value);if(!(contains(addlIdArray,az[aA].value))){addlIdArray.push(az[aA])}}}if(F.length===0){F.push(-1)}if(addlIdArray.length===0){addlIdArray.push(-1)}i.setVisibleLayers(F)}Q=[{url:"https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer",name:"MDiMap Composite Locator",singleLineFieldName:"SingleLine"}];V=new Y({map:map,geocoders:Q,arcgisGeocoder:false},"geosearch");V.startup()});