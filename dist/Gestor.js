import { MongoClient } from 'mongodb';
const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'destravate-app';
/**
 * GestorManager - Class that includes all valid Management Operations
 * upon Destravate System
 * @class
 */
export class GestorManager {
    _usuarios;
    _grupos;
    _rutas;
    _retos;
    constructor(usuarios, grupos, rutas, retos) {
        if (usuarios) {
            this._usuarios = usuarios;
        }
        if (grupos) {
            this._grupos = grupos;
        }
        if (rutas) {
            this._rutas = rutas;
        }
        if (retos) {
            this._retos = retos;
        }
    }
    /********************** TRACK OPERATIONS ********************************/
    async findTrack(query, findBy) {
        try {
            const client = await MongoClient.connect(dbURL);
            const db = client.db(dbName);
            let found = false;
            if (findBy === 'id' || findBy === undefined) {
                const result = await db.collection('rutas').findOne({ id: query });
                if (result) {
                    found = true;
                }
            }
            else if (findBy === 'nombre') {
                const result = await db.collection('rutas').findOne({ nombre: query });
                if (result) {
                    found = true;
                }
            }
            else {
                throw new Error("Invalid findBy options");
            }
            if (!found) {
                throw new Error("Not found");
            }
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async addTrack(newTrack) {
        try {
            const trackExists = await this.findTrack(newTrack.id);
            if (!trackExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                try {
                    const result = await db.collection('rutas').insertOne(newTrack.toJSON());
                    return {
                        type: 'add',
                        success: true,
                        output: `La ruta con id ${newTrack.id} ha sido correctamente añadida al sistema`,
                    };
                }
                catch (err) {
                    throw new Error(err);
                }
            }
            else {
                throw new Error(`La ruta con id ${newTrack.id} ya existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'add',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async showTrack(query, searchBy) {
        try {
            let result;
            const client = await MongoClient.connect(dbURL);
            const db = client.db(dbName);
            if (searchBy === "id" || searchBy === undefined) {
                const data = await db.collection('rutas').findOne({ id: query });
                if (data) {
                    result = [data];
                }
            }
            else if (searchBy === 'nombre') {
                const data = await db.collection('rutas').findOne({ nombre: query });
                if (data) {
                    result = [data];
                }
            }
            else if (searchBy === '*') {
                result = await db.collection('rutas').find().toArray();
            }
            else {
                throw new Error("Invalid searchBy options");
            }
            if (result) {
                return {
                    type: 'read',
                    success: true,
                    output: result
                };
            }
            else {
                throw new Error("No se ha obtenido un resultado válido");
            }
        }
        catch (err) {
            return {
                type: 'read',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async deleteTrack(query, deleteBy) {
        try {
            const trackExists = await this.findTrack(query, deleteBy);
            if (trackExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                try {
                    if (deleteBy === 'id' || deleteBy === undefined) {
                        const result = await db.collection('rutas').deleteOne({ id: query });
                        return {
                            type: 'remove',
                            success: true,
                            output: `La ruta con id ${query} ha sido correctamente eliminada del sistema`,
                        };
                    }
                    else if (deleteBy === 'nombre') {
                        const result = await db.collection('rutas').deleteOne({ nombre: query });
                        return {
                            type: 'remove',
                            success: true,
                            output: `La ruta con nombre ${query} ha sido correctamente eliminada del sistema`,
                        };
                    }
                    else {
                        throw new Error("Invalid deleteBy options");
                    }
                }
                catch (err) {
                    throw new Error(err);
                }
            }
            else {
                throw new Error(`La ruta con id o nombre ${query} no existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'remove',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async updateTrack(query, newTrack, updateBy) {
        try {
            const trackExists = await this.findTrack(query, updateBy);
            if (trackExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                if (updateBy === 'id') {
                    try {
                        const resultDelete = await db.collection('rutas').deleteOne({ id: query });
                        const result = await db.collection('rutas').insertOne(newTrack.toJSON());
                        return {
                            type: 'update',
                            success: true,
                            output: `La ruta con id ${query} ha sido correctamente modificada del sistema`,
                        };
                    }
                    catch (err) {
                        throw new Error(err);
                    }
                }
                else if (updateBy === 'nombre') {
                    try {
                        console.log(newTrack);
                        const resultDelete = await db.collection('rutas').deleteOne({ nombre: query });
                        const result = await db.collection('rutas').insertOne(newTrack.toJSON());
                        return {
                            type: 'update',
                            success: true,
                            output: `La ruta con nombre ${query} ha sido correctamente modificada del sistema`,
                        };
                    }
                    catch (err) {
                        throw new Error(err);
                    }
                }
                else {
                    throw new Error("Invalid updateBy options");
                }
            }
            else {
                throw new Error(`La ruta con id o nombre ${query} no existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'update',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    /********************** USER OPERATIONS ********************************/
    async findUser(query, findBy) {
        try {
            const client = await MongoClient.connect(dbURL);
            const db = client.db(dbName);
            let found = false;
            if (findBy === 'id' || findBy === undefined) {
                const result = await db.collection('users').findOne({ id: query });
                if (result) {
                    found = true;
                }
            }
            else if (findBy === 'nombre') {
                const result = await db.collection('users').findOne({ nombre: query });
                if (result) {
                    found = true;
                }
            }
            else {
                throw new Error("Invalid findBy options");
            }
            if (!found) {
                throw new Error("Not found");
            }
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async addUser(newUser) {
        try {
            const userExists = await this.findTrack(newUser.id);
            if (!userExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                try {
                    const result = await db.collection('users').insertOne(newUser.toJSON());
                    return {
                        type: 'add',
                        success: true,
                        output: `El usuario con id ${newUser.id} ha sido correctamente añadida al sistema`,
                    };
                }
                catch (err) {
                    throw new Error(err);
                }
            }
            else {
                throw new Error(`El usuario con id ${newUser.id} ya existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'add',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async showUser(query, searchBy) {
        try {
            let result;
            const client = await MongoClient.connect(dbURL);
            const db = client.db(dbName);
            if (searchBy === "id" || searchBy === undefined) {
                const data = await db.collection('users').findOne({ id: query });
                if (data) {
                    result = [data];
                }
            }
            else if (searchBy === 'nombre') {
                const data = await db.collection('users').findOne({ nombre: query });
                if (data) {
                    result = [data];
                }
            }
            else if (searchBy === '*') {
                result = await db.collection('users').find().toArray();
            }
            else {
                throw new Error("Invalid searchBy options");
            }
            if (result) {
                return {
                    type: 'read',
                    success: true,
                    output: result
                };
            }
            else {
                throw new Error("No se ha obtenido un resultado válido");
            }
        }
        catch (err) {
            return {
                type: 'read',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async deleteUser(query, deleteBy) {
        try {
            const userExists = await this.findTrack(query, deleteBy);
            if (userExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                try {
                    if (deleteBy === 'id' || deleteBy === undefined) {
                        const result = await db.collection('rutas').deleteOne({ id: query });
                        return {
                            type: 'remove',
                            success: true,
                            output: `El usuario con id ${query} ha sido correctamente eliminado del sistema`,
                        };
                    }
                    else if (deleteBy === 'nombre') {
                        const result = await db.collection('users').deleteOne({ nombre: query });
                        return {
                            type: 'remove',
                            success: true,
                            output: `El usuario con nombre ${query} ha sido correctamente eliminado del sistema`,
                        };
                    }
                    else {
                        throw new Error("Invalid deleteBy options");
                    }
                }
                catch (err) {
                    throw new Error(err);
                }
            }
            else {
                throw new Error(`El usuario con id o nombre ${query} no existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'remove',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
    async updateUser(query, newUser, updateBy) {
        try {
            const userExists = await this.findTrack(query, updateBy);
            if (userExists) {
                const client = await MongoClient.connect(dbURL);
                const db = client.db(dbName);
                if (updateBy === 'id') {
                    try {
                        const resultDelete = await db.collection('users').deleteOne({ id: query });
                        const result = await db.collection('users').insertOne(newUser.toJSON());
                        return {
                            type: 'update',
                            success: true,
                            output: `El usuario con id ${query} ha sido correctamente modificado del sistema`,
                        };
                    }
                    catch (err) {
                        throw new Error(err);
                    }
                }
                else if (updateBy === 'nombre') {
                    try {
                        console.log(newUser);
                        const resultDelete = await db.collection('users').deleteOne({ nombre: query });
                        const result = await db.collection('users').insertOne(newUser.toJSON());
                        return {
                            type: 'update',
                            success: true,
                            output: `El usuario con nombre ${query} ha sido correctamente modificado del sistema`,
                        };
                    }
                    catch (err) {
                        throw new Error(err);
                    }
                }
                else {
                    throw new Error("Invalid updateBy options");
                }
            }
            else {
                throw new Error(`El usuario con id o nombre ${query} no existe en el sistema`);
            }
        }
        catch (err) {
            return {
                type: 'update',
                success: false,
                output: undefined,
                error: err.message
            };
        }
    }
}
