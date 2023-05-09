import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js";
import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento.js";
/**
 * Clase que representa un grupo de entrenamiento
 * @class
 * @implements - @interface IGrupoData
 */
export class Grupo {
    _id;
    _nombre;
    _miembrosID;
    _propietarioID;
    _estadisticas;
    _ranking;
    _rutasFav;
    _historicoRutas;
    /**
     * Constructor de la clase Grupo
     * @param {string} nombre - Nombre del grupo
     * @param {string[]} miembrosID - Identificadores de los miembros del grupo (por defecto [])
     */
    constructor(nombre, miembrosID = [], generateID) {
        if (generateID) {
            // Se genera el id único
            let generadorId = GeneradorIdUnicos.getInstance();
            this._id = generadorId.generateUniqueId();
        }
        this._nombre = nombre;
        this._miembrosID = miembrosID;
        this._estadisticas = new EstadisticasEntrenamiento();
        this._ranking = [];
        this._rutasFav = [];
        this._historicoRutas = new Map();
        if (this._miembrosID.length !== 0) {
            this.ordenarRankingPorKmAcumulado();
        }
    }
    /**
     * Metodo que parsea un Grupo recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Grupo de los datos recibidos
     */
    parse(data) {
        this._id = data.id;
        this._nombre = data.nombre;
        this._miembrosID = data.miembrosID;
        this._estadisticas = data.estadisticas;
        this._ranking = data.ranking;
        this._rutasFav = data.rutasFav;
        this._historicoRutas = data.historicoRutas;
        if (this._miembrosID.length !== 0) {
            this.ordenarRankingPorKmAcumulado();
        }
        return this;
    }
    /**
     * Metodo que convierte una clase Grupo a un modelo de datos de JSON
     * @returns Grupo Data a modelo JSON
     */
    toJSON() {
        return {
            nombre: this._nombre,
            miembrosID: this._miembrosID,
            id: this._id,
            propietarioID: this._propietarioID,
            estadisticas: this._estadisticas,
            ranking: this._ranking,
            rutasFav: this._rutasFav,
            historicoRutas: this._historicoRutas
        };
    }
    // Getters
    /**
     * Retorna el nombre del grupo
     */
    get nombre() {
        return this._nombre;
    }
    /**
     * Retorna el id del grupo
     */
    get id() {
        return this._id;
    }
    /**
     * Retorna un array con los IDs de los miembros del grupo
     */
    get miembrosID() {
        return this._miembrosID;
    }
    /**
     * Retorna las estadísticas de los entrenamientos del grupo
     */
    get estadisticas() {
        return this._estadisticas;
    }
    /**
     * Retorna un ranking de los miembros del grupo
     */
    get ranking() {
        return this._ranking;
    }
    /**
     * Retorna las rutas favoritas del grupo
     */
    get rutasFav() {
        return this._rutasFav;
    }
    /**
     * Retorna el historial de rutas realizadas por el grupo
     */
    get historicoRutas() {
        return this._historicoRutas;
    }
    /**
     * Retornal el ID del propietario del grupo
     */
    get propietarioID() {
        return this._propietarioID;
    }
    // Setters
    /**
     * Establece el nombre del grupo
     * @param nombre - El nombre que se va a establecer
     */
    set nombre(nombre) {
        this._nombre = nombre;
    }
    /**
     * Establece el propietario del grupo
     * @param ID - El ID del propietario del grupo
     */
    set propietarioID(ID) {
        this._propietarioID = this.propietarioID;
    }
    /**
     * Establece el ID del grupo
     * @param id - El ID que se va a establecer
     */
    set id(id) {
        this._id = id;
    }
    /**
     * Establece los miembros del grupo
     * @paran miembrosID - Un array con los IDs de los miembros del grupo que se va a establecer
     */
    set miembrosID(miembrosID) {
        this._miembrosID = miembrosID;
    }
    /**
     * Establece las estadísticas de entrenamiento del grupo
     * @param estadisticas - Estadísticas de tipo EstadisticasEntrenamiento que se van a establecer
     */
    set estadisticas(estadisticas) {
        this._estadisticas = estadisticas;
    }
    /**
     * Establece el ranking del grupo
     * @param ranking - Un array de strings que representa el ranking que se va a establecer
     */
    set ranking(ranking) {
        this._ranking = ranking;
    }
    /**
     * Establece las rutas favoritas del grupo
     * @param rutas - Las rutas que se van a establecer como favoritas
     */
    set rutasFav(rutas) {
        this._rutasFav = rutas;
    }
    /**
     * Establece el historial de rutas recorridas por el grupo
     * @param historicoRutas - Un mapa donde cada entrada almacena una fecha y un array string que representa las rutas
     */
    set historicoRutas(historicoRutas) {
        this._historicoRutas = historicoRutas;
    }
    // Methods
    /**
     * Método que agrega el ID de un nuevo miembro al grupo
     * @param id - ID del nuevo miembro
     */
    agregarMiembro(id) {
        if (!this._miembrosID.includes(id)) {
            this._miembrosID.push(id);
            this.ordenarRankingPorKmAcumulado();
        }
    }
    /**
     * Método que elimina un miembro del grupo
     * @param id - ID del miembro a eliminar
     */
    eliminarMiembro(id) {
        this._miembrosID = this._miembrosID.filter(miembro => miembro !== id);
        this.ordenarRankingPorKmAcumulado();
    }
    /**
     * Método que ordena el ranking de los miembros del grupo según la cantidad de km cumulados históricamente
     */
    ordenarRankingPorKmAcumulado() {
        this._ranking = this._miembrosID.sort((a, b) => {
            const kmA = this.calcularKmUsuario(a);
            const kmB = this.calcularKmUsuario(b);
            return kmB - kmA;
        });
    }
    /**
     * Método que ordena el ranking de los miembros del grupo según el desnivel acumulado históricamente
     */
    ordenarRankingPorDesnivelAcumulado() {
        this._ranking = this._miembrosID.sort((a, b) => {
            const desnivelA = this.calcularDesnivelUsuario(a);
            const desnivelB = this.calcularDesnivelUsuario(b);
            return desnivelB - desnivelA;
        });
    }
    /**
     * Método que calcula la cantidad de km acumulado por un usuario en el grupo
     * @param idUsuario - ID del usuario
     * @returns El total de km acumulados
     */
    calcularKmUsuario(idUsuario) {
        let kmTotal = 0;
        return kmTotal;
    }
    /**
     * Método que calcula la el desnivel acumulado por un usuario en el grupo
     * @param idUsuario - ID del usuario
     * @returns El desnivel total acumulado por el usuario
     */
    calcularDesnivelUsuario(idUsuario) { return 0; }
    /**
     * Método para agregar una ruta al historia de rutas del grupo
     * @param fecha - Fecha de cuando se realizó la ruta
     * @param ruta - Ruta que se realizó
     */
    agregarHistorico(fecha, ruta) {
        let fechaExiste = false;
        this._historicoRutas.forEach((array, elemento) => {
            if (elemento == fecha) {
                array.push(ruta);
                fechaExiste = true;
            }
        });
        if (!fechaExiste) {
            this._historicoRutas.set(fecha, [ruta]);
        }
    }
    /**
     * Método para agregar rutas favoritas al grupo
     * @param id - ID de la ruta
     */
    agregarRutasFav(id) {
        if (!this._rutasFav.includes(id)) {
            this._rutasFav.push(id);
            ;
        }
    }
    /**
     * Método para elminar rutas favoritas del grupo
     * @param id - ID de la ruta a eliminar
     */
    eliminarRutasFav(id) {
        this._rutasFav = this._rutasFav.filter(rutas => rutas !== id);
    }
    /**
      * Actualizador de estadisticas pasandole los km y el desnivel realizado
      * @param km km realizados
      * @param desnivel desnivel realizado
      */
    actualizar_estadisticas(km, desnivel) {
        this._estadisticas.actualizarEstadisticas(km, desnivel);
    }
}
