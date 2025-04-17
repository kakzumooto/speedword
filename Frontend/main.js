const niveles = [
  `public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola Mundo");
    }
}`,

  `for (int i = 0; i < 5; i++) {
    System.out.println("Iteración: " + i);
}`,

  `if (usuario.isAutenticado()) {
    mostrarDashboard();
} else {
    redirigirLogin();
}`,

  `List<String> lista = new ArrayList<>();
lista.add("Java");
lista.add("Spring Boot");`,

  `@RestController
public class SaludoController {
    @GetMapping("/saludo")
    public String saludar() {
        return "¡Hola desde Spring!";
    }
}`
];

let nivelActual = 0;
let textoActual = niveles[nivelActual];
let segundos = 0;
let intervalo;

const textoAMostrar = document.getElementById("textoAMostrar");
const entradaEditable = document.getElementById("entradaEditable");
const tiempoSpan = document.getElementById("tiempo");
const btnReiniciar = document.getElementById("reiniciar");

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
  const input = entradaEditable.innerText;
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
      alert(`¡Juego terminado en ${segundos} segundos! 🎉`);
      entradaEditable.setAttribute("contenteditable", "false");
    }
  }
}

// Función para que el cursor no se pierda
function colocarCursorAlFinal(elemento) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(elemento);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Bloquear pegar texto
entradaEditable.addEventListener("paste", (e) => {
  e.preventDefault();
});

entradaEditable.addEventListener("input", pintarTexto);

btnReiniciar.addEventListener("click", () => {
  nivelActual = 0;
  cargarNivel();
});

cargarNivel();
