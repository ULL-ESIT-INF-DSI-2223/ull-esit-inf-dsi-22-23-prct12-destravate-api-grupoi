/**
 * Clase que representa las estadística de un entrenamiento
 * @class
 */
export declare class EstadisticasEntrenamiento {
    private kmAcumuladosSemana;
    private desnivelAcumuladoSemana;
    private kmAcumuladosMes;
    private desnivelAcumuladoMes;
    private kmAcumuladosAnio;
    private desnivelAcumuladoAnio;
    /**
     * Constructor de la clase EstadisticasEntrenamiento
     */
    constructor();
    /**
     * Retorna las estadísticas de la semana actual
     * @returns - Objeto con los km y desnivel acumulados en la semana actual
     */
    obtenerEstadisticasSemana(): {
        km: number;
        desnivel: number;
    };
    /**
     * Retorna las estadísticas del mes actual
     * @returns - Objeto con los km y desnivel acumulados en el mes actual
     */
    obtenerEstadisticasMes(): {
        km: number;
        desnivel: number;
    };
    /**
     * Retorna las estadísticas del año actual
     * @returns - Objeto con los km y desnivel acumulados en el año actual
     */
    obtenerEstadisticasAnio(): {
        km: number;
        desnivel: number;
    };
    /**
     * Reestablece a 0 las estadísticas almacenadas
     */
    clear(): void;
    /**
     * Método para actualizar las estadísticas almacenadas
     * @param km - Número de km recorridos en el entrenamiento
     * @param desnivel - Desnivel acumulado en el entrenamiento
     */
    actualizarEstadisticas(km: number, desnivel: number): void;
    /**
     * Método de utilidad que pasandole una fecha devuelve el numero de la semana
     * @param date fecha
     * @returns numero de la semana de la fecha pasada
     */
    private getWeekNumber;
}
