document.addEventListener("DOMContentLoaded", () => {
  const niveles = [
    "hola mundo",
    "mi gato se llama coco",
    "el sol sale por el este y se oculta por el oeste",
    "mañana vamos al parque con toda la familia a las diez",
    "cuando el río suena, agua lleva, pero no siempre es verdad"
  ];



  let nivelActual = 0;
  let segundos = 0;
  let intervalo;
  let tiempoIniciado = false;

  const textoAMostrar = document.getElementById("textoAMostrar");
  const entradaEditable = document.getElementById("entradaEditable");
  const tiempoSpan = document.getElementById("tiempo");
  const btnReiniciar = document.getElementById("reiniciar");
  const registroForm = document.getElementById("registroForm");
  const usuarioInput = document.getElementById("usuarioInput");
  const passwordInput = document.getElementById("passwordInput");
  const enviarRegistro = document.getElementById("enviarRegistro");
  const reiniciarFinal = document.getElementById("reiniciarFinal");
  const btnTop = document.getElementById("btnTop");
  const modalTop = document.getElementById("modalTop");
  const cerrarModal = document.getElementById("cerrarModal");
  const topList = document.getElementById("topList");

  function iniciarTiempo() {
    if (!tiempoIniciado) {
      intervalo = setInterval(() => {
        segundos++;
        tiempoSpan.textContent = segundos;
      }, 1000);
      tiempoIniciado = true;
    }
  }

  function cargarNivel() {
    textoAMostrar.textContent = niveles[nivelActual];
    entradaEditable.innerHTML = '';
    entradaEditable.focus();
    entradaEditable.setAttribute("contenteditable", "true");
    iniciarTiempo();
  }

  function pintarTexto() {
    setTimeout(() => {
      const input = entradaEditable.textContent;
      let resultado = '';
      let errorEncontrado = false;

      for (let i = 0; i < input.length; i++) {
        if (!errorEncontrado && input[i] === niveles[nivelActual][i]) {
          resultado += `<span class="correcto">${input[i]}</span>`;
        } else {
          errorEncontrado = true;
          resultado += `<span class="incorrecto">${input[i] || ''}</span>`;
        }
      }

      entradaEditable.innerHTML = resultado;
      colocarCursorAlFinal(entradaEditable);

      if (input === niveles[nivelActual]) {
        nivelActual++;
        if (nivelActual < niveles.length) {
         mostrarMensaje("¡Nivel superado! Vamos al siguiente...", "info");
          cargarNivel();
        } else {
          clearInterval(intervalo);
          entradaEditable.setAttribute("contenteditable", "false");
          registroForm.classList.remove("hidden");
          reiniciarFinal.classList.remove("hidden");
          cargarTopUsuarios();
        }
      }
    }, 10);
  }

  function colocarCursorAlFinal(elemento) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(elemento);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  entradaEditable.addEventListener("paste", (e) => {
    e.preventDefault();
  });

  entradaEditable.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitamos el salto de línea automático
      // Insertamos un salto de línea real
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      range.deleteContents();

      const saltoLinea = document.createTextNode("\n");
      range.insertNode(saltoLinea);

      // Mover el cursor después del salto de línea
      range.setStartAfter(saltoLinea);
      range.setEndAfter(saltoLinea);
      sel.removeAllRanges();
      sel.addRange(range);



      pintarTexto();
    }

     if (e.key === "Tab") {
        e.preventDefault(); // Evitamos que se salga del div

        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        range.deleteContents();

        // Puedes usar '\t' o '  ' para insertar espacios
        const tabNode = document.createTextNode("  "); // 2 espacios como tab
        range.insertNode(tabNode);

        // Mover el cursor después del tab
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);

        pintarTexto();
      }
  });


  entradaEditable.addEventListener("input", pintarTexto);

  btnReiniciar.addEventListener("click", () => {
    nivelActual = 0;
    segundos = 0;
    tiempoIniciado = false;
    clearInterval(intervalo);
    tiempoSpan.textContent = 0;
    registroForm.classList.add("hidden");
    reiniciarFinal.classList.add("hidden");
    cargarNivel();
  });

  reiniciarFinal.addEventListener("click", () => {
    registroForm.classList.add("hidden");
    reiniciarFinal.classList.add("hidden");
    usuarioInput.value = "";
    passwordInput.value = "";
    nivelActual = 0;
    segundos = 0;
    tiempoIniciado = false;
    clearInterval(intervalo);
    tiempoSpan.textContent = 0;
    cargarNivel();
  });

  enviarRegistro.addEventListener("click", async () => {
    const nombreUsuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nombreUsuario || !password) {
      mostrarMensaje("Por favor ingresa un nombre de usuario y contraseña.", "advertencia");
      return;
    }

    const datosUsuario = {
      nombreUsuario,
      password,
      recordSegundos: segundos
    };

    try {
      const response = await fetch("/api/usuarios/guardar-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario)
      });

      if (!response.ok) {
        mostrarMensaje("Hubo un error al guardar tu récord.", "error");
        return;
      }

      const resultado = await response.json();
      const esNuevoTop = resultado.top;
      const rompisteRecord = resultado.rompisteRecord;

      if (esNuevoTop) {
        mostrarMensaje("¡Felicidades! Has entrado al Top 10.", "exito");
      } else if (rompisteRecord) {
        mostrarMensaje("¡Has roto tu récord!", "exito");
      } else {
        mostrarMensaje("¡Récord guardado exitosamente!", "info");
      }

      entradaEditable.setAttribute("contenteditable", "false");
    } catch (error) {
      console.error("Error al guardar récord:", error);
      mostrarMensaje("Hubo un error al guardar tu récord.", "error");
    }
  });


  async function cargarTopUsuarios() {
    try {
      const response = await fetch("/api/usuarios/top");
      if (!response.ok) throw new Error("Error al obtener el top");
      const topUsuarios = await response.json();

      topList.innerHTML = "";
      topUsuarios.forEach((usuario, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-b p-2">${index + 1}</td>
          <td class="border-b p-2">${usuario.nombreUsuario}</td>
          <td class="border-b p-2">${usuario.recordSegundos}s</td>
        `;
        topList.appendChild(row);
      });
    } catch (error) {
      console.error("Error al cargar el top:", error);
    }
  }

  btnTop.addEventListener("click", () => {
    cargarTopUsuarios().then(() => {
      modalTop.classList.remove("hidden");
    });
  });

  cerrarModal.addEventListener("click", () => {
    modalTop.classList.add("hidden");
  });

  function mostrarMensaje(mensaje, tipo = "info") {
    const noti = document.getElementById("notificacion");
    noti.textContent = mensaje;

    const colores = {
      info: "bg-blue-500",
      exito: "bg-green-500",
      error: "bg-red-500",
      advertencia: "bg-yellow-500"
    };

    // Limpiar clases y agregar la del tipo
    noti.className = `fixed bottom-5 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg z-50 ${colores[tipo]}`;
    noti.classList.remove("hidden");

    setTimeout(() => {
      noti.classList.add("hidden");
    }, 3000);
  }


  cargarNivel();
});
