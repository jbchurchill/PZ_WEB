var findTask,findParams,checkNull,getExtent,require,doFind,map,center,zoom,grid,store,identifyTask,identifyParams,passedCenter,passedX,passedY,zoomLevel,xMin,yMin,xMax,yMax;var addlIdArray=[];var extArray=[];function startTrackingExtent(){dojo.connect(map,"onExtentChange",getExtent)}function contains(b,d){var c;for(c=0;c<b.length;c++){if(b[c]===d){return true}}return false}function ltrim(a){return a.replace(/^\s+/,"")}function popupCamera(a){var b="Traffic Camera";window.open(a,b,"width=500, height=380")}function getCamUrl(c){var d="Some Camera";var b="http://www.chart.state.md.us/video/video.php?feed=";var a=b+ltrim(c);return a}function executeIdentifyTask(a){var c;identifyParams.geometry=a.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.layerIds=[0,2,3,5,7];for(c=0;c<addlIdArray.length;c++){identifyParams.layerIds.push(addlIdArray[c].value)}var d=identifyParams.layerIds;d.sort(function(f,e){return f-e});var b=identifyTask.execute(identifyParams);checkNull=function(g,e){var f;function h(j,k,i){if(j==""|j=="Null"){f=""}else{if(i){if(k=='SDAT Link: <a href="'){j+='" target="_blank">LINK</a>'}j+="<br />"}f=k+j}}switch(e){case"SOURCE_OF_DATA":h(g,"Source of Data: ",true);break;case"TOWER_HEIGHT":h(g,"Tower Height: ",false);break;case"HEIGHT_ELEV_UNITS":h(g,", ",true);break;case"TOWER_COMMUNITY":h(g,"Community: ",true);break;case"GROUND_ELEV":h(g,"Ground Elevation: ",false);break;case"SUBDIVSN":h(g,"Subdivision: ",true);break;case"PLAT":h(g,"Plat: ",true);break;case"BLOCK":h(g,"Block: ",true);break;case"PLTLIBER":h(g,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":h(g,"Folio: ",true);break;case"OWNNAME2":h(g," ",false);break;case"SDATWEBADR":h(g,'SDAT Link: <a href="',true);break}return f};b.addCallback(function(e){var f;return dojo.map(e,function(g){var h=g.feature;h.attributes.layerName=g.layerName;if(g.layerName==="addresspoints"){f=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Critical_Facilities"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ');h.setInfoTemplate(f)}else{if(g.layerName==="celltowers"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> ${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}');h.setInfoTemplate(f)}else{if(g.layerName==="centerlines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');h.setInfoTemplate(f)}else{if(g.layerName==="School Zones"){f=new esri.InfoTemplate("Board of Ed. Info.",'<span class="sectionhead">Layer: School Zones</span><br /><br /><hr>Elementary School: ${School} <br />Middle School: ${MS} <br />High School: ${HS}');h.setInfoTemplate(f)}else{if(g.layerName==="Election_Districts"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> Commissioner District: ${Comm_Dist} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Zip Codes"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />Zip Code: ${ZIPCODE1} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Wind_Turbines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />Owner: ${Owner} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="SHA_CamData"){f=new esri.InfoTemplate("Traffic Info",'<span class="sectionhead">Layer: SHA Traffic Cameras</span><br /><br /><hr>ID: ${ID} <br />Description: ${desc_} <br /> Latitude: ${lat} <br /> Longitude ${long} <br /><hr />Link: <button onclick="popupCamera(\'${Feed:getCamUrl}\');">Open Camera</button>');h.setInfoTemplate(f)}else{if(g.layerName==="County_Zoning_Layer"){f=new esri.InfoTemplate("Zoning Info",'<span class="sectionhead">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}');h.setInfoTemplate(f)}else{if(g.layerName==="Tax Map Grid"){f=new esri.InfoTemplate("Tax Map Info",'<span class="sectionhead">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}');h.setInfoTemplate(f)}else{if(g.layerName==="Garrett.DBO.TaxParcel"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');map.infoWindow.resize(250,500);h.setInfoTemplate(f)}else{if(g.layerName==="Water Service"){f=new esri.InfoTemplate("Water Service Info",'<span class="sectionhead">Layer: Water Service </span><br /><br /><hr>Water System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Sewer Service"){f=new esri.InfoTemplate("Sewer Service Info",'<span class="sectionhead">Layer: Sewer Service </span><br /><br /><hr>Sewer System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Town Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />');h.setInfoTemplate(f)}}}}}}}}}}}}}}}}return h})});map.infoWindow.setFeatures([b]);map.infoWindow.show(a.mapPoint)}require(["esri/map","esri/dijit/Scalebar","esri/dijit/BasemapGallery","esri/dijit/Popup","esri/geometry/webMercatorUtils","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ImageParameters","esri/tasks/query","esri/toolbars/draw","esri/tasks/IdentifyTask","esri/tasks/FindTask","esri/tasks/FindParameters","esri/layers/FeatureLayer","esri/tasks/IdentifyResult","esri/tasks/IdentifyParameters","esri/dijit/InfoWindow","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/InfoTemplate","dojo/_base/array","dojo/_base/connect","dojox/grid/DataGrid","dojox/layout/ExpandoPane","dojo/data/ItemFileReadStore","esri/Color","dojo/on","dojo/dom","dojo/query","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dojo/parser","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/AccordionContainer","dijit/TitlePane","dijit/form/Button","dijit/form/RadioButton","esri/dijit/Geocoder","dojo/domReady!"],function(v,e,al,ad,au,ai,ar,O,ak,F,o,n,ae,P,G,am,A,Y,K,V,ap,av,p,I,x,J,y,L,l,r,ab,T,at,ah,W,q,h,ag,U){T.parse();var aq,aa,a,g,u,ao,E,D,f,C,t,w,M,R,af,ac;aq=1,af=[];ab.byId("search").on("click",aj);ab.byId("search2").on("click",aj);passedCenter=[passedX,passedY];aa=new ad({fillSymbol:new A(A.STYLE_SOLID,new Y(Y.STYLE_SOLID,new x([255,0,0]),2),new x([255,255,0,0.25]))},dojo.create("div"));map=new v("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:aa});findTask=new o("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");map.on("load",function(){findParams=new n();findParams.returnGeometry=true;findParams.layerIds=[5,7];findParams.searchFields=["RDNAMELOCAL","PARCEL"];findParams.outSpatialReference=map.spatialReference;console.log("find sr: ",findParams.outSpatialReference)});a=new e({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});g=new al({showArcGISBasemaps:true,map:map},"basemapGallery");u=new esri.layers.ArcGISTiledMapServiceLayer("https://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("https://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");ao=new esri.dijit.Basemap({layers:[u],title:"MD 2014 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image_v2.png"});g.add(ao);g.add(mdImageBasemap2011);g.startup();g.on("error",function(aw){console.log("basemap gallery error:  ",aw)});E=new ar();E.layerIds=[0,2,3,5,7];E.layerOption=ar.LAYER_OPTION_SHOW;D=[];f=new ai("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:E,opacity:0.55});map.addLayer(f);function N(az){var aA,ay,aw,aB,ax;V.forEach(az.features,function(aC){aB=af.indexOf(aC.attributes.ADDRESS);if(af.length==0){af.push(aC.attributes.ADDRESS)}else{if(af.indexOf(aC.attributes.ADDRESS)==-1){if(ac==1){af.push(aC.attributes.ADDRESS)}else{if(ac==0){}}}else{if(ac==0){af.splice(aB,1)}else{if(ac==1){}}}}});ay="";aA=af.length;for(ax=0;ax<af.length;ax++){ay+=af[ax]+"<br />"}aw='Save these point records<br /><form action="file.php" method="post" target="_blank"><input id="save" type="submit"></input><input type="checkbox" name="append_data" checked="true" value="address">Write new file?<br /><input id="hidden_field" name="hidden_field" type="hidden" value="'+ay+'" /></form>';if(aA>0){y.byId("formContent").innerHTML=aw}else{y.byId("formContent").innerHTML=""}y.byId("messages").innerHTML="<strong>Number of Selected Points: "+aA+"</strong><br />"+ay+"<br />"}function S(ax){var aF,aD,aB,aG,aC,aw,aA,az,aE,ay;aF=0;aG="";aw="";ay=0;V.forEach(ax.features,function(aH){aD=[String(aH.attributes.MAP),String(aH.attributes.PARCEL),String(aH.attributes.SDATWEBADR)];aA=af.indexOf(aD);for(aE=0;aE<af.length;aE++){if(String(af[aE])===String(aD)){aA=aE}}if(aA>=0){if(ac===0){af.splice(aA,1)}}else{if(ac===1){if(aA==="undefined"){af.push(aD)}else{if(aA===-1){af.push(aD)}}}}ay+=1});aF=af.length;aG="<strong>Number of Selected Parcels: "+aF+"</strong><br />";for(az=0;az<af.length;az++){aG+="<strong>MAP: </strong>"+af[az][0]+"<br /><strong>PARCEL: </strong>"+af[az][1]+'<br /><strong>LINK: </strong><a href="'+af[az][2]+'" target="_blank">Link</a><br /><hr />';aw+=af[az][0]+", "+af[az][1]+", "+af[az][2]+"<br />"}aC='Save these parcel records<br /><form action="file.php" method="post" target="_blank"><input id="save" type="submit"></input><input type="checkbox" name="append_data" checked="true" value="parcel">Write new file?<br /><input id="hidden_field" name="hidden_field" type="hidden" value="'+aw+'" /></form><br />';if(aF>0){y.byId("formContent").innerHTML=aC}else{y.byId("formContent").innerHTML=""}y.byId("messages").innerHTML=aG}var m,B,d,H,i=false;function b(){if(i){m=new A(A.STYLE_SOLID,new Y(Y.STYLE_DASHDOT,new x([255,0,0]),2),new x([255,255,0,0.5]));B="Map: ${MAP}<br />Parcel: ${PARCEL}<br />Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";d=new K("${FIELD_NAME}",B);H=new ae("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/7",{mode:ae.MODE_ONDEMAND,outFields:["*"]});H.on("selection-complete",S)}else{m=new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0,255,255]));m.setSize(9);B="Address: ${ADDRESS}<br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";d=new K("${FIELD_NAME}",B);H=new ae("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/2",{mode:ae.MODE_ONDEMAND,outFields:["*"]});H.on("selection-complete",N)}H.setSelectionSymbol(m);H.on("selection-clear",function(){y.byId("messages").innerHTML="<i>No Selected Point or Parcels</i>"});map.addLayer(H)}J(y.byId("polys"),"click",function(){i=true;H.clearSelection();b()});J(y.byId("points"),"click",function(){i=false;H.clearSelection();b()});J(y.byId("selectPointsButton"),"click",function(){ac=1;var aw;af=[];aw=document.getElementById("rectangle").checked;if(aw){C.activate(ak.EXTENT)}else{C.activate(ak.FREEHAND_POLYGON)}});J(y.byId("addPointsButton"),"click",function(){ac=1;var aw;aw=document.getElementById("rectangle").checked;if(aw){t.activate(ak.EXTENT)}else{t.activate(ak.FREEHAND_POLYGON)}});J(y.byId("removePointsButton"),"click",function(){ac=0;var aw;aw=document.getElementById("rectangle").checked;if(aw){w.activate(ak.EXTENT)}else{w.activate(ak.FREEHAND_POLYGON)}});J(y.byId("clearSelectionButton"),"click",function(){H.clearSelection();pointSum=0;af=[];strAddresses="";map.graphics.clear();aq=0;y.byId("formContent").innerHTML="";Z("")});var Q,k;Q=new l({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});k=new r({id:"mapSelect",name:"map",value:"Planning and Zoning",store:Q,searchAttr:"name"},"mapSelect").startup();function an(){var ax=dijit.byId("mapSelect").get("value"),ay,aw,az;switch(ax){case"Measurement":az="_blank";ay="measure.php";break;case"Planning and Zoning":ay="pz_map.php";az="_self";break;case"Flood Hazard":ay="FEMA_map.php";az="_blank";break;case"Sensitive Areas":ay="sensitive.php";az="_blank";break;case"Printable":ay="printable.php";az="_blank";break}var aw=ay+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(aw,az)}ab.byId("launchButton").on("click",an);function s(ax){var aw=au.webMercatorToGeographic(ax.getCenter());passedX=parseFloat(aw.x.toFixed(5));passedY=parseFloat(aw.y.toFixed(5));zoomLevel=map.getLevel()}function z(ay){var ax,aw,az;b();dojo.connect(map,"onExtentChange",s);C=new ak(ay.map);ax=new O();J(C,"DrawEnd",function(aA){C.deactivate();ax.geometry=aA;H.selectFeatures(ax,ae.SELECTION_NEW)});t=new ak(ay.map);aw=new O();J(t,"DrawEnd",function(aA){t.deactivate();aw.geometry=aA;H.selectFeatures(aw,ae.SELECTION_ADD)});w=new ak(ay.map);az=new O();J(w,"DrawEnd",function(aA){w.deactivate();az.geometry=aA;H.selectFeatures(az,ae.SELECTION_SUBTRACT)})}map.on("load",z);map.on("click",executeIdentifyTask);identifyTask=new F("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");identifyParams=new G();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=G.LAYER_OPTION_ALL;identifyParams.width=map.width;identifyParams.height=map.height;var c;function aj(){if(this.id=="search"){findParams.searchText=y.byId("roadName").value;c="grid"}else{if(this.id=="search2"){findParams.searchText=y.byId("parcelInfo").value;c="grid1"}}findTask.execute(findParams,Z)}function Z(az){map.graphics.clear();var aB=new Y(Y.STYLE_SOLID,new x([98,194,204]),3);var ax=V.map(az,function(aC){var aD=aC.feature;aD.setSymbol(aB);map.graphics.add(aD);return aC.feature.attributes});if(c=="grid"){var aA={identifier:"OBJECTID",label:"OBJECTID",items:ax}}else{if(c=="grid1"){var aA={identifier:"ACCTID",label:"ACCTID",items:ax}}}var aw=new I({data:aA});var ay=ab.byId(c);if(ay){if(!(c==="")){ay.setStore(aw);ay.on("rowclick",j)}}if(aq==1){map.centerAndZoom(center,zoom)}aq=1}function j(ax){var ay,aw;if(c=="grid"){ay=ax.grid.getItem(ax.rowIndex).OBJECTID;aw=V.filter(map.graphics.graphics,function(az){return((az.attributes)&&az.attributes.OBJECTID===ay)})}else{if(c=="grid1"){ay=ax.grid.getItem(ax.rowIndex).ACCTID;aw=V.filter(map.graphics.graphics,function(az){return((az.attributes)&&az.attributes.ACCTID===ay)})}}if(aw.length){map.setExtent(aw[0].geometry.getExtent(),true)}}J(y.byId("layer1CheckBox"),"change",X);J(y.byId("layer4CheckBox"),"change",X);J(y.byId("layer6CheckBox"),"change",X);J(y.byId("layer8CheckBox"),"change",X);J(y.byId("layer9CheckBox"),"change",X);J(y.byId("layer10CheckBox"),"change",X);J(y.byId("layer11CheckBox"),"change",X);J(y.byId("layer12CheckBox"),"change",X);J(y.byId("layer13CheckBox"),"change",X);J(y.byId("layer14CheckBox"),"change",X);J(y.byId("layer15CheckBox"),"change",X);function X(){var ax;var aw=L(".list_item");var ay=aw.length;D=[0,2,3,5,7];addlIdArray=[];for(ax=0;ax<ay;ax++){if(aw[ax].checked){D.push(aw[ax].value);if(!(contains(addlIdArray,aw[ax].value))){addlIdArray.push(aw[ax])}}}if(D.length===0){D.push(-1)}if(addlIdArray.length===0){addlIdArray.push(-1)}f.setVisibleLayers(D)}M=[{url:"https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocatorWithEsri/GeocodeServer",name:"MDiMap Composite Locator",singleLineFieldName:"SingleLine"}];R=new U({map:map,geocoders:M,arcgisGeocoder:false},"geosearch");R.startup()});