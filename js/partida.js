import { Personaje } from "./personaje.js";
import { EstadosPartida } from "./estadosPartida.js";
import { ResultadoLucha } from "./resultadoLucha.js";

export class Partida {
    // Definimos todos los atributos estáticos pues no necesitamos más de una partida
    // Contendrá los personajes elegidos en cada partida
    static #personajes = [];
    static #turno = 1;
    // Para saber quien es el atacante y el defensor en cada turno
    static #atacanteActual = null;
    static #defensorActual = null;

    static generarPersonajes() {
        this.#turno = 1;
        const imagenesPersonajes = ["caballero.jpeg", "ciclope.jpeg", "dragon.jpeg",
            "elfo.jpeg", "enano.jpeg", "ent.jpeg", "hobbit.jpeg", "lamia.jpeg",
            "lobo.jpeg", "mago.jpeg", "minotauro.jpeg", "ninfa.jpeg", "orco.jpeg",
            "troll.jpeg", "vampiro.jpeg"];
        this.#personajes = []; // Vaciamos los personajes que pudieran existir de otra partida
        // Generamos 8 cartas con valores aleatorios
        for (let i = 0; i < 8; i++) {
            const personaje = Math.floor(Math.random() * imagenesPersonajes.length);
            const imagen = imagenesPersonajes[personaje];
            const salud = Math.floor(Math.random() * 10 + 1);
            const ataque = Math.floor(Math.random() * 10 + 1);
            const defensa = Math.floor(Math.random() * 10 + 1);
            // imagen.replace(".jpeg", "") para darle el mismo nombre al persona 
            // que a la imagen pero qutando el .jpeg. Otra opción sería tener un array
            // con los nombres deseados
            const p = new Personaje(imagen.replace(".jpeg", ""), ataque, defensa, salud, imagen);
            // Eliminamos el personaje del array de imagenes para que no genere dos o más iguales
            imagenesPersonajes.splice(personaje, 1);
            this.#personajes.push(p);
        }
        return this.#personajes;
    }

    /**
     * Elige dos personajes al azar para luchar
     * @returns {Personaje[]} - el personaje atacante en el primer elemento del array y 
     * el defensor en el segundo
     */
    static generarLucha() {
        let numeroAtacante = Math.floor(Math.random() * this.#personajes.length);
        let numeroDefensor;
        // Debemos generar un defensor mientra coincida con el atacante
        do {
            numeroDefensor = Math.floor(Math.random() * this.#personajes.length);
        } while (numeroDefensor == numeroAtacante);

        // Debemos guardar quienes son
        this.#atacanteActual = this.#personajes[numeroAtacante];
        this.#defensorActual = this.#personajes[numeroDefensor];
        return [this.#atacanteActual, this.#defensorActual];
    }

    /**
     * Realiza la lucha entre dos cartas
     * @returns {ResultadoLucha} - resultado de la lucha
     */
    static luchar() {
        this.#turno++;

        const resultado = new ResultadoLucha(this.#atacanteActual, this.#defensorActual);
        resultado.ganador = this.#atacanteActual.atacar(this.#defensorActual);
        // Comprobamos si alguno ha muerto
        if (this.#atacanteActual.salud <= 0) {
            resultado.muerto = EstadosPartida.ATACANTE
            // Eliminamos el muerto de la partida
            this.#personajes = this.#personajes.filter(p => p != this.#atacanteActual);
        } else if (this.#defensorActual.salud <= 0) {
            resultado.muerto = EstadosPartida.DEFENSOR;
            // Eliminamos el muerto de la partida
            this.#personajes = this.#personajes.filter(p => p != this.#defensorActual);
        }
        return resultado;
    }

    /**
     * Comprueba si la partida ha terminado, ya sea porque quede solo un personaje o todos tengan el mismo ataque y defensa
     * @returns {boolean} - true si terminó, false si no
     */
    static comprobarFinal() {
        // Si solo queda un carta
        if (this.#personajes.length == 1) {
            return true;
        }
        // Debemos comprobar si d elos personajes que quedan todos tienen el mismo ataque y defensa, pues
        // no podría acabar la partida.
        // Para ello cogemos los valores del primer personaje y buscamos en el array si hay alguno que no coincida
        const ataque = this.#personajes[0].ataque;
        const defensa = this.#personajes[0].defensa;
        for (const p of this.#personajes) {
            if (ataque != p.ataque || defensa != p.defensa) {
                return false;
            }
        }
        // Todos tienen el mismo ataque y defensa
        return true;
    }

    /**
     * Obtener el ganador o ganadores de la partida
     * @returns {Personaje[]} - un array con los personajes ganadores
     */
    static obtenerGanadores() {
        return this.#personajes;
    }

    /**
     * Obtener el turno actual de la partida
     * * @returns {number} - el turno actual de la partida
     */
    static get turno() {
        return this.#turno;
    }
}