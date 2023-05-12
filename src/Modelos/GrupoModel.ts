import mongoose, { Document, connect, model, Schema } from 'mongoose';

interface EstadisticasEntrenamiento {
    semana: { km: number; desnivel: number };
    mes: { km: number; desnivel: number };
    anio: { km: number; desnivel: number };
}

export interface IGrupoData extends mongoose.Document{
    nombre: string;
    miembrosID: string[];
    propietarioID: string;
    estadisticas: EstadisticasEntrenamiento;
    ranking: string[];
    rutasFav: string[];
    historicoRutas: Map<string, string[]>;
  }
  
  
  
const GrupoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    miembrosID: { 
        type: [String], 
        required: true 
    },
    propietarioID: { 
        type: String, 
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
    rutasFav: { 
        type: [String], 
        required: true 
    },
    historicoRutas: { 
        type: Map, 
        of: [String], 
        required: true 
    }
  });
  
  export const GrupoModel = mongoose.model<IGrupoData>('Grupo', GrupoSchema);