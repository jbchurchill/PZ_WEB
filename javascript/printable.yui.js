var app={};var mpArray;var passedCenter;app.map=null;app.toolbar=null;app.tool=null;app.symbols=null;app.printer=null;require(["esri/map","esri/toolbars/draw","esri/dijit/Print","esri/dijit/Geocoder","esri/dijit/Legend","esri/dijit/BasemapGallery","esri/geometry/webMercatorUtils","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/FeatureLayer","esri/layers/ImageParameters","esri/tasks/PrintTemplate","esri/tasks/LegendLayer","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/symbols/TextSymbol","esri/symbols/Font","esri/graphic","esri/config","dojo/_base/array","esri/Color","dojo/parser","dojo/query","dojo/dom","dojo/on","dojo/dom-construct","dojo/store/Memory","dijit/registry","dijit/form/CheckBox","dijit/form/ComboBox","dijit/form/Button","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","dojox/layout/ExpandoPane","dojo/domReady!"],function(q,T,L,V,p,R,J,B,v,S,ag,o,O,ah,E,b,ae,Q,f,z,e,u,I,af,c,K,U,G,ac,x,D,W,F){I.parse();z.defaults.io.proxyUrl="/proxy";var g;var j=false;passedCenter=[passedX,passedY];app.map=new q("map",{basemap:"streets",center:passedCenter,zoom:zoomLevel});app.map.on("load",function(){app.toolbar=new T(app.map);app.toolbar.on("draw-end",r);app.map.on("mouse-move",i);app.map.on("mouse-drag",i);dojo.connect(app.map,"onExtentChange",M)});function a(){app.map.graphics.clear()}function i(ai){var aj=J.webMercatorToGeographic(ai.mapPoint);c.byId("coordsinfo").innerHTML=aj.x.toFixed(5)+", "+aj.y.toFixed(5);mpArray=[aj.x.toFixed(5),aj.y.toFixed(5)]}function h(){app.toolbar=new T(app.map);s("label");app.toolbar.on("draw-end",r);K.once(c.byId("map"),"click",i)}g=new R({showArcGISBasemaps:true,map:app.map},"basemapGallery");mdImagelayer=new esri.layers.ArcGISTiledMapServiceLayer("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");mdImageBasemap=new esri.dijit.Basemap({layers:[mdImagelayer],title:"MD Imagery",thumbnailUrl:"http://gis.garrettcounty.org/arcgis/images/image_v2.png"});g.add(mdImageBasemap);g.startup();g.on("error",function(ai){console.log("basemap gallery error:  ",ai)});var N=new O();N.layerId="Zoning";var aa,Y,C,m,t,k,A,n,d,l;var ad=0;function P(){if(ad>0){return}ad+=1;var aj;var an=ac.byId("mapTitle");var ai="Data from Garrett County Office of Planning and Land Management. Accuracy is not guaranteed (see http://gis.garrettcounty.org/).";var ak="Title and Graphics created by User at "+ip;aj=an.get("value");var am=[{name:"Letter ANSI A Landscape",label:"Landscape (PDF)",format:"pdf",options:{legendLayers:[N],scalebarUnit:"Miles",titleText:aj+", Landscape PDF",copyrightText:ak,authorText:ai}},{name:"Letter ANSI A Portrait",label:"Portrait (Image)",format:"jpg",options:{legendLayers:[N],scaleBarUnit:"Miles",titleText:aj+", Portrait JPG",copyrightText:ak,authorText:ai}},{name:"Letter ANSI A Landscape",label:"Landscape (Image)",format:"jpg",options:{legendLayers:[N],scaleBarUnit:"Miles",titleText:aj+", Landscape JPG",copyrightText:ak,authorText:ai}},{name:"Letter ANSI A Portrait",label:"Portrait (PDF)",format:"pdf",options:{legendLayers:[N],scaleBarUnit:"Miles",titleText:aj+", Portrait PDF",copyrightText:ak,authorText:ai}}];var al=e.map(am,function(ap){var ao=new o();ao.layout=ap.name;ao.label=ap.label;ao.format=ap.format;ao.layoutOptions=ap.options;return ao});app.printer=new L({map:app.map,templates:al,url:"http://gis.garrettcounty.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"},c.byId("printButton"));app.printer.startup()}K(c.byId("prepMap"),"click",P);K(c.byId("clearGraphics"),"click",a);K(c.byId("textLabel"),"click",h);var H,X;H=new ag();H.layerIds=[1,4,5,6,7];H.layerOption=ag.LAYER_OPTION_SHOW;X=new ag();X.layerIds=[4,8];X.layerOption=ag.LAYER_OPTION_SHOW;aa=new v("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:X,opacity:0.75,id:"Parcels & Addresses"});Y=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/5",{mode:S.MODE_ONDEMAND,id:"Cell Towers"});C=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/3",{mode:S.MODE_ONDEMAND,id:"Wind Turbines"});m=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/6",{mode:S.MODE_ONDEMAND,id:"Street Centerlines"});t=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/1",{mode:S.MODE_ONDEMAND,id:"Perennial Streams"});k=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/10",{mode:S.MODE_ONDEMAND,opacity:0.3,id:"Zoning"});A=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/4",{mode:S.MODE_ONDEMAND,opacity:0.45,id:"Source Water Prot. Areas"});n=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/6",{mode:S.MODE_ONDEMAND,opacity:0.45,id:"Protected Species"});d=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/7",{mode:S.MODE_ONDEMAND,opacity:0.75,id:"Growth Areas"});l=new S("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/2",{mode:S.MODE_ONDEMAND,id:"Flood Hazard",opacity:0.75});app.map.addLayers([aa,Y,C,m,t,k,A,n,d,l]);e.forEach(["Parcels & Addresses","Cell Towers","Wind Turbines","Street Centerlines","Perennial Streams","Zoning","Source Water Prot. Areas","Protected Species","Growth Areas","Flood Hazard"],function(aj){new x({id:"cb_"+aj,name:"cb_"+aj,checked:true,onChange:function(ak){ak?app.map.getLayer(this.id.split("_")[1]).show():app.map.getLayer(this.id.split("_")[1]).hide()}},U.create("input",{id:"lyr_"+aj})).placeAt(c.byId("layerToggle"));var ai=U.create("label",{"for":"cb_"+aj,innerHTML:aj});U.place(ai,c.byId("layerToggle"));U.place(U.create("br"),c.byId("layerToggle"))});app.symbols={};app.symbols.point=new ah("square",10,new E(),new u([0,255,0,0.75]));app.symbols.polyline=new E("solid",new u([255,128,0]),2);app.symbols.polygon=new b().setColor(new u([255,255,0,0.25]));app.symbols.circle=new b().setColor(new u([0,0,180,0.25]));af(".drawing").forEach(function(aj){var ai=new W({label:aj.innerHTML,onClick:function(){s(this.id)}},aj)});var y,ab;y=new G({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});ab=new D({id:"mapSelect",name:"map",value:"Printable",store:y,searchAttr:"name"},"mapSelect").startup();function Z(){var aj=dijit.byId("mapSelect").get("value"),ak,ai,al;switch(aj){case"Measurement":al="_blank";ak="measure.php";break;case"Planning and Zoning":ak="pz_map.php";al="_blank";break;case"Flood Hazard":ak="FEMA_map.php";al="_blank";break;case"Sensitive Areas":ak="sensitive.php";al="_blank";break;case"Printable":ak="printable.php";al="_self";break}var ai=ak+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(ai,al)}ac.byId("launchButton").on("click",Z);function M(aj){var ai=J.webMercatorToGeographic(aj.getCenter());passedX=parseFloat(ai.x.toFixed(5));passedY=parseFloat(ai.y.toFixed(5));zoomLevel=app.map.getLevel()}function s(ai){if(ai==="label"){app.symbols.point=new ah("circle",10,new E(),new u([255,0,0,0.75]));ai="point";esri.bundle.toolbars.draw.addPoint="Add a text label";j=true}else{if(ai==="point"){app.symbols.point=new ah("square",10,new E(),new u([0,255,0,0.75]));esri.bundle.toolbars.draw.addPoint="Click to add a point";j=false}else{j=false}}app.tool=ai.replace("freehand","");app.toolbar.activate(ai);app.map.hideZoomSlider()}function r(aj){var ao,al,an;var ak=new Q("20px",Q.STYLE_NORMAL,Q.VARIANT_NORMAL,Q.WEIGHT_BOLDER);app.toolbar.deactivate();app.map.showZoomSlider();if(j){ao=prompt("Enter a Text Label","");al=ac.byId("includeCoords");if(al.get("checked")){an="X: "+mpArray[0]+", Y: "+mpArray[1]+"  -  "+ao}else{an=ao}var am=new ae(an,ak,new u([0,0,0]));var ap=new f(aj.geometry,am);var ai=new f(aj.geometry,app.symbols[app.tool]);app.map.graphics.add(ap);app.map.graphics.add(ai)}else{var ap=new f(aj.geometry,app.symbols[app.tool]);app.map.graphics.add(ap)}}var w=new V({map:app.map},"geosearch");w.startup()});