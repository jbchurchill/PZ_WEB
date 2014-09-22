var map,zoom,center,require,dojo,dijit,esri,scalebar,checkNull,window,content,console;var mdImagelayer,mapLaunchStore,comboBox,flzTemplate,parcelTemplate,addrTemplate,streetTemplate,fpFEMA_task,mdImageBasemap,identifyParams,geocoder;var basemapGallery,layerFEMA,imageParameters;var passedCenter,passedX,passedY,zoomLevel;require(["esri/map","esri/dijit/Scalebar","esri/dijit/Popup","esri/dijit/BasemapGallery","esri/dijit/Basemap","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","esri/layers/FeatureLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ImageParameters","esri/geometry/webMercatorUtils","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters","esri/InfoTemplate","esri/dijit/Geocoder","dojo/parser","dojo/domReady!"],function(f,x,j,i,a,p,A,l,s,z,k,v,h,q,r,B,g,e,C,c,y,n,o,d){d.parse();var b=new j({fillSymbol:new g(g.STYLE_SOLID,new e(e.STYLE_SOLID,new C([255,0,0]),2),new C([255,255,0,0.25]))},dojo.create("div"));function t(){var E=dijit.byId("mapSelect").get("value"),F,D,G;switch(E){case"Measurement":G="_blank";F="measure.php";break;case"Planning and Zoning":F="pz_map.php";G="_blank";break;case"Flood Hazard":F="FEMA_map.php";G="_self";break;case"Sensitive Areas":F="sensitive.php";G="_blank";break}D=F+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(D,G)}function m(){var D=B.webMercatorToGeographic(map.extent.getCenter());passedX=parseFloat(D.x.toFixed(5));passedY=parseFloat(D.y.toFixed(5));zoomLevel=map.getLevel()}passedCenter=[passedX,passedY];l.byId("launchButton").on("click",t);function u(){dojo.connect(map,"onExtentChange",m)}map=new f("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:b});scalebar=new x({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});map.on("load",u);mapLaunchStore=new p({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"}]});comboBox=new A({id:"mapSelect",name:"map",value:"Flood Hazard",store:mapLaunchStore,searchAttr:"name"},"mapSelect").startup();checkNull=function(E,D){function F(H,I,G){if(H=="Null"){content=""}else{if(G){if(I=='SDAT Link: <a href="'){H+='" target="_blank">LINK</a>'}H+="<br />"}content=I+H}}switch(D){case"SUBDIVSN":F(E,"Subdivision: ",true);break;case"PLAT":F(E,"Plat: ",true);break;case"BLOCK":F(E,"Block: ",true);break;case"PLTLIBER":F(E,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":F(E,"Folio: ",true);break;case"OWNNAME2":F(E," ",false);break;case"SDAT_URL":F(E,'SDAT Link: <a href="',true);break}return content};flzTemplate=new n("",'<span class="sectionhead">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE} <br/>');parcelTemplate=new n("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES:NumberFormat(places:2)} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDAT_URL:checkNull}');addrTemplate=new n("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');streetTemplate=new n("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE.len:NumberFormat(places:1)} feet <br />');fpFEMA_task=new c("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/");imageParameters=new r();imageParameters.layerIds=[0,1,2,3];imageParameters.layerOption=r.LAYER_OPTION_SHOW;layerFEMA=new h("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/",{imageParameters:imageParameters,opacity:0.75});map.addLayer(layerFEMA);basemapGallery=new i({showArcGISBasemaps:true,map:map},"basemapGallery");mdImagelayer=new q("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");mdImageBasemap=new a({layers:[mdImagelayer],title:"MD Imagery",thumbnailUrl:"http://gis.garrettcounty.org/arcgis/images/image_v2.png"});basemapGallery.add(mdImageBasemap);basemapGallery.startup();basemapGallery.on("error",function(D){console.log("basemap gallery error:  ",D)});function w(D){identifyParams=new y();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=y.LAYER_OPTION_VISIBLE;identifyParams.width=map.width;identifyParams.height=map.height;identifyParams.geometry=D.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.tolerance=3;identifyParams.SpatialReference=102100;identifyParams.layerIds=[0,1,2,3];var E=fpFEMA_task.execute(identifyParams);E.addCallback(function(F){return dojo.map(F,function(G){var H=G.feature;if(G.layerName==="Flood Hazard Areas"){console.log("Flood Zone: "+H.attributes.FLD_ZONE);H.setInfoTemplate(flzTemplate)}else{if(G.layerName==="addresspoints"){H.setInfoTemplate(addrTemplate)}else{if(G.layerName==="Garrett.DBO.TaxParcel"){H.setInfoTemplate(parcelTemplate)}else{if(G.layerName==="centerlines"){H.setInfoTemplate(streetTemplate)}}}}return H},function(G){console.log("Error: "+G)})});map.infoWindow.setFeatures([E]);map.infoWindow.show(D.mapPoint)}map.on("click",w);geocoder=new o({map:map},"geosearch");geocoder.startup()});