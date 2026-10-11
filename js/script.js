const boton = document.getElementById("generarPaleta");
const contenedor = document.getElementById("paleta");
const selectFormato = document.getElementById("formato");
const selectCantidad = document.getElementById("Cantidad");

const estado = {
  cantidad: 6,
  formato: "hex",
  colores: []
};

function actualizarCantidadDesdeSelect() {
  estado.cantidad = Number(selectCantidad.value);
}

function generarColorHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 60) + 40;
  const l = Math.floor(Math.random() * 40) + 30;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function ajustarPaletaSegunCantidad() {
  while (estado.colores.length < estado.cantidad) {
    estado.colores.push({
      valor: generarColorHSL(),
      locked: false
    });
  }

  if (estado.colores.length > estado.cantidad) {
    estado.colores = estado.colores.slice(0, estado.cantidad);
  }
}

function convertirHslARgb(valorHsl) {
  const match = valorHsl.match(/\d+/g);

  if (!match) {
    return { r: 0, g: 0, b: 0 };
  }

  const h = Number(match[0]);
  const s = Number(match[1]) / 100;
  const l = Number(match[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: r + m,
    g: g + m,
    b: b + m
  };
}

function convertirRgbAHex(r, g, b) {
  const r255 = Math.round(r * 255);
  const g255 = Math.round(g * 255);
  const b255 = Math.round(b * 255);

  const toHex = (value) => value.toString(16).padStart(2, "0");

  return "#" + toHex(r255) + toHex(g255) + toHex(b255);
}

function convertirRgbARgba(r, g, b, alpha = 1) {
  const r255 = Math.round(r * 255);
  const g255 = Math.round(g * 255);
  const b255 = Math.round(b * 255);

  return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
}

function obtenerCodigoParaMostrar(valorHsl, formato) {
  const rgb = convertirHslARgb(valorHsl);

  if (formato === "hex") {
    return convertirRgbAHex(rgb.r, rgb.g, rgb.b);
  }

  if (formato === "rgba") {
    return convertirRgbARgba(rgb.r, rgb.g, rgb.b);
  }

  return valorHsl;
}

function toggleLock(index) {
  estado.colores[index].locked = !estado.colores[index].locked;
  renderPaleta();
}

function renderPaleta() {
  contenedor.innerHTML = "";

  estado.colores.forEach((item, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.style.backgroundColor = item.valor;

    const codigoColor = document.createElement("p");
    codigoColor.textContent = obtenerCodigoParaMostrar(item.valor, estado.formato);

    const botonBloqueo = document.createElement("button");
    botonBloqueo.textContent = item.locked ? "🔒" : "🔓";

    botonBloqueo.addEventListener("click", () => {
      toggleLock(index);
    });

    tarjeta.appendChild(codigoColor);
    tarjeta.appendChild(botonBloqueo);
    contenedor.appendChild(tarjeta);
  });
}

function generarPaleta() {
  estado.colores = estado.colores.map((item) => {
    if (item.locked) {
      return item;
    }

    return {
      valor: generarColorHSL(),
      locked: false
    };
  });

  renderPaleta();
}

function crearPaletaInicial() {
  estado.colores = [];

  for (let i = 0; i < estado.cantidad; i++) {
    estado.colores.push({
      valor: generarColorHSL(),
      locked: false
    });
  }

  renderPaleta();
}
crearPaletaInicial();
boton.addEventListener("click", generarPaleta);

selectCantidad.addEventListener("change", () => {
  actualizarCantidadDesdeSelect();
  ajustarPaletaSegunCantidad();
  renderPaleta();
});

selectFormato.addEventListener("change", () => {
  estado.formato = selectFormato.value;
  renderPaleta();
});


