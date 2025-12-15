// js/contacto.js
(function () {

  // Año automático en el footer
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Datos de la empresa
  var EMPRESA = {
    lat: 43.3105,
    lng: -2.9163,
    nombre: "Suministros Félix",
    direccion: "C/ Iberre Bloque 10 - Nave 10, Polígono Industrial Sangroniz, Sondika (Bizkaia)"
  };

  // Crear mapa centrado en la empresa
  var map = L.map('mapa').setView([EMPRESA.lat, EMPRESA.lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Marcador de la empresa
  var markerEmpresa = L.marker([EMPRESA.lat, EMPRESA.lng])
    .addTo(map)
    .bindPopup('<strong>' + EMPRESA.nombre + '</strong><br>' + EMPRESA.direccion)
    .openPopup();

  // Obtener ubicación del cliente AUTOMÁTICAMENTE
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var cliente = L.latLng(pos.coords.latitude, pos.coords.longitude);
      var empresa = L.latLng(EMPRESA.lat, EMPRESA.lng);

      // Marcador del cliente
      L.marker(cliente)
        .addTo(map)
        .bindPopup('Tu ubicación')
        .openPopup();

      // Ruta automática
      var ruta = L.Routing.control({
        waypoints: [cliente, empresa],
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
          styles: [{ color: '#1f4f64', weight: 5 }]
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
      }).addTo(map);

      map.fitBounds(L.latLngBounds([cliente, empresa]), {
        padding: [40, 40]
      });
    },
    function () {
      alert('No se pudo obtener tu ubicación. Activa el GPS o los permisos del navegador.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );

})();

