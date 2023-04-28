import { GeneradorIdUnicos } from "./GeneradorIdUnicos.js";
import { EstadisticasEntrenamiento } from "./EstadisticasEntrenamiento.js";

/**
 * Clase que representa un grupo de entrenamiento
 * @class
 */
export class Grupo {
  private _id: string;
  private _nombre: string;
  private _miembrosID: string[];
  private _propietarioID: string;

  private _estadisticas: EstadisticasEntrenamiento;

  private _ranking: string[];
  private _rutasFav: string[];
  private _historicoRutas: Map<string, string[]>;
  
  /**
   * Constructor de la clase Grupo
   * @param {string} nombre - Nombre del grupo
   * @param {string[]} miembrosID - Identificadores de los miembros del grupo (por defecto [])
   */
  constructor(nombre: string, miembrosID: string[] = []) {
    // Se genera el id único
    let generadorId = GeneradorIdUnicos.getInstance();
    this._id = generadorId.generateUniqueId();

    this._nombre = nombre;
    this._miembrosID = miembrosID;

    this._estadisticas = new EstadisticasEntrenamiento();

    this._ranking = [];
    this._rutasFav = [];
    this._historicoRutas = new Map<string, string[]>();

    if (this._miembrosID.length !== 0) {
      this.ordenarRankingPorKmAcumulado();
    }
  }

  // Getters

  /**
   * Retorna el nombre del grupo
   */
  get nombre(): string {
    return this._nombre;
  }

  /**
   * Retorna el id del grupo
   */
  get id(): string {
    return this._id;
  }

  /**
   * Retorna un array con los IDs de los miembros del grupo
   */
  get miembrosID(): string[] {
    return this._miembrosID;
  }

  /**
   * Retorna las estadísticas de los entrenamientos del grupo
   */
  get estadisticas(): EstadisticasEntrenamiento {
    return this._estadisticas;
  }

  /**
   * Retorna un ranking de los miembros del grupo
   */
  get ranking(): string[] {
    return this._ranking;
  }

  /**
   * Retorna las rutas favoritas del grupo
   */
  get rutasFav(): string[] {
    return this._rutasFav;
  }

  /**
   * Retorna el historial de rutas realizadas por el grupo
   */
  get historicoRutas(): Map<string, string[]> {
    return this._historicoRutas;
  }

  /**
   * Retornal el ID del propietario del grupo
   */
  get propietarioID(): string {
    return this._propietarioID; 
  }

  // Setters

  /**
   * Establece el nombre del grupo
   * @param nombre - El nombre que se va a establecer
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }
  
  /**
   * Establece el propietario del grupo
   * @param ID - El ID del propietario del grupo
   */
  set propietarioID(ID: string) {
    this._propietarioID = this.propietarioID;
  }

  /**
   * Establece el ID del grupo
   * @param id - El ID que se va a establecer 
   */
  set id(id: string) {
    this._id = id;
  }

  /**
   * Establece los miembros del grupo
   * @paran miembrosID - Un array con los IDs de los miembros del grupo que se va a establecer
   */
  set miembrosID(miembrosID: string[]) {
    this._miembrosID = miembrosID;
  }

  /**
   * Establece las estadísticas de entrenamiento del grupo
   * @param estadisticas - Estadísticas de tipo EstadisticasEntrenamiento que se van a establecer
   */
  set estadisticas(estadisticas: EstadisticasEntrenamiento) {
    this._estadisticas = estadisticas;
  }

  /**
   * Establece el ranking del grupo
   * @param ranking - Un array de strings que representa el ranking que se va a establecer 
   */
  set ranking(ranking: string[]) {
    this._ranking = ranking;
  }

  /**
   * Establece las rutas favoritas del grupo
   * @param rutas - Las rutas que se van a establecer como favoritas
   */
  set rutasFav(rutas: string[]) {
    this._rutasFav = rutas;
  }

  /**
   * Establece el historial de rutas recorridas por el grupo
   * @param historicoRutas - Un mapa donde cada entrada almacena una fecha y un array string que representa las rutas
   */
  set historicoRutas(historicoRutas: Map<string, string[]>) {
    this._historicoRutas = historicoRutas;
  }

  // Methods

  /**
   * Método que agrega el ID de un nuevo miembro al grupo
   * @param id - ID del nuevo miembro
   */
  public agregarMiembro(id: string) {
    if (!this._miembrosID.includes(id)) {
      this._miembrosID.push(id);
      this.ordenarRankingPorKmAcumulado();
    }
  }

  /**
   * Método que elimina un miembro del grupo
   * @param id - ID del miembro a eliminar
   */
  public eliminarMiembro(id: string) {
    this._miembrosID = this._miembrosID.filter(miembro => miembro !== id);
    this.ordenarRankingPorKmAcumulado();
  }


  /**
   * Método que ordena el ranking de los miembros del grupo según la cantidad de km cumulados históricamente
   */
  ordenarRankingPorKmAcumulado() {
    this._ranking = this._miembrosID.sort((a, b) => {
      const kmA: number = this.calcularKmUsuario(a);
      const kmB: number = this.calcularKmUsuario(b);
      return kmB - kmA;
    });
  }

  /**
   * Método que ordena el ranking de los miembros del grupo según el desnivel acumulado históricamente
   */
  ordenarRankingPorDesnivelAcumulado() {
    this._ranking = this._miembrosID.sort((a, b) => {
      const desnivelA: number = this.calcularDesnivelUsuario(a);
      const desnivelB: number = this.calcularDesnivelUsuario(b);
      return desnivelB - desnivelA;
    });
  }

  /**
   * Método que calcula la cantidad de km acumulado por un usuario en el grupo
   * @param idUsuario - ID del usuario
   * @returns El total de km acumulados
   */
  calcularKmUsuario(idUsuario: string): number {
    let kmTotal = 0;
    
    return kmTotal;
  }

  /**
   * Método que calcula la el desnivel acumulado por un usuario en el grupo
   * @param idUsuario - ID del usuario
   * @returns El desnivel total acumulado por el usuario
   */
  calcularDesnivelUsuario(idUsuario: string): number {  return 0; }


  /**
   * Método para agregar una ruta al historia de rutas del grupo
   * @param fecha - Fecha de cuando se realizó la ruta
   * @param ruta - Ruta que se realizó
   */
  public agregarHistorico(fecha: string, ruta: string) {
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
  public agregarRutasFav(id: string) {
    if (!this._rutasFav.includes(id)) {
      this._rutasFav.push(id);;
    }
  }
  
  /**
   * Método para elminar rutas favoritas del grupo
   * @param id - ID de la ruta a eliminar
   */
  public eliminarRutasFav(id: string) {
    this._rutasFav = this._rutasFav.filter(rutas => rutas !== id);
  }

  
   /**
     * Actualizador de estadisticas pasandole los km y el desnivel realizado
     * @param km km realizados
     * @param desnivel desnivel realizado
     */
   actualizar_estadisticas(km: number, desnivel: number): void {
    this._estadisticas.actualizarEstadisticas(km, desnivel);
}
}

