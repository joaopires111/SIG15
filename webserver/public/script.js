
const coordESTG = [41.692, -8.838];


const offsetLat = 0.01; // Latitude offset
const offsetLon = 0.01; // Longitude offset

var fid;

let isFiltered = false;
// Declare a variable to hold the current layer control instance
let currentLayerControl;

const smallerBounds = [
       [coordESTG[0] - offsetLat, coordESTG[1] - offsetLon], // Bottom-left corner
       [coordESTG[0] + offsetLat, coordESTG[1] + offsetLon]  // Top-right corner
];



const wms_my_url = 'http://localhost:8080/geoserver/SIG15/wms';
const map = L.map('mapa').setView(coordESTG, 11);
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map); // Adicionar osm ao mapa para ficar visivel
const googleHyb = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
       maxZoom: 20,
       subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
})
const googleSat = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
})
const baseMaps = {
       "OpenStreetMap": osm,
       "Google Hybrid": googleHyb,
       "Google Satellite": googleSat
};

// Define the layers
const vianaLayer = L.tileLayer.wms(wms_my_url, {
       layers: 'SIG15:viana_do_castelo',
       format: 'image/png',
       transparent: true,
       opacity: 1
});

const pontosTuristicosLayer = L.tileLayer.wms(wms_my_url, {
       layers: 'SIG15:pontos_turisticos',
       format: 'image/png',
       transparent: true,
       opacity: 1
});

var sig15areaturistica = L.tileLayer.wms(wms_my_url, {
       layers: 'SIG15:sig15areaturistica',
       format: 'image/png',
       transparent: true,
       opacity: 1
});
const caminhosLayer = L.tileLayer.wms(wms_my_url, {
       layers: 'SIG15:sig15caminho',
       format: 'image/png',
       transparent: true,
       opacity: 1
});

vianaLayer.addTo(map);
pontosTuristicosLayer.addTo(map);
sig15areaturistica.addTo(map);
caminhosLayer.addTo(map);

// Global reference to the active sig15areaturistica layer
let activeSig15areaturistica = sig15areaturistica;

// Add a layer control to switch between layers
var overlayMaps = {
       "Viana do Castelo": vianaLayer,
       "Áreas Turisticas": sig15areaturistica,
       "Pontos Turísticos": pontosTuristicosLayer,
       "Caminhos": caminhosLayer
};

currentLayerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
L.control.scale().addTo(map);
map.fitBounds(smallerBounds);


/*NÃO corrige erro de deixar de funcionar ao mover o mapa
map.on('moveend', function() {
       setTimeout(() => {   
              sig15areaturistica.redraw();
            }, 200);
   });
*/

