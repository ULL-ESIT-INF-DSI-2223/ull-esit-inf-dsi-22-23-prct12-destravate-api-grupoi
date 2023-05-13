import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { Actividad } from '../Actividad.js';
import { RutaDocument } from './RutaModel.js';
import { IRetoData } from './RetoModel.js';
import {IGrupoData} from './GrupoModel.js';

export interface EstadisticasEntrenamiento {
    semana: { km: number; desnivel: number };
    mes: { km: number; desnivel: number };
    anio: { km: number; desnivel: number };
}

export interface IUsuarioDocument extends Document {
    nombre: string;
    actividad: Actividad;
    amigos: IUsuarioDocument["_id"][];
    grupos: IGrupoData["_id"][];
    estadisticas: EstadisticasEntrenamiento;
    rutas: RutaDocument["_id"][];
    retos: IRetoData["_id"][];
    historicoRutas: Map<string, string[]>;
  }
  
  const UsuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    actividad: {
        type: String,
        enum: Object.values(Actividad),
        required: true,
    },
    amigos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario",
        default: [] 
    }],
    grupos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Grupo",
        default: [] 
    }],
    estadisticas: {
      semana: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
      mes: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
      anio: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
    },
    rutas: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ruta", 
        default: [] 
    }],
    retos: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reto", 
        default: [] 
    }],
    historicoRutas: { type: Map, 
        of: [String], 
        default: new Map() 
    },
  });
  
 export const UsuarioModel = model<IUsuarioDocument>('Usuario', UsuarioSchema);