import express from 'express';
import bodyParser from 'body-parser';
import { GestorManager } from './Gestor.js';
import { ResponseType } from './Types.js';
import { Actividad } from './Actividad.js';
import { IRutaData, Ruta, Geolocalizacion } from './Ruta.js';
import { IGrupoData } from './Grupo.js';
import { IRetoData } from './Reto.js';
import { IUsuarioData, Usuario } from './Usuario.js';

import Ajv from 'ajv';
import { Grupo } from './Grupo.js';
import { Reto } from './Reto.js';


export const app = express();
const ajv = new Ajv();

/**
 * Esto permite analizar el body en formato json
 */
app.use(bodyParser.json());


/**********************RUTAS********************************/

/**
 * Esquema para validar JSON's de rutas
 */
const schemaTrack = {
  type: 'object',
  properties: {
      id: { id: 'string' },
      nombre: { nombre: 'string' },
      inicio: { inicio: 'Geolocalizacion' },
      final: { final: 'Geolocalizacion' },
      longitud: { longitud: 'number' },
      desnivel: { desnivel: 'number' },
      usuarios: { usuarios: 'string[]' },
      actividad: { actividad: 'Actividad' },
      calificacion: { calificacion: 'number' },
  },
  required: ['id','nombre','inicio','final','longitud','desnivel','usuarios','actividad','calificacion'],
};
const validateTrack = ajv.compile(schemaTrack);

/**
 * Lista un track
 */
app.get('/tracks', async (req, res) => {
  const gestor = new GestorManager();
  if (req.query.nombre === "*" || req.query.id === "*") {
    try {
      const result = await gestor.showTrack("", "*");
      res.send({ response: result });
    } catch (err) {
      res.status(500).send({ error: err});
    }
  } else {
    if (req.query.nombre) {
      //Por Nombre
      const nombre = req.query.nombre.toString();
      try {
        const result = await gestor.showTrack(nombre, "nombre");
        res.send({ response: result });
      } catch (err) {
        res.status(500).send({ error: err});
      }
    } else if (req.query.id) {
      //Por Id
      const id = req.query.id.toString();
      try {
        const result = await gestor.showTrack(id, "id");
        res.send({ response: result });
      } catch (err) {
        res.status(500).send({ error: err});
      }
    } else {
      const outputError: ResponseType<string> = {
        type: 'read',
        success: false,
        output: undefined,
        error: 'Un nombre o un id deben ser introducidos'
      }
      res.status(400).send({ error: outputError })
    }
  }
});

/**
 * Añade un track
 */
app.post('/tracks', async (req, res) => {
  if (!req.body) {
    const error: ResponseType<string> = {
      type: 'add',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos de la ruta'
    }
    res.status(400).send({ error: error })
  } else {
    const gestor = new GestorManager();
    const trackData: IRutaData = req.body;
    const isValid = validateTrack(req.body);
    const geo: Geolocalizacion = {
      latitud: 0,
      longitud: 0
    };
    
    if (isValid) {
      const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0, true).parse(trackData);
      try {
        const result = await gestor.addTrack(newTrack);
        res.send({ response: result });
      } catch (err) {
        res.status(500).json({ error: err});
      }
    } else {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'add',
        success: false,
        output: undefined,
        error: validateTrack.errors
      };
      res.status(400).send({ error: error });
    }
  }
});

/**
 * Elimina un track
 */
app.delete('/tracks', async (req, res) => {
  const gestor = new GestorManager();
  if (req.query.nombre) {
    //Por Nombre
    const nombre = req.query.nombre.toString();
    try {
      const result = await gestor.deleteUser(nombre, "nombre");
      res.send({ response: result });
    } catch (err) {
      res.status(500).send({ error: err});
    }
  } else if (req.query.id) {
    //Por Id
    const id = req.query.id.toString();
    try {
      const result = await gestor.deleteUser(id, "id");
      res.send({ response: result });
    } catch (err) {
      res.status(500).send({ error: err});
    }
  } else {
    const outputError: ResponseType<string> = {
      type: 'remove',
      success: false,
      output: undefined,
      error: 'Un nombre o un id deben ser introducidos'
    }
    res.status(400).send({ error: outputError })
  }  
});

/**
 * Modifica una ruta
 */
app.patch('/tracks', async (req, res) => {
  if (!req.body) {
    const error: ResponseType<string> = {
      type: 'update',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos de la ruta a modificar'
    }
    res.status(400).send({ error: error })
  } else {
    const isValid = validateTrack(req.body);
    const rutaData: IRutaData = req.body;
    if (isValid) {
      const gestor = new GestorManager();
      const geo: Geolocalizacion = {
        latitud: 0,
        longitud: 0
      };
    
      if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0).parse(rutaData);
        try {
          const result = await gestor.updateTrack(nombre, newTrack, "nombre");
          res.send({ response: result });
        } catch (err) {
          res.status(500).send({ error: err});
        }
          
      } else if (req.query.id) {
        //Por Id
        const id = req.query.id.toString();
        const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0).parse(rutaData);
        try {
          const result = await gestor.updateTrack(id, newTrack, "id");
          res.send({ response: result });
        } catch (err) {
          res.status(500).send({ error: err});
        }
      } else { 
        const error: ResponseType<string> = {
          type: 'update',
          success: false,
          output: undefined,
          error: 'Debe introducir la id o el nombre de la ruta a modificar'
        }
        res.status(400).send({ error: error })
      }
    } else {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'update',
        success: false,
        output: undefined,
        error: validateTrack.errors
      };
      res.status(400).json({error: error});
    } 
  }
});

/**********************USUARIOS********************************/
/**
 * Schema to validate json files
 */
const schema_user = {
  type: 'object',
  properties: {
      id: { id: 'string' },
      nombre: { nombre: 'string' },
      actividad: { actividad: 'Actividad' },
      amigos: { amigos: 'string[]' },
      grupos: { grupos: 'string[]' },
      estadisticas: { estadisticas: 'EstadisticasEntrenamiento' },
      rutas: { rutas: 'string[]' },
      retos: { retos: 'string[]' },
      historicoRutas: { historicoRutas: 'Map<string, string[]>' },
  },
  required: ['id','nombre','actividad','amigos','grupos','estadisticas','rutas','retos','historicoRutas'],
};
const validateUser = ajv.compile(schema_user);

/**
 * Añade un usuario
 */
app.post('/users', async (req, res) => {
  if (!req.body) {
    const error: ResponseType<string> = {
      type: 'add',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos del usuario'
    }
    res.status(400).send({ error: error })
  } else {
    const gestor = new GestorManager();
    const userData: IUsuarioData = req.body;
    const isValid = validateUser(req.body);
    const geo: Geolocalizacion = {
      latitud: 0,
      longitud: 0
    };
    
    if (isValid) {
      const newUser = new Usuario("").parse(userData);
      try {
        const result = await gestor.addUser(newUser);
        res.send({ response: result });
      } catch (err) {
        res.status(500).json({ error: err});
      }
    } else {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'add',
        success: false,
        output: undefined,
        error: validateUser.errors
      };
      res.status(400).send({ error: error });
    }
  }
});

/**
 * Elimina un usuario
 */
app.delete('/users', async (req, res) => {
  const gestor = new GestorManager();
  if (req.query.nombre) {
    //Por Nombre
    const nombre = req.query.nombre.toString();
    try {
      const result = await gestor.deleteUser(nombre, "nombre");
      res.send({ response: result });
    } catch (err) {
      res.status(500).send({ error: err});
    }
  } else if (req.query.id) {
    //Por Id
    const id = req.query.id.toString();
    try {
      const result = await gestor.deleteUser(id, "id");
      res.send({ response: result });
    } catch (err) {
      res.status(500).send({ error: err});
    }
  } else {
    const outputError: ResponseType<string> = {
      type: 'remove',
      success: false,
      output: undefined,
      error: 'Un nombre o un id deben ser introducidos'
    }
    res.status(400).send({ error: outputError })
  }  
});

/**
 * Modifica un usuario
 */
app.patch('/users', async (req, res) => {
  if (!req.body) {
    const error: ResponseType<string> = {
      type: 'update',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos del usuario a modificar'
    }
    res.status(400).send({ error: error })
  } else {
    const isValid = validateUser(req.body);
    const userData: IUsuarioData = req.body;
    if (isValid) {
      const gestor = new GestorManager();
      const geo: Geolocalizacion = {
        latitud: 0,
        longitud: 0
      };
    
      if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        const newUser = new Usuario("").parse(userData);
        try {
          const result = await gestor.updateUser(nombre, newUser, "nombre");
          res.send({ response: result });
        } catch (err) {
          res.status(500).send({ error: err});
        }
          
      } else if (req.query.id) {
        //Por Id
        const id = req.query.id.toString();
        const newUser = new Usuario("").parse(userData);
        try {
          const result = await gestor.updateUser(id, newUser, "id");
          res.send({ response: result });
        } catch (err) {
          res.status(500).send({ error: err});
        }
      } else { 
        const error: ResponseType<string> = {
          type: 'update',
          success: false,
          output: undefined,
          error: 'Debe introducir la id o el nombre del usuario a modificar'
        }
        res.status(400).send({ error: error })
      }
    } else {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'update',
        success: false,
        output: undefined,
        error: validateUser.errors
      };
      res.status(400).json({error: error});
    } 
  }
});

















/**
 * Default route that returns 404 Not Found
 */
app.get('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
});

/**
 * Server listening port 3000
 */
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});