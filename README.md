# Tarea matcon

Se tiene la necesidad de visualizar contenido de manera desconectada (offline) en una aplicación móvil para los sistemas operativos Android o iOS, ya que su cliente cuenta con ambos sistemas. Además, los recursos que consume la aplicación son: títulos en textos, párrafos, párrafos con Látex; además de multimedias como: imágenes, videos, pdf, geogebra; También se deberán poder descargar al móvil archivos editables de: word, excel y power point. El que se lea el contenido offline, es porque sus clientes están en zonas sin internet, por lo tanto debe poder descargarlo y luego trabajar con el contenido de manera desconectada.

## Features
Este es un listado con todos los features de la aplicación:

- [x]  La aplicación se debe conectar a *Firebase* para recuperar la información almacenada y desplegarla en la aplicación móvil
- [ ]  Si hay alguna actualización en Firebase debe actualizar lo que ya se ha descargado.
    
    * esto no se logra de manera automática, hay que volver a descargar el recurso. Para lograrlo de manera automática, mi primera aproximación sería ocupar un patrón de subscripción, en el cual estemos suscritos a los cambios que ocurren en la collección de documentos de firestore, y en el momento en que se genere un cambio, volvemos a descargar el recurso y hacer el update en el Storage.
  

- [x]  La imágen disponible en el recurso de *Firebase*, se debe descargar en el teléfono para poder visualizarlo *offline*.
- [x]  El párrafo en *Látex* debe poder mostrarse una vez es procesado.
- [x]  La base de datos en *firebase* para los textos incluye campos con texto en inglés y español pero solo será necesario desplegar los textos en español.
- [x]  la aplicación logra obtener el contenido de la base de datos, y es posible verlo en la aplicación cuando no está conectado a internet.

## Installation

El desarrollo de la App se hizo utilizando Expo y el simulador de iOS.

Para instalar las dependencias:
``` 
yarn install
```

Para iniciar la aplicación:

```
npx expo start
```

para iniciar el emulador de iOS debemos apretar la tecla `i`.

las credenciales de firebase deben ir en el root, en un archivo json `firebaseCredentials.json`. Aquí te dejo un ejemplo:
```
{
    "apiKey": "your_api_key",
    "authDomain": "yourdomain.firebaseapp.com",
    "projectId": "projectid-123",
    "storageBucket": "your_storage_bucket.com",
    "messagingSenderId": "012345678",
    "appId": "appId",
    "measurementId": "some_measurment_id"
}

```



## Usage

Describe how to use the project.

## Offline Test

Si bien los recursos se guardan en el teléfono para poder revisarlos sin tener que depender de la conexión, no logré testear de manera 100% offline la aplicación, solo pude emularla.

Hay dos formas para comprobar que los recursos que se descargan se guardan en la memoria del teléfono:

1.  Descargar un recurso, modificar sus datos en firebase, refrescar el emulador y comparar la versión que viene de la API (actualizada) de la que está guardada en el teléfono (antigua).
2. Descargar un recurso, bloquear la llamada a la API de firebase (comentando el código), refrescar el emulador, y comprobar que los recursos en la pantalla Offline se mantienen ahí.

## Video

El video muestra que se logra obtener el contenido de la base de datos, y se demuestra el testing offline descrito en la sección anterior.

[link al video](https://www.loom.com/share/3dd72ebe496a4f27a289ca830f736222)
