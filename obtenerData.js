var url = 'https://diario-app-alex.herokuapp.com/api/diario'
var dataRegistros = [];

async function obtenerData() {

    //GET.
    var dataLista;
    await fetch(url)
    .then(response => response.json())
    .then(data => dataLista = data);
    
    for (var i = 0; i < dataLista.registros.length; i++) {  
        dataRegistros.push( dataLista.registros[i]);
    }
    
    dataRegistros.map(
        data => {

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

            //var deleteTd = document.createElement('td');

            //var linkDelete = document.createElement('a'); 
            //var linkUpdate = document.createElement('a');
            
            //var val = linkDelete.nodeValue = data._id
            //valorId.push(val);
            //linkDelete.text = 'Eliminar'

            //linkDelete.setAttribute('href', `${ await mandarDataBackend(data._id, {}, 'DELETE')}`);

            //linkDelete.className = 'btn btn-danger me-2'
            //linkUpdate.text = 'Editar';
            //linkUpdate.setAttribute('href', 'editar.html');
            //linkUpdate.className = 'btn btn-secondary'

            //deleteTd.append(linkDelete)
            
            padreTr.append(fechaTd, sentTd, descTd, imgTd);
            
            document.getElementById('cuerpo').appendChild(padreTr);
        }
    ) 

} 

//Petición GET.
obtenerData();

async function eliminarData() {

    var idX = parseInt(prompt('¿Qué registro desea eliminar? (Ingrese el #) '));


    let idArray = [];

    for (let i = 0; i < dataRegistros.length; i++) {  
        idArray.push(dataRegistros[i]._id);
    } 

    var idEliminado = idArray[idX-1];

    console.log("Eliminar ese id:" + idEliminado)
    
    //Petición DELETE.
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

    if (method === 'DELETE') {
        //Se ingresa el /id
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

async function editarData() {

    alert('Procesando y editando registro. Por favor espere unos segundos...')

    var idEdit = document.getElementById('numberId').value;

    let idArray = [];

    for (let i = 0; i < dataRegistros.length; i++) {  
        idArray.push(dataRegistros[i]._id);
    } 

    var idEditado = idArray[idEdit-1];

    if (!idEditado) {
        alert('El registro con ese # no existe. Ingrese uno existente.')
    }

    var sentimiento = document.getElementById('editarSentimiento').value;
    
    var descripcion = document.getElementById('editarDescripcion').value;
    
    var fecha = document.getElementById('editarFecha').value;

    var imagen = await img;

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

    console.log(sentimiento, descripcion, fecha, imagen);
    
    //Petición PUT.
    const resp = await peticionPut(idEditado, {sentimiento, descripcion, fecha, imagen}, 'PUT');
    const body = await resp.json();

    console.log(body);

        if (body.ok) {
            alert(`Editado correctamente la nota #${idEdit}`);
            reenviarPagIndex();
        } else {
            alert("Ingrese correctamente los datos");
            reiniciarPag();
        }    
    
}

async function peticionPut( endpoint, data, method ) {

    if (method === 'PUT') {
        //Se ingresa el /id
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

function reiniciarPag() {
    window.location.reload();
}

function reenviarPagIndex() {
    window.location.href = 'index.html';
}

var img;

function editImg(input) {

    if (input) {
        file = input.files[0];          
    } 
    
    img = imgLista(file);

}

async function subirImagen(img) {
    
    const cloudUrl = 'https://api.cloudinary.com/v1_1/diyjcwivy/upload'

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
        throw error;
    }

} 

async function imgLista(file) {

    return imgUrl = await subirImagen(file);

    //document.getElementById('cuerpo').appendChild(padreTr);
    
}


















    /*
    console.log("######### DESCRIPCION #######")

    //Desc
    dataRegistros.map(
        data => {
            console.log(data.descripcion)
        }
    ) 

    console.log("####### FECHA #########")

    //Fecha
    dataRegistros.map(
        data => {
            console.log(data.fecha)
        }
    ) 

    console.log("######## TIMESTAMP ########")

    //Timestamp
    dataRegistros.map(
        data => {
            console.log(data.timestamp)
        }
    ) 
*/
