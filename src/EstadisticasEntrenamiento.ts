/**
 * Clase que representa las estadística de un entrenamiento
 * @class
 */
export class EstadisticasEntrenamiento {
  private kmAcumuladosSemana: number = 0;
  private desnivelAcumuladoSemana: number = 0;

  private kmAcumuladosMes: number = 0;
  private desnivelAcumuladoMes: number = 0;

  private kmAcumuladosAnio: number = 0;
  private desnivelAcumuladoAnio: number = 0;
  
  /**
   * Constructor de la clase EstadisticasEntrenamiento
   */
  constructor() {

  }
  
  /**
   * Retorna las estadísticas de la semana actual
   * @returns - Objeto con los km y desnivel acumulados en la semana actual
   */
  public obtenerEstadisticasSemana() {
    return {
      km: this.kmAcumuladosSemana,
      desnivel: this.desnivelAcumuladoSemana,
    };
  }
  
  /**
   * Retorna las estadísticas del mes actual
   * @returns - Objeto con los km y desnivel acumulados en el mes actual
   */
  public obtenerEstadisticasMes() {
    return {
      km: this.kmAcumuladosMes,
      desnivel: this.desnivelAcumuladoMes,
    };
  }
  
  /**
   * Retorna las estadísticas del año actual
   * @returns - Objeto con los km y desnivel acumulados en el año actual
   */
  public obtenerEstadisticasAnio() {
    return {
      km: this.kmAcumuladosAnio,
      desnivel: this.desnivelAcumuladoAnio,
    };
  }
  
  /**
   * Reestablece a 0 las estadísticas almacenadas
   */
  public clear() {
    this.kmAcumuladosAnio =
      this.desnivelAcumuladoAnio =
      this.kmAcumuladosMes =
      this.desnivelAcumuladoMes =
      this.kmAcumuladosSemana =
      this.desnivelAcumuladoSemana =
        0;
  }

  /**
   * Método para actualizar las estadísticas almacenadas
   * @param km - Número de km recorridos en el entrenamiento
   * @param desnivel - Desnivel acumulado en el entrenamiento
   */
  public actualizarEstadisticas(km: number, desnivel: number) {
    const hoy = new Date();
    
    // Obtiene el número de semana, mes y año actual
    const semana = this.getWeekNumber(hoy);
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    // Actualiza los acumulados de km y desnivel para la semana, mes y año
    this.kmAcumuladosSemana += km;
    this.kmAcumuladosMes += km;
    this.kmAcumuladosAnio += km;

    this.desnivelAcumuladoSemana += desnivel;
    this.desnivelAcumuladoMes += desnivel;
    this.desnivelAcumuladoAnio += desnivel;

    // Si se cambió de semana, se reinicia el contador de km y desnivel de la semana
    if (semana !== this.getWeekNumber(new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000))+1) {
      this.kmAcumuladosSemana = 0;
      this.desnivelAcumuladoSemana = 0;
    }

    // Si se cambió de mes, se reinicia el contador de km y desnivel del mes
    if (mes !== new Date(hoy.getTime() - 24 * 60 * 60 * 1000).getMonth() + 1) {
      this.kmAcumuladosMes = 0;
      this.desnivelAcumuladoMes = 0;
    }

    // Si se cambió de año, se reinicia el contador de km y desnivel del año
    if (año !== new Date(hoy.getTime() - 24 * 60 * 60 * 1000).getFullYear()) {
      this.kmAcumuladosAnio = 0;
      this.desnivelAcumuladoAnio = 0;
    }
  }

  /**
   * Método de utilidad que pasandole una fecha devuelve el numero de la semana
   * @param date fecha
   * @returns numero de la semana de la fecha pasada
   */
  private getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
  }
}
