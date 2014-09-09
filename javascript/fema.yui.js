var map,zoom,center,require,dojo,scalebar,checkNull,content;var passedCenter,passedX,passedY,zoomLevel;require(["esri/map","esri/dijit/Scalebar","esri/dijit/Popup","esri/dijit/BasemapGallery","dojo/store/Memory","dijit/form/ComboBox","dijit/registry","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","esri/layers/FeatureLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ImageParameters","esri/geometry/webMercatorUtils","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters","esri/InfoTemplate","esri/dijit/Geocoder","dojo/parser","dojo/domReady!"],function(f,q,l,z,r,n,H,I,d,a,B,i,k,K,w,b,o,h,g,m,p,C,u){u.parse();var v=new l({fillSymbol:new b(b.STYLE_SOLID,new o(o.STYLE_SOLID,new h([255,0,0]),2),new h([255,255,0,0.25]))},dojo.create("div"));passedCenter=[passedX,passedY];H.byId("launchButton").on("click",E);function e(){dojo.connect(map,"onExtentChange",x)}map=new f("mapDiv",{basemap:"streets",center:passedCenter,zoom:zoomLevel,infoWindow:v});scalebar=new q({map:map,attachTo:"bottom-right",scalebarStyle:"line",scalebarUnit:"english"});map.on("load",e);var j=new r({data:[{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"}]});var G=new n({id:"mapSelect",name:"map",value:"Measurement",store:j,searchAttr:"name"},"mapSelect").startup();function E(){var M=dijit.byId("mapSelect").get("value");var N;switch(M){case"Measurement":N="measure.php";break;case"Planning and Zoning":N="pz_map.php";break}var L=N+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(L,"_blank")}function x(M){var L=w.webMercatorToGeographic(map.extent.getCenter());passedX=parseFloat(L.x.toFixed(5));passedY=parseFloat(L.y.toFixed(5));zoomLevel=map.getLevel()}checkNull=function(N,L,M){function O(Q,R,P){if(Q=="Null"){content=""}else{if(P){if(R=='SDAT Link: <a href="'){Q+='" target="_blank">LINK</a>'}Q+="<br />"}content=R+Q}}switch(L){case"SUBDIVSN":O(N,"Subdivision: ",true);break;case"PLAT":O(N,"Plat: ",true);break;case"BLOCK":O(N,"Block: ",true);break;case"PLTLIBER":O(N,'<hr><span class="sectionhead">Plat Reference</span><br />Liber: ',true);break;case"PLTFOLIO":O(N,"Folio: ",true);break;case"OWNNAME2":O(N," ",false);break;case"SDAT_URL":O(N,'SDAT Link: <a href="',true);break}return content};map.on("click",D);var t=new esri.InfoTemplate("",'<span class="sectionhead">Layer: FEMA Flood Hazard Zones </span><br /><br /><hr>Flood Zone: ${FLD_ZONE} <br/>');var J=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Parcels</span><br /><br /><hr>Address: ${ADDRESS} <br />City: ${CITY} <br /> Owner: ${OWNNAME1} ${OWNNAME2:checkNull} <br /> Tax Id: ${ACCTID} <br /><hr><span class="sectionhead">Deed Reference</span><br />Liber: ${DR1LIBER} <br /> Folio: ${DR1FOLIO} <br /><hr> ${SUBDIVSN:checkNull} ${PLAT:checkNull} ${BLOCK:checkNull} Grid: ${GRID} <br />Map: ${MAP} <br /> Parcel: ${PARCEL} <br /> Lot: ${LOT} <br /> Area: ${ACRES} Acres <br />${PLTLIBER:checkNull} ${PLTFOLIO:checkNull} <hr>Year Built: ${YRBLT_CAMA} <br /> ${SDAT_URL:checkNull}');var F=new esri.InfoTemplate("Address Info",'<span class="sectionhead">Layer: Address Points</span><br /><br /><hr>Address: ${ADDRESS} <br /><br /> City: ${CITY} <br /> Zip: ${ZIP_CODE} <br /> ESN: ${ESN} <br /> Community: ${COMMUNITY} <br /> Map: ${MAP} <br /> Parcel: ${PARCEL} <br />Lot: ${LOT} <br /> Tract: ${TRACT} <br /> LU: ${LU} <br /> Key date: ${KEYDATE} <br /> Rental: ${RENTAL} <br />Rental Co.: ${RENTAL_CO} <br /> Tax Account: ${TAX_ACCOUNT_ID} <br /> Owner: ${OWNER_FIRST_NAME} ${OWNER_LAST_NAME} <br />');var y=new esri.InfoTemplate("",'<span class="sectionhead">Layer: Street Centerlines</span><br /><br /><hr>Name: ${STREET_ALL} <br />Maintenance: ${MAINTENANCE} <br /> Length: ${SHAPE_Length:NumberFormat} feet <br />');fpFEMA_task=new g("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/");var s=new K();s.layerIds=[0,1,2,3];s.layerOption=K.LAYER_OPTION_SHOW;var A=new i("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/",{imageParameters:s,opacity:0.75});map.addLayer(A);var c=new z({showArcGISBasemaps:true,map:map},"basemapGallery");mdImagelayer=new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");mdImageBasemap=new esri.dijit.Basemap({layers:[mdImagelayer],title:"MD Imagery",thumbnailUrl:"http://gis.garrettcounty.org/arcgis/images/image_v2.png"});c.add(mdImageBasemap);c.startup();c.on("error",function(L){console.log("basemap gallery error:  ",L)});function D(L){identifyParams=new m();identifyParams.tolerance=3;identifyParams.returnGeometry=true;identifyParams.layerOption=m.LAYER_OPTION_VISIBLE;identifyParams.width=map.width;identifyParams.height=map.height;identifyParams.geometry=L.mapPoint;identifyParams.mapExtent=map.extent;identifyParams.tolerance=3;identifyParams.SpatialReference=102100;identifyParams.layerIds=[0,1,2,3];var M=fpFEMA_task.execute(identifyParams);M.addCallback(function(N){return dojo.map(N,function(O){var P=O.feature;if(O.layerName==="Flood Hazard Areas"){console.log("Flood Zone: "+P.attributes.FLD_ZONE);P.setInfoTemplate(t)}else{if(O.layerName==="addresspoints"){P.setInfoTemplate(F)}else{if(O.layerName==="Garrett.DBO.TaxParcel"){P.setInfoTemplate(J)}else{if(O.layerName==="centerlines"){P.setInfoTemplate(y)}}}}return P},function(O){console.log("Error: "+O)})});map.infoWindow.setFeatures([M]);map.infoWindow.show(L.mapPoint)}geocoder=new C({map:map},"geosearch");geocoder.startup()});