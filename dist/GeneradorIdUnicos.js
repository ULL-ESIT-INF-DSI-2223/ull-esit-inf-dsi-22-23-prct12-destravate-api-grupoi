/**
 * Clase para generar ids unicos utilizando el patron singelton
 */
export class GeneradorIdUnicos {
    static instance;
    contadorIds;
    /**
     * Constructor de la clase que inicializa el contador de ids a 0
     */
    constructor() {
        this.contadorIds = 0;
    }
    modificarContador(ultimoId) {
        this.contadorIds = ultimoId;
    }
    /**
     * Funcion que devuelve la unica instancia de la clase, necesaria para implementar el patron singelton
     * @returns retorna la instancia de la clase, si no existe, la crea y la instancia
     */
    static getInstance() {
        if (!GeneradorIdUnicos.instance) {
            GeneradorIdUnicos.instance = new GeneradorIdUnicos();
        }
        return GeneradorIdUnicos.instance;
    }
    /**
     * Método que genera un id unico
     * @returns retona un string que contiene el prefijo id- mas el numero del id que le corresponde
     */
    generateUniqueId() {
        const newId = `id-${this.contadorIds}`;
        this.contadorIds++;
        return newId;
    }
}
