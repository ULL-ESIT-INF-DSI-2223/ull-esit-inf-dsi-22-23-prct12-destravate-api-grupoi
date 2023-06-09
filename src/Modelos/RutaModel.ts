import mongoose, { Document, connect, model, Schema } from 'mongoose';
import { Geolocalizacion } from '../Ruta.js';
import { Actividad } from '../Actividad.js';
import { IUsuarioDocument } from './UsuarioModel.js';

/**
 * @interface
 * Interfaz para los datos de una ruta
 */
export interface RutaDocument extends mongoose.Document {
    nombre: string;
    inicio: Geolocalizacion;
    final: Geolocalizacion;
    longitud: number;
    desnivel: number;
    usuarios: IUsuarioDocument["_id"][];
    actividad: Actividad;
    calificacion: number;
  }
  
export const RutaSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true,
    },
    inicio: {
      type: {
        latitud: Number,
        longitud: Number,
      },
      required: true,
    },
    final: {
      type: {
        latitud: Number,
        longitud: Number,
      },
      required: true,
    },
    longitud: {
      type: Number,
      required: true,
    },
    desnivel: {
      type: Number,
      required: true,
    },
    usuarios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    }],
    actividad: {
      type: String,
      enum: Object.values(Actividad),
      required: true,
    },
    calificacion: {
      type: Number,
      required: true,
    },
});
  
export const RutaModel = mongoose.model<RutaDocument>('Ruta', RutaSchema);