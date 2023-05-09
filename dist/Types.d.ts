import { IGrupoData } from "./Grupo.js";
import { IRetoData } from "./Reto.js";
import { IUsuarioData } from "./Usuario.js";
import { IRutaData } from "./Ruta.js";
/**
 * Default ResponseType Express server will emit
 */
export type ResponseType<T> = {
    type: 'add' | 'remove' | 'update' | 'read';
    success: boolean;
    output: IGrupoData[] | IRetoData[] | IUsuarioData[] | IRutaData[] | string | undefined;
    error?: T;
};
