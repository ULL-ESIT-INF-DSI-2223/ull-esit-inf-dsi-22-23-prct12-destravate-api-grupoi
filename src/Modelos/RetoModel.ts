import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { Actividad } from '../Actividad.js';

export interface IRetoData extends Document{
    nombre: string;
    rutas: string[];
    actividad: Actividad;
    total: number;
    usuarios: string[];
  }
  
  const RetoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    rutas: {
        type: [String], 
        required: true 
    },
    actividad: {
        type: String,
        enum: Object.values(Actividad),
        required: true,
    },
    total: {
        type: Number, 
        required: true 
    },
    usuarios: {
        type: [String], 
        required: true 
    },
  });
  
  export const RetoModel = mongoose.model<IRetoData>('Reto', RetoSchema);