var map,zoom,center,scalebar,checkNull,content;var mdImagelayer,mapLaunchStore,comboBox,flzTemplate,parcelTemplate,addrTemplate,streetTemplate,fpFEMA_task,mdImageBasemap,identifyParams,geocoder;var basemapGallery,layerFEMA,imageParameters;var passedCenter,passedX,passedY,zoomLevel;require(["esri/map","esri/dijit/Scalebar","esri/dijit/Popup","esri/dijit/BasemapGallery","esri/dijit/Basemap","dojo/dom","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","esri/layers/FeatureLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ImageParameters","esri/geometry/webMercatorUtils","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters","esri/InfoTemplate","esri/dijit/Geocoder","dojo/parser","dojo/domReady!"],function(f,z,j,i,a,w,p,C,l,s,B,k,v,h,q,r,D,g,e,E,c,A,n,o,d){d.parse();var b=new j({fillSymbol:new g(g.STYLE_SOLID,new e(e.STYLE_SOLID,new E([255,0,0]),2),new E([255,255,0,0.25]))},dojo.create("div"));function t(){var G=dijit.byId("mapSelect").get("value"),H,F,I;switch(G){case"Measurement":I="_blank";H="measure.php";break;case"Planning and Zoning":H="pz_map.php";I="_blank";break;case"Flood Hazard":H="FEMA_map.php";I="_self";break;case"Sensitive Areas":H="sensitive.php";I="_blank";break;case"Printable":H="printable.php";I="_blank";break}F=H+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(F,I)}function m(){var F=D.webMercatorToGeographic(map.extent.getCenter());passedX=parseFloat(F.x.toFixed(5));passedY=parseFloat(F.y.toFixed(5));zoomLevel=map.getLevel()}function y(){var G,F;G=document.querySelector(".esriPopup");if(G){F=new dojo.dnd.Moveable(w.byId(G))}return F}passedCenter=[passedX,passedY];l.byId("launchButton").on("click",t);function u(){dojo.connect(map,"onExtentChange",m)}map=new f("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:b});scalebar=new z({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});map.on("load",u);mapLaunchStore=new p({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});comboBox=new C({id:"mapSelect",name:"map",value:"Flood Hazard",store:mapLaunchStore,searchAttr:"name"},"mapSelect").startup();checkNull=function(G,F){function H(J,K,I){if(J=="Null"|J==""){content=""}else{if(I){if(K=='SDAT Link: <a href="'){J+='" target="_blank">LINK</a>'}if(K=="Subtype: "&J=="0.2 PCT ANNUAL CHANCE FLOOD HAZARD"){K="";J=""}J+="<br />"}content=K+J}}switch(F){case"SUBDIVSN":H(G,"Subdivision: ",true);break;case"PLAT":H(G,"Plat: ",true);break;case"BLOCK":H(G,"Block: ",true);break;case"PLTLIBER":H(G,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":H(G,"Folio: ",true);break;case"OWNNAME2":H(G," ",false);break;case"SDATWEBADR":H(G,'SDAT Link: <a href="',true);break;case"ZONE_SUBTY":H(G,"Subtype: ",true)}return content};flzTemplate=new n("",'<span class="sectionhead">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE2} <br/> ${ZONE_SUBTY:checkNull}');parcelTemplate=new n("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDATWEBADR:checkNull}');addrTemplate=new n("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');streetTemplate=new n("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');fpFEMA_task=new c("http://maps.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/");imageParameters=new r();imageParameters.layerIds=[0,1,2,3];imageParameters.layerOption=r.LAYER_OPTION_SHOW;layerFEMA=new h("http://maps.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/",{imageParameters:imageParameters,opacity:0.75});map.addLayer(layerFEMA);basemapGallery=new i({showArcGISBasemaps:true,map:map},"basemapGallery");mdImagelayer=new q("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");mdImageBasemap=new a({layers:[mdImagelayer],title:"MD Imagery",thumbnailUrl:"http://maps.garrettcounty.org/arcgis/images/image_v2.png"});basemapGallery.add(mdImageBasemap);basemapGallery.startup();basemapGallery.on("error",function(F){console.log("basemap gallery error:  ",F)});function x(F){identifyParams=new A();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=A.LAYER_OPTION_VISIBLE;identifyParams.width=map.width;identifyParams.height=map.height;identifyParams.geometry=F.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.tolerance=3;identifyParams.SpatialReference=102100;identifyParams.layerIds=[0,1,2,3];var G=fpFEMA_task.execute(identifyParams);G.addCallback(function(H){return dojo.map(H,function(I){var J=I.feature;if(I.layerName==="Flood Hazard Areas"){J.setInfoTemplate(flzTemplate)}else{if(I.layerName==="addresspoints"){J.setInfoTemplate(addrTemplate)}else{if(I.layerName==="Garrett.DBO.TaxParcel"){J.setInfoTemplate(parcelTemplate)}else{if(I.layerName==="centerlines"){J.setInfoTemplate(streetTemplate)}}}}return J},function(I){console.log("Error: "+I)})});map.infoWindow.setFeatures([G]);map.infoWindow.show(F.mapPoint)}map.on("click",x);map.on("click",y);geocoder=new o({map:map},"geosearch");geocoder.startup()});