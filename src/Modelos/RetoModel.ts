import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { Actividad } from '../Actividad.js';
import { RutaDocument } from './RutaModel.js';
import { IUsuarioDocument } from './UsuarioModel.js';

export interface IRetoData extends Document{
    nombre: string;
    rutas: RutaDocument["_id"][];
    actividad: Actividad;
    total: number;
    usuarios: IUsuarioDocument["_id"][];
  }
  
  const RetoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    rutas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ruta", 
        required: true 
    }],
    actividad: {
        type: String,
        enum: Object.values(Actividad),
        required: true,
    },
    total: {
        type: Number, 
        required: true 
    },
    usuarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", 
        required: true 
    }],
  });
  
  export const RetoModel = mongoose.model<IRetoData>('Reto', RetoSchema);