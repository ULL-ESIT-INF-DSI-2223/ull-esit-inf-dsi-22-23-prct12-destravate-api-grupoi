import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { IUsuarioDocument } from './UsuarioModel.js';
import { RutaDocument } from './RutaModel.js';

/**
 * @interface
 * Interfaz para las estadisticas de entrenamiento
 */
interface EstadisticasEntrenamiento {
    semana: { km: number; desnivel: number };
    mes: { km: number; desnivel: number };
    anio: { km: number; desnivel: number };
}

/**
 * @interface
 * Interfaz para los datos de un grupo
 */
export interface IGrupoData extends mongoose.Document{
    nombre: string;
    miembrosID: IUsuarioDocument["_id"][];
    propietarioID: IUsuarioDocument["_id"];
    estadisticas: EstadisticasEntrenamiento;
    ranking: string[];
    rutasFav: RutaDocument["_id"][];
    historicoRutas: Map<string, string[]>;
  }
  
  
  
const GrupoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    miembrosID: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario",
        required: true 
    }],
    propietarioID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario",
        required: true 
    },
    estadisticas: { 
        type: Object, 
        required: true 
    },
    ranking: { 
        type: [String], 
        required: true 
    },
    rutasFav: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Ruta",
        required: true 
    }],
    historicoRutas: { 
        type: Map, 
        of: [String], 
        required: true 
    }
  });
  
  export const GrupoModel = mongoose.model<IGrupoData>('Grupo', GrupoSchema);