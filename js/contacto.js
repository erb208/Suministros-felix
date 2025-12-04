// Año actual en el footer
(function () {
  var y = document.getElementById('year');
  if (y) {
    y.textContent = new Date().getFullYear();
  }
})();

// Datos del negocio
var NEGOCIO = {
  lat: 43.3105,
  lng: -2.9163,
  nombre: "Suministros Félix",
  direccion: "C/ Iberre Bloque 10 - Nave 10, Polígono Industrial Sangroniz, Sondika (Bizkaia)"
};

// Crear mapa
var map = L.map('mapa').setView([NEGOCIO.lat, NEGOCIO.lng], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcador con popup
var marker = L.marker([NEGOCIO.lat, NEGOCIO.lng]).addTo(map);
marker.bindPopup('<strong>' + NEGOCIO.nombre + '</strong><br>' + NEGOCIO.direccion).openPopup();

// Calcular ruta desde la ubicación del usuario
var controlRuta = null;
var btn = document.getElementById('btnRuta');

if (btn) {
  btn.addEventListener('click', function () {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      var start = L.latLng(pos.coords.latitude, pos.coords.longitude);
      var end = L.latLng(NEGOCIO.lat, NEGOCIO.lng);

      if (controlRuta) {
        map.removeControl(controlRuta);
        controlRuta = null;
      }

      controlRuta = L.Routing.control({
        waypoints: [start, end],
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
        lineOptions: { addWaypoints: false },
        showAlternatives: false,
        collapsible: true,
        show: true,
        draggableWaypoints: false
      }).addTo(map);

      map.fitBounds(L.latLngBounds([start, end]), { padding: [40, 40] });
    }, function () {
      alert('No pudimos obtener tu ubicación. Activa GPS o permisos e intenta de nuevo.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  });
}
