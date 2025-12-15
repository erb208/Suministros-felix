(() => {
    // Ruta actual normalizada
    const here = new URL(location.href);
    const currentPath = here.pathname.replace(/\/+$/,''); // sin barra final
    const currentFile = currentPath.split('/').filter(Boolean).pop() || 'index.html';
  
    // Limpia cualquier activo previo
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
  
    // Intenta emparejar por ruta completa; si no, por nombre de archivo
    let matched = null;
  
    document.querySelectorAll('.nav-link[href]').forEach(a => {
      try {
        const url = new URL(a.getAttribute('href'), here);         // resuelve ../ correctamente
        const linkPath = url.pathname.replace(/\/+$/,'');
        const linkFile = linkPath.split('/').filter(Boolean).pop() || 'index.html';
  
        if (linkPath === currentPath || linkFile === currentFile) {
          matched = a; // guarda el mejor candidato
          // Preferimos coincidencia por ruta exacta; si quieres romper el empate, puedes priorizar aquí
        }
      } catch {}
    });
  
    if (matched) {
      matched.classList.add('active');
      matched.setAttribute('aria-current','page');
    }
  })();
  