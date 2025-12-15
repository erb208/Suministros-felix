// js/contacto.js
(function () {
  'use strict';

  /* ========= AÑO EN FOOTER ========= */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ========= DATOS DE LA EMPRESA ========= */
  const EMPRESA = {
    lat: 43.3105,
    lng: -2.9163,
    nombre: 'Suministros Félix',
    direccion: 'C/ Iberre Bloque 10 - Nave 10, Polígono Industrial Sangroniz, Sondika (Bizkaia)'
  };

  /* ========= MAPA BASE ========= */
  const map = L.map('mapa').setView([EMPRESA.lat, EMPRESA.lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Marcador empresa (siempre visible)
  const markerEmpresa = L.marker([EMPRESA.lat, EMPRESA.lng])
    .addTo(map)
    .bindPopup(`<strong>${EMPRESA.nombre}</strong><br>${EMPRESA.direccion}`)
    .openPopup();

  let controlRuta = null;
  let markerCliente = null;

  /* ========= FUNCIÓN PARA DIBUJAR RUTA ========= */
  function crearRuta(origenLatLng) {
    if (controlRuta) {
      map.removeControl(controlRuta);
    }
    if (markerCliente) {
      map.removeLayer(markerCliente);
    }

    markerCliente = L.marker(origenLatLng)
      .addTo(map)
      .bindPopup('Tu ubicación')
      .openPopup();

    controlRuta = L.Routing.control({
      waypoints: [
        origenLatLng,
        L.latLng(EMPRESA.lat, EMPRESA.lng)
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#1f4f64', weight: 5 }]
      },
      createMarker: () => null // evitamos duplicar marcadores
    }).addTo(map);
  }

  /* ========= GPS AUTOMÁTICO ========= */
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origen = L.latLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        crearRuta(origen);
      },
      () => {
        // Si falla el GPS, esperamos dirección manual
        console.warn('GPS no disponible. Esperando dirección manual.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  /* ========= DIRECCIÓN MANUAL ========= */
  const inputDireccion = document.getElementById('direccionCliente');

  if (inputDireccion) {
    let timeout = null;

    inputDireccion.addEventListener('input', () => {
      clearTimeout(timeout);

      const direccion = inputDireccion.value.trim();
      if (direccion.length < 5) return;

      timeout = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`)
          .then(res => res.json())
          .then(data => {
            if (!data || data.length === 0) return;

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            crearRuta(L.latLng(lat, lon));
          })
          .catch(err => console.error('Error geocodificando dirección:', err));
      }, 800);
    });
  }

})();

