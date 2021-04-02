var url = 'https://diario-app-alex.herokuapp.com/api/diario'
var file;
var img;

//const url = 'localhost:4000/api/diario'

function guardarImgFile(input) {

    if (input) {
        file = input.files[0];          
    } 
    
    img = imgLista(file);

}

async function imgLista(file) {
    return imgUrl = await subirImagen(file);    
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

async function datosFront() {

    function reiniciarForm() {
        window.location.reload();
    }

    alert('Procesando y guardando el registro, por favor espere unos segundos :)')
    
    var imagen = await img;
    var sentimiento = document.getElementById('inputSentimiento').value;
    var descripcion = document.getElementById('inputDescripción').value;
    var fecha = document.getElementById('inputFecha').value;
    
    if (sentimiento.length < 5) {
        alert('El campo sentimiento requiere 5 o más carácteres');
        reiniciarForm();
    } else if (descripcion.length < 10) {
        alert('El campo descripción requiere 10 o más carácteres');
        reiniciarForm();
    } else if (fecha === "") {
        alert('Por favor ingrese la fecha de hoy');
        reiniciarForm();
    } else if (imagen === undefined) {
        alert('Por favor ingrese una imágen de referencia');
        reiniciarForm();
    } 
            
        var resp = await peticionPost('agregar', {sentimiento, descripcion, imagen, fecha}, 'POST');
        var body = await resp.json();
    
        if (body.ok) {
            alert(body.msg);
            reiniciarForm();
        } else {
            alert('Hubo un error. Intenta nuevamente :(')
            reiniciarForm();
        } 
}

function peticionPost( endpoint, data, method ) {
    if (method === 'POST') {
        //Se ingresa el /agregar en el path, más los datos almacenados del form.
        const urlPost = `${url}/${endpoint}`;
        return fetch(urlPost, {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } 
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

async function subirImagen(img) {
    
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
        throw error;
    }
} 


