       //----------------------------OSM-------------------------
       const coordESTG = [41.694, -8.846];
       const PTbounds = [
        [41.6059, -8.8819],
        [41.8302, -8.641]
        ];
        var wms_censos_url = 'http://localhost:8080/geoserver/ecgmsig1/wms';
        var wms_censos_layer;
        var map = L.map('mapa').setView(coordESTG, 13);

       function initPage1() {
       var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
       })
       osm.addTo(map);
       //L.marker([41.694, -8.846]).addTo(map);
       L.control.scale().addTo(map);
       }

       //----------------------------GEOSERVER---------------------------

        function initPage3() {
        initPage1();
        wms_censos_layer = L.tileLayer.wms(wms_censos_url, {
        layers: 'ecgmsig1:monserrate',
        format: 'image/png',
        transparent: true,
        opacity: 0.5
        });
        wms_censos_layer.addTo(map); // Adicionar wms ao mapa para ficar visivel
        // Adicionar tema wms ao controlo de layers


        //------------------------------STYLE POR FAZER--------------------
        //layerControl.addOverlay(wms_censos_layer, "Cencos 2021");
        map.fitBounds(PTbounds);
        }
