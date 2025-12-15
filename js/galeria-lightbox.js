(() => {
  const grid = document.getElementById('galeriaGrid');
  const estado = document.getElementById('galeriaEstado');
  const btns = document.querySelectorAll('.filter-btn');
  let datos = [];

  // Dimensiones originales de las imágenes
  const DIMENSIONES = {
    'lejia.png':             { w: 600,  h: 600 },
    'jabon-neutro.png':      { w: 800,  h: 800 },
    'toalla-secamanos.png':  { w: 1536, h: 1024 },
    'logo.png':              { w: 1024,  h: 1024 }
   
  };

  const render = (items) => {
    grid.innerHTML = items.map(it => {
      // it.thumb será algo como "../img/lejia.png"
      const ruta = it.thumb || '';
      const fichero = ruta.split('/').pop();            // "lejia.png"
      const dims = DIMENSIONES[fichero] || { w: 400, h: 400 };

      return `
        <div class="col-6 col-md-4 col-lg-3">
          <a href="${it.full}"
             data-lightbox="sf-galeria"
             data-title="${it.titulo} — ${it.categoria}"
             class="d-block text-decoration-none">
            <img src="${it.thumb}"
                 alt="${it.titulo}"
                 width="${dims.w}"
                 height="${dims.h}"
                 class="w-100 g-thumb">
            <div class="small mt-2 text-dark">${it.titulo}</div>
            <div class="small text-muted">${it.categoria}</div>
          </a>
        </div>
      `;
    }).join('');
  };

  const filtrar = (cat) => {
    if (cat === '*') { render(datos); return; }
    render(datos.filter(d => d.categoria === cat));
  };

  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      filtrar(b.dataset.filter);
    });
  });

  const cargar = async () => {
    estado.classList.remove('d-none');
    estado.textContent = 'Cargando galería…';
    try {
      const r = await fetch('../data/galeria.json');
      datos = await r.json();
      estado.classList.add('d-none');
      render(datos);
      // lightbox.option({ resizeDuration: 200, wrapAround: true }); // opcional
    } catch (e) {
      console.error(e);
      estado.classList.remove('d-none');
      estado.textContent = 'No se pudo cargar la galería.';
    }
  };

  cargar();
})();