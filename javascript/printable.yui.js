var app={};var mpArray;var passedCenter;var gLayer;app.map=null;app.toolbar=null;app.tool=null;app.symbols=null;app.printer=null;require(["esri/map","esri/toolbars/draw","esri/dijit/Print","esri/dijit/Geocoder","esri/dijit/BasemapGallery","esri/geometry/webMercatorUtils","esri/geometry/Point","esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/FeatureLayer","esri/layers/ImageParameters","esri/layers/GraphicsLayer","esri/tasks/PrintTemplate","esri/tasks/LegendLayer","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/symbols/TextSymbol","esri/symbols/Font","esri/renderers/SimpleRenderer","esri/graphic","esri/config","dojo/_base/array","esri/Color","dojo/parser","dojo/query","dojo/dom","dojo/on","dojo/dom-construct","dojo/store/Memory","dijit/registry","dijit/form/CheckBox","dijit/form/ComboBox","dijit/form/Button","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/TitlePane","dojox/layout/ExpandoPane","dojo/domReady!"],function(v,ah,l,Q,ai,at,e,R,ae,Z,aq,T,al,r,y,V,z,H,am,m,au,M,f,w,P,L,x,E,X,n,W,an,s,i,o){P.parse();M.defaults.io.proxyUrl="/proxy";var h,Y,K,ad,g;var F=false;passedCenter=[passedX,passedY];app.map=new v("map",{basemap:"streets",center:passedCenter,zoom:zoomLevel});function J(){var ax,aC,aB,ay,aw,aE,az,aA,aD;ax=document.getElementById("textLatLong").value;ax=ax.replace(/\s+/g,"");aC=ax.indexOf(",");if(aC>0){aB=parseFloat(ax.slice(0,aC));ay=parseFloat(ax.substring(aC+1));console.log("latitude: "+aB);console.log("longitude: "+ay);aw=new y(y.STYLE_SQUARE,12,new V(V.STYLE_SOLID,new w([10,10,10,0.75]),1),new w([255,0,0,0.5]));aE=new e(ay,aB,map.spatialRefernce);az=new au(aE,aw,null,null);aA=new T();aA.add(az);app.map.addLayer(aA);if(az.geometry.type==="point"){aD=app.map.getMaxZoom();app.map.centerAndZoom(az.geometry,aD-1)}else{app.map.setExtent(graphicsUtils.graphicsExtent([az]))}}else{return""}}app.map.on("load",function(){app.toolbar=new ah(app.map);app.toolbar.on("draw-end",B);app.map.on("mouse-move",ag);app.map.on("mouse-drag",ag);dojo.connect(app.map,"onExtentChange",u);E(x.byId("submitLatLongButton"),"click",J)});function ar(){app.map.graphics.clear()}function ag(aw){var ax=at.webMercatorToGeographic(aw.mapPoint);x.byId("coordsinfo").innerHTML=ax.x.toFixed(5)+", "+ax.y.toFixed(5);mpArray=[ax.x.toFixed(5),ax.y.toFixed(5)]}function ao(){app.toolbar=new ah(app.map);ac("label");app.toolbar.on("draw-end",B);E.once(x.byId("map"),"click",ag)}h=new ai({showArcGISBasemaps:true,map:app.map},"basemapGallery");mdImagelayer=new R("http://geodata.md.gov/imap/rest/services/Imagery/MD_SixInchImagery/MapServer");mdImageBasemap=new esri.dijit.Basemap({layers:[mdImagelayer],title:"MD Imagery",thumbnailUrl:"http://gis.garrettcounty.org/arcgis/images/image_v2.png"});h.add(mdImageBasemap);h.startup();h.on("error",function(aw){console.log("basemap gallery error:  ",aw)});Y=new r();Y.layerId="Zoning";K=new r();K.layerId="Protected Species";ad=new r();ad.layerId="Growth Areas";g=new r();g.layerId="Edge of Pavement";legSourceWater=new r();legSourceWater.layerId="Source Water Prot. Areas";var aj,av,D,A,S,ap,U,p,a,aa,c,d,q;var j=0;function b(){if(j>0){app.printer.destroy()}j+=1;var ax;var aB=W.byId("mapTitle");var aw="Data from Garrett County Office of Planning and Land Management. Accuracy is not guaranteed (see http://gis.garrettcounty.org/).";var ay="Title and Graphics created by User at "+ip;ax=aB.get("value");var aA=[{name:"Letter ANSI A Landscape",label:"Landscape (PDF)",format:"pdf",options:{legendLayers:[Y,K,ad,g,legSourceWater],scalebarUnit:"Miles",titleText:ax+", Landscape PDF",copyrightText:ay,authorText:aw}},{name:"Letter ANSI A Portrait",label:"Portrait (Image)",format:"jpg",options:{legendLayers:[Y,K,ad,g,legSourceWater],scaleBarUnit:"Miles",titleText:ax+", Portrait JPG",copyrightText:ay,authorText:aw}},{name:"Letter ANSI A Landscape",label:"Landscape (Image)",format:"jpg",options:{legendLayers:[Y,K,ad,g,legSourceWater],scaleBarUnit:"Miles",titleText:ax+", Landscape JPG",copyrightText:ay,authorText:aw}},{name:"Letter ANSI A Portrait",label:"Portrait (PDF)",format:"pdf",options:{legendLayers:[Y,K,ad,g,legSourceWater],scaleBarUnit:"Miles",titleText:ax+", Portrait PDF",copyrightText:ay,authorText:aw}}];var az=f.map(aA,function(aD){var aC=new al();aC.layout=aD.name;aC.label=aD.label;aC.format=aD.format;aC.layoutOptions=aD.options;return aC});app.printer=new l({map:app.map,templates:az,url:"http://gis.garrettcounty.org:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"},x.byId("printButton"));app.printer.startup()}E(x.byId("prepMap"),"click",b);E(x.byId("clearGraphics"),"click",ar);E(x.byId("textLabel"),"click",ao);var t,C,ab,I,af,G;t=new aq();t.layerIds=[1,4,5,6,7];t.layerOption=aq.LAYER_OPTION_SHOW;C=new aq();C.layerIds=[4,8];C.layerOption=aq.LAYER_OPTION_SHOW;G="RDNAMELOCAL";ab=new aq();ab.layerIds=[2,3,4,5,6,7,8,9];ab.layerOption=aq.LAYER_OPTION_SHOW;I=new aq();I.layerIds=[11,12,13,14];I.layerOption=aq.LAYER_OPTION_SHOW;aj=new ae("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer",{imageParameters:C,opacity:0.75,id:"Parcels & Addresses"});av=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/5",{mode:Z.MODE_ONDEMAND,id:"Cell Towers"});D=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/3",{mode:Z.MODE_ONDEMAND,id:"Wind Turbines"});A=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/6",{mode:Z.MODE_ONDEMAND,outFields:[G],showLabels:true,id:"Street Centerlines"});S=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/1",{mode:Z.MODE_ONDEMAND,id:"Perennial Streams"});ap=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/P_and_Z/Parcels_and_Zoning/MapServer/10",{mode:Z.MODE_ONDEMAND,opacity:0.3,id:"Zoning"});U=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/4",{mode:Z.MODE_ONDEMAND,opacity:0.45,id:"Source Water Prot. Areas"});p=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/6",{mode:Z.MODE_ONDEMAND,opacity:0.45,id:"Protected Species"});a=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/Sensitive_Areas/Sensitive_Areas/MapServer/7",{mode:Z.MODE_ONDEMAND,opacity:0.75,id:"Growth Areas"});aa=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/FEMA/Flood_Hazard/MapServer/2",{mode:Z.MODE_ONDEMAND,id:"Flood Hazard",opacity:0.75});c=new Z("http://gis.garrettcounty.org:6080/arcgis/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer/0",{mode:Z.MODE_ONDEMAND,opacity:0.75,id:"Building Footprints"});d=new ae("http://gis.garrettcounty.org:6080/arcgis/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",{imageParameters:ab,opacity:0.75,id:"Edge of Pavement"});q=new ae("http://gis.garrettcounty.org:6080/arcgis/rest/services/Contours_and_Plan/Contours_and_Plan/MapServer",{imageParameters:I,opacity:0.75,id:"Contours"});app.map.addLayers([aj,av,D,A,S,ap,U,p,a,aa,c,d,q]);console.log(d.id);console.log(U.id);f.forEach(["Parcels & Addresses","Cell Towers","Wind Turbines","Street Centerlines","Perennial Streams","Zoning","Source Water Prot. Areas","Protected Species","Growth Areas","Flood Hazard","Building Footprints","Edge of Pavement","Contours"],function(ax){new an({id:"cb_"+ax,name:"cb_"+ax,checked:true,onChange:function(ay){ay?app.map.getLayer(this.id.split("_")[1]).show():app.map.getLayer(this.id.split("_")[1]).hide()}},X.create("input",{id:"lyr_"+ax})).placeAt(x.byId("layerToggle"));var aw=X.create("label",{"for":"cb_"+ax,innerHTML:ax});X.place(aw,x.byId("layerToggle"));X.place(X.create("br"),x.byId("layerToggle"))});app.symbols={};app.symbols.point=new y("square",10,new V(),new w([0,255,0,0.75]));app.symbols.polyline=new V("solid",new w([255,128,0]),2);app.symbols.polygon=new z().setColor(new w([255,255,0,0.25]));app.symbols.circle=new z().setColor(new w([0,0,180,0.25]));app.symbols.line=new V("solid",new w([180,10,80]),2);L(".drawing").forEach(function(ax){var aw=new i({label:ax.innerHTML,onClick:function(){ac(this.id)}},ax)});var O,k;O=new n({data:[{name:"Flood Hazard",id:"FEMA",baseURL:"FEMA_map.php"},{name:"Measurement",id:"MSMT",baseURL:"measure.php"},{name:"Planning and Zoning",id:"PZMAP",baseURL:"pz_map.php"},{name:"Sensitive Areas",id:"SENSI",baseURL:"sensitive.php"},{name:"Printable",id:"PRINT",baseURL:"printable.php"}]});k=new s({id:"mapSelect",name:"map",value:"Printable",store:O,searchAttr:"name"},"mapSelect").startup();function ak(){var ax=dijit.byId("mapSelect").get("value"),ay,aw,az;switch(ax){case"Measurement":az="_blank";ay="measure.php";break;case"Planning and Zoning":ay="pz_map.php";az="_blank";break;case"Flood Hazard":ay="FEMA_map.php";az="_blank";break;case"Sensitive Areas":ay="sensitive.php";az="_blank";break;case"Printable":ay="printable.php";az="_self";break}aw=ay+"?px="+passedX+"&py="+passedY+"&zl="+zoomLevel;window.open(aw,az)}W.byId("launchButton").on("click",ak);function u(ax){var aw=at.webMercatorToGeographic(ax.getCenter());passedX=parseFloat(aw.x.toFixed(5));passedY=parseFloat(aw.y.toFixed(5));zoomLevel=app.map.getLevel()}function ac(aw){if(aw==="label"){app.symbols.point=new y("circle",10,new V(),new w([255,0,0,0.75]));aw="point";esri.bundle.toolbars.draw.addPoint="Add a text label";F=true}else{if(aw==="point"){app.symbols.point=new y("square",10,new V(),new w([0,255,0,0.75]));esri.bundle.toolbars.draw.addPoint="Click to add a point";F=false}else{if(aw==="arrow"){app.symbols.arrow=new z().setColor(new w([0,0,180,0.25]))}else{if(aw==="rectangle"){app.symbols.rectangle=new z().setColor(new w([0,180,39,0.25]))}else{F=false}}}}app.tool=aw.replace("freehand","");app.toolbar.activate(aw);app.map.hideZoomSlider()}function B(ax){app.gLayer=new T();var aC,aA,az,aB,aD,aw;var ay=new am("20px",am.STYLE_NORMAL,am.VARIANT_NORMAL,am.WEIGHT_BOLDER,"Ariel");app.toolbar.deactivate();app.map.showZoomSlider();if(F){aC=prompt("Enter a Text Label","");az=W.byId("includeCoords");if(az.get("checked")){aB="X: "+mpArray[0]+", Y: "+mpArray[1]+"  -  "+aC}else{aB=aC}aA=new H(aB,ay,new w([0,0,0]));aD=new au(ax.geometry,aA);aw=new au(ax.geometry,app.symbols[app.tool]);app.map.graphics.add(aD);app.map.graphics.add(aw)}else{aD=new au(ax.geometry,app.symbols[app.tool]);app.map.graphics.add(aD)}F=false}var N=new Q({map:app.map},"geosearch");N.startup()});