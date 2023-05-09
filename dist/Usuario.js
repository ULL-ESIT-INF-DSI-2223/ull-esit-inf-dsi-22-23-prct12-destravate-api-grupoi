import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js";
import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento.js";
/**
 * Clase para Usuarios
 * @class
 * @implements - @interface IUsuarioData
 */
export class Usuario {
    _id;
    _nombre;
    _actividad;
    _amigos;
    _grupos; // _grupos CLASE
    _estadisticas;
    _rutas; // RUTAS CLASE
    _retos; // _retos CLASE
    _historicoRutas;
    /**
     * El constructor inicializa el id único del usuario , el _nombre pasado y el resto de atributos como vacíos
     * @param name _nombre del usuario que se quiere crear
     */
    constructor(name) {
        this._nombre = name;
        // Se genera el id único
        let generadorId = GeneradorIdUnicos.getInstance();
        this._id = generadorId.generateUniqueId();
        this._amigos = [];
        this._grupos = []; // _grupos CLASE
        this._estadisticas = new EstadisticasEntrenamiento();
        this._rutas = []; // RUTAS CLASE
        this._retos = []; // _retos CLASE
        this._historicoRutas = new Map();
    }
    /**
     * Metodo que parsea un Usuario recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Usuario de los datos recibidos
     */
    parse(data) {
        this._id = data.id;
        this._nombre = data.nombre;
        this._actividad = data.actividad;
        this._amigos = data.amigos;
        this._grupos = data.grupos;
        this._estadisticas = data.estadisticas;
        this._rutas = data.rutas;
        this._retos = data.retos;
        this._historicoRutas = data.historicoRutas;
        return this;
    }
    /**
     * Metodo que convierte una clase Usuario a un modelo de datos de JSON
     * @returns Usuario Data a un modelo JSON
     */
    toJSON() {
        return {
            id: this._id,
            nombre: this._nombre,
            actividad: this._actividad,
            amigos: this._amigos,
            grupos: this._grupos,
            estadisticas: this._estadisticas,
            rutas: this._rutas,
            retos: this._retos,
            historicoRutas: this._historicoRutas
        };
    }
    // Getters
    /**
     * Getter del _nombre del usuario
     * @returns el atributo que almacena el _nombre del usuario
     */
    get nombre() {
        return this._nombre;
    }
    /**
     * Getter del id del usuario
     * @returns el atributo que almacena el id del usuario
     */
    get id() {
        return this._id;
    }
    /**
     * Getter de las actividades que realiza el  suario
     * @returns el atributo que almacena las actividades del usuario
     */
    get Actividad() {
        return this._actividad;
    }
    /**
     * Getter de los _amigos que tiene el usuario
     * @returns el atributo que almacena los _amigos del usuario
     */
    get amigos() {
        return this._amigos;
    }
    /**
     * Getter de los _grupos a los que pertenece lel usuario
     * @returns el atributo que almacena los _grupos del usuario
     */
    get grupos() {
        return this._grupos;
    }
    /**
     * Getter de las estadísticas del usuario
     * @returns el atributo que almacena las estadísticas del usuario
     */
    get estadisticas() {
        return this._estadisticas;
    }
    /**
     * Getter de las rutas del usuario
     * @returns el atributo que almacena las rutas del usuario
     */
    get Rutas() {
        return this._rutas;
    }
    /**
     * Getter de los _retos del usuario
     * @returns el atributo que almacena los _retos que está realizando el  usuario
     */
    get retos() {
        return this._retos;
    }
    /**
     * Getter del histórico del usuario
     * @returns el atributo que almacena las el histórico de rutas que ha realizado el usuario
     */
    get Historico() {
        return this._historicoRutas;
    }
    /**
     * Setter para el atributo _id.
     *
     * @param value El valor que se asignará al atributo.
     */
    set id(value) {
        this._id = value;
    }
    /**
     * Setter para el atributo _nombre.
     *
     * @param value El valor que se asignará al atributo.
     */
    set nombre(value) {
        this._nombre = value;
    }
    /**
     * Setter para el atributo _actividad.
     *
     * @param value El valor que se asignará al atributo.
     */
    set actividad(value) {
        this._actividad = value;
    }
    /**
     * Setter para el atributo _amigos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set amigos(value) {
        this._amigos = value;
    }
    /**
     * Setter para el atributo _grupos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set grupos(value) {
        this._grupos = value;
    }
    /**
     * Setter para el atributo _estadisticas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set estadisticas(value) {
        this._estadisticas = value;
    }
    /**
     * Setter para el atributo _rutas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set rutas(value) {
        this._rutas = value;
    }
    /**
     * Setter para el atributo _retos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set retos(value) {
        this._retos = value;
    }
    /**
     * Setter para el atributo _historicoRutas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set historicoRutas(value) {
        this._historicoRutas = value;
    }
    // metodos para modificar la actividad.
    /**
     * Método para añadir una actividad a la lista
     * @param actividad actividad a añadir a la lista
     */
    agregarActividad(actividad) {
        this._actividad = actividad;
    }
    // metodos para agregar eliminar _grupos
    /**
     * Método para añadir un grupo a la lista, comprobando si ya está metido
     * @param id id del grupo a añadir
     */
    agregarGrupo(id) {
        if (!this._grupos.includes(id)) {
            this._grupos.push(id);
        }
    }
    /**
     * Método para eliminar grupo
     * @param id id del grupo que se quiere eliminar
     */
    eliminarGrupo(id) {
        this._grupos = this._grupos.filter((grupo) => grupo != id);
    }
    // metodos para agregar eliminar rutas
    /**
     * Agrega una ruta a la lista de rutas
     * @param id id de la ruta a añadir
     */
    agregarRutas(id) {
        if (!this._rutas.includes(id)) {
            this._rutas.push(id);
        }
    }
    /**
     * Método pra eliminar la ruta pasada
     * @param id id de la ruta a eliminar
     */
    eliminarRutas(id) {
        this._rutas = this._rutas.filter((ruta) => ruta != id);
    }
    // metodos para agregar eliminar _retos
    /**
     * Método para agregar retos
     * @param id id del reto a agregar
     */
    agregar_retos(id) {
        if (!this._retos.includes(id)) {
            this._retos.push(id);
        }
    }
    /**
     * Método para elminiar reto
     * @param id id del reto a eliminar
     */
    eliminar_retos(id) {
        this._retos = this._retos.filter((reto) => reto != id);
    }
    // metodos para agregar eliminar _amigos
    /**
     * Método para agregar amigos
     * @param id id del amigo a agregar
     */
    agregarAmigo(id) {
        if (!this._amigos.includes(id)) {
            this._amigos.push(id);
        }
    }
    /**
     * Método para eliminar amigos
     * @param id id del amigo a eliminar
     */
    eliminarAmigo(id) {
        this._amigos = this._amigos.filter((amigo) => amigo != id);
    }
    // metodos para agregar en el histórico de rutas.
    /**
     * Método para añadir ruta al historico
     * @param fecha fecha en la que se realizó la ruta
     * @param ruta ruta realizada
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
    // Métodos para actualizar estadísticas de entrenamiento
    /**
     * Actualizador de estadisticas pasandole los km y el desnivel realizado
     * @param km km realizados
     * @param desnivel desnivel realizado
     */
    actualizar_estadisticas(km, desnivel) {
        this._estadisticas.actualizarEstadisticas(km, desnivel);
    }
    // Getters de las estadísticas
    /**
     * getter de las estadisticas de la semana
     */
    get EstadisticasSemana() {
        return this._estadisticas.obtenerEstadisticasSemana();
    }
    /**
     * getter de las estadisticas del mes
     */
    get EstadisticasMes() {
        return this._estadisticas.obtenerEstadisticasMes();
    }
    /**
     * getter de las estadisticas del año
     */
    get EstadisticasAno() {
        return this._estadisticas.obtenerEstadisticasAnio();
    }
}