function onclickWMSinteragivel(e) {


       // Obter o URL completo para o GetFeatureInfo
       const url = getUrl_WMS_GetFeatureInfo(e, map, wms_my_url, 'SIG15:sig15areaturistica');
       // Efetuar o pedido AJAX ao servidor WMS
       fetch(url)
              .then(response => response.json()) // Fazer o parse da resposta JSON
              .then(data => {
                     // Create popup content from the response data
                     if (data.features && data.features.length > 0) {
                            var properties = data.features[0].properties; // Propriedades do elemento obtido
                            var content = "";
                            for (var key in properties) {
                                   if (key.includes('nome')) {
                                          content += "<h3><b>" + properties[key] + "</h3></b>";
                                          fid = properties[key];

                                          if (fid == 'camaraviana') {
                                                 // Fetch data from your server (assume it's at /data endpoint)
                                                 fetch('/data1')
                                                        .then(response => response.json())  // Parse the JSON data
                                                        .then(data => {
                                                               content += "<b>Presidentes</b><br>";
                                                               data.forEach(item => {
                                                                      //console.log(item.nome);
                                                                      content += item.nome + " " + item.ano + "<br>";

                                                               });
                                                               L.popup()
                                                                      .setLatLng(e.latlng) // Localização do popup
                                                                      .setContent(content) // Conteúdo do popup
                                                                      .openOn(map); // Mostrar o popup no mapa
                                                        })

                                                        .catch(error => console.error('Error fetching data:', error));
                                          } else if (fid == 'estacaoviana') {
                                                 // Fetch data from your server (assume it's at /data endpoint)
                                                 fetch('/data2')
                                                        .then(response => response.json())  // Parse the JSON data
                                                        .then(data => {
                                                               content += "<b>Lojas do Shopping</b><br>";
                                                               data.forEach(item => {
                                                                      content += item.nome + "<br>";
                                                               });
                                                               L.popup()
                                                                      .setLatLng(e.latlng) // Localização do popup
                                                                      .setContent(content) // Conteúdo do popup
                                                                      .openOn(map); // Mostrar o popup no mapa
                                                        })

                                                        .catch(error => console.error('Error fetching data:', error));

                                          } else if (fid == 'ESTG') {
                                                 // Fetch data from your server (assume it's at /data endpoint)
                                                 fetch('/data3')
                                                        .then(response => response.json())  // Parse the JSON data
                                                        .then(data => {
                                                               content += "<b>Professores</b><br>";
                                                               data.forEach(item => {
                                                                      //console.log(item.nome);
                                                                      content += item.nome + "<br>";

                                                               });
                                                               L.popup()
                                                                      .setLatLng(e.latlng) // Localização do popup
                                                                      .setContent(content) // Conteúdo do popup
                                                                      .openOn(map); // Mostrar o popup no mapa
                                                        })

                                                        .catch(error => console.error('Error fetching data:', error));

                                          }
                                          else {
                                                 console.log("CONTEUDO" + content);
                                                 L.popup()
                                                        .setLatLng(e.latlng) // Localização do popup
                                                        .setContent(content) // Conteúdo do popup
                                                        .openOn(map); // Mostrar o popup no mapa
                                          }
                                   }
                            }
                     } else {
                            L.popup()
                                   .setLatLng(e.latlng)
                                   .setContent("Não foi encontrada informação")
                                   .openOn(map);
                     }
              })
              .catch(error => {
                     console.error('Error:', error);
                     L.popup()
                            .setLatLng(e.latlng)
                            .setContent("ERROrrrrrrR.")
                            .openOn(map);
              });
}



// Add event listener for map clicks (layer is active by default)
map.on('click', onclickWMSinteragivel);

// Add event listener for activating a layer in the layer control
map.on('overlayadd', function (event) {
    map.closePopup(); // Close popup if open
    if (event.layer === activeSig15areaturistica) { // Check against the current active layer
        map.on('click', onclickWMSinteragivel);
    }
});

// Add event listener for deactivating a layer in the layer control
map.on('overlayremove', function (event) {
    map.closePopup(); // Close popup if open
    if (event.layer === activeSig15areaturistica) { // Check against the current active layer
        map.off('click', onclickWMSinteragivel);
    }
});

function getUrl_WMS_GetFeatureInfo(e, map, wmsUrl, layer) {
       // Ponto onde foi efetuado o clique
       var point = map.latLngToContainerPoint(e.latlng, map.getZoom());
       
       console.log(point);
       //arredonda valores para o erro do click
       const pointx = Math.round(point.x);
       const pointy = Math.round(point.y);
       var size = map.getSize();
       // Definir os parâmetros para o GetFeatureInfo do WMS
       var params = {
              service: 'WMS',
              version: '1.1.1',
              request: 'GetFeatureInfo',
              layers: layer, // Layer do WMS
              crs: 'EPSG:4326', // Indica o sistema de coordenadas utilizado
              query_layers: layer, // Layer do WMS a interrogar
              bbox: map.getBounds().toBBoxString(), // Bounding box do mapa
              feature_count: 1, // Numero máximo de elementos a retornar
              height: size.y, // Altura do mapa
              width: size.x, // Largura do mapa
              info_format: 'application/json', // Utilizar o formato JSON para a resposta
              x: pointx,
              y: pointy
       };

       return wmsUrl + L.Util.getParamString(params);

}

