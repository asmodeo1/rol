import { EstadosPartida } from "./estadosPartida.js";
export class Personaje {
    // Creamos los atributos del personaje privados
    #nombre;
    #ataque = 0;
    #defensa = 0;
    #salud = 0;
    #puntos = 0;
    #imagen;

    constructor(nombre, ataque, defensa, salud, imagen) {
        this.#nombre = nombre;
        this.#ataque = ataque;
        this.#defensa = defensa;
        this.#salud = salud;
        this.#imagen = imagen;
    }

    // Creamos unos cuantos getters para poder acceder al valor de los atributos desde fuera de la clase
    get nombre() {
        return this.#nombre;
    }

    get salud() {
        return this.#salud;
    }

    get puntos() {
        return this.#puntos;
    }

    get ataque() {
        return this.#ataque;
    }

    get defensa() {
        return this.#defensa;
    }

    get imagen() {
        return this.#imagen;
    }

    /**
     * Realiza una lucha entre dos personajes
     * @param {Personaje} enemigo 
     * @returns {EstadosPartida} - ATACANTE si ganó el atancante, DEFENSOR si ganó el defensor y 
     *                          EMPATE si empataron
     */
    atacar(enemigo) {
        if(this.#ataque > enemigo.#defensa) {
            enemigo.#salud -= this.#ataque - enemigo.#defensa;
            this.#puntos++;
            return EstadosPartida.ATACANTE;
        } else if(this.#ataque < enemigo.#defensa) {
            this.#salud -= enemigo.#defensa - this.#ataque; 
            enemigo.#puntos++;
            return EstadosPartida.DEFENSOR;
        } else {
            return EstadosPartida.EMPATE;
        }
    }
}