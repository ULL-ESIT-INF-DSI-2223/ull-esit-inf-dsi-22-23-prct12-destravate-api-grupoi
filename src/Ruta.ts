import { Actividad } from "./Actividad.js";
import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js"

/**
 * Interfaz para la geolocalización
 * @interface
 * @param latitud
 * @param longitud
 */
export interface Geolocalizacion{
    latitud: number;
    longitud: number;
}

/**
 * Clase para las rutas
 * @class
 */
export class Ruta {
    private _id: string;
    private _nombre: string;
    private _inicio: Geolocalizacion;
    private _final: Geolocalizacion;
    private _longitud: number;
    private _desnivel: number;
    private _usuarios: string[];
    private _actividad: Actividad;
    private _calificacion: number;

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
    constructor(nombre: string, inicio: Geolocalizacion, final: Geolocalizacion, longitud: number, desnivel: number, usuarios: string[], actividad: Actividad, calificacion: number) {
        // Se genera el id único
        let generadorId = GeneradorIdUnicos.getInstance();
        this._id = generadorId.generateUniqueId();

        this._nombre = nombre;
        this._inicio = inicio;
        this._final = final;
        this._longitud = longitud;
        this._desnivel = desnivel;
        this._usuarios = usuarios;
        this._actividad = actividad;
        this._calificacion = calificacion;
    }

    /****************************Getters y Setters*******************************/
    /**
     * Getter del atributo privado _id
     * @return this.id
     */
    get id(): string {
        return this._id;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _nombre
     * @return this._nombre
     */
    get nombre(): string {
        return this._nombre;
    }
    /**
     * Setter del atributo privado _nombre
     * @param value Nuevo valor para el atributo _nombre
     */
    set nombre(value: string) {
        this._nombre = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _inicio
     * @return this._inicio
     */
    get inicio(): Geolocalizacion {
        return this._inicio;
    }
    /**
     * Setter del atributo privado _inicio
     * @param value Nuevo valor para el atributo _inicio
     */
    set inicio(value: Geolocalizacion) {
        this._inicio = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _final
     * @return this._final
     */
    get final(): Geolocalizacion {
        return this._final;
    }
    /**
     * Setter del atributo privado _final
     * @param value Nuevo valor para el atributo _final
     */
    set final(value: Geolocalizacion) {
        this._final = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _longitud
     * @return this._longitud
     */
    get longitud(): number {
        return this._longitud;
    }
    /**
     * Setter del atributo privado _longitud
     * @param value Nuevo valor para el atributo _longitud
     */
    set longitud(value: number) {
        this._longitud = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _desnivel
     * @return this._desnivel
     */
    get desnivel(): number {
        return this._desnivel;
    }
    /**
     * Setter del atributo privado _desnivel
     * @param value Nuevo valor para el atributo _desnivel
     */
    set desnivel(value: number) {
        this._desnivel = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _usuarios
     * @return this._usuarios
     */
    get usuarios(): string[] {
        return this._usuarios;
    }
    /**
     * Setter del atributo privado _usuarios
     * @param value Nuevo valor para el atributo _usuarios
     */
    set usuarios(value: string[]) {
        this._usuarios = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _actividad
     * @return this._actividad
     */
    get actividad(): Actividad {
        return this._actividad;
    }
    /**
     * Setter del atributo privado _actividad
     * @param value Nuevo valor para el atributo _actividad
     */
    set actividad(value: Actividad) {
        this._actividad = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _calificacion
     * @return this._calificacion
     */
    get calificacion(): number {
        return this._calificacion;
    }
    /**
     * Setter del atributo privado _calificacion
     * @param value Nuevo valor para el atributo _calificacion
     */
    set calificacion(value: number) {
        this._calificacion = value;
    }
    /**
     * Método para enseñar los detalles de la ruta
     * @returns string con toda la información de la ruta
     */
    toString(): string {
        return `Ruta ${this._nombre}:
        - Id: ${this._id}
        - Inicio: (${this._inicio.latitud}, ${this._inicio.longitud})
        - Final: (${this._final.latitud}, ${this._final.longitud})
        - Longitud: ${this._longitud} km
        - Desnivel: ${this._desnivel} m
        - Actividad: ${this._actividad === Actividad.Bicicleta ? 'Bicicleta' : 'Correr'}
        - Usuarios: ${this._usuarios.length}
        - Calificación: ${this._calificacion}`;
      }
}