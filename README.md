# Desarrollo de Sistemas Informáticos 

## **Práctica 12. Destravate: API Node/Express**
#### **Date: 15/05/2023**


## El GitHub Pages se encuentra en el siguiente [link](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoi/).
## El link del vídeo explicativo es el siguiente: [link]()

## Introducción

El objetivo de esta práctica es implementar un API REST con Node/Express para realizar operaciones CRUD (Crear, Leer, Actualizar y Borrar) sobre un sistema de registro de actividades deportivas que se desarrolló en el anterior trabajo grupal.

Se requiere el uso de MongoDB como sistema de base de datos no relacional, y Mongoose para gestionar la base de datos desde Node.js utilizando esquemas. 

Por último, se desplegará la API en cyclic, un servicio de alojamiento de aplicaciones web y APIs en la nube que permite desplegar aplicaciones fácilmente sin tener que preocuparse por la gestión de infraestructuras y servidores.

## Novedades respecto a la entrega anterior

+ Ya no se utiliza inquier
+ La base de datos ya no es un json
+ La clase Gestor ya no es necesaria

## Implementación

### Types.ts

+ Estructura ResponseType: En el fichero Types.ts se encuentra el tipo de respuesta que utiliza nuestra api con express el tipo es el siguiente: 

```ts
export type ResponseType<T> = {
    type: 'add' | 'remove' | 'update' | 'read';
    success: boolean;
    output: IGrupoData[] | IRetoData[] | IUsuarioData[] | IRutaData[] | string | undefined;
    error?: T;
}
```
tiene el tipo de respuesta, si es cuando queremos añadir a la base de datos un elemento(add), si es cuando intentamos eliminar(remove), cuando es para actualizar(update), o para hacer un get (read).
Después está success, que si es true es que la operación ha sido satisfactoria, output para devolver los grupos, retos… y por último si success es false se envía el error que ha sucedido en error.

### App.ts
+ Uso de express

Para usar express para el servidor, en primer lugar se pone la siguiente linea, en el fichero App.ts:
`export const app = express();`

También tendremos que poner la siguiente línea para poder acceder al body de las peticiones:
`app.use(bodyParser.json());`

Después al final del código se pone la siguiente línea para que el servidor esté escuchando en el puerto 3000:
```ts
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
```
Y después debemos de crear para usuarios, grupos, retos y rutas, un get para hacer una petición de la información, un post para subir nuevos usuarios, grupos, retos y rutas un delete y un patch para modificarlos. Para las rutas, se accede a la ruta /tracks, para usuarios /users, para grupos, /groups y para rutas /challenges. Y si se accede a otra ruta se gestiona al final de todo con el siguiente código:

```ts
app.get('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
});
```
Para no estar explicado para cada uno, ya que es prácticamente lo mismo, se explicará para Rutas:
Primero se explicará el post para subir una ruta a la base de datos:
Primero de nada creamos un esquema bastante parecido al que creamos para crear el modelo, y así gracias a Ajv validamos que la información pasada en el body es correcta para subirla a la base de datos:

```ts
const schemaTrack = {
  type: 'object',
  properties: {
      //id: { id: 'string' },
      nombre: { nombre: 'string' },
      inicio: { inicio: 'Geolocalizacion' },
      final: { final: 'Geolocalizacion' },
      longitud: { longitud: 'number' },
      desnivel: { desnivel: 'number' },
      usuarios: { usuarios: 'string[]' },
      actividad: { actividad: 'Actividad' },
      calificacion: { calificacion: 'number' },
  },
  required: [/*'id',*/'nombre','inicio','final','longitud','desnivel','usuarios','actividad','calificacion'],
};
const validateTrack = ajv.compile(schemaTrack);
```

Ahora si podemos explicar las diferentes peticiones https que se pueden realizar a la api

+ Post:

