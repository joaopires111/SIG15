
const coordESTG = [41.692, -8.838];


const offsetLat = 0.01; // Latitude offset
const offsetLon = 0.01; // Longitude offset

const smallerBounds = [
       [coordESTG[0] - offsetLat, coordESTG[1] - offsetLon], // Bottom-left corner
       [coordESTG[0] + offsetLat, coordESTG[1] + offsetLon]  // Top-right corner
];

// Log the new smaller bounding box
console.log("Smaller Bounding Box:", smallerBounds);


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

vianaLayer.addTo(map);
pontosTuristicosLayer.addTo(map);
sig15areaturistica.addTo(map);
caminhosLayer.addTo(map);

// Add a layer control to switch between layers
const overlayMaps = {
       "Viana do Castelo": vianaLayer,
       "Áreas Turisticas": sig15areaturistica,
       "Pontos Turísticos": pontosTuristicosLayer,
       "Caminhos": caminhosLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
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

// Adicionar evento de clique sobre o mapa uma vez que o tema está ativo por omissão
map.on('click', onclickWMSinteragivel);
// Adicionar evento de ativação de um layer no layer control
map.on('overlayadd', function (event) {
       map.closePopup(); // Fechar popup se estiver aberto
       if (event.layer === sig15areaturistica) { // Se layer é o wms_censos_layer definido anteriormente
              map.on('click', onclickWMSinteragivel);
       }
});
// Adicionar evento de desativação de um layer no layer control
map.on('overlayremove', function (event) {
       map.closePopup(); // Fechar popup se estiver aberto
       if (event.layer === sig15areaturistica) {
              map.off('click', onclickWMSinteragivel);
       }
});


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
              crs: 'EPSG:4326', // Indica o sistema de coordenadas utilizado
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


// ========================================================================
// Exemplo 4 com invocação de serviços REST
function exemplo4(censosData) {
       // Adicionar o layer ao mapa com definicao dos eventos
       jsonCensosData_layer = L.geoJson(censosData,
       {
       style: censosStyle,
       onEachFeature: function (feature, layer) {
       layer.on({
       dblclick: ondblclickSubSeccao,
       click: onClickSubSeccao
       });
       }
       }
       );
       jsonCensosData_layer.addTo(map); // Adicionar ao mapa para ficar visivel
       }
       // Funcao a ser invocada quando se clica numa subseccao
       function onClickSubSeccao(e) {
       // Parar a progagacao do evento
       L.DomEvent.stopPropagation(e);
       // Obter o id do elemento
       var fid = e.target.feature.properties.fid;
       // Invocar o serviço REST
       fetch(`/api/vizinhos/${fid}`)
       .then(response => {
       if (!response.ok) {
       return null; // Erro ao obter dados do servidor - devolver null
       }
       return response.json(); // Devolver os dados obtidos
       })
       .then(data => {
       if (data) {
       // Apresentar popup com os dados do elemento
       L.popup()
       .setLatLng(e.latlng)
       .setContent(`Número de vizinhos: ${data.numVizinhos}`)
       .openOn(map);
       }
       }).catch(error => {
       console.error('Erro ao obter dados do servidor', error);
       });
       }
       function ondblclickSubSeccao(e) {
       // Para completar a seguir
       }