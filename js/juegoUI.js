import { EstadosPartida } from "./estadosPartida.js";
import { Partida } from "./partida.js";

/**
 * Comienza una nueva partida
 */
function nuevaPartida() {
    document.getElementById("turno").textContent = 1;
    // Ocultamos la lista de ganadores por si estaba viéndose de la partida anterior
    document.getElementById("ganadores").style.display = "none";
    const plantilla = document.getElementById("plantillaCarta");
    const participantes = document.getElementById("participantes");
    participantes.innerHTML = ""; // Borramos las cartas anteriores
    const personajes = Partida.generarPersonajes();
    for (const p of personajes) {
        const clon = plantilla.cloneNode(true); // con true se clonan también sus hijos
        clon.setAttribute("id", ""); // Le quitamos el id a los clones pue sno debe haber dos elementos con el mismo id
        clon.getElementsByTagName("img")[0].setAttribute("src", "imagenes/" + p.imagen);
        clon.getElementsByClassName("nombre")[0].textContent = p.nombre;
        mostraDatosCarta(clon, p);

        participantes.appendChild(clon);
        clon.style.animation = "mostrarCarta 1s";
    }
    // Activamos el botón para jugar un turno
    document.getElementById("jugarTurno").disabled = false;
}

/**
 * Realizamos una lucha entre los dos personajes
 */
function luchar() {
    // Desactivamos el botón para jugar un turno hasta que acabe este
    document.getElementById("jugarTurno").disabled = true;
    const audio = new Audio("audio/lucha.mp3");
    audio.play();
    const resultado = Partida.luchar();
    // Vamos a actualizar los resultados
    const atacante = document.getElementById("atacante");
    const defensor = document.getElementById("defensor");

    mostraDatosCarta(atacante, resultado.atacante);
    mostraDatosCarta(defensor, resultado.defensor);

    if (resultado.ganador == EstadosPartida.ATACANTE) {
        // Podría ser mejor usar clases CSS y no establecer aquí el diseño
        atacante.style.outline = "4px solid green";
        defensor.style.outline = "4px solid red";

    } else if (resultado.ganador == EstadosPartida.DEFENSOR) {
        defensor.style.outline = "4px solid green";
        atacante.style.outline = "4px solid red";
    }

    const cartaAtacante = obtenerCartaPorNombre(resultado.atacante.nombre);
    const cartaDefensor = obtenerCartaPorNombre(resultado.defensor.nombre);

    mostraDatosCarta(cartaAtacante, resultado.atacante);
    mostraDatosCarta(cartaDefensor, resultado.defensor);

    if (resultado.muerto == EstadosPartida.ATACANTE) {
        atacante.style.filter = "grayscale()";
        cartaAtacante.style.filter = "grayscale()";
    }
    if (resultado.muerto == EstadosPartida.DEFENSOR) {
        defensor.style.filter = "grayscale()";
        cartaDefensor.style.filter = "grayscale()";
    }

    setTimeout(ocultarLucha, 1000);
}

/**
 * Mostramos los datos de ataque, defensa, salud y puntos de un personaje
 * @param {HTMLElement} carta - la carta donde mostrar los datos
 * @param {Personaje} personaje - el personaje con los datos a mostrar
 */
function mostraDatosCarta(carta, personaje) {
    carta.getElementsByClassName("ataque")[0].textContent = personaje.ataque;
    carta.getElementsByClassName("defensa")[0].textContent = personaje.defensa;
    carta.getElementsByClassName("salud")[0].textContent = personaje.salud;
    carta.getElementsByClassName("valorPuntos")[0].textContent = personaje.puntos;
}

/**
 * Una vez que termina la lucha la debemos ocultar y comprobar si la partida ha terminado
 */
function ocultarLucha() {
    document.getElementById("lucha").style.display = "none";
    if (Partida.comprobarFinal()) {
        // Mostramos la lista de posibles ganadores
        const ganadores = Partida.obtenerGanadores();
        const listado = document.getElementById("listado");
        listado.textContent = "";
        for (const ganador of ganadores) {
            const elemento = document.createElement("p");
            elemento.textContent = ganador.nombre;
            listado.appendChild(elemento);
        }
        document.getElementById("ganadores").style.display = "block";
    } else {
        // Activamos el botón para el siguiente turno
        document.getElementById("jugarTurno").disabled = false;
    }
}

/**
 * Obtiene la carta del personaje
 * @param {string} nombre - nombre del personaje
 * @returns {HTMLElement | null} - la carta que corresponde al nombre dado
 */
function obtenerCartaPorNombre(nombre) {
    // Como no hay asociación entre la carta HTML y el personaje en código, debemos
    // buscar la carta cuyo nombre coincide con el nombre del personaje
    const cartas = document.getElementsByClassName("carta");
    for (const carta of cartas) {
        // Con CSS estamos mostrando el nombre del personaje con la primera letra en
        // mayúsculas, debemos convertir ambos nombres a minúsculas o mayúsculas para
        // poder encontrarlos
        if (carta.getElementsByClassName("nombre")[0].textContent.toLowerCase() == nombre.toLowerCase()) {
            return carta;
        }
    }
    return null; // No debería pasar en nuestro juego
}

/**
 * Prepara la carta de la lucha para una nueva lucha 
 * @param {HTMLElement} carta - la carta 
 */
function preparaCarta(carta) {
    carta.style.outline = "none";
    carta.style.filter = "none";
    // Para que se vuelva a ejecutar la animación de un elemento existente
    carta.style.animation = "";
    carta.offsetWidth;
    carta.style.animation = "mostrarCarta 1s";
}

/**
 * Jugar un turno entre dos personajes
 */
function jugarTurno() {
    document.getElementById("turno").textContent = Partida.turno;
    document.getElementById("jugarTurno").disabled = true;
    const luchadores = Partida.generarLucha();
    // Mediante desestructurización podemos evitar usar luego luchadores[0] y luchadores[1]
    //let [personajeAtacante, personajeDefensor] = generarLucha();
    const lucha = document.getElementById("lucha");
    const atacante = document.getElementById("atacante");
    const defensor = document.getElementById("defensor");

    atacante.getElementsByTagName("img")[0].setAttribute("src", "imagenes/" + luchadores[0].imagen);
    atacante.getElementsByClassName("nombre")[0].textContent = luchadores[0].nombre;
    mostraDatosCarta(atacante, luchadores[0]);

    preparaCarta(atacante);

    defensor.getElementsByTagName("img")[0].setAttribute("src", "imagenes/" + luchadores[1].imagen);
    defensor.getElementsByClassName("nombre")[0].textContent = luchadores[1].nombre;
    mostraDatosCarta(defensor, luchadores[1]);

    preparaCarta(defensor);

    lucha.style.display = "flex";

    // Vamos a esperar un poco antes de la lucha en sí y mostrar los resultados
    setTimeout(luchar, 1500);

}

document.getElementById("nuevaPartida").addEventListener("click", nuevaPartida);
document.getElementById("jugarTurno").addEventListener("click", jugarTurno);