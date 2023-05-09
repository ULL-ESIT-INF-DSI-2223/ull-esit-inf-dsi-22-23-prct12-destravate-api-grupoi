import { Actividad } from "./Actividad.js";
/**
 * IRetoData - Representa Data necesitada para describir un Reto
 * @interface
 */
export interface IRetoData {
    id: string;
    nombre: string;
    rutas: string[];
    actividad: Actividad;
    total: number;
    usuarios: string[];
}
/**
 * Clase para los retos
 * @class
 * @implements - @interface IRetoData
 */
export declare class Reto implements IRetoData {
    private _id;
    private _nombre;
    private _rutas;
    private _actividad;
    private _total;
    private _usuarios;
    /**
     * Constructor de Reto
     * @param nombre Nombre del reto
     * @param rutas Rutas que forman parte del reto
     * @param actividad Tipo de actividad del reto: bicicleta o correr
     * @param usuarios Usuarios que están realizando el reto
     */
    constructor(nombre: string, rutas: string[], actividad: Actividad, /*usuarios: Usuario*/ usuarios: string[]);
    /**
     * Metodo que parsea un Reto recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Reto de los datos recibidos
     */
    parse(data: IRetoData): Reto;
    /**
     * Metodo que convierte una clase Reto a un modelo de datos de JSON
     * @returns Reto Data a modelo JSON
     */
    toJSON(): IRetoData;
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
     * Getter del atributo privado _rutas
     * @return this._rutas
     */
    get rutas(): string[];
    /**
     * Setter del atributo privado _rutas
     * @param value Nuevo valor para el atributo _rutas
     */
    set rutas(value: string[]);
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
     * Getter del atributo privado _total
     * @return this._total
     */
    get total(): number;
    /**
     * Setter del atributo privado _total
     * @param value Nuevo valor para el atributo _total
     */
    set total(value: Actividad);
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
}
