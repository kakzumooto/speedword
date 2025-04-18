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

  const textoAMostrar = document.getElementById("textoAMostrar");
  const entradaEditable = document.getElementById("entradaEditable");
  const tiempoSpan = document.getElementById("tiempo");
  const btnReiniciar = document.getElementById("reiniciar");
  const registroForm = document.getElementById("registroForm");
  const usuarioInput = document.getElementById("usuarioInput");
  const passwordInput = document.getElementById("passwordInput");
  const enviarRegistro = document.getElementById("enviarRegistro");
  const reiniciarFinal = document.getElementById("reiniciarFinal"); // << Botón del modal

  function iniciarTiempo() {
    segundos = 0;
    tiempoSpan.textContent = segundos;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
      segundos++;
      tiempoSpan.textContent = segundos;
    }, 1000);
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
        clearInterval(intervalo);
        nivelActual++;
        if (nivelActual < niveles.length) {
          alert("¡Nivel superado! Vamos al siguiente...");
          cargarNivel();
        } else {
          entradaEditable.setAttribute("contenteditable", "false");
          registroForm.classList.remove("hidden");
          reiniciarFinal.classList.remove("hidden"); // Muestra el botón "Volver a jugar" en el modal
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
    registroForm.classList.add("hidden");
    reiniciarFinal.classList.add("hidden");
    cargarNivel();
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

      await fetch(`/api/usuarios/${usuario.id}/record?nuevoRecord=${segundos}`, {
        method: "PUT"
      });

      alert("¡Récord guardado exitosamente!");
      entradaEditable.setAttribute("contenteditable", "false");
      // El botón ya se muestra desde antes, así que no hacemos nada más aquí
    } catch (error) {
      console.error("Error al guardar récord:", error);
      alert("Hubo un error al guardar tu récord.");
    }
  });

  reiniciarFinal.addEventListener("click", () => {
    registroForm.classList.add("hidden");
    reiniciarFinal.classList.add("hidden");
    usuarioInput.value = "";
    passwordInput.value = "";
    nivelActual = 0;
    cargarNivel();
    entradaEditable.setAttribute("contenteditable", "true");
  });

  cargarNivel();
});