```ts
app.post('/tracks', async (req, res) => {
 
  if (JSON.stringify(req.body) == "{}") {
    const error: ResponseType<string> = {
      type: 'add',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos de la ruta'
    }
    res.status(400).send({ error: error })
  } else {
    const trackData = new RutaModel(req.body);
    const isValid = validateTrack(req.body);
   
    if (isValid) {
      trackData.save().then((RutaGuardada) => {
        res.status(200).send(RutaGuardada);
      }).catch((err) => {
        const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
          type: 'add',
          success: false,
          output: undefined,
          error: err
        };
        res.status(400).send({ error: error });
      });
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

```
Como se puede ver, lo primero que se hace es comprobar que el body no esté vacío, si es asi, se devuelve un error con status 400. Después de esto, se declara un modelo con la información de la ruta y se valida con Ajv, si es válido se guarda en la base de datos con save y se controlan los errores, si no se puede validar, se envía una respuesta con el error y un código 400.


+ Get

```ts
app.get('/tracks', async (req, res) => {
  if (req.query.nombre == undefined && req.query.id == undefined) {
    try{
      const tracks = await RutaModel.find().populate('usuarios', 'nombre');
      res.status(200).send(tracks);
    } catch (err) {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'read',
        success: false,
        output: undefined,
        error: err
      };
      res.status(400).send({ error: error });
    }
  } else {
    if (req.query.nombre) {
      //Por Nombre
      try{
        const nombre = req.query.nombre.toString();
        const tracks = await RutaModel.findOne({nombre: nombre}).populate('usuarios', 'nombre');
        if (tracks != null){
          res.status(200).send(tracks);
        } else{
          const error: ResponseType<string> = {
            type: 'read',
            success: false,
            output: undefined,
            error: "El nombre no coincide con ninguna ruta"
          };
          res.status(400).send({ error: error });
        }
      } catch(err) {
        const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
          type: 'read',
          success: false,
          output: undefined,
          error: err
        };
        res.status(400).send({ error: error });
      }
    } else if (req.query.id) {
      //Por Id
      try{
        const id = req.query.id.toString();
        const tracks = await RutaModel.findById(id).populate('usuarios', 'nombre');
        if (tracks != null){
          res.status(200).send(tracks);
        } else{
          const error: ResponseType<string> = {
            type: 'read',
            success: false,
            output: undefined,
            error: "El id no coincide con ninguna ruta"
          };
          res.status(400).send({ error: error });
        }
      } catch(err) {
        const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
          type: 'read',
          success: false,
          output: undefined,
          error: err
        }
        res.status(400).send({ error: error });
      }
    }
  }
});

```
Lo primero que se comprueba es que se pase un id o un nombre, si no es así se buscan todas las rutas con el find() y se devuelve el json con todas las pistas con un código 200. Como es una promesa, se comprueban los errores al buscar, si falla se recoge el error y se envía un código 400 con el error.
Si no es así, se comprueba que se ha pasado un nombre y si es así se busca por nombre, y se comprueban si se ha devuelto null, esto es que ninguna ruta coincide con el nombre por lo que se envía el error, si no es así se envía la ruta con el código 200.
Si se ha pasado un id, se hace lo mismo que cuando se le pasa un nombre pero buscando por id.

 
+ Delete

```ts
app.delete('/tracks', async (req, res) => {
 
  if (req.query.nombre) {
    //Por Nombre
    const nombre = req.query.nombre.toString();
    RutaModel.deleteOne({nombre: nombre}).then((result) => {
      if(result.deletedCount == 1){
          res.status(200).send(result);
      }else{
        const error: ResponseType<string> = {
          type: 'remove',
          success: false,
          output: undefined,
          error: "El nombre no coincide con ninguna ruta"
        };
        res.status(400).send({ error: error });
      }
    }).catch((err) => {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'remove',
        success: false,
        output: undefined,
        error: err
      };
      res.status(400).send({ error: error });
    });
  } else if (req.query.id) {
    //Por Id
    const id = req.query.id.toString();
    RutaModel.findByIdAndDelete(id).then((result) => {
      if(result != null){
          res.status(200).send(result);
      }else{
        const error: ResponseType<string> = {
          type: 'remove',
          success: false,
          output: undefined,
          error: "El nombre no coincide con ninguna ruta"
        };
        res.status(400).send({ error: error });
      }
    }).catch((err) => {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'remove',
        success: false,
        output: undefined,
        error: err
      };
      res.status(400).send({ error: error });
    });
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

```
En primer lugar se comprueba si se ha pasado un nombre, si no es así, un id, y si no ha recibido ninguno, devuelve el error con el responsetype con código 400.
Si se recibe un nombre, se llama a delteOne con el nombre, si el resultado tiene un deleteCount de 1 quiere decir que se ha eliminado una ruta, por lo que se devuelve una respuesta 200, si no es así, es que no ha encontrado ninguna ruta con ese nombre, por lo que se devuelve el código 400 más el response type con el error. También se controla el error al acceder a la base de datos. Al eliminar con id es lo mismo, pero se utiliza findByIdAndDelete.



+ Patch

```ts
app.patch('/tracks', async (req, res) => {
 
  if (JSON.stringify(req.body) == "{}") {
    const error: ResponseType<string> = {
      type: 'update',
      success: false,
      output: undefined,
      error: 'Debe introducir los datos de la ruta a modificar'
    }
    res.status(400).send({ error: error })
  } else {
    if (req.query.nombre) {
      //Por Nombre
      const nombre = req.query.nombre.toString();
      const aModificar = req.body;
      RutaModel.updateOne({nombre: nombre}, aModificar).then((result) => {
        if(result.modifiedCount >= 1){
            res.status(200).send(result);
        }else{
          const error: ResponseType<string> = {
            type: 'update',
            success: false,
            output: undefined,
            error: "El nombre o el elemento a modificar no coinciden con ninguna ruta"
          };
          res.status(400).send({ error: error });
        }
      }).catch((err) => {
        const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
          type: 'update',
          success: false,
          output: undefined,
          error: err
        };
        res.status(400).send({ error: error });
      });
         
    } else if (req.query.id) {
      //Por Id
      const id = req.query.id.toString();
      const aModificar = req.body;


      RutaModel.findByIdAndUpdate( id, aModificar).then((result) => {
        if(result != null){
          res.status(200).send(result);
      }else{
        const error: ResponseType<string> = {
          type: 'update',
          success: false,
          output: undefined,
          error: "El nombre o el elemento a modificar no coinciden con ninguna ruta"
        };
        res.status(400).send({ error: error });
      }
    }).catch((err) => {
      const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
        type: 'update',
        success: false,
        output: undefined,
        error: err
      };
      res.status(400).send({ error: error });
    });
    } else {
      const error: ResponseType<string> = {
        type: 'update',
        success: false,
        output: undefined,
        error: 'Debe introducir la id o el nombre de la ruta a modificar'
      }
      res.status(400).send({ error: error })
    }
  }
});

```
Es bastante parecida a la estructura de las otras peticiones, primero se comprueba que el body no está vacío, después si se pasa un nombre se llama a update one con el nombre y el body que tendrá un json con lo que se quiere modificar de la ruta. Si se devuelve un modifycount de 1 es que se modificó satisfactoriamente la ruta, pero si no es que no se modificó nada por lo que o el nombre no coincide con ninguna ruta o el json pasado no era correcto. Se hace lo mismo por id, pero por findbyid. 
Si no se pasa ni un id ni un nombre devuelve un error también.



+ Populate

Para realizar el populate, primero debiamos conectar los modelos de esta forma:
` usuarios: IUsuarioDocument["_id"][];`

De esta forma se conectan entre modelos y crean dependencias entre ellos.
```ts
    usuarios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    }],
```

Después de modificar los modelos, en la parte del servidor lo utilizamos de la siguiente forma:
`const tracks = await RutaModel.find().populate('usuarios', 'nombre');`

De esta forma podemos indicarle al modelo de ruta, que coja la variable usuarios y nos muestre aparte del id de los usuarios, el nombre también. Si tenemos más variables que deseamos cambiar se pueden hacer varios populates como en el caso de Usuarios:
`const users = await UsuarioModel.find().populate('rutas', 'nombre').populate('grupos', 'nombre').populate('amigos', 'nombre').populate('retos', 'nombre');`

### Modelos

Para guardar la información que se le pasa a la api, o acceder a la ya guardada, se utiliza Mongoose, y lo primero que tenemos que hacer es definir los modelos. Los modelos se definen dentro de una carpeta llamada Modelos, dentro de src, contendrá en ficheros separados, modelos para guardar con mongoose en la base de datos, los grupos, los regos, las rutas y los usuarios, así como para acceder a ellos, modificarlos y borrar. Como todos son por el estilo, pero cambiando la información que se utiliza, explicaré el de Usuarios:
En primer lugar se ha creado una interfaz para las estadísticas, que tienen el desnivel y los km de la semana, el mes y el año.

```ts
export interface EstadisticasEntrenamiento {
    semana: { km: number; desnivel: number };
    mes: { km: number; desnivel: number };
    anio: { km: number; desnivel: number };
}
```

Ahora sí, para definir el modelo, primero tenemos que crear una interfaz que hereda de Document de mongoose, esta interfaz tiene la información que tiene cada usuario.

```ts
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
```

Una vez hecho esto creamos un esquema que contendrá la información de la interfaz, pero diciendo el tipo, si referencia a alguna sitio, si no se le pasa nada que tendrá por defecto, si es un campo referido o no…

```ts
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
```

Y por último definimos el modelo que se llamará UsuarioModel y que se crea con el esquema y la interfaz creada en los pasos anteriores.

```ts
export const UsuarioModel = model<IUsuarioDocument>('Usuario', UsuarioSchema);
```
Hacemos esto para los grupos, retos y rutas, pero con la información que guarda cada uno.

## Ejemplos de ejecución

### Operación POST

![Ej POST](Assets/Img/rutaPost.png)

![Ej POST DB](Assets/Img/rutaPostDB.png)

### Operación GET

![Ej GET](Assets/Img/rutaGet.png)

### Operación DELETE

![Ej DELETE](Assets/Img/rutaDelete.png)

### Operación PATCH

![Ej PATCH](Assets/Img/rutaPatch.png)

## Pruebas de desarrollo
Para realizar las pruebas con Mocha Chai lo primero que hemos realizado es 
```ts
beforeEach(async () => {
    await UsuarioModel.deleteMany();
    await GrupoModel.deleteMany();
    await RutaModel.deleteMany();
    await RetoModel.deleteMany();
});
```
De esta forma vaciamos la base de datos y así puede ejecutar las pruebas más de una vez sin que haya problemas de dependencias. Vamos a explicar solo como hemos hecho las pruebas de rutas ya que el resto son iguales (grupos, retos y usuarios). Las pruebas están divididas en POST, DELETE, GET y PATCH:

+ POST
```ts
describe('POST /tracks', () => {
    it('Should successfully create a new route', async () => {
        await request(app).post('/tracks').send({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        }).expect(200);
    });
});
```
En esta prueba simplemente creamos una nueva ruta y nos aseguramos que todo funcione correctamente.

+ DELETE
```ts
describe('DELETE /tracks', () => {
    it('Should successfully delete a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        });
        const savedRoute = await newRoute.save();

        await request(app)
            .delete('/tracks')
            .query({ id: savedRoute.id })
            .expect(200);
    });

    it('Should return an error when no id is provided', async () => {
        await request(app).delete('/tracks').expect(400);
    });
});
```
La primera prueba se asegura de eliminar un nuevo usuario sin problema y la segunda es para comprobar que haya un error cuando no se introduce ningún id.

+ GET
```ts
describe('GET /tracks', () => {
    it('Should successfully get all routes', async () => {
        await request(app).get('/tracks').expect(200);
    });

    it('Should successfully get a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        });
        const savedRoute = await newRoute.save();

        await request(app)
            .get('/tracks')
            .query({ id: savedRoute.id })
            .expect(200);
    });

    it('Should return an error when no route is found by id', async () => {
        await request(app)
            .get('/tracks')
            .query({ id: 'non-existent-id' })
            .expect(400);
    });
});
```
Aquí nos aseguramos primero de que muestre todas las rutas con éxito, luego creamos una ruta y que enseñe toda la información de esa ruta recién creada. Al final comprobamos que muestre un error si no se encuentra ninguna ruta con un id inexistente.

