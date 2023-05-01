import { Actividad } from "./Actividad.js";
import { Ruta } from "./Ruta.js";
import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js"
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
export class Reto implements IRetoData{
    private _id: string;
    private _nombre: string;
    private _rutas: string[];
    private _actividad: Actividad;
    private _total: number;
    private _usuarios: string[];


    /**
     * Constructor de Reto
     * @param nombre Nombre del reto
     * @param rutas Rutas que forman parte del reto
     * @param actividad Tipo de actividad del reto: bicicleta o correr
     * @param usuarios Usuarios que están realizando el reto
     */
    constructor(nombre: string, rutas: string[], actividad: Actividad, /*usuarios: Usuario*/ usuarios: string[]) {
        // Se genera el id único
        let generadorId = GeneradorIdUnicos.getInstance();
        this._id = generadorId.generateUniqueId();

        this._nombre = nombre;
        this._rutas = rutas;
        this._actividad = actividad;
        this._total = 0;
        this._usuarios = usuarios;
    }
    /**
     * Metodo que parsea un Reto recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Reto de los datos recibidos
     */
    public parse(data: IRetoData): Reto {
        this._id = data.id;
        this._nombre = data.nombre;
        this._rutas = data.rutas;
        this._actividad = data.actividad;
        this._total = data.total;
        this._usuarios = data.usuarios;
        return this;
    }
    /**
     * Metodo que convierte una clase Reto a un modelo de datos de JSON
     * @returns Reto Data a modelo JSON
     */
    public toJSON(): IRetoData {
        return {
            id: this._id,
            nombre: this._nombre,
            rutas: this._rutas,
            actividad: this._actividad,
            total: this._total,
            usuarios: this._usuarios
        };
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
     * Getter del atributo privado _rutas
     * @return this._rutas
     */
    get rutas(): string[] {
        return this._rutas;
    }
    /**
     * Setter del atributo privado _rutas
     * @param value Nuevo valor para el atributo _rutas
     */
    set rutas(value: string[]) {
        this._rutas = value;
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
     * Getter del atributo privado _total
     * @return this._total
     */
    get total(): number {
        return this._total;
    }
    /**
     * Setter del atributo privado _total
     * @param value Nuevo valor para el atributo _total
     */
    set total(value: Actividad) {
        this._total = value;
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
}