
const coordESTG = [41.694, -8.846];
const PTbounds = [
       [41.6059, -8.8819],
       [41.8302, -8.641]
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

const sig15areaturistica = L.tileLayer.wms(wms_my_url, {
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

// Add a layer control to switch between layers
const overlayMaps = {
       "Viana do Castelo": vianaLayer,
       "Pontos Turísticos": pontosTuristicosLayer,
       "Caminhos": caminhosLayer,
       "Áreas Turisticas": sig15areaturistica
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
L.control.scale().addTo(map);
map.fitBounds(PTbounds);

// Construir o URL para a legenda
const urlImgHtml = wms_my_url + L.Util.getParamString({
       service: 'WMS',
       version: '1.3.0',
       request: 'GetLegendGraphic',
       layer: 'SIG15:pontos_turisticos',
       format: 'image/png'
});

/*
const imgHtml = `<div id="wms-legend" style="padding: 10px; ">
<div>
<h4 style="display: inline; vertical-align: top;">Legenda do Tema Censos 2021</h4>
<img id="wms-legend" src="${urlImgHtml}" alt="Legend" style="display: inline;"></div>
</div>`;
document.body.insertAdjacentHTML('beforebegin', imgHtml);
*/



map.on('click', onclickWMSinteragivel);

function onclickWMSinteragivel(e) {
       // Obter o URL completo para o GetFeatureInfo
       var url = getUrl_WMS_GetFeatureInfo(e, map, wms_my_url, 'SIG15:sig15areaturistica');
       // Efetuar o pedido AJAX ao servidor WMS
       fetch(url)
              .then(response => response.json()) // Fazer o parse da resposta JSON
              .then(data => {
                     // Create popup content from the response data
                     if (data.features && data.features.length > 0) {
                            var properties = data.features[0].properties; // Propriedades do elemento obtido
                            var content = "<b>Dados do elemento:</b><br>";
                            for (var key in properties) {
                                   if (key.includes('nome'))
                                          content += key + ": " + properties[key] + "<br>";
                            }
                            L.popup()
                                   .setLatLng(e.latlng) // Localização do popup
                                   .setContent(content) // Conteúdo do popup
                                   .openOn(map); // Mostrar o popup no mapa
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

function getUrl_WMS_GetFeatureInfo(e, map, wmsUrl, layer) {
       // Ponto onde foi efetuado o clique
       var point = map.latLngToContainerPoint(e.latlng, map.getZoom());
       // Obter o tamanho do mapa
       var size = map.getSize();
       // Definir os parâmetros para o GetFeatureInfo do WMS
       var params = {
              service: 'WMS',
              version: '1.1.1',
              request: 'GetFeatureInfo',
              layers: layer, // Layer do WMS
              crs: 'EPSG:3763', // Indica o sistema de coordenadas utilizado
              query_layers: layer, // Layer do WMS a interrogar
              bbox: map.getBounds().toBBoxString(), // Bounding box do mapa
              feature_count: 1, // Numero máximo de elementos a retornar
              height: size.y, // Altura do mapa
              width: size.x, // Largura do mapa
              info_format: 'application/json', // Utilizar o formato JSON para a resposta
              x: point.x,
              y: point.y
       };
       // Construir o URL completo para o GetFeatureInfo
       console.log("GetFeatureInfo URL:", wmsUrl + L.Util.getParamString(params));
       console.log("Map BBOX:", map.getBounds().toBBoxString());
       return wmsUrl + L.Util.getParamString(params);
       
}



var legend = L.control({position: 'topleft'});
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
<p>Tipo de Pontos</p>
<span class="toggle-icon-winLegend"></span>
</label>
<div class="winLegend-content">
<img id="wms-legend" src="${urlImgHtml}" alt="Legend" style="display: inline;"></div>
</div>
</div>`;
return div;
};
legend.addTo(map);

