var findTask,findParams;var getExtent,doFind;var map,center,zoom;var grid,store;var identifyTask,identifyParams;var addlIdArray=[];var xMin,yMin,xMax,yMax;var extArray=[];var passedCenter,passedX,passedY,zoomLevel;function startTrackingExtent(){dojo.connect(map,"onExtentChange",getExtent)}function contains(b,d){var c;for(c=0;c<b.length;c++){if(b[c]===d){return true}}return false}function executeIdentifyTask(a){var c;identifyParams.geometry=a.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.layerIds=[0,2,3,4,6];for(c=0;c<addlIdArray.length;c++){identifyParams.layerIds.push(addlIdArray[c].value)}var d=identifyParams.layerIds;d.sort(function(f,e){return f-e});var b=identifyTask.execute(identifyParams);checkNull=function(h,e,g){var f;function i(k,l,j){if(k==""|k=="Null"){f=""}else{if(j){if(l=='SDAT Link: <a href="'){k+='" target="_blank">LINK</a>'}k+="<br />"}f=l+k}}switch(e){case"SOURCE_OF_DATA":i(h,"Source of Data: ",true);break;case"TOWER_HEIGHT":i(h,"Tower Height: ",false);break;case"HEIGHT_ELEV_UNITS":i(h,", ",true);break;case"TOWER_COMMUNITY":i(h,"Community: ",true);break;case"GROUND_ELEV":i(h,"Ground Elevation: ",false);break;case"SUBDIVSN":i(h,"Subdivision: ",true);break;case"PLAT":i(h,"Plat: ",true);break;case"BLOCK":i(h,"Block: ",true);break;case"PLTLIBER":i(h,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":i(h,"Folio: ",true);break;case"OWNNAME2":i(h," ",false);break;case"SDATWEBADR":i(h,'SDAT Link: <a href="',true);break}return f};b.addCallback(function(e){var f;return dojo.map(e,function(g){var h=g.feature;h.attributes.layerName=g.layerName;if(g.layerName==="addresspoints"){f=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Critical_Facilities"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ');h.setInfoTemplate(f)}else{if(g.layerName==="celltowers"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> ${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}');h.setInfoTemplate(f)}else{if(g.layerName==="centerlines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Election_Districts"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> Commissioner District: ${Comm_Dist} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Zip Codes"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />Zip Code: ${ZIPCODE1} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Wind_Turbines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />Owner: ${Owner} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County_Zoning_Layer"){f=new esri.InfoTemplate("Zoning Info",'<span class="sectionhead">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}');h.setInfoTemplate(f)}else{if(g.layerName==="Tax Map Grid"){f=new esri.InfoTemplate("Tax Map Info",'<span class="sectionhead">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}');h.setInfoTemplate(f)}else{if(g.layerName==="Garrett.DBO.TaxParcel"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');map.infoWindow.resize(250,500);h.setInfoTemplate(f)}else{if(g.layerName==="Water Service"){f=new esri.InfoTemplate("Water Service Info",'<span class="sectionhead">Layer: Water Service </span><br /><br /><hr>Water System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Sewer Service"){f=new esri.InfoTemplate("Sewer Service Info",'<span class="sectionhead">Layer: Sewer Service </span><br /><br /><hr>Sewer System: ${System}');h.setInfoTemplate(f)}else{if(g.layerName==="Town Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />');h.setInfoTemplate(f)}}}}}}}}}}}}}}return h})});map.infoWindow.setFeatures([b]);map.infoWindow.show(a.mapPoint)}require(["esri/map","esri/dijit/Scalebar","esri/dijit/BasemapGallery","esri/dijit/Popup","esri/geometry/webMercatorUtils","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ImageParameters","esri/tasks/query","esri/toolbars/draw","esri/tasks/IdentifyTask","esri/tasks/FindTask","esri/tasks/FindParameters","esri/layers/FeatureLayer","esri/tasks/IdentifyResult","esri/tasks/IdentifyParameters","esri/dijit/InfoWindow","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/InfoTemplate","dojo/_base/array","dojo/_base/connect","dojox/grid/DataGrid","dojox/layout/ExpandoPane","dojo/data/ItemFileReadStore","esri/Color","dojo/on","dojo/dom","dojo/query","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dojo/parser","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/AccordionContainer","dijit/TitlePane","dijit/form/Button","dijit/form/RadioButton","esri/dijit/Geocoder","dojo/domReady!"],function(l,x,Z,r,I,o,ar,N,ad,m,X,ag,ac,aa,s,E,d,v,w,D,t,y,z,F,n,J,f,ap,A,u,al,G,ao,i,Q,c,af,am,ae){G.parse();var aq,H,a,h,g,j,C,O,U,ab,T,p;aq=1;al.byId("search").on("click",ah);al.byId("search2").on("click",ah);passedCenter=[passedX,passedY];H=new r({fillSymbol:new d(d.STYLE_SOLID,new v(v.STYLE_SOLID,new n([255,0,0]),2),new n([255,255,0,0.25]))},dojo.create("div"));passedCenter=[passedX,passedY];map=new l("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:H});findTask=new X("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");map.on("load",function(){findParams=new ag();findParams.returnGeometry=true;findParams.layerIds=[4,6];findParams.searchFields=["RDNAMELOCAL","PARCEL"];findParams.outSpatialReference=map.spatialReference;console.log("find sr: ",findParams.outSpatialReference)});a=new x({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});h=new Z({showArcGISBasemaps:true,map:map},"basemapGallery");g=new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("http://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");j=new esri.dijit.Basemap({layers:[g],title:"MD 2014 Imagery",thumbnailUrl:"http://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"http://maps.garrettcounty.org/arcgis/images/image_v2.png"});h.add(j);h.add(mdImageBasemap2011);h.startup();h.on("error",function(at){console.log("basemap gallery error:  ",at)});C=new ar();C.layerIds=[0,2,3,4,6];C.layerOption=ar.LAYER_OPTION_SHOW;O=[];U=new o("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:C,opacity:0.55});map.addLayer(U);function S(av){var aw,au,at;aw=0;au=[];at="";D.forEach(av.features,function(ax){at+=ax.attributes.ADDRESS+"<br />";au.push(ax.attributes.ADDRESS);aw+=1});f.byId("messages").innerHTML="<strong>Number of Selected Points: "+aw+"</strong><br />"+at}function an(){var au,at;au=document.querySelector(".esriPopup");if(au){at=new dojo.dnd.Moveable(f.byId(au))}return at}function Y(av){var aw,au,at;aw=0;au=[];at="";D.forEach(av.features,function(ax){at+="<strong>MAP: </strong>"+ax.attributes.MAP+"<br /><strong>PARCEL: </strong>"+ax.attributes.PARCEL+'<br /><strong>LINK: </strong><a href="'+ax.attributes.SDATWEBADR+'" target="_blank">Link</a><br /><hr />';au.push(ax.attributes.MAP);aw+=1});f.byId("messages").innerHTML="<strong>Number of Selected Parcels: "+aw+"</strong><br />"+at}var P,k,M,e,b=false;function R(){if(b){P=new d(d.STYLE_SOLID,new v(v.STYLE_DASHDOT,new n([255,0,0]),2),new n([255,255,0,0.5]));k="Map: ${MAP}<br />Parcel: ${PARCEL}<br />Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";M=new w("${FIELD_NAME}",k);e=new ac("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/6",{mode:ac.MODE_ONDEMAND,outFields:["*"]});e.on("selection-complete",Y)}else{P=new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0,255,255]));P.setSize(9);k="Address: ${ADDRESS}<br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";M=new w("${FIELD_NAME}",k);e=new ac("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/2",{mode:ac.MODE_ONDEMAND,outFields:["*"]});e.on("selection-complete",S)}e.setSelectionSymbol(P);e.on("selection-clear",function(){f.byId("messages").innerHTML="<i>No Selected Point or Parcels</i>"});map.addLayer(e)}J(f.byId("polys"),"click",function(){b=true;e.clearSelection();R()});J(f.byId("points"),"click",function(){b=false;e.clearSelection();R()});J(f.byId("selectPointsButton"),"click",function(){var at;at=document.getElementById("rectangle").checked;if(at){ab.activate(ad.EXTENT)}else{ab.activate(ad.FREEHAND_POLYGON)}});J(f.byId("clearSelectionButton"),"click",function(){e.clearSelection();map.graphics.clear();aq=0;V("")});var q,ak;q=new A({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});ak=new u({id:"mapSelect",name:"map",value:"Planning and Zoning",store:q,searchAttr:"name"},"mapSelect").startup();function ai(){var au=dijit.byId("mapSelect").get("value"),av,at,aw;switch(au){case"Measurement":aw="_blank";av="measure.php";break;case"Planning and Zoning":av="pz_map.php";aw="_self";break;case"Flood Hazard":av="FEMA_map.php";aw="_blank";break;case"Sensitive Areas":av="sensitive.php";aw="_blank";break;case"Printable":av="printable.php";aw="_blank";break}var at=av+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(at,aw)}al.byId("launchButton").on("click",ai);function L(au){var at=I.webMercatorToGeographic(au.getCenter());passedX=parseFloat(at.x.toFixed(5));passedY=parseFloat(at.y.toFixed(5));zoomLevel=map.getLevel()}function B(au){var at;R();dojo.connect(map,"onExtentChange",L);ab=new ad(au.map);at=new N();J(ab,"DrawEnd",function(av){ab.deactivate();at.geometry=av;e.selectFeatures(at,ac.SELECTION_NEW)})}map.on("load",B);map.on("click",executeIdentifyTask);map.on("click",an);identifyTask=new m("http://192.168.100.36:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");identifyParams=new s();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=s.LAYER_OPTION_ALL;identifyParams.width=map.width;identifyParams.height=map.height;var W;function ah(){if(this.id=="search"){findParams.searchText=f.byId("roadName").value;W="grid"}else{if(this.id=="search2"){findParams.searchText=f.byId("parcelInfo").value;W="grid1"}}findTask.execute(findParams,V)}function V(aw){map.graphics.clear();var ay=new v(v.STYLE_SOLID,new n([98,194,204]),3);var au=D.map(aw,function(az){var aA=az.feature;aA.setSymbol(ay);map.graphics.add(aA);return az.feature.attributes});if(W=="grid"){var ax={identifier:"OBJECTID",label:"OBJECTID",items:au}}else{if(W=="grid1"){var ax={identifier:"ACCTID",label:"ACCTID",items:au}}}var at=new F({data:ax});var av=al.byId(W);if(!(W=="")){av.setStore(at);av.on("rowclick",aj)}if(aq==1){map.centerAndZoom(center,zoom)}aq=1}function aj(au){var av,at;if(W=="grid"){av=au.grid.getItem(au.rowIndex).OBJECTID;at=D.filter(map.graphics.graphics,function(aw){return((aw.attributes)&&aw.attributes.OBJECTID===av)})}else{if(W=="grid1"){av=au.grid.getItem(au.rowIndex).ACCTID;at=D.filter(map.graphics.graphics,function(aw){return((aw.attributes)&&aw.attributes.ACCTID===av)})}}if(at.length){map.setExtent(at[0].geometry.getExtent(),true)}}J(f.byId("layer1CheckBox"),"change",K);J(f.byId("layer5CheckBox"),"change",K);J(f.byId("layer7CheckBox"),"change",K);J(f.byId("layer8CheckBox"),"change",K);J(f.byId("layer9CheckBox"),"change",K);J(f.byId("layer10CheckBox"),"change",K);J(f.byId("layer11CheckBox"),"change",K);J(f.byId("layer12CheckBox"),"change",K);J(f.byId("layer13CheckBox"),"change",K);function K(){var au;var at=ap(".list_item");var av=at.length;O=[0,2,3,4,6];addlIdArray=[];for(au=0;au<av;au++){if(at[au].checked){O.push(at[au].value);if(!(contains(addlIdArray,at[au].value))){addlIdArray.push(at[au])}}}if(O.length===0){O.push(-1)}if(addlIdArray.length===0){addlIdArray.push(-1)}U.setVisibleLayers(O)}T=[{url:"http://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocatorWithEsri/GeocodeServer",name:"MDiMap Composite Locator",singleLineFieldName:"SingleLine"}];p=new ae({map:map,geocoders:T,arcgisGeocoder:false},"geosearch");p.startup()});