import { Actividad } from "./Actividad.js";
import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento.js";
/**
 * IUsuarioData - Representa Data necesitada para describir un Usuario
 * @interface
 */
export interface IUsuarioData {
    id: string;
    nombre: string;
    actividad: Actividad;
    amigos: string[];
    grupos: string[];
    estadisticas: EstadisticasEntrenamiento;
    rutas: string[];
    retos: string[];
    historicoRutas: Map<string, string[]>;
}
/**
 * Clase para Usuarios
 * @class
 * @implements - @interface IUsuarioData
 */
export declare class Usuario implements IUsuarioData {
    private _id;
    private _nombre;
    private _actividad;
    private _amigos;
    private _grupos;
    private _estadisticas;
    private _rutas;
    private _retos;
    private _historicoRutas;
    /**
     * El constructor inicializa el id único del usuario , el _nombre pasado y el resto de atributos como vacíos
     * @param name _nombre del usuario que se quiere crear
     */
    constructor(name: string);
    /**
     * Metodo que parsea un Usuario recibiendo data
     * @param data - JSON data
     * @returns Un nuevo Usuario de los datos recibidos
     */
    parse(data: IUsuarioData): Usuario;
    /**
     * Metodo que convierte una clase Usuario a un modelo de datos de JSON
     * @returns Usuario Data a un modelo JSON
     */
    toJSON(): IUsuarioData;
    /**
     * Getter del _nombre del usuario
     * @returns el atributo que almacena el _nombre del usuario
     */
    get nombre(): string;
    /**
     * Getter del id del usuario
     * @returns el atributo que almacena el id del usuario
     */
    get id(): string;
    /**
     * Getter de las actividades que realiza el  suario
     * @returns el atributo que almacena las actividades del usuario
     */
    get Actividad(): Actividad;
    /**
     * Getter de los _amigos que tiene el usuario
     * @returns el atributo que almacena los _amigos del usuario
     */
    get amigos(): string[];
    /**
     * Getter de los _grupos a los que pertenece lel usuario
     * @returns el atributo que almacena los _grupos del usuario
     */
    get grupos(): string[];
    /**
     * Getter de las estadísticas del usuario
     * @returns el atributo que almacena las estadísticas del usuario
     */
    get estadisticas(): EstadisticasEntrenamiento;
    /**
     * Getter de las rutas del usuario
     * @returns el atributo que almacena las rutas del usuario
     */
    get Rutas(): string[];
    /**
     * Getter de los _retos del usuario
     * @returns el atributo que almacena los _retos que está realizando el  usuario
     */
    get retos(): string[];
    /**
     * Getter del histórico del usuario
     * @returns el atributo que almacena las el histórico de rutas que ha realizado el usuario
     */
    get Historico(): Map<string, string[]>;
    /**
     * Setter para el atributo _id.
     *
     * @param value El valor que se asignará al atributo.
     */
    set id(value: string);
    /**
     * Setter para el atributo _nombre.
     *
     * @param value El valor que se asignará al atributo.
     */
    set nombre(value: string);
    /**
     * Setter para el atributo _actividad.
     *
     * @param value El valor que se asignará al atributo.
     */
    set actividad(value: Actividad);
    /**
     * Setter para el atributo _amigos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set amigos(value: string[]);
    /**
     * Setter para el atributo _grupos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set grupos(value: string[]);
    /**
     * Setter para el atributo _estadisticas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set estadisticas(value: EstadisticasEntrenamiento);
    /**
     * Setter para el atributo _rutas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set rutas(value: string[]);
    /**
     * Setter para el atributo _retos.
     *
     * @param value El valor que se asignará al atributo.
     */
    set retos(value: string[]);
    /**
     * Setter para el atributo _historicoRutas.
     *
     * @param value El valor que se asignará al atributo.
     */
    set historicoRutas(value: Map<string, string[]>);
    /**
     * Método para añadir una actividad a la lista
     * @param actividad actividad a añadir a la lista
     */
    agregarActividad(actividad: Actividad): void;
    /**
     * Método para añadir un grupo a la lista, comprobando si ya está metido
     * @param id id del grupo a añadir
     */
    agregarGrupo(id: string): void;
    /**
     * Método para eliminar grupo
     * @param id id del grupo que se quiere eliminar
     */
    eliminarGrupo(id: string): void;
    /**
     * Agrega una ruta a la lista de rutas
     * @param id id de la ruta a añadir
     */
    agregarRutas(id: string): void;
    /**
     * Método pra eliminar la ruta pasada
     * @param id id de la ruta a eliminar
     */
    eliminarRutas(id: string): void;
    /**
     * Método para agregar retos
     * @param id id del reto a agregar
     */
    agregar_retos(id: string): void;
    /**
     * Método para elminiar reto
     * @param id id del reto a eliminar
     */
    eliminar_retos(id: string): void;
    /**
     * Método para agregar amigos
     * @param id id del amigo a agregar
     */
    agregarAmigo(id: string): void;
    /**
     * Método para eliminar amigos
     * @param id id del amigo a eliminar
     */
    eliminarAmigo(id: string): void;
    /**
     * Método para añadir ruta al historico
     * @param fecha fecha en la que se realizó la ruta
     * @param ruta ruta realizada
     */
    agregarHistorico(fecha: string, ruta: string): void;
    /**
     * Actualizador de estadisticas pasandole los km y el desnivel realizado
     * @param km km realizados
     * @param desnivel desnivel realizado
     */
    actualizar_estadisticas(km: number, desnivel: number): void;
    /**
     * getter de las estadisticas de la semana
     */
    get EstadisticasSemana(): {
        km: number;
        desnivel: number;
    };
    /**
     * getter de las estadisticas del mes
     */
    get EstadisticasMes(): {
        km: number;
        desnivel: number;
    };
    /**
     * getter de las estadisticas del año
     */
    get EstadisticasAno(): {
        km: number;
        desnivel: number;
    };
}
