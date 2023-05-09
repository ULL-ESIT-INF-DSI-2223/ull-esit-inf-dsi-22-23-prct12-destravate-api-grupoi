/**
 * Clase para generar ids unicos utilizando el patron singelton
 */
export declare class GeneradorIdUnicos {
    private static instance;
    private contadorIds;
    /**
     * Constructor de la clase que inicializa el contador de ids a 0
     */
    private constructor();
    modificarContador(ultimoId: number): void;
    /**
     * Funcion que devuelve la unica instancia de la clase, necesaria para implementar el patron singelton
     * @returns retorna la instancia de la clase, si no existe, la crea y la instancia
     */
    static getInstance(): GeneradorIdUnicos;
    /**
     * Método que genera un id unico
     * @returns retona un string que contiene el prefijo id- mas el numero del id que le corresponde
     */
    generateUniqueId(): string;
}
