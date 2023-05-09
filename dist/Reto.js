import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js";
/**
 * Clase para los retos
 * @class
 * @implements - @interface IRetoData
 */
export class Reto {
    _id;
    _nombre;
    _rutas;
    _actividad;
    _total;
    _usuarios;
    /**
     * Constructor de Reto
     * @param nombre Nombre del reto
     * @param rutas Rutas que forman parte del reto
     * @param actividad Tipo de actividad del reto: bicicleta o correr
     * @param usuarios Usuarios que están realizando el reto
     */
    constructor(nombre, rutas, actividad, /*usuarios: Usuario*/ usuarios) {
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
    parse(data) {
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
    toJSON() {
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
    get id() {
        return this._id;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _nombre
     * @return this._nombre
     */
    get nombre() {
        return this._nombre;
    }
    /**
     * Setter del atributo privado _nombre
     * @param value Nuevo valor para el atributo _nombre
     */
    set nombre(value) {
        this._nombre = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _rutas
     * @return this._rutas
     */
    get rutas() {
        return this._rutas;
    }
    /**
     * Setter del atributo privado _rutas
     * @param value Nuevo valor para el atributo _rutas
     */
    set rutas(value) {
        this._rutas = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _actividad
     * @return this._actividad
     */
    get actividad() {
        return this._actividad;
    }
    /**
     * Setter del atributo privado _actividad
     * @param value Nuevo valor para el atributo _actividad
     */
    set actividad(value) {
        this._actividad = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _total
     * @return this._total
     */
    get total() {
        return this._total;
    }
    /**
     * Setter del atributo privado _total
     * @param value Nuevo valor para el atributo _total
     */
    set total(value) {
        this._total = value;
    }
    /****************************************************************************/
    /**
     * Getter del atributo privado _usuarios
     * @return this._usuarios
     */
    get usuarios() {
        return this._usuarios;
    }
    /**
     * Setter del atributo privado _usuarios
     * @param value Nuevo valor para el atributo _usuarios
     */
    set usuarios(value) {
        this._usuarios = value;
    }
}