+ PATCH
```ts
describe('PATCH /tracks', () => {
    it('Should successfully update a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
            "latitud": 40.7128,
            "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
            });
            const savedRoute = await newRoute.save();
            await request(app)
            .patch('/tracks')
            .query({ id: savedRoute.id })
            .send({
                "nombre": "Ruta Actualizada",
                "inicio": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "final": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "longitud": 10,
                "desnivel": 200,
                "usuarios": [],
                "actividad": "Correr",
                "calificacion": 5
            })
            .expect(200);
    });
    
    it('Should return an error when no id is provided', async () => {
        await request(app).patch('/tracks').expect(400);
    });
    
    it('Should return an error when no route is found by id', async () => {
        await request(app)
            .patch('/tracks')
            .query({ id: "idnoexistente" })
            .send({
                "nombre": "Ruta Actualizada",
                "inicio": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "final": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "longitud": 10,
                "desnivel": 200,
                "usuarios": [],
                "actividad": "Correr",
                "calificacion": 5
            })
            .expect(400);
    });
});
```
Primera prueba modifica una ruta por el id y lo hace con éxito. Después comprueba que si no se introduce un id, devuelve un error. La última prueba es introducir un id no existente y asegurarse de que muestre un error.
Para el resto de clases funciona de la misma manera todos.

### Ejecución pruebas
<p align="center">
    <img width="602" alt="1" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoi/assets/117380181/86035b7c-3ebb-4fdb-978b-db5bd46014ca">
</p>

<p align="center">
    <img width="338" alt="2" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoi/assets/117380181/e90fde22-ff31-4b98-a3ff-e54fbea08120">
</p>

<p align="center">
    <img width="310" alt="3" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoi/assets/117380181/16d7bd6f-1dbc-4811-93c1-16f64af5730d">
</p>

### GitHub Actions
<p align="center">
<img width="656" alt="image" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoi/assets/117380181/0716e6fa-6763-41d5-908e-d1accbe4f7bd">
</p>

## Despliegue

Para el proceso de despliegue del API REST se requería crear un clúster en MongoDB Atlas.

El primer paso fue registrarse en MongoDB Atlas y crear una organización y un proyecto. Luego, se creó un clúster compartido con el proveedor de servicios en la nube de AWS . 

![Ej Clúster](Assets/Img/mongodb.png)

Una vez creado el clúster se generó una URL de conexión con el nombre de usuario y contraseña de un usuario con permisos de lectura y modificación sobre la base de datos.

Esta URL se almacenó en una variable de entorno dentro de la plataforma Cyclic para el despliegue de API’s. 

Para el despliegue sobre esta plataforma fue necesario añadir dos script: build y start al package.json del proyecto, crear una cuenta en la plataforma y por último enlazar el repositorio público de la API.

Como resultado obtuvimos una URL (https://vast-gold-brown-bear-suit.cyclic.app/) correspondiente a un servidor siempre operativo a través del cuál podremos hacer peticiones HTTP, por ejemplo, mediante el uso de ThunderClient.

![Ej Cyclic](Assets/Img/cyclic.png)

## Conclusión
En esta práctica hemos podido juntar todo lo que hemos aprendido durante el curso y poder desplegar una API creada de 0 por nosotros.

## Referencias

* [Enunciado Práctica](https://ull-esit-inf-dsi-2223.github.io/prct12-destravate-api/)
* [Cyclic](https://www.cyclic.sh/)
* [MongoDB](https://www.mongodb.com/cloud/atlas/)
* [Mongoose](https://mongoosejs.com/)
* [Ajv Scheme Validator](https://ajv.js.org/guide/typescript.html/)
* [Despliegue API](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-deployment.html/)
