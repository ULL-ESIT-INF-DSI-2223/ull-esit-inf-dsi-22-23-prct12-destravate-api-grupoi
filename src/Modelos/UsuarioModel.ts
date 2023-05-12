import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { Actividad } from '../Actividad.js';

export interface EstadisticasEntrenamiento {
    semana: { km: number; desnivel: number };
    mes: { km: number; desnivel: number };
    anio: { km: number; desnivel: number };
}

interface IUsuarioDocument extends Document {
    nombre: string;
    actividad: Actividad;
    amigos: string[];
    grupos: string[];
    estadisticas: EstadisticasEntrenamiento;
    rutas: string[];
    retos: string[];
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
    amigos: { 
        type: [String], 
        default: [] 
    },
    grupos: { 
        type: [String], 
        default: [] 
    },
    estadisticas: {
      semana: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
      mes: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
      anio: { km: { type: Number, default: 0 }, desnivel: { type: Number, default: 0 } },
    },
    rutas: { 
        type: [String], 
        default: [] 
    },
    retos: { 
        type: [String], 
        default: [] 
    },
    historicoRutas: { type: Map, 
        of: [String], 
        default: new Map() 
    },
  });
  
 export const UsuarioModel = model<IUsuarioDocument>('Usuario', UsuarioSchema);