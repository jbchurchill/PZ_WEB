var findTask,findParams;var getExtent,doFind;var map,center,zoom;var grid,store;var identifyTask,identifyParams;var addlIdArray=[];var xMin,yMin,xMax,yMax;var extArray=[];var passedCenter,passedX,passedY,zoomLevel;function startTrackingExtent(){dojo.connect(map,"onExtentChange",getExtent)}function contains(b,d){var c;for(c=0;c<b.length;c++){if(b[c]===d){return true}}return false}function executeIdentifyTask(a){var c;identifyParams.geometry=a.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.layerIds=[1,4,5,6,8];for(c=0;c<addlIdArray.length;c++){identifyParams.layerIds.push(addlIdArray[c].value)}var d=identifyParams.layerIds;d.sort(function(f,e){return f-e});var b=identifyTask.execute(identifyParams);checkNull=function(h,e,g){var f;function i(k,l,j){if(k==""|k=="Null"){f=""}else{if(j){if(l=='SDAT Link: <a href="'){k+='" target="_blank">LINK</a>'}k+="<br />"}f=l+k}}switch(e){case"SOURCE_OF_DATA":i(h,"Source of Data: ",true);break;case"TOWER_HEIGHT":i(h,"Tower Height: ",false);break;case"HEIGHT_ELEV_UNITS":i(h,", ",true);break;case"TOWER_COMMUNITY":i(h,"Community: ",true);break;case"GROUND_ELEV":i(h,"Ground Elevation: ",false);break;case"SUBDIVSN":i(h,"Subdivision: ",true);break;case"PLAT":i(h,"Plat: ",true);break;case"BLOCK":i(h,"Block: ",true);break;case"PLTLIBER":i(h,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":i(h,"Folio: ",true);break;case"OWNNAME2":i(h," ",false);break;case"SDATWEBADR":i(h,'SDAT Link: <a href="',true);break}return f};b.addCallback(function(e){var f;return dojo.map(e,function(g){var h=g.feature;h.attributes.layerName=g.layerName;if(g.layerName==="addresspoints"){f=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Critical_Facilities"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Critical Facilities </span><br /><br /><hr>Land Use: ${LU} <br /> Address: ${ADDRESS} ${ROADNAME} <br /> Last Name: ${LASTNAME} <br /> ');h.setInfoTemplate(f)}else{if(g.layerName==="celltowers"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Cell Towers</span><br /><br /><hr>Address: ${TOWER_ADDRESS} <br /> ${TOWER_COMMUNITY:checkNull} ${GROUND_ELEV:checkNull} ${HEIGHT_ELEV_UNITS:checkNull} ${TOWER_HEIGHT:checkNull} ${HEIGHT_ELEV_UNITS:checkNull}Comments: ${COMMENTS} <br /> ${SOURCE_OF_DATA:checkNull}');h.setInfoTemplate(f)}else{if(g.layerName==="centerlines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Election_Districts"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Election Districts</span><br /><br /><hr>Election District: ${Dist_Numb} <br /> Commissioner District: ${Comm_Dist} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Zip Codes"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Zip Codes</span><br /><br /><hr>Zip Code: ${ZIPNAME} <br />Zip Code: ${ZIPCODE1} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="Wind_Turbines"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Wind Turbines</span><br /><br /><hr>Identifier: ${Identifier} <br />Owner: ${Owner} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County_Zoning_Layer"){f=new esri.InfoTemplate("Zoning Info",'<span class="sectionhead">Layer: County Zoning Layer </span><br /><br /><hr>${GENZONE} <br/> Land Use Code: ${FLU}');h.setInfoTemplate(f)}else{if(g.layerName==="Tax Map Grid"){f=new esri.InfoTemplate("Tax Map Info",'<span class="sectionhead">Layer: Tax Map Grid </span><br /><br /><hr>Map ID: ${MAPID} <br />Tax Map: ${TAXMAP}');h.setInfoTemplate(f)}else{if(g.layerName==="Garrett.DBO.TaxParcel"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');map.infoWindow.resize(250,500);h.setInfoTemplate(f)}else{if(g.layerName==="Town Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Town Boundary</span><br /><br /><hr>Community: ${COMMUNITY_NAME} <br />');h.setInfoTemplate(f)}else{if(g.layerName==="County Boundary"){f=new esri.InfoTemplate("",'<span class="sectionhead">Layer: County Boundary</span><br /><br /><hr>Yes! That location is in Garrett County.<br />');h.setInfoTemplate(f)}}}}}}}}}}}}return h})});map.infoWindow.setFeatures([b]);map.infoWindow.show(a.mapPoint)}require(["esri/map","esri/dijit/Scalebar","esri/dijit/BasemapGallery","esri/dijit/Popup","esri/geometry/webMercatorUtils","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ImageParameters","esri/tasks/query","esri/toolbars/draw","esri/tasks/IdentifyTask","esri/tasks/FindTask","esri/tasks/FindParameters","esri/layers/FeatureLayer","esri/tasks/IdentifyResult","esri/tasks/IdentifyParameters","esri/dijit/InfoWindow","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/InfoTemplate","dojo/_base/array","dojo/_base/connect","dojox/grid/DataGrid","dojox/layout/ExpandoPane","dojo/data/ItemFileReadStore","esri/Color","dojo/on","dojo/dom","dojo/query","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dojo/parser","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/AccordionContainer","dijit/TitlePane","dijit/form/Button","dijit/form/RadioButton","esri/dijit/Geocoder","dojo/domReady!"],function(l,w,X,q,H,o,ap,M,ab,m,V,ae,aa,Y,r,D,d,u,v,C,s,x,y,E,n,I,f,an,z,t,aj,F,am,i,P,c,ad,ak,ac){F.parse();var ao,G,a,h,g,j,B,N,S,Z;ao=1;aj.byId("search").on("click",af);aj.byId("search2").on("click",af);passedCenter=[passedX,passedY];G=new q({fillSymbol:new d(d.STYLE_SOLID,new u(u.STYLE_SOLID,new n([255,0,0]),2),new n([255,255,0,0.25]))},dojo.create("div"));passedCenter=[passedX,passedY];map=new l("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:G});findTask=new V("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");map.on("load",function(){findParams=new ae();findParams.returnGeometry=true;findParams.layerIds=[6,8];findParams.searchFields=["RDNAMELOCAL","PARCEL"];findParams.outSpatialReference=map.spatialReference;console.log("find sr: ",findParams.outSpatialReference)});a=new w({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});h=new X({showArcGISBasemaps:true,map:map},"basemapGallery");g=new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("http://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");j=new esri.dijit.Basemap({layers:[g],title:"MD 2014 Imagery",thumbnailUrl:"http://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"http://maps.garrettcounty.org/arcgis/images/image_v2.png"});h.add(j);h.add(mdImageBasemap2011);h.startup();h.on("error",function(aq){console.log("basemap gallery error:  ",aq)});B=new ap();B.layerIds=[1,4,5,6,8];B.layerOption=ap.LAYER_OPTION_SHOW;N=[];S=new o("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:B,opacity:0.55});map.addLayer(S);function R(at){var au,ar,aq;au=0;ar=[];aq="";C.forEach(at.features,function(av){aq+=av.attributes.ADDRESS+"<br />";ar.push(av.attributes.ADDRESS);au+=1});f.byId("messages").innerHTML="<strong>Number of Selected Points: "+au+"</strong><br />"+aq}function al(){var ar,aq;ar=document.querySelector(".esriPopup");if(ar){aq=new dojo.dnd.Moveable(f.byId(ar))}return aq}function W(at){var au,ar,aq;au=0;ar=[];aq="";C.forEach(at.features,function(av){aq+="<strong>MAP: </strong>"+av.attributes.MAP+"<br /><strong>PARCEL: </strong>"+av.attributes.PARCEL+'<br /><strong>LINK: </strong><a href="'+av.attributes.SDATWEBADR+'" target="_blank">Link</a><br /><hr />';ar.push(av.attributes.MAP);au+=1});f.byId("messages").innerHTML="<strong>Number of Selected Parcels: "+au+"</strong><br />"+aq}var O,k,L,e,b=false;function Q(){if(b){O=new d(d.STYLE_SOLID,new u(u.STYLE_DASHDOT,new n([255,0,0]),2),new n([255,255,0,0.5]));k="Map: ${MAP}<br />Parcel: ${PARCEL}<br />Lot: ${LOT}<br />Grid: ${GRID}<br />Tax ID: ${ACCTID}<br /><hr>";L=new v("${FIELD_NAME}",k);e=new aa("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/8",{mode:aa.MODE_ONDEMAND,outFields:["*"]});e.on("selection-complete",W)}else{O=new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([0,255,255]));O.setSize(9);k="Address: ${ADDRESS}<br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2} <br /> Tax Id: ${ACCTID} <br /><hr>";L=new v("${FIELD_NAME}",k);e=new aa("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/4",{mode:aa.MODE_ONDEMAND,outFields:["*"]});e.on("selection-complete",R)}e.setSelectionSymbol(O);e.on("selection-clear",function(){f.byId("messages").innerHTML="<i>No Selected Point or Parcels</i>"});map.addLayer(e)}I(f.byId("polys"),"click",function(){b=true;e.clearSelection();Q()});I(f.byId("points"),"click",function(){b=false;e.clearSelection();Q()});I(f.byId("selectPointsButton"),"click",function(){var aq;aq=document.getElementById("rectangle").checked;if(aq){Z.activate(ab.EXTENT)}else{Z.activate(ab.FREEHAND_POLYGON)}});I(f.byId("clearSelectionButton"),"click",function(){e.clearSelection();map.graphics.clear();ao=0;T("")});var p,ai;p=new z({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});ai=new t({id:"mapSelect",name:"map",value:"Planning and Zoning",store:p,searchAttr:"name"},"mapSelect").startup();function ag(){var ar=dijit.byId("mapSelect").get("value"),at,aq,au;switch(ar){case"Measurement":au="_blank";at="measure.php";break;case"Planning and Zoning":at="pz_map.php";au="_self";break;case"Flood Hazard":at="FEMA_map.php";au="_blank";break;case"Sensitive Areas":at="sensitive.php";au="_blank";break;case"Printable":at="printable.php";au="_blank";break}var aq=at+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(aq,au)}aj.byId("launchButton").on("click",ag);function K(ar){var aq=H.webMercatorToGeographic(ar.getCenter());passedX=parseFloat(aq.x.toFixed(5));passedY=parseFloat(aq.y.toFixed(5));zoomLevel=map.getLevel()}function A(ar){var aq;Q();dojo.connect(map,"onExtentChange",K);Z=new ab(ar.map);aq=new M();I(Z,"DrawEnd",function(at){Z.deactivate();aq.geometry=at;e.selectFeatures(aq,aa.SELECTION_NEW)})}map.on("load",A);map.on("click",executeIdentifyTask);map.on("click",al);identifyTask=new m("http://maps.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer");identifyParams=new r();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=r.LAYER_OPTION_ALL;identifyParams.width=map.width;identifyParams.height=map.height;var U;function af(){if(this.id=="search"){findParams.searchText=f.byId("roadName").value;U="grid"}else{if(this.id=="search2"){findParams.searchText=f.byId("parcelInfo").value;U="grid1"}}findTask.execute(findParams,T)}function T(au){map.graphics.clear();var aw=new u(u.STYLE_SOLID,new n([98,194,204]),3);var ar=C.map(au,function(ax){var ay=ax.feature;ay.setSymbol(aw);map.graphics.add(ay);return ax.feature.attributes});if(U=="grid"){var av={identifier:"OBJECTID",label:"OBJECTID",items:ar}}else{if(U=="grid1"){var av={identifier:"ACCTID",label:"ACCTID",items:ar}}}var aq=new E({data:av});var at=aj.byId(U);if(!(U=="")){at.setStore(aq);at.on("rowclick",ah)}if(ao==1){map.centerAndZoom(center,zoom)}ao=1}function ah(ar){var at,aq;if(U=="grid"){at=ar.grid.getItem(ar.rowIndex).OBJECTID;aq=C.filter(map.graphics.graphics,function(au){return((au.attributes)&&au.attributes.OBJECTID===at)})}else{if(U=="grid1"){at=ar.grid.getItem(ar.rowIndex).ACCTID;aq=C.filter(map.graphics.graphics,function(au){return((au.attributes)&&au.attributes.ACCTID===at)})}}if(aq.length){map.setExtent(aq[0].geometry.getExtent(),true)}}I(f.byId("layer10CheckBox"),"change",J);I(f.byId("layer3CheckBox"),"change",J);I(f.byId("layer7CheckBox"),"change",J);I(f.byId("layer9CheckBox"),"change",J);I(f.byId("layer11CheckBox"),"change",J);I(f.byId("layer12CheckBox"),"change",J);I(f.byId("layer13CheckBox"),"change",J);function J(){var ar;var aq=an(".list_item");var at=aq.length;N=[1,4,5,6,8];addlIdArray=[];for(ar=0;ar<at;ar++){if(aq[ar].checked){N.push(aq[ar].value);if(!(contains(addlIdArray,aq[ar].value))){addlIdArray.push(aq[ar])}}}if(N.length===0){N.push(-1)}if(addlIdArray.length===0){addlIdArray.push(-1)}S.setVisibleLayers(N)}geocoders=[{url:"http://geodata.md.gov/imap/rest/services/GeocodeServices/MD_AddressPointLocator/GeocodeServer",name:"iMap GeoCoder"}];geocoder=new ac({map:map,geocoders:geocoders,arcgisGeocoder:false},"geosearch");geocoder.startup()});