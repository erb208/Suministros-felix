document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM listo, cargando noticias…');
    cargarNoticias();
  });
  
  async function cargarNoticias() {
    const contenedor = document.getElementById('lista-noticias');
    const estado = document.getElementById('noticias-estado');
  
    if (!contenedor) {
      console.error('No existe #lista-noticias en el HTML.');
      return;
    }
  
    try {
      console.log('Solicitando data/noticias.json…');
      const resp = await fetch('data/noticias.json', { cache: 'no-store' });
  
      if (!resp.ok) {
        console.error('Error HTTP:', resp.status, resp.statusText);
        estado.textContent = `Error al cargar noticias (${resp.status}).`;
        return;
      }
  
      const text = await resp.text();
      console.log('JSON recibido:', text);
      let noticias;
      try {
        noticias = JSON.parse(text);
      } catch (e) {
        console.error('JSON inválido:', e);
        estado.textContent = 'El archivo de noticias tiene un formato inválido.';
        return;
      }
  
      if (!Array.isArray(noticias) || noticias.length === 0) {
        estado.textContent = 'No hay noticias disponibles por el momento.';
        return;
      }
  
      estado.textContent = ''; // limpiar estado
      const frag = document.createDocumentFragment();
  
      noticias.forEach(n => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
          <article class="noticia card h-100 shadow-sm">
            <img class="card-img-top" src="${n.imagen || 'https://via.placeholder.com/600x400?text=Noticia'}" alt="${n.titulo || 'Noticia'}">
            <div class="card-body">
              <h3 class="h5 card-title mb-2">${n.titulo || 'Sin título'}</h3>
              <time class="text-muted d-block mb-2" datetime="${n.fecha || ''}">
                ${n.fecha ? new Date(n.fecha).toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' }) : ''}
              </time>
              <p class="card-text">${n.resumen || ''}</p>
              <a class="btn btn-sm btn-outline-primary" href="${n.enlace || '#'}" target="_blank" rel="noopener noreferrer">Leer más</a>
            </div>
          </article>`;
        frag.appendChild(col);
      });
  
      contenedor.appendChild(frag);
      console.log('Noticias renderizadas correctamente.');
    } catch (err) {
      console.error('Excepción al cargar noticias:', err);
      if (estado) estado.textContent = 'Error al cargar las noticias. Revisa la consola.';
    }
  }