       // Initialize the map and set its view to a specified location and zoom level
       const map = L.map('map').setView([41.69440888528626, -8.846874332440894], 13);

       // Add a tile layer (basemap)
       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '© OpenStreetMap contributors'
       }).addTo(map);
