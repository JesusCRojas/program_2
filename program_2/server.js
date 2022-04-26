var express_jesus    = require('express');
var app_jesus        = express_jesus();
var mongoose_jesus   = require('mongoose');
var bodyParser_jesus = require('body-parser');
var multer_jesus     = require('multer');

//
var path_jesus   = require('path');
app_jesus.set('views', path_jesus.resolve(__dirname, 'views'));
var path_jesus_2 = path_jesus.resolve(__dirname, 'public');
app_jesus.use(express_jesus.static(path_jesus_2));

//
app_jesus.set('view engine','ejs');

//
app_jesus.use(bodyParser_jesus.urlencoded({extended:false}));

// Conectándose a la bd que fue creada en la aplicación web de MongoDB cuyo nombre es "program_1_db".
const user_jesus     = 'jesuscr';
const password_jesus = '77206979';
const name_db_jesus  = 'program_1_db';
const url_jesus      = `mongodb+srv://${user_jesus}:${password_jesus}@cluster0.xevem.mongodb.net/${name_db_jesus}?retryWrites=true&w=majority`;
mongoose_jesus.connect(url_jesus, {useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>console.log('Base de datos de MongoDB conectada :).'))
.catch(err=>console.log('No se pudo conectar la BD :(.', err));

// Creación de un esquema y modelo. 
// La palabra "path_archivo" es el nombre del campo por así decirlo y "archivos" es
// el nombre de la tabla (documento) por así decirlo.
var schema_archivo_jesus = new mongoose_jesus.Schema({

    path_archivo: String
})
var model_archivo_jesus  = mongoose_jesus.model('archivos', schema_archivo_jesus);

// Código para mostrar el INDEX.
app_jesus.get('/index',(solicitud_jesus, respuesta_jesus)=>{

    model_archivo_jesus.find((error_jesus , dato_jesus)=>{

        if(error_jesus){
            
            console.log(error_jesus)
        }
        else if(dato_jesus.length>0){

            respuesta_jesus.render('index', {dato_jesus_2: dato_jesus})
        }
        else{

            respuesta_jesus.render('index', {dato_jesus_2: {}})
        }
    })
})

// Código para CARGAR un archivo.
var almacenamiento_archivo_jesus = multer_jesus.diskStorage({

    destination: function(req, file, callback){

        callback(null,'./public/archivos_cargados')
    },

    filename: function(req, file, callback){

        callback(null, file.originalname)
    }
})
var cargar_archivo_jesus = multer_jesus({storage: almacenamiento_archivo_jesus})
app_jesus.post('/cargar_archivo_jesus', cargar_archivo_jesus.single('name_input_seleccionar_archivo'), (solicitud_jesus, respuesta_jesus)=>{

    var temporal = new model_archivo_jesus({
        
        path_archivo: 'archivos_cargados/' + solicitud_jesus.file.originalname
    })
    
    temporal.save((error_jesus, dato_jesus)=>{

        if(error_jesus){

            console.log(error_jesus)
        }

        respuesta_jesus.redirect('/index')
    })
})

// Código para DESCARGAR un archivo.
app_jesus.get('/descargar_archivo_jesus/:id',(solicitud_jesus, respuesta_jesus)=>{

    model_archivo_jesus.find({_id:solicitud_jesus.params.id}, (error_jesus, dato_jesus)=>{

         if(error_jesus){

             console.log(error_jesus)
         }
         else{

             respuesta_jesus.download(__dirname+'/public/'+dato_jesus[0].path_archivo)
         }
    })
})

//
var port  = process.env.PORT || 3000 ;
app_jesus.listen(port,()=>console.log('server running at port'+port))