var legend = L.control({ position: 'topleft' });
legend.onAdd = function (map) {
       // Construir o URL para a legenda
       var urlImgHtml = wms_my_url + L.Util.getParamString({
              service: 'WMS',
              version: '1.3.0',
              request: 'GetLegendGraphic',
              layer: 'SIG15:pontos_turisticos',
              format: 'image/png'
       });
       // Criar DIV com a legenda utilizando CSS para expandir/contrair a legenda
       var div = L.DomUtil.create('div', 'window');
       div.innerHTML = `<div class="winLegend" onclick="event.stopPropagation();">
<!-- Checkbox oculto para controlar o estado -->
<input type="checkbox" id="chk-toggle-winLegend">
<label for="chk-toggle-winLegend" class="winLegend-header">
<p>Legenda</p>
<span class="toggle-icon-winLegend"></span>
</label>
<div class="winLegend-content">
<img id="wms-legend" src="${urlImgHtml}" alt="Legend" style="display: inline;"></div>
</div>
</div>`;
       return div;
};
legend.addTo(map);


   document.getElementById('searchButton').addEventListener('click', function () {
       const searchInput = document.getElementById('searchInput').value.trim();
   
       if (searchInput) {
           // Remove the current sig15areaturistica layer if it exists
           if (map.hasLayer(activeSig15areaturistica)) {
               map.removeLayer(activeSig15areaturistica);
               map.fire('overlayremove', { layer: activeSig15areaturistica }); // Manually fire overlayremove
           }
   
           // Add the filtered layer based on the search input
           activeSig15areaturistica = L.tileLayer.wms(wms_my_url, {
               layers: 'SIG15:sig15areaturistica',
               format: 'image/png',
               transparent: true,
               opacity: 1,
               CQL_FILTER: `tipo_area='${searchInput}'` // Apply the filter dynamically
           }).addTo(map);
   
           console.log(`Filter applied: tipo_area='${searchInput}'`);
   
           // Update the overlayMaps reference
           overlayMaps["Áreas Turisticas"] = activeSig15areaturistica;
   
           // Remove the current layer control if it exists
           if (currentLayerControl) {
               map.removeControl(currentLayerControl);
           }
   
           // Create and add a new layer control to the map
           currentLayerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
   
           // Manually fire overlayadd event
           map.fire('overlayadd', { layer: activeSig15areaturistica });
   
           // Reattach the click events to the new layer
           attachMapClickEvents();
       } else {
           alert('Please enter a valid tipo_area to filter.');
       }
   });
   
   document.getElementById('resetButton').addEventListener('click', function () {
       // Remove the current sig15areaturistica layer if it exists
       if (map.hasLayer(activeSig15areaturistica)) {
           map.removeLayer(activeSig15areaturistica);
           map.fire('overlayremove', { layer: activeSig15areaturistica }); // Manually fire overlayremove
       }
   
       // Add the original unfiltered layer back
       activeSig15areaturistica = L.tileLayer.wms(wms_my_url, {
           layers: 'SIG15:sig15areaturistica',
           format: 'image/png',
           transparent: true,
           opacity: 1
       }).addTo(map);
   
       console.log("Reverted to the original unfiltered layer.");
   
       // Update the overlayMaps reference
       overlayMaps["Áreas Turisticas"] = activeSig15areaturistica;
   
       // Remove the current layer control if it exists
       if (currentLayerControl) {
           map.removeControl(currentLayerControl);
       }
   
       // Create and add a new layer control to the map
       currentLayerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
   
       // Manually fire overlayadd event
       map.fire('overlayadd', { layer: activeSig15areaturistica });
   
       // Reattach the click events to the original layer
       attachMapClickEvents();
   
       // Clear the search input field
       document.getElementById('searchInput').value = '';
   });




// Attach click events dynamically to the active Áreas Turisticas layer
function attachMapClickEvents() {
       // Remove any previous click events
       map.off('click', onclickWMSinteragivel);
   
       // Add the click event if the layer is active on the map
       if (map.hasLayer(activeSig15areaturistica)) {
           map.on('click', onclickWMSinteragivel);
       }
   }

   // Listen for layer control events
map.on('overlayadd', function (event) {
       // Check if the Áreas Turisticas layer is activated
       if (event.layer === activeSig15areaturistica) {
           attachMapClickEvents();
       }
   });
   
   map.on('overlayremove', function (event) {
       // Check if the Áreas Turisticas layer is deactivated
       if (event.layer === activeSig15areaturistica) {
           map.off('click', onclickWMSinteragivel);
       }
   });
