import { Actividad } from "./Actividad.js";
/**
 * Interfaz para la geolocalización
 * @interface
 * @param latitud
 * @param longitud
 */
export interface Geolocalizacion {
    latitud: number;
    longitud: number;
}
/**
 * IRutaData - Representa Data necesitada para describir una Ruta
 * @interface
 */
export interface IRutaData {
    id: string;
    nombre: string;
    inicio: Geolocalizacion;
    final: Geolocalizacion;
    longitud: number;
    desnivel: number;
    usuarios: string[];
    actividad: Actividad;
    calificacion: number;
}
/**
 * Clase para las rutas
 * @class
 * @implements - @interface IRutaData
 */
export declare class Ruta implements IRutaData {
    private _id;
    private _nombre;
    private _inicio;
    private _final;
    private _longitud;
    private _desnivel;
    private _usuarios;
    private _actividad;
    private _calificacion;
    /**
     * Constructor de Ruta
     * @param nombre Nombre de la ruta
     * @param inicio Geolocalización del inicio (coordenadas)
     * @param final Geolocalización del final de la ruta (coordenadas)
     * @param longitud Longitud de la ruta en kilómetros
     * @param desnivel Desnivel medio de la ruta
     * @param usuarios Usuarios que han realizado la ruta (IDs)
     * @param actividad Tipo de actividad: Indicador si la ruta se puede realizar en bicicleta o corriendo
     * @param calificacion Calificación media de la ruta
     */
    constructor(nombre: string, inicio: Geolocalizacion, final: Geolocalizacion, longitud: number, desnivel: number, usuarios: string[], actividad: Actividad, calificacion: number, generateID?: boolean);
    /**
     * Metodo que parsea una Ruta recibiendo data
     * @param data - JSON data
     * @returns Una nueva Ruta de los datos recibidos
     */
    parse(data: IRutaData): Ruta;
    /**
     * Metodo que convierte una clase Ruta a un modelo de datos de JSON
     * @returns Reto Data a un modelo JSON
     */
    toJSON(): IRutaData;
    /****************************Getters y Setters*******************************/
    /**
     * Getter del atributo privado _id
     * @return this.id
     */
    get id(): string;
    /****************************************************************************/
    /**
     * Getter del atributo privado _nombre
     * @return this._nombre
     */
    get nombre(): string;
    /**
     * Setter del atributo privado _nombre
     * @param value Nuevo valor para el atributo _nombre
     */
    set nombre(value: string);
    /****************************************************************************/
    /**
     * Getter del atributo privado _inicio
     * @return this._inicio
     */
    get inicio(): Geolocalizacion;
    /**
     * Setter del atributo privado _inicio
     * @param value Nuevo valor para el atributo _inicio
     */
    set inicio(value: Geolocalizacion);
    /****************************************************************************/
    /**
     * Getter del atributo privado _final
     * @return this._final
     */
    get final(): Geolocalizacion;
    /**
     * Setter del atributo privado _final
     * @param value Nuevo valor para el atributo _final
     */
    set final(value: Geolocalizacion);
    /****************************************************************************/
    /**
     * Getter del atributo privado _longitud
     * @return this._longitud
     */
    get longitud(): number;
    /**
     * Setter del atributo privado _longitud
     * @param value Nuevo valor para el atributo _longitud
     */
    set longitud(value: number);
    /****************************************************************************/
    /**
     * Getter del atributo privado _desnivel
     * @return this._desnivel
     */
    get desnivel(): number;
    /**
     * Setter del atributo privado _desnivel
     * @param value Nuevo valor para el atributo _desnivel
     */
    set desnivel(value: number);
    /****************************************************************************/
    /**
     * Getter del atributo privado _usuarios
     * @return this._usuarios
     */
    get usuarios(): string[];
    /**
     * Setter del atributo privado _usuarios
     * @param value Nuevo valor para el atributo _usuarios
     */
    set usuarios(value: string[]);
    /****************************************************************************/
    /**
     * Getter del atributo privado _actividad
     * @return this._actividad
     */
    get actividad(): Actividad;
    /**
     * Setter del atributo privado _actividad
     * @param value Nuevo valor para el atributo _actividad
     */
    set actividad(value: Actividad);
    /****************************************************************************/
    /**
     * Getter del atributo privado _calificacion
     * @return this._calificacion
     */
    get calificacion(): number;
    /**
     * Setter del atributo privado _calificacion
     * @param value Nuevo valor para el atributo _calificacion
     */
    set calificacion(value: number);
    /**
     * Método para enseñar los detalles de la ruta
     * @returns string con toda la información de la ruta
     */
    toString(): string;
}
