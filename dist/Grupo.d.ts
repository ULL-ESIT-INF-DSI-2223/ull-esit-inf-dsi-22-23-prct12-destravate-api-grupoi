import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento.js";
/**
 * IGrupoData - Representa Data necesitada para describir un Grupo
 * @interface
 */
export interface IGrupoData {
    id: string;
    nombre: string;
    miembrosID: string[];
    propietarioID: string;
    estadisticas: EstadisticasEntrenamiento;
    ranking: string[];
    rutasFav: string[];
    historicoRutas: Map<string, string[]>;
}
/**
 * Clase que representa un grupo de entrenamiento
 * @class
 * @implements - @interface IGrupoData
 */
export declare class Grupo implements IGrupoData {
    private _id;
    private _nombre;
    private _miembrosID;
    private _propietarioID;
    private _estadisticas;
    private _ranking;
    private _rutasFav;
    private _historicoRutas;
    /**
     * Constructor de la clase Grupo
     * @param {string} nombre - Nombre del grupo
     * @param {string[]} miembrosID - Identificadores de los miembros del grupo (por defecto [])
     */
    constructor(nombre: string, miembrosID?: string[], generateID?: boolean);
    /**
     * Metodo que parsea un Grupo recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Grupo de los datos recibidos
     */
    parse(data: IGrupoData): Grupo;
    /**
     * Metodo que convierte una clase Grupo a un modelo de datos de JSON
     * @returns Grupo Data a modelo JSON
     */
    toJSON(): IGrupoData;
    /**
     * Retorna el nombre del grupo
     */
    get nombre(): string;
    /**
     * Retorna el id del grupo
     */
    get id(): string;
    /**
     * Retorna un array con los IDs de los miembros del grupo
     */
    get miembrosID(): string[];
    /**
     * Retorna las estadísticas de los entrenamientos del grupo
     */
    get estadisticas(): EstadisticasEntrenamiento;
    /**
     * Retorna un ranking de los miembros del grupo
     */
    get ranking(): string[];
    /**
     * Retorna las rutas favoritas del grupo
     */
    get rutasFav(): string[];
    /**
     * Retorna el historial de rutas realizadas por el grupo
     */
    get historicoRutas(): Map<string, string[]>;
    /**
     * Retornal el ID del propietario del grupo
     */
    get propietarioID(): string;
    /**
     * Establece el nombre del grupo
     * @param nombre - El nombre que se va a establecer
     */
    set nombre(nombre: string);
    /**
     * Establece el propietario del grupo
     * @param ID - El ID del propietario del grupo
     */
    set propietarioID(ID: string);
    /**
     * Establece el ID del grupo
     * @param id - El ID que se va a establecer
     */
    set id(id: string);
    /**
     * Establece los miembros del grupo
     * @paran miembrosID - Un array con los IDs de los miembros del grupo que se va a establecer
     */
    set miembrosID(miembrosID: string[]);
    /**
     * Establece las estadísticas de entrenamiento del grupo
     * @param estadisticas - Estadísticas de tipo EstadisticasEntrenamiento que se van a establecer
     */
    set estadisticas(estadisticas: EstadisticasEntrenamiento);
    /**
     * Establece el ranking del grupo
     * @param ranking - Un array de strings que representa el ranking que se va a establecer
     */
    set ranking(ranking: string[]);
    /**
     * Establece las rutas favoritas del grupo
     * @param rutas - Las rutas que se van a establecer como favoritas
     */
    set rutasFav(rutas: string[]);
    /**
     * Establece el historial de rutas recorridas por el grupo
     * @param historicoRutas - Un mapa donde cada entrada almacena una fecha y un array string que representa las rutas
     */
    set historicoRutas(historicoRutas: Map<string, string[]>);
    /**
     * Método que agrega el ID de un nuevo miembro al grupo
     * @param id - ID del nuevo miembro
     */
    agregarMiembro(id: string): void;
    /**
     * Método que elimina un miembro del grupo
     * @param id - ID del miembro a eliminar
     */
    eliminarMiembro(id: string): void;
    /**
     * Método que ordena el ranking de los miembros del grupo según la cantidad de km cumulados históricamente
     */
    ordenarRankingPorKmAcumulado(): void;
    /**
     * Método que ordena el ranking de los miembros del grupo según el desnivel acumulado históricamente
     */
    ordenarRankingPorDesnivelAcumulado(): void;
    /**
     * Método que calcula la cantidad de km acumulado por un usuario en el grupo
     * @param idUsuario - ID del usuario
     * @returns El total de km acumulados
     */
    calcularKmUsuario(idUsuario: string): number;
    /**
     * Método que calcula la el desnivel acumulado por un usuario en el grupo
     * @param idUsuario - ID del usuario
     * @returns El desnivel total acumulado por el usuario
     */
    calcularDesnivelUsuario(idUsuario: string): number;
    /**
     * Método para agregar una ruta al historia de rutas del grupo
     * @param fecha - Fecha de cuando se realizó la ruta
     * @param ruta - Ruta que se realizó
     */
    agregarHistorico(fecha: string, ruta: string): void;
    /**
     * Método para agregar rutas favoritas al grupo
     * @param id - ID de la ruta
     */
    agregarRutasFav(id: string): void;
    /**
     * Método para elminar rutas favoritas del grupo
     * @param id - ID de la ruta a eliminar
     */
    eliminarRutasFav(id: string): void;
    /**
      * Actualizador de estadisticas pasandole los km y el desnivel realizado
      * @param km km realizados
      * @param desnivel desnivel realizado
      */
    actualizar_estadisticas(km: number, desnivel: number): void;
}
