# DiarioApp - Frontend.

Frontend hecho con HTML, CSS y Js vanila.
Se utilizó Bootstrap para darle un poco de diseño a los formularios y tablas.

El frontend fue subido a GitHub Pages.

Resúmen del proyecto:
Diario personal para registrar anotaciones.

Página que renderiza la lista de las notas. Tiene formularios de agregar y de editar.

Botones principales: Home y Agregar.
Botones de ajuste para Editar o Eliminar.

Se utilizó el fetch de Js, para hacer peticiones a la api del backend que fue subido en Heroku. 

También se utilizó la api de Cloudinary, para poder almacenar las imágenes en una base de datos.
Nota: En MongoDB se almacena el Url de la imágen (Url de Cloudinary), pero en Cloudinary se almacena la imágen en su formato respectivo. El Url es el que renderiza la imágen, ya que es subida a internet mediante Cloudinary.
