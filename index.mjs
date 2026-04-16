import http from 'node:http'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { access, constants } from 'node:fs/promises';

const app = http.createServer(async(peticion, respuesta)=>{
    console.log("Petición recibida")
    if(peticion.method === 'GET'){
        if(peticion.url === '/usuarios'){
            try{
                const respuestaApi = await fetch('https://api.escuelajs.co/api/v1/users')
                const datosApi = await respuestaApi.text()
                await fsp.writeFile(path.join('./datosApi.json'), datosApi)
                respuesta.statusCode = 201
                /*const datos = await respuestaApi.json()
                const datosString = await JSON.stringify(JSON.parse(datos))
                console.log(datos)*/

                //Leer y mandarselo al cliente
                return respuesta.end(datosApi)
            }catch(e){
                respuesta.statusCode = 50
                return respuesta.end('Error en el servidor')
            }
        }
        else if(peticion.url === '/usuarios/filtrados'){
            try{
                await fsp.access('.datosApi.json', fsp.constants.F_OK)
                //Logica para filtrar
                respuesta.end('¡Datos filtrados!')
            }
            catch(e){
                respuesta.end('Acceda primero a ./usuarios')
            }
            
        }
    }
    respuesta.statusCode = 404
    return respuesta.end('Recurso no encontrado')
})

app.listen(3000, ()=>{
    console.log('Servidor corriendo en https://localhost:3000')
})