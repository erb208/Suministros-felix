// Presupuesto dinámico Suministros Félix
// Requiere que existan estos IDs en presupuesto.html:
// #formPresupuesto, #producto, #plazo, #descuentoLabel,
// #extraEnvio, #extraInstal, #extraGarant, #subtotal, #total,
// #nombre, #apellidos, #telefono, #email, #chkPrivacidad

(function () {
  const $ = (sel) => document.querySelector(sel);

  const form = $('#formPresupuesto');
  const selProducto = $('#producto');
  const inpPlazo = $('#plazo');
  const lblDescuento = $('#descuentoLabel');
  const extras = [
    $('#extraEnvio'),
    $('#extraInstal'),
    $('#extraGarant')
  ].filter(Boolean);

  const outSubtotal = $('#subtotal');
  const outTotal = $('#total');

  // --- Utilidades ---
  const toNum = (v) => Number(String(v).replace(',', '.')) || 0;
  const eur = (n) =>
    (isFinite(n) ? n : 0).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });

  // Descuento por plazo
  // <=7 -> 10%, 8–15 -> 5%, 16–30 -> 2%, >30 -> 0%
  function getDescuentoPct(plazo) {
    const d = Number(plazo) || 0;
    if (d <= 7) return 0.10;
    if (d <= 15) return 0.05;
    if (d <= 30) return 0.02;
    return 0;
  }

  function calc() {
    const base = toNum(selProducto?.value);
    const ext = extras.reduce(
      (sum, e) => sum + (e?.checked ? toNum(e.value) : 0),
      0
    );
    const sub = base + ext;

    const pct = getDescuentoPct(inpPlazo?.value);
    if (lblDescuento) lblDescuento.value = Math.round(pct * 100) + '%';

    const total = sub * (1 - pct);
    if (outSubtotal) outSubtotal.value = eur(sub);
    if (outTotal) outTotal.value = eur(total);
  }

  // --- Enlazar eventos para recalcular en vivo ---
  ['change', 'input'].forEach((evt) => {
    selProducto?.addEventListener(evt, calc);
    inpPlazo?.addEventListener(evt, calc);
    extras.forEach((x) => x?.addEventListener(evt, calc));
  });

  // Recalcular después de un reset
  form?.addEventListener('reset', () => setTimeout(calc, 0));

  // --- Validación de datos de contacto ---
  const iNombre = $('#nombre');
  const iApellidos = $('#apellidos');
  const iTel = $('#telefono');
  const iEmail = $('#email');
  const iPriv = $('#chkPrivacidad');

  const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const tel9 = /^\d{9}$/;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function valNombre() {
    const ok =
      !!iNombre?.value &&
      soloLetras.test(iNombre.value) &&
      iNombre.value.length <= 15;
    iNombre?.classList.toggle('is-invalid', !ok);
    iNombre?.classList.toggle('is-valid', ok);
    return ok;
  }

  function valApellidos() {
    const ok =
      !!iApellidos?.value &&
      soloLetras.test(iApellidos.value) &&
      iApellidos.value.length <= 40;
    iApellidos?.classList.toggle('is-invalid', !ok);
    iApellidos?.classList.toggle('is-valid', ok);
    return ok;
  }

  function valTel() {
    const ok = !!iTel?.value && tel9.test(iTel.value);
    iTel?.classList.toggle('is-invalid', !ok);
    iTel?.classList.toggle('is-valid', ok);
    return ok;
  }

  function valEmail() {
    const ok = !!iEmail?.value && emailRx.test(iEmail.value);
    iEmail?.classList.toggle('is-invalid', !ok);
    iEmail?.classList.toggle('is-valid', ok);
    return ok;
  }

  function valPriv() {
    const ok = !!iPriv?.checked;
    if (iPriv) {
      if (!ok) iPriv.classList.add('is-invalid');
      else iPriv.classList.remove('is-invalid');
    }
    return ok;
  }

  // Validación en tiempo real
  iNombre?.addEventListener('input', valNombre);
  iApellidos?.addEventListener('input', valApellidos);
  iTel?.addEventListener('input', valTel);
  iEmail?.addEventListener('input', valEmail);
  iPriv?.addEventListener('change', valPriv);

  // Envío del formulario (sin refrescar la página)
  form?.addEventListener('submit', (e) => {
    const ok =
      valNombre() &&
      valApellidos() &&
      valTel() &&
      valEmail() &&
      valPriv() &&
      toNum(selProducto?.value) > 0 &&
      Number(inpPlazo?.value) >= 1;

    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    alert('¡Presupuesto enviado! Te contactaremos en breve.');
  });

  // Primer cálculo al cargar
  calc();
})();

