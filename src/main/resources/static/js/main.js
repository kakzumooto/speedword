document.addEventListener("DOMContentLoaded", () => {
  const niveles = [
    `public`,
    `for`,
    `if`,
    `List<String>`,
    `@RestController`
  ];

  let nivelActual = 0;
  let textoActual = niveles[nivelActual];
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
    textoActual = niveles[nivelActual];
    textoAMostrar.textContent = textoActual;
    entradaEditable.innerHTML = '';
    entradaEditable.focus();
    entradaEditable.setAttribute("contenteditable", "true");
    iniciarTiempo();
  }

  function pintarTexto() {
    setTimeout(() => {
      const input = entradaEditable.innerText.trim();
      let resultado = '';
      let errorEncontrado = false;

      for (let i = 0; i < input.length; i++) {
        if (!errorEncontrado && input[i] === textoActual[i]) {
          resultado += `<span class="correcto">${input[i]}</span>`;
        } else {
          errorEncontrado = true;
          resultado += `<span class="incorrecto">${input[i] || ''}</span>`;
        }
      }

      entradaEditable.innerHTML = resultado;
      colocarCursorAlFinal(entradaEditable);

      if (input === textoActual) {
        nivelActual++;
        if (nivelActual < niveles.length) {
          alert("¡Nivel superado! Vamos al siguiente...");
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
    entradaEditable.setAttribute("contenteditable", "true");
  });

  enviarRegistro.addEventListener("click", async () => {
    const nombreUsuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nombreUsuario || !password) {
      alert("Por favor ingresa un nombre de usuario y contraseña.");
      return;
    }

    try {
      let response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, password })
      });

      let usuario;
      if (response.ok) {
        usuario = await response.json();
      } else {
        response = await fetch("/api/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombreUsuario, password })
        });

        if (!response.ok) {
          alert("Error al registrar usuario.");
          return;
        }

        usuario = await response.json();
      }

      // Guardar nuevo récord
      const nuevoRecord = segundos;
      const actualizarRecord = await fetch(`/api/usuarios/${usuario.id}/record?nuevoRecord=${nuevoRecord}`, {
        method: "PUT"
      });

      if (!actualizarRecord.ok) {
        alert("Hubo un error al guardar tu récord.");
        return;
      }

      // Verificar si el usuario quedó en el top 10
      const topResponse = await fetch("/api/usuarios/top");
      const topUsuarios = await topResponse.json();

      const esNuevoTop = topUsuarios.some(u => u.id === usuario.id);
      const recordAnterior = usuario.recordSegundos;

      if (esNuevoTop) {
        alert("¡Felicidades! Has entrado al Top 10.");
      } else if (recordAnterior && nuevoRecord < recordAnterior) {
        alert("¡Has roto tu récord!");
      } else {
        alert("¡Récord guardado exitosamente!");
      }

      entradaEditable.setAttribute("contenteditable", "false");
    } catch (error) {
      console.error("Error al guardar récord:", error);
      alert("Hubo un error al guardar tu récord.");
    }
  });

  async function cargarTopUsuarios() {
    try {
      const response = await fetch("/api/usuarios/top");
      if (!response.ok) throw new Error("Error al obtener el top");
      const topUsuarios = await response.json();

      const listaTop = document.getElementById("listaTop");
      if (listaTop) {
        listaTop.innerHTML = "";
        topUsuarios.forEach((usuario, index) => {
          const li = document.createElement("li");
          li.textContent = `${usuario.nombreUsuario} - ${usuario.recordSegundos} segundos`;
          listaTop.appendChild(li);
        });
        document.getElementById("topUsuarios").classList.remove("hidden");
      }
    } catch (error) {
      console.error("Error al cargar el top:", error);
    }
  }

  btnTop.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/usuarios/top");
      const usuariosTop = await response.json();

      topList.innerHTML = "";
      usuariosTop.forEach((usuario, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-b p-2">${index + 1}</td>
          <td class="border-b p-2">${usuario.nombreUsuario}</td>
          <td class="border-b p-2">${usuario.recordSegundos}s</td>
        `;
        topList.appendChild(row);
      });

      modalTop.classList.remove("hidden");
    } catch (error) {
      console.error("Error al obtener el Top 10:", error);
      alert("Hubo un error al cargar el Top 10.");
    }
  });

  cerrarModal.addEventListener("click", () => {
    modalTop.classList.add("hidden");
  });




  cargarNivel();
});
