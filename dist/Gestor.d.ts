import { Usuario } from "./Usuario.js";
import { Grupo } from "./Grupo.js";
import { Ruta, IRutaData } from "./Ruta.js";
import { Reto } from "./Reto.js";
import { ResponseType } from "./Types.js";
/**
 * GestorManager - Class that includes all valid Management Operations
 * upon Destravate System
 * @class
 */
export declare class GestorManager {
    private _usuarios;
    private _grupos;
    private _rutas;
    private _retos;
    constructor(usuarios?: Usuario[], grupos?: Grupo[], rutas?: Ruta[], retos?: Reto[]);
    findTrack(query: string, findBy?: string): Promise<boolean>;
    addTrack(newTrack: Ruta): Promise<ResponseType<string>>;
    showTrack(query: string, searchBy?: string): Promise<ResponseType<IRutaData[]>>;
    deleteTrack(query: string, deleteBy?: string): Promise<ResponseType<string>>;
    updateTrack(query: string, newTrack: Ruta, updateBy?: string): Promise<ResponseType<string>>;
}
