var findTask,findParams,checkNull,getExtent,require,doFind,map,center,zoom,grid,store,identifyTask,identifyParams,passedCenter,passedX,passedY,zoomLevel,xMin,yMin,xMax,yMax;var addlIdArray=[];var extArray=[];function startTrackingExtent(){dojo.connect(map,"onExtentChange",getExtent)}function contains(b,d){var c;for(c=0;c<b.length;c++){if(b[c]===d){return true}}return false}function ltrim(a){return a.replace(/^\s+/,"")}function popupCamera(a){var b="Traffic Camera";window.open(a,b,"width=500, height=380")}function getCamUrl(c){var d="Some Camera";var b="http://www.chart.state.md.us/video/video.php?feed=";var a=b+ltrim(c);return a}function executeIdentifyTask(a){var c;identifyParams.geometry=a.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.layerIds=[0,2,3,5,7];for(c=0;c<addlIdArray.length;c++){identifyParams.layerIds.push(addlIdArray[c].value)}var d=identifyParams.layerIds;d.sort(function(f,e){return f-e});var b=identifyTask.execute(identifyParams);checkNull=function(g,e){var f;function h(j,k,i){if(j==""|j=="Null"){f=""}else{if(i){if(k=='SDAT Link: <a href="'){j+='" target="_blank">LINK</a>'}j+="<br />"}f=k+j}}switch(e){case"SOURCE_OF_DATA":h(g,"Source of Data: ",true);break;case"TOWER_HEIGHT":h(g,"Tower Height: ",false);break;case"HEIGHT_ELEV_UNITS":h(g,", ",true);break;case"TOWER_COMMUNITY":h(g,"Community: ",true);break;case"GROUND_ELEV":h(g,"Ground Elevation: ",false);break;case"SUBDIVSN":h(g,"Subdivision: ",true);break;case"PLAT":h(g,"Plat: ",true);break;case"BLOCK":h(g,"Block: ",true);break;case"PLTLIBER":h(g,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":h(g,"Folio: ",true);break;case"OWNNAME2":h(g," ",false);break;case"SDATWEBADR":h(g,'SDAT Link: <a href="',true);break}return f};b.addCallback(function(e){var f;return dojo.map(e,function(g){var h=g.feature;h.attributes.layerName=g.layerName;if(g.layerName==="addresspoints"){f=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Critical_Facilities"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ');h.setInfoTemplate(f)}else{if(g.layerName==="celltowers"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> ${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}');h.setInfoTemplate(f)}else{if(g.layerName==="centerlines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');h.setInfoTemplate(f)}else{if(g.layerName==="School Zones"){f=new esri.InfoTemplate("Board of Ed. Info.",'<span class="sectionhead">Layer: School Zones</span><br /><br /><hr>Elementary School: ${School} <br />Middle School: ${MS} <br />High School: ${HS}');h.setInfoTemplate(f)}else{if(g.layerName==="Election_Districts"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> Commissioner District: ${Comm_Dist} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Zip Codes"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />Zip Code: ${ZIPCODE1} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Wind_Turbines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />Owner: ${Owner} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="SHA_CamData"){f=new esri.InfoTemplate("Traffic Info",'<span class="sectionhead">Layer: SHA Traffic Cameras</span><br /><br /><hr>ID: ${ID} <br />Description: ${desc_} <br /> Latitude: ${lat} <br /> Longitude ${long} <br /><hr />Link: <button onclick="popupCamera(\'${Feed:getCamUrl}\');">Open Camera</button>');h.setInfoTemplate(f)}else{if(g.layerName==="County_Zoning_Layer"){f=new esri.InfoTemplate("Zoning Info",'<span class="sectionhead">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}');h.setInfoTemplate(f)}else{if(g.layerName==="Tax Map Grid"){f=new esri.InfoTemplate("Tax Map Info",'<span class="sectionhead">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}');h.setInfoTemplate(f)}else{if(g.layerName==="Garrett.DBO.TaxParcel"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');map.infoWindow.resize(250,500);h.setInfoTemplate(f)}else{if(g.layerName==="Water Service"){f=new esri.InfoTemplate("Water Service Info",'<span class="sectionhead">Layer: Water Service </span><br /><br /><hr>Water System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Sewer Service"){f=new esri.InfoTemplate("Sewer Service Info",'<span class="sectionhead">Layer: Sewer Service </span><br /><br /><hr>Sewer System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Town Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />');h.setInfoTemplate(f)}}}}}}}}}}}}}}}}return h})});map.infoWindow.setFeatures([b]);map.infoWindow.show(a.mapPoint)}require(["esri/map","esri/dijit/Scalebar","esri/dijit/BasemapGallery","esri/dijit/Popup","esri/geometry/webMercatorUtils","esri/geometry/Point","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ImageParameters","esri/tasks/query","esri/toolbars/draw","esri/tasks/IdentifyTask","esri/tasks/FindTask","esri/tasks/FindParameters","esri/layers/FeatureLayer","esri/tasks/IdentifyResult","esri/tasks/IdentifyParameters","esri/dijit/InfoWindow","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol","esri/graphic","esri/InfoTemplate","dojo/_base/array","dojo/_base/connect","dojox/grid/DataGrid","dojox/layout/ExpandoPane","dojo/data/ItemFileReadStore","esri/Color","dojo/on","dojo/dom","dojo/query","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dojo/parser","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/AccordionContainer","dijit/TitlePane","dijit/form/Button","dijit/form/RadioButton","esri/dijit/Geocoder","dojo/domReady!"],function(y,h,ar,aj,aA,g,ao,ay,U,aq,J,r,q,ak,V,K,at,E,ae,D,aB,O,ab,aw,aC,s,M,A,N,B,Q,o,u,ah,Z,az,an,ac,t,k,am,aa){Z.parse();var ax,ag,b,j,x,av,I,H,i,G,w,z,S,X,al,ai;ax=1,al=[];ah.byId("search").on("click",ap);ah.byId("search2").on("click",ap);passedCenter=[passedX,passedY];ag=new aj({fillSymbol:new E(E.STYLE_SOLID,new ae(ae.STYLE_SOLID,new A([255,0,0]),2),new A([255,255,0,0.25]))},dojo.create("div"));map=new y("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:ag});function P(){var aG,aF,aK,aJ,aH,aD,aI,aE;aG=document.getElementById("textLatLong").value;aG=aG.replace(/\s+/g,"");aF=aG.indexOf(",");if(aF>0){aK=parseFloat(aG.slice(0,aF));aJ=parseFloat(aG.substring(aF+1));aH=new D(D.STYLE_SQUARE,12,new ae(ae.STYLE_SOLID,new A([10,10,10,0.75]),1),new A([255,0,0,0.5]));aD=new g(aJ,aK,map.spatialRefernce);aI=new aB(aD,aH,null,null);map.graphics.add(aI);if(aI.geometry.type==="point"){aE=map.getMaxZoom();map.centerAndZoom(aI.geometry,aE-1)}else{map.setExtent(graphicsUtils.graphicsExtent([aI]))}}else{return""}}function a(aE){var aD=document.getElementById("textLatLong");aD.value=aE.coords.latitude+", "+aE.coords.longitude}function R(){map.graphics.clear();var aD=document.getElementById("centroid");if(navigator.geolocation){navigator.geolocation.getCurrentPosition(a)}else{aD.innerHTML="Geolocation is not supported by this browser."}}N(B.byId("getLocationButton"),"click",R);findTask=new r("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");map.on("load",function(){findParams=new q();findParams.returnGeometry=true;findParams.layerIds=[5,7];findParams.searchFields=["RDNAMELOCAL","PARCEL"];findParams.outSpatialReference=map.spatialReference;console.log("find sr: ",findParams.outSpatialReference);N(B.byId("submitLatLongButton"),"click",P)});b=new h({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});j=new ar({showArcGISBasemaps:true,map:map},"basemapGallery");x=new esri.layers.ArcGISTiledMapServiceLayer("https://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("https://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");av=new esri.dijit.Basemap({layers:[x],title:"MD 2014 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image_v2.png"});j.add(av);j.add(mdImageBasemap2011);j.startup();j.on("error",function(aD){console.log("basemap gallery error:  ",aD)});I=new ay();I.layerIds=[0,2,3,5,7];I.layerOption=ay.LAYER_OPTION_SHOW;H=[];i=new ao("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:I,opacity:0.55});map.addLayer(i);function T(aG){var aH,aF,aD,aI,aE;ab.forEach(aG.features,function(aJ){aI=al.indexOf(aJ.attributes.ADDRESS);if(al.length==0){al.push(aJ.attributes.ADDRESS)}else{if(al.indexOf(aJ.attributes.ADDRESS)==-1){if(ai==1){al.push(aJ.attributes.ADDRESS)}else{if(ai==0){}}}else{if(ai==0){al.splice(aI,1)}else{if(ai==1){}}}}});aF="";aH=al.length;for(aE=0;aE<al.length;aE++){aF+=al[aE]+"<br />"}aD='Download these point records<br /><form action="file.php" method="post" target="_blank"><input id="save" type="submit"></input><br /><br />File Name<input id="fname" name="fname" type="text"></input><br /><input type="hidden" name="append_data" value="address"></input><input id="hidden_field" name="hidden_field" type="hidden" value="'+aF+'" /></form>';if(aH>0){B.byId("formContent").innerHTML=aD}else{B.byId("formContent").innerHTML=""}B.byId("messages").innerHTML="<strong>Number of Selected Points: "+aH+"</strong><br />"+aF+"<br />"}function f(){var aE,aD;aE=document.querySelector(".esriPopup");if(aE){aD=new dojo.dnd.Moveable(B.byId(aE))}return aD}function Y(aE){var aM,aK,aI,aN,aJ,aD,aH,aG,aL,aF;aM=0;aN="";aD="";aF=0;ab.forEach(aE.features,function(aO){aK=[String(aO.attributes.MAP),String(aO.attributes.PARCEL),String(aO.attributes.LOT),(aO.attributes.SDATWEBADR)];aH=al.indexOf(aK);for(aL=0;aL<al.length;aL++){if(String(al[aL])===String(aK)){aH=aL}}if(aH>=0){if(ai===0){al.splice(aH,1)}}else{if(ai===1){if(aH==="undefined"){al.push(aK)}else{if(aH===-1){al.push(aK)}}}}aF+=1});aM=al.length;aN="<strong>Number of Selected Parcels: "+aM+"</strong><br />";for(aG=0;aG<al.length;aG++){aN+="<strong>MAP: </strong>"+al[aG][0]+"<br /><strong>PARCEL: </strong>"+al[aG][1]+"<br /><strong>LOT: </strong>"+al[aG][2]+'<br /><strong>LINK: </strong><a href="'+al[aG][3]+'" target="_blank">Link</a><br /><hr />';aD+=al[aG][0]+", "+al[aG][1]+", "+al[aG][2]+", "+al[aG][3]+"<br />"}aJ='Download these parcel records<br /><form action="file.php" method="post" target="_blank"><input id="save" type="submit"></input><br /><br />File Name<input id="fname" name="fname" type="text"></input><br /><input type="hidden" name="append_data" value="parcel"></input><input id="hidden_field" name="hidden_field" type="hidden" value="'+aD+'" /></form><br />';if(aM>0){B.byId("formContent").innerHTML=aJ}else{B.byId("formContent").innerHTML=""}B.byId("messages").innerHTML=aN}var p,F,e,L,l=false;function c(){if(l){p=new E(E.STYLE_SOLID,new ae(ae.STYLE_DASHDOT,new A([255,0,0]),2),new A([255,255,0,0.5]));F="Map: ${MAP}<br />Parcel: ${PARCEL}<br />Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";e=new O("${FIELD_NAME}",F);L=new ak("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/7",{mode:ak.MODE_ONDEMAND,outFields:["*"]});L.on("selection-complete",Y)}else{p=new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0,255,255]));p.setSize(9);F="Address: ${ADDRESS}<br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";e=new O("${FIELD_NAME}",F);L=new ak("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/2",{mode:ak.MODE_ONDEMAND,outFields:["*"]});L.on("selection-complete",T)}L.setSelectionSymbol(p);L.on("selection-clear",function(){B.byId("messages").innerHTML="<i>No Selected Point or Parcels</i>"});map.addLayer(L)}N(B.byId("polys"),"click",function(){l=true;L.clearSelection();c()});N(B.byId("points"),"click",function(){l=false;L.clearSelection();c()});N(B.byId("selectPointsButton"),"click",function(){ai=1;var aD;al=[];aD=document.getElementById("rectangle").checked;if(aD){G.activate(aq.EXTENT)}else{G.activate(aq.FREEHAND_POLYGON)}});N(B.byId("addPointsButton"),"click",function(){ai=1;var aD;aD=document.getElementById("rectangle").checked;if(aD){w.activate(aq.EXTENT)}else{w.activate(aq.FREEHAND_POLYGON)}});N(B.byId("removePointsButton"),"click",function(){ai=0;var aD;aD=document.getElementById("rectangle").checked;if(aD){z.activate(aq.EXTENT)}else{z.activate(aq.FREEHAND_POLYGON)}});N(B.byId("clearSelectionButton"),"click",function(){L.clearSelection();pointSum=0;al=[];strAddresses="";map.graphics.clear();ax=0;B.byId("formContent").innerHTML="";af("")});var W,n;W=new o({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});n=new u({id:"mapSelect",name:"map",value:"Local Planning",store:W,searchAttr:"name"},"mapSelect").startup();function au(){var aE=dijit.byId("mapSelect").get("value"),aF,aD,aG;switch(aE){case"Local Planning":aG="_self";aF="local_pz.php";break;case"Measurement":aG="_blank";aF="../measure.php";break;case"Planning and Zoning":aF="../pz_map.php";aG="_blank";break;case"Flood Hazard":aF="../FEMA_map.php";aG="_blank";break;case"Sensitive Areas":aF="../sensitive.php";aG="_blank";break;case"Printable":aF="../printable.php";aG="_blank";break}var aD=aF+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(aD,aG)}ah.byId("launchButton").on("click",au);function v(aF){var aE=aA.webMercatorToGeographic(aF.getCenter());passedX=parseFloat(aE.x.toFixed(5));passedY=parseFloat(aE.y.toFixed(5));zoomLevel=map.getLevel();var aD=document.getElementById("centroid");aD.innerHTML="Latitude: "+passedY+"<br />Longitude: "+passedX}function C(aF){var aE,aD,aG;c();dojo.connect(map,"onExtentChange",v);G=new aq(aF.map);aE=new U();N(G,"DrawEnd",function(aH){G.deactivate();aE.geometry=aH;L.selectFeatures(aE,ak.SELECTION_NEW)});w=new aq(aF.map);aD=new U();N(w,"DrawEnd",function(aH){w.deactivate();aD.geometry=aH;L.selectFeatures(aD,ak.SELECTION_ADD)});z=new aq(aF.map);aG=new U();N(z,"DrawEnd",function(aH){z.deactivate();aG.geometry=aH;L.selectFeatures(aG,ak.SELECTION_SUBTRACT)})}map.on("load",C);map.on("click",executeIdentifyTask);map.on("click",f);identifyTask=new J("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");identifyParams=new K();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=K.LAYER_OPTION_ALL;identifyParams.width=map.width;identifyParams.height=map.height;var d;function ap(){if(this.id=="search"){findParams.searchText=B.byId("roadName").value;d="grid"}else{if(this.id=="search2"){findParams.searchText=B.byId("parcelInfo").value;d="grid1"}}findTask.execute(findParams,af)}function af(aG){map.graphics.clear();var aI=new ae(ae.STYLE_SOLID,new A([98,194,204]),3);var aE=ab.map(aG,function(aJ){var aK=aJ.feature;aK.setSymbol(aI);map.graphics.add(aK);return aJ.feature.attributes});if(d=="grid"){var aH={identifier:"OBJECTID",label:"OBJECTID",items:aE}}else{if(d=="grid1"){var aH={identifier:"ACCTID",label:"ACCTID",items:aE}}}var aD=new M({data:aH});var aF=ah.byId(d);if(aF){if(!(d==="")){aF.setStore(aD);aF.on("rowclick",m)}}if(ax==1){map.centerAndZoom(center,zoom)}ax=1}function m(aE){var aF,aD;if(d=="grid"){aF=aE.grid.getItem(aE.rowIndex).OBJECTID;aD=ab.filter(map.graphics.graphics,function(aG){return((aG.attributes)&&aG.attributes.OBJECTID===aF)})}else{if(d=="grid1"){aF=aE.grid.getItem(aE.rowIndex).ACCTID;aD=ab.filter(map.graphics.graphics,function(aG){return((aG.attributes)&&aG.attributes.ACCTID===aF)})}}if(aD.length){map.setExtent(aD[0].geometry.getExtent(),true)}}N(B.byId("layer1CheckBox"),"change",ad);N(B.byId("layer4CheckBox"),"change",ad);N(B.byId("layer6CheckBox"),"change",ad);N(B.byId("layer8CheckBox"),"change",ad);N(B.byId("layer9CheckBox"),"change",ad);N(B.byId("layer10CheckBox"),"change",ad);N(B.byId("layer11CheckBox"),"change",ad);N(B.byId("layer12CheckBox"),"change",ad);N(B.byId("layer13CheckBox"),"change",ad);N(B.byId("layer14CheckBox"),"change",ad);N(B.byId("layer15CheckBox"),"change",ad);function ad(){var aE;var aD=Q(".list_item");var aF=aD.length;H=[0,2,3,5,7];addlIdArray=[];for(aE=0;aE<aF;aE++){if(aD[aE].checked){H.push(aD[aE].value);if(!(contains(addlIdArray,aD[aE].value))){addlIdArray.push(aD[aE])}}}if(H.length===0){H.push(-1)}if(addlIdArray.length===0){addlIdArray.push(-1)}i.setVisibleLayers(H)}S=[{url:"https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer",name:"MDiMap Composite Locator",singleLineFieldName:"SingleLine"}];X=new aa({map:map,geocoders:S,arcgisGeocoder:false},"geosearch");X.startup()});