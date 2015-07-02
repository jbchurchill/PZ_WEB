var app={};var mpArray;var passedCenter;app.map=null;app.toolbar=null;app.tool=null;app.symbols=null;app.printer=null;require(["esri/map","esri/toolbars/draw","esri/toolbars/edit","esri/dijit/Print","esri/dijit/Geocoder","esri/dijit/BasemapGallery","esri/geometry/webMercatorUtils","esri/geometry/Point","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/FeatureLayer","esri/layers/ImageParameters","esri/layers/GraphicsLayer","esri/tasks/PrintTemplate","esri/tasks/LegendLayer","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/symbols/TextSymbol","esri/symbols/Font","esri/renderers/SimpleRenderer","esri/graphic","esri/config","dojo/_base/array","esri/Color","dojo/parser","dojo/query","dojo/dom","dojo/on","dojo/dom-construct","dojo/store/Memory","dijit/registry","dijit/form/CheckBox","dijit/form/ComboBox","dijit/form/Button","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","dojox/layout/ExpandoPane","dojo/domReady!"],function(v,ai,ao,l,Q,aj,av,e,R,af,aa,at,T,am,r,z,V,A,I,an,m,aw,N,f,w,P,M,x,F,Y,n,X,ap,s,i,o){P.parse();N.defaults.io.proxyUrl="/proxy";var h,Z,L,ae,g;var G=false;passedCenter=[passedX,passedY];app.map=new v("map",{basemap:"streets",center:passedCenter,zoom:zoomLevel});function K(){var aB,aA,aF,aE,aC,ay,aD,az;aB=document.getElementById("textLatLong").value;aB=aB.replace(/\s+/g,"");aA=aB.indexOf(",");if(aA>0){aF=parseFloat(aB.slice(0,aA));aE=parseFloat(aB.substring(aA+1));console.log("latitude: "+aF);console.log("longitude: "+aE);aC=new z(z.STYLE_SQUARE,12,new V(V.STYLE_SOLID,new w([10,10,10,0.75]),1),new w([255,0,0,0.5]));ay=new e(aE,aF,map.spatialRefernce);aD=new aw(ay,aC,null,null);app.map.graphics.add(aD);if(aD.geometry.type==="point"){az=app.map.getMaxZoom();app.map.centerAndZoom(aD.geometry,az-1)}else{app.map.setExtent(graphicsUtils.graphicsExtent([aD]))}}else{return""}}app.map.on("load",function(){app.toolbar=new ai(app.map);app.toolbar.on("draw-end",C);app.map.on("mouse-move",ah);app.map.on("mouse-drag",ah);dojo.connect(app.map,"onExtentChange",u);F(x.byId("submitLatLongButton"),"click",K);W(app.map)});function au(){app.map.graphics.clear()}function ah(ay){var az=av.webMercatorToGeographic(ay.mapPoint);x.byId("coordsinfo").innerHTML=az.y.toFixed(5)+", "+az.x.toFixed(5);mpArray=[az.x.toFixed(5),az.y.toFixed(5)]}function aq(){app.toolbar=new ai(app.map);ad("label");app.toolbar.on("draw-end",C);F.once(x.byId("map"),"click",ah)}h=new aj({showArcGISBasemaps:true,map:app.map},"basemapGallery");mdImagelayer=new esri.layers.ArcGISTiledMapServiceLayer("https://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/ImageServer");mdImage2011=new esri.layers.ArcGISTiledMapServiceLayer("https://imagery.geodata.md.gov/imap/rest/services/SixInch/SixInchImagery2011_2013/MapServer");mdImageBasemap=new esri.dijit.Basemap({layers:[mdImagelayer],title:"MD 2014 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image2014.png"});mdImageBasemap2011=new esri.dijit.Basemap({layers:[mdImage2011],title:"MD 2011 Imagery",thumbnailUrl:"https://maps.garrettcounty.org/arcgis/images/image_v2.png"});h.add(mdImageBasemap);h.add(mdImageBasemap2011);h.startup();h.on("error",function(ay){console.log("basemap gallery error:  ",ay)});Z=new r();Z.layerId="Zoning";L=new r();L.layerId="Protected Species";ae=new r();ae.layerId="Growth Areas";g=new r();g.layerId="Edge of Pavement";legSourceWater=new r();legSourceWater.layerId="Source Water Prot. Areas";var ak,ax,E,B,S,ar,U,p,a,ab,c,d,q;var j=0;function b(){if(j>0){app.printer.destroy()}j+=1;var az;var aD=X.byId("mapTitle");var ay="Data from Garrett County Office of Planning and Land Management. Accuracy is not guaranteed (see https://maps.garrettcounty.org/).";var aA="Title and Graphics created by User at "+ip;az=aD.get("value");var aC=[{name:"Letter ANSI A Landscape",label:"Landscape (PDF)",format:"pdf",options:{legendLayers:[Z,L,ae,g,legSourceWater],scalebarUnit:"Miles",titleText:az+", Landscape PDF",copyrightText:aA,authorText:ay}},{name:"Letter ANSI A Portrait",label:"Portrait (Image)",format:"jpg",options:{legendLayers:[Z,L,ae,g,legSourceWater],scaleBarUnit:"Miles",titleText:az+", Portrait JPG",copyrightText:aA,authorText:ay}},{name:"Letter ANSI A Landscape",label:"Landscape (Image)",format:"jpg",options:{legendLayers:[Z,L,ae,g,legSourceWater],scaleBarUnit:"Miles",titleText:az+", Landscape JPG",copyrightText:aA,authorText:ay}},{name:"Letter ANSI A Portrait",label:"Portrait (PDF)",format:"pdf",options:{legendLayers:[Z,L,ae,g,legSourceWater],scaleBarUnit:"Miles",titleText:az+", Portrait PDF",copyrightText:aA,authorText:ay}}];var aB=f.map(aC,function(aF){var aE=new am();aE.layout=aF.name;aE.label=aF.label;aE.format=aF.format;aE.layoutOptions=aF.options;return aE});app.printer=new l({map:app.map,templates:aB,url:"https://maps.garrettcounty.org/arcweb/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"},x.byId("printButton"));app.printer.startup()}F(x.byId("prepMap"),"click",b);F(x.byId("clearGraphics"),"click",au);F(x.byId("textLabel"),"click",aq);var t,D,ac,J,ag,H;t=new at();t.layerIds=[1,4,5,6,7];t.layerOption=at.LAYER_OPTION_SHOW;D=new at();D.layerIds=[2,6];D.layerOption=at.LAYER_OPTION_SHOW;H="RDNAMELOCAL";ac=new at();ac.layerIds=[2,3,4,5,6,7,8,9];ac.layerOption=at.LAYER_OPTION_SHOW;J=new at();J.layerIds=[11,12,13,14];J.layerOption=at.LAYER_OPTION_SHOW;ak=new af("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:D,opacity:0.75,id:"Parcels & Addresses"});ax=new aa("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/3",{mode:aa.MODE_ONDEMAND,id:"Cell Towers"});E=new aa("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/1",{mode:aa.MODE_ONDEMAND,id:"Wind Turbines"});B=new aa("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/4",{mode:aa.MODE_ONDEMAND,outFields:[H],showLabels:true,id:"Street Centerlines"});S=new aa("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/1",{mode:aa.MODE_ONDEMAND,id:"Perennial Streams"});ar=new aa("https://maps.garrettcounty.org/arcweb/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/10",{mode:aa.MODE_ONDEMAND,opacity:0.3,id:"Zoning"});U=new aa("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/4",{mode:aa.MODE_ONDEMAND,opacity:0.45,id:"Source Water Prot. Areas"});p=new aa("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/6",{mode:aa.MODE_ONDEMAND,opacity:0.45,id:"Protected Species"});a=new aa("https://maps.garrettcounty.org/arcweb/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/7",{mode:aa.MODE_ONDEMAND,opacity:0.75,id:"Growth Areas"});ab=new aa("https://maps.garrettcounty.org/arcweb/rest/services/FEMA/Flood_Hazard/MapServer/2",{mode:aa.MODE_ONDEMAND,id:"Flood Hazard",opacity:0.75});c=new aa("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer/0",{mode:aa.MODE_ONDEMAND,opacity:0.75,id:"Building Footprints"});d=new af("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",{imageParameters:ac,opacity:0.75,id:"Edge of Pavement"});q=new af("https://maps.garrettcounty.org/arcweb/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",{imageParameters:J,opacity:0.75,id:"Contours"});app.map.addLayers([ak,ax,E,B,S,ar,U,p,a,ab,c,d,q]);f.forEach(["Parcels & Addresses","Cell Towers","Wind Turbines","Street Centerlines","Perennial Streams","Zoning","Source Water Prot. Areas","Protected Species","Growth Areas","Flood Hazard","Building Footprints","Edge of Pavement","Contours"],function(az){new ap({id:"cb_"+az,name:"cb_"+az,checked:true,onChange:function(aA){aA?app.map.getLayer(this.id.split("_")[1]).show():app.map.getLayer(this.id.split("_")[1]).hide()}},Y.create("input",{id:"lyr_"+az})).placeAt(x.byId("layerToggle"));var ay=Y.create("label",{"for":"cb_"+az,innerHTML:az});Y.place(ay,x.byId("layerToggle"));Y.place(Y.create("br"),x.byId("layerToggle"))});app.symbols={};app.symbols.point=new z("square",10,new V(),new w([0,255,0,0.75]));app.symbols.polyline=new V("solid",new w([255,128,0]),2);app.symbols.polygon=new A().setColor(new w([255,255,0,0.25]));app.symbols.circle=new A().setColor(new w([0,0,180,0.25]));app.symbols.line=new V("solid",new w([180,10,80]),2);M(".drawing").forEach(function(az){var ay=new i({label:az.innerHTML,onClick:function(){ad(this.id)}},az)});var O,k;O=new n({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});k=new s({id:"mapSelect",name:"map",value:"Printable",store:O,searchAttr:"name"},"mapSelect").startup();function al(){var az=dijit.byId("mapSelect").get("value"),aA,ay,aB;switch(az){case"Measurement":aB="_blank";aA="measure.php";break;case"Planning and Zoning":aA="pz_map.php";aB="_blank";break;case"Flood Hazard":aA="FEMA_map.php";aB="_blank";break;case"Sensitive Areas":aA="sensitive.php";aB="_blank";break;case"Printable":aA="printable.php";aB="_self";break}ay=aA+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(ay,aB)}X.byId("launchButton").on("click",al);function u(az){var ay=av.webMercatorToGeographic(az.getCenter());passedX=parseFloat(ay.x.toFixed(5));passedY=parseFloat(ay.y.toFixed(5));zoomLevel=app.map.getLevel()}function ad(ay){if(ay==="label"){app.symbols.point=new z("circle",10,new V(),new w([255,0,0,0.75]));ay="point";esri.bundle.toolbars.draw.addPoint="Add a text label";G=true}else{if(ay==="point"){app.symbols.point=new z("square",10,new V(),new w([0,255,0,0.75]));esri.bundle.toolbars.draw.addPoint="Click to add a point";G=false}else{if(ay==="arrow"){app.symbols.arrow=new A().setColor(new w([0,0,180,0.25]))}else{if(ay==="rectangle"){app.symbols.rectangle=new A().setColor(new w([0,180,39,0.25]))}else{G=false}}}}app.tool=ay.replace("freehand","");app.toolbar.activate(ay);app.map.hideZoomSlider()}function W(){dojo.connect(dijit.byId("map"),"resize",app.map,app.map.resize);ao=new esri.toolbars.Edit(app.map);dojo.connect(app.map.graphics,"onClick",function(ay){dojo.stopEvent(ay);y(ay.graphic)});dojo.connect(app.map,"onClick",function(ay){ao.deactivate()})}function y(az){var ay={allowAddVertices:true,allowDeleteVertices:true};ao.activate(esri.toolbars.Edit.EDIT_VERTICES|esri.toolbars.Edit.ROTATE,az,ay)}function C(az){var aE,aC,aB,aD,aF,ay;var aA=new an("20px",an.STYLE_NORMAL,an.VARIANT_NORMAL,an.WEIGHT_BOLDER,"Ariel");app.toolbar.deactivate();app.map.showZoomSlider();if(G){aE=prompt("Enter a Text Label","");aB=X.byId("includeCoords");if(aB.get("checked")){aD="Lat: "+mpArray[1]+", Long: "+mpArray[0]+"  -  "+aE}else{aD=aE}aC=new I(aD,aA,new w([0,0,0]));aF=new aw(az.geometry,aC);ay=new aw(az.geometry,app.symbols[app.tool]);app.map.graphics.add(aF);app.map.graphics.add(ay)}else{aF=new aw(az.geometry,app.symbols[app.tool]);app.map.graphics.add(aF)}G=false}geocoders=[{url:"https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocatorWithEsri/GeocodeServer",name:"MDiMap Composite Locator",singleLineFieldName:"SingleLine"}];geocoder=new Q({map:app.map,geocoders:geocoders,arcgisGeocoder:false},"geosearch");geocoder.startup()});