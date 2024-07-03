// Usaremos esta clase para almacenar los datos de una lucha
// Como solo vamos a tener una lucha a la vez y no hay que mantener los datos
// de la lucha anterior, podríamos haber definido los atributos estáticos
export class ResultadoLucha {
    atacante;
    defensor;
    ganador;
    muerto;

    constructor(atacante, defensor) {
        this.atacante = atacante;
        this.defensor = defensor;
        this.muerto = null;
    }
}
