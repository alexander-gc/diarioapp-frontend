//URL para hacer las peticiones fetch. Backend subido en Heroku.
var url = 'https://diario-app-alex.herokuapp.com/api/diario'

//En este array se guardarán todos los registros. Luego podré usarlo con los métodos push, map, for, etc.
var dataRegistros = [];

async function obtenerData() {

    //Petición GET.
    var dataLista;
    await fetch(url)
    .then(response => response.json())
    .then(data => dataLista = data);
    
    //Este ciclo 'for' llenará el array dataRegistros. Para que luego se pueda recorrer ese array con el map.
    for (var i = 0; i < dataLista.registros.length; i++) {  
        dataRegistros.push( dataLista.registros[i]);
    }
    
    //Por cada registro individual que existe en el array de registros, lo recorrerá para mostrarlo con uso del DOM.
    dataRegistros.map(
        data => {
            //En el HTML, se agregará un atributo 'tr' con sus hijos 'td'
            var padreTr = document.createElement('tr');

            var fechaTd = document.createElement('td')
            var fechaText = document.createTextNode(`${data.fecha}`);
            fechaTd.appendChild(fechaText);

            var sentTd = document.createElement('td')
            var sentText = document.createTextNode(data.sentimiento);
            sentTd.appendChild(sentText);

            var descTd = document.createElement('td')
            var descText = document.createTextNode(data.descripcion);
            descTd.appendChild(descText);

            var imgTd = document.createElement('td');
            var imgValue = document.createElement('img');
            imgValue.src = data.imagen;
            imgValue.style = "height: 50px;";
            imgTd.appendChild(imgValue);

            padreTr.append(fechaTd, sentTd, descTd, imgTd);
            //El 'tr' padre, se anexará al elemento 'tbody' (cuerpo).
            document.getElementById('cuerpo').appendChild(padreTr);
        }
    ) 
} 

obtenerData();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

async function eliminarData() {

    //Cuando el usuario presione el botón eliminar, se le pedirá que ingrese el #.
    var idX = parseInt(prompt('¿Qué registro desea eliminar? (Ingrese el #) '));

    let idArray = [];

    for (let i = 0; i < dataRegistros.length; i++) {  
        idArray.push(dataRegistros[i]._id);
    } 

    var idEliminado = idArray[idX-1];

    console.log("Eliminar ese id:" + idEliminado)
    
    const resp = await peticionDelete(idEliminado, {}, 'DELETE');
    const body = await resp.json();

    console.log(body);

        if (body.ok) {
            alert(`Eliminado correctamente la nota #${idX}`);
            reiniciarPag();
        } else {
            alert("No existe el registro con ese #");
        }  

}

async function peticionDelete( endpoint, data, method ) {
    
    // Petición DELETE, incluyendo el endpoint(id) y la ruta /eliminar.
    if (method === 'DELETE') {
        const urlDelete = `${url}/eliminar/${endpoint}`
        return fetch(urlDelete, {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify( data )
        });
    }

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

async function editarData() {

    alert('Procesando y editando registro. Por favor espere unos segundos...')

    var idEdit = document.getElementById('numberId').value;

    //Se almacenarán unicamente todos los id de los registros existentes.
    let idArray = [];

    for (let i = 0; i < dataRegistros.length; i++) {  
        idArray.push(dataRegistros[i]._id);
    } 

    //Después de que el usuario ingrese el id (#) que desea editar, en el idArray buscará el id dependiendo el indice ingresado.
    //Le resto 1, para que el usuario pueda ingresar del 1 en adelante, y se sincronice bien en la busqueda del indice.
    var idEditado = idArray[idEdit-1];

    if (!idEditado) {
        alert('El registro con ese # no existe. Ingrese uno existente.')
    }

    var sentimiento = document.getElementById('editarSentimiento').value;
    
    var descripcion = document.getElementById('editarDescripcion').value;
    
    var fecha = document.getElementById('editarFecha').value;

    var imagen = await imgCloud;

    if (sentimiento.length < 5) {
        alert('El campo sentimiento requiere 5 o más carácteres');
        reiniciarPag();
    } else if (descripcion.length < 10) {
        alert('El campo descripción requiere 10 o más carácteres');
        reiniciarPag();
    } else if (fecha === "") {
        alert('Por favor ingrese la fecha de hoy');
        reiniciarPag();
    } else if (imagen === undefined) {
        alert('Por favor ingrese una imágen de referencia');
        reiniciarPag();
    } 
    
    const resp = await peticionPut(idEditado, {sentimiento, descripcion, fecha, imagen}, 'PUT');
    const body = await resp.json();

        if (body.ok) {
            alert(`Editado correctamente la nota #${idEdit}`);
            reenviarPagIndex();
        } else {
            alert("Ingrese correctamente los datos");
            reiniciarPag();
        }    
}

async function peticionPut( endpoint, data, method ) {
    // Petición PUT, incluyendo el endpoint(id), la ruta sigue siendo '/'.
    if (method === 'PUT') {
        const urlEdit = `${url}/${endpoint}`
        return fetch(urlEdit, {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify( data )
        });
    }
}

//Reiniciará el form de la página actual. Se vaciarán los campos.
function reiniciarPag() {
    window.location.reload();
}

//Me regresará al index. 
function reenviarPagIndex() {
    window.location.href = 'index.html';
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var imgCloud; //Valor de la Url Img de Cloudinary.

//La función será llamada desde el campo de imagen(file). Apenas haya un cambio ahí, será llamada.
function editImg(input) {
    //Se almacena el valor de la imagen. Si existe, será enviada como argumento en la función imgLista().
    if (input) {
        var fileImg = input.files[0];          
    }   

    imgCloud = imgLista(fileImg);
}

async function imgLista(file) {
    return imgUrl = await subirImagen(file);    
}

async function subirImagen(img) {
    //Cloudinary: Base de datos en la nube para imágenes.
    // Me guié de la documentación de Cloudinary, para poder consumir su api.
    var cloudUrl = 'https://api.cloudinary.com/v1_1/diyjcwivy/upload'

    const formDataImg = new FormData();
    formDataImg.append('upload_preset', 'diario-app');
    formDataImg.append('file', img);

    try {
        const resp = await fetch(cloudUrl, {
            method: 'POST',
            body: formDataImg
        });

        if (resp.ok) {
            const respImg = await resp.json();
            return respImg.secure_url;
        } else {
            throw await resp.json();
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}
