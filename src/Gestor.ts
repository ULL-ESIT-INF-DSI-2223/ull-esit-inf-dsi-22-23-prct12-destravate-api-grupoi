import { Usuario, IUsuarioData } from "./Usuario.js";
import { Grupo, IGrupoData } from "./Grupo.js";
import { Ruta, IRutaData } from "./Ruta.js";
import { Reto, IRetoData } from "./Reto.js";
import { ResponseType } from "./Types.js";
import { MongoClient } from 'mongodb';
import { IRoute } from "express";

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'destravate-app';

/**
 * GestorManager - Class that includes all valid Management Operations
 * upon Destravate System
 * @class
 */
export class GestorManager {
  private _usuarios: Usuario[];
  private _grupos: Grupo[];
  private _rutas: Ruta[];
  private _retos: Reto[];

  constructor(
    usuarios?: Usuario[],
    grupos?: Grupo[],
    rutas?: Ruta[],
    retos?: Reto[]
  ) {
    if (usuarios) { this._usuarios = usuarios; }
    if (grupos) { this._grupos = grupos; }
    if (rutas) { this._rutas = rutas; }
    if (retos) { this._retos = retos; }
  }

  /********************** TRACK OPERATIONS ********************************/

  public async findTrack(query: string, findBy?: string): Promise<boolean> {
    try {
      const client = await MongoClient.connect(dbURL);
      const db = client.db(dbName);
      let found = false;
      if (findBy === 'id' || findBy === undefined) {
        const result = await db.collection<IRutaData>('rutas').findOne({ id: query });
        if (result) { found = true; }
      } else if (findBy === 'nombre') {
        const result = await db.collection<IRutaData>('rutas').findOne({ nombre: query })
        if (result) { found = true; }
      } else {
        throw new Error("Invalid findBy options");
      }
      if (!found) { throw new Error("Not found"); }
      return true;
    } catch (err) {
      return false;
    } 
  }
  
  public async addTrack(newTrack: Ruta): Promise<ResponseType<string>> {
    try {
      const trackExists = await this.findTrack(newTrack.id);
      if (!trackExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        try {
          const result = await db.collection<IRutaData>('rutas').insertOne(newTrack.toJSON());
          return {
            type: 'add',
            success: true,
            output: `La ruta con id ${newTrack.id} ha sido correctamente añadida al sistema`,
          };
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error(`La ruta con id ${newTrack.id} ya existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'add',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }
  
  public async showTrack(query: string, searchBy?: string): Promise<ResponseType<IRutaData[]>> {
    try {
      let result: IRutaData[] | undefined;
      const client = await MongoClient.connect(dbURL);
      const db = client.db(dbName);
  
      if (searchBy === "id" || searchBy === undefined) {
        const data = await db.collection<IRutaData>('rutas').findOne({ id: query });
        if (data) {
          result = [data];
        }
      } else if (searchBy === 'nombre') {
        const data = await db.collection<IRutaData>('rutas').findOne({ nombre: query });
        if (data) {
          result = [data];
        }
      } else if (searchBy === '*') {
        result = await db.collection<IRutaData>('rutas').find().toArray();
      } else {
        throw new Error("Invalid searchBy options");
      }
  
      if (result) {
        return {
          type: 'read',
          success: true,
          output: result
        };
      } else {
        throw new Error("No se ha obtenido un resultado válido");
      }
    } catch (err) {
      return {
        type: 'read',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }

  public async deleteTrack(query: string, deleteBy?: string): Promise<ResponseType<string>> {
    try {
      const trackExists = await this.findTrack(query, deleteBy);
      if (trackExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        try {
          if (deleteBy === 'id' || deleteBy === undefined) {
            const result = await db.collection<IRutaData>('rutas').deleteOne({ id: query });
            return {
              type: 'remove',
              success: true,
              output: `La ruta con id ${query} ha sido correctamente eliminada del sistema`,
            };
          } else if (deleteBy === 'nombre') {
            const result = await db.collection<IRutaData>('rutas').deleteOne({ nombre: query });
            return {
              type: 'remove',
              success: true,
              output: `La ruta con nombre ${query} ha sido correctamente eliminada del sistema`,
            };
          } else {
            throw new Error("Invalid deleteBy options");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error(`La ruta con id o nombre ${query} no existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'remove',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }
 
  public async updateTrack(query: string, newTrack: Ruta, updateBy?: string): Promise<ResponseType<string>> {
    try {
      const trackExists = await this.findTrack(query, updateBy);
      if (trackExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        if (updateBy === 'id') {
          try {
            const resultDelete = await db.collection<IRutaData>('rutas').deleteOne({ id: query });
            const result = await db.collection<IRutaData>('rutas').insertOne(newTrack.toJSON());
            return {
              type: 'update',
              success: true,
              output: `La ruta con id ${query} ha sido correctamente modificada del sistema`,
            };
          } catch (err) {
            throw new Error(err);
          }
        } else if (updateBy === 'nombre') {
          try {
            console.log(newTrack);
            const resultDelete = await db.collection<IRutaData>('rutas').deleteOne({ nombre: query });
            const result = await db.collection<IRutaData>('rutas').insertOne(newTrack.toJSON());
            return {
              type: 'update',
              success: true,
              output: `La ruta con nombre ${query} ha sido correctamente modificada del sistema`,
            };
          } catch (err) {
            throw new Error(err);
          }
        } else { throw new Error("Invalid updateBy options"); }
      } else {
        throw new Error(`La ruta con id o nombre ${query} no existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'update',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }

   /********************** USER OPERATIONS ********************************/

   public async findUser(query: string, findBy?: string): Promise<boolean> {
    try {
      const client = await MongoClient.connect(dbURL);
      const db = client.db(dbName);
      let found = false;
      if (findBy === 'id' || findBy === undefined) {
        const result = await db.collection<IUsuarioData>('users').findOne({ id: query });
        if (result) { found = true; }
      } else if (findBy === 'nombre') {
        const result = await db.collection<IUsuarioData>('users').findOne({ nombre: query })
        if (result) { found = true; }
      } else {
        throw new Error("Invalid findBy options");
      }
      if (!found) { throw new Error("Not found"); }
      return true;
    } catch (err) {
      return false;
    } 
  }
  
  public async addUser(newUser: Usuario): Promise<ResponseType<string>> {
    try {
      const userExists = await this.findTrack(newUser.id);
      if (!userExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        try {
          const result = await db.collection<IUsuarioData>('users').insertOne(newUser.toJSON());
          return {
            type: 'add',
            success: true,
            output: `El usuario con id ${newUser.id} ha sido correctamente añadida al sistema`,
          };
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error(`El usuario con id ${newUser.id} ya existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'add',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }
  
  public async showUser(query: string, searchBy?: string): Promise<ResponseType<IUsuarioData[]>> {
    try {
      let result: IUsuarioData[] | undefined;
      const client = await MongoClient.connect(dbURL);
      const db = client.db(dbName);
  
      if (searchBy === "id" || searchBy === undefined) {
        const data = await db.collection<IUsuarioData>('users').findOne({ id: query });
        if (data) {
          result = [data];
        }
      } else if (searchBy === 'nombre') {
        const data = await db.collection<IUsuarioData>('users').findOne({ nombre: query });
        if (data) {
          result = [data];
        }
      } else if (searchBy === '*') {
        result = await db.collection<IUsuarioData>('users').find().toArray();
      } else {
        throw new Error("Invalid searchBy options");
      }
  
      if (result) {
        return {
          type: 'read',
          success: true,
          output: result
        };
      } else {
        throw new Error("No se ha obtenido un resultado válido");
      }
    } catch (err) {
      return {
        type: 'read',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }

  public async deleteUser(query: string, deleteBy?: string): Promise<ResponseType<string>> {
    try {
      const userExists = await this.findTrack(query, deleteBy);
      if (userExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        try {
          if (deleteBy === 'id' || deleteBy === undefined) {
            const result = await db.collection<IUsuarioData>('rutas').deleteOne({ id: query });
            return {
              type: 'remove',
              success: true,
              output: `El usuario con id ${query} ha sido correctamente eliminado del sistema`,
            };
          } else if (deleteBy === 'nombre') {
            const result = await db.collection<IUsuarioData>('users').deleteOne({ nombre: query });
            return {
              type: 'remove',
              success: true,
              output: `El usuario con nombre ${query} ha sido correctamente eliminado del sistema`,
            };
          } else {
            throw new Error("Invalid deleteBy options");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error(`El usuario con id o nombre ${query} no existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'remove',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }
 
  public async updateUser(query: string, newUser: Usuario, updateBy?: string): Promise<ResponseType<string>> {
    try {
      const userExists = await this.findTrack(query, updateBy);
      if (userExists) {
        const client = await MongoClient.connect(dbURL);
        const db = client.db(dbName);
        if (updateBy === 'id') {
          try {
            const resultDelete = await db.collection<IUsuarioData>('users').deleteOne({ id: query });
            const result = await db.collection<IUsuarioData>('users').insertOne(newUser.toJSON());
            return {
              type: 'update',
              success: true,
              output: `El usuario con id ${query} ha sido correctamente modificado del sistema`,
            };
          } catch (err) {
            throw new Error(err);
          }
        } else if (updateBy === 'nombre') {
          try {
            console.log(newUser);
            const resultDelete = await db.collection<IUsuarioData>('users').deleteOne({ nombre: query });
            const result = await db.collection<IUsuarioData>('users').insertOne(newUser.toJSON());
            return {
              type: 'update',
              success: true,
              output: `El usuario con nombre ${query} ha sido correctamente modificado del sistema`,
            };
          } catch (err) {
            throw new Error(err);
          }
        } else { throw new Error("Invalid updateBy options"); }
      } else {
        throw new Error(`El usuario con id o nombre ${query} no existe en el sistema`);
      }
    } catch (err) {
      return {
        type: 'update',
        success: false,
        output: undefined,
        error: err.message
      };
    }
  }
  
  
  




}
