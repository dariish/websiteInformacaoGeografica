
var map;
function init_map(){

  
   // criacao de layer de base
var bingMap = new ol.layer.Tile({
   preload: Infinity,
   source: new ol.source.BingMaps({
   key: 'AmsC0864kukoBixOpup8lsv3yFO_qzXenrScHMmdHz5HVDSI0wZsGcP9DyW9zIU-',
   imagerySet: 'Aerial',
   maxZoom: 19
   }),
   visible: true,
   title: 'BingMap'
  });

var openStreetMap = new ol.layer.Tile({
    source : new ol.source.OSM(),
    visible: false,
    title: 'OpenStreetMap'
});


var CartoDB = new ol.layer.Tile({
  source: new ol.source.OSM({
      "url" : "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
  }),
  visible: false,
  title:'CartoDB'
})

//layer group
const baseLayerGroup = new ol.layer.Group({
  layers: [
      openStreetMap, bingMap, CartoDB
  ]
})


//Layer Switcher (BaseLayers)
const baseLayerElements = document.querySelectorAll('.list-group-item > input[type=radio]');
for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element, index, array){
        let baseLayerTitle = element.get('title');
        element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
    })
}

  // Visualizar coordenadas
  var mousePositionControl = new ol.control.MousePosition({
   coordinateFormat: ol.coordinate.createStringXY(4),
   projection: 'EPSG:4326',
   className: 'custom-mouse-position',
   target: document.getElementById('mouse-position'),
   undefinedHTML: ' '
  }); 

  // Visualizar escala do mapa
  var scaleLineControl = new ol.control.ScaleLine();



  //Nucleo do mapa
 map = new ol.Map({
 target: 'map',
 layers: [
  baseLayerGroup
 ],
 controls: ol.control.defaults().extend([
   mousePositionControl, scaleLineControl
   ]), 
 view: new ol.View({ 
    center: ol.proj.transform([-8.3770108, 41.2771817],'EPSG:4326','EPSG:3857'),
    zoom: 16
 })
 });


 //Geoserver WMS Layers
   var wms_layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/sig18024/wms',
      params: {'LAYERS': 'sig18024:tudo', 'TILED': true},
      serverType: 'geoserver',
      })
     });
    map.addLayer(wms_layer); 
     

    //Controlar visibilidade
    document.getElementById('wms1').addEventListener('change', function() {
      wms_layer.setVisible(this.checked);
     });
 

    // ---------------------------

 var wms_layer1 = new ol.layer.Tile({
      source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/sig18024/wms',
      params: {'LAYERS': 'sig18024:pois', 'TILED': true},
      serverType: 'geoserver'
      }),
      visible: false
     });
    map.addLayer(wms_layer1); 
     

    //Controlar visibilidade
    document.getElementById('wms2').addEventListener('change', function() {
      wms_layer1.setVisible(this.checked);
     });
     

     // -------------------------------

     var wms_layer2 = new ol.layer.Tile({
      source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/sig18024/wms',
      params: {'LAYERS': 'sig18024:estrada', 'TILED': true},
      serverType: 'geoserver'
      }),
      visible: false
     });
    map.addLayer(wms_layer2); 
     

    //Controlar visibilidade
    document.getElementById('wms3').addEventListener('change', function() {
      wms_layer2.setVisible(this.checked);
     });
     

     //----------------------------------
     var wms_layer3 = new ol.layer.Tile({
      source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/sig18024/wms',
      params: {'LAYERS': 'sig18024:ecopontos', 'TILED': true},
      serverType: 'geoserver'
      }),
     visible: false
     });
    map.addLayer(wms_layer3); 
     

    //Controlar visibilidade
    document.getElementById('wms4').addEventListener('change', function() {
      wms_layer3.setVisible(this.checked);
     });
  
     
     

  



/*
* Elements that make up the popup.
*/
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/*
* Add a click handler to hide the popup.
* @return {boolean} Don't follow the href.
*/
closer.onclick = function() {
   
 popup.setPosition(undefined);
 closer.blur();
 return false;
};

/**
* Create an overlay to anchor the popup to the map.
*/
var popup = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
 element: container,
 autoPan: true,
 autoPanAnimation: {
 duration: 250
 }
}));
map.addOverlay(popup);



   //obter coords de um ponto
     map.on('singleclick', function(evt) {

      // transformando coordenadas para WGS84 e apresentando coordenadas
 var coords = ol.proj.transform(evt.coordinate,'EPSG:3857','EPSG:4326');



      content.innerHTML = '';
      var viewResolution = map.getView().getResolution(); 
      var url = wms_layer.getSource().getFeatureInfoUrl(
        evt.coordinate, viewResolution, 'EPSG:3857',
        {'INFO_FORMAT': 'text/html'});
      if (url) {
        fetch(url)
          .then(function (response) { return response.text(); })
          .then(function (html) {
            content.innerHTML = html + "<div class='co'>  <table><tr><th> Longitude </th><th> Latitude </th></tr> <th> " + coords[0] + " </th> <th> " + coords[1] + "</th></div>";
          });
      }

      popup.setPosition(evt.coordinate); 

    });
   
}