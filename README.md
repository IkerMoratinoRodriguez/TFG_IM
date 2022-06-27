# TFG

INSTRUCCIONES PARA EJECUTAR Y PODER PROBAR ASTOOLS EN LOCAL:



PASO 1- CLONAR EL REPOSITORIO EN LOCAL, EJECUTANDO CON UNA CONSOLA DE GIT EL COMANDO "git clone https://github.com/IkerMoratinoRodriguez/TFG_IM.git"

PASO 2- ABRIR EL PROYECTO EN EL EDITOR DE CÓDIGO QUE SE PREFIERA (PREFERIBLEMENTE EN VISUAL STUDIO CODE, QUE ES CON EL QUE SE HA DESARROLLADO, PERO CUALQUIER OTRO DEBERÍA VALER).

PASO 3- DENTRO DEL EDITOR, ABRIR UN TERMINAL. EN ÉL EJECUTAR EL COMANDO "npm run dev" PARA INCIALIZAR EL SERVIDOR 
(ASEGURARSE DE TENER NODE.JS INSTALADO PARA EJECUTAR EL COMANDO CORRECTAMENTE, SE PUEDE HACER AQUÍ: https://nodejs.org/en/download/ . TRAS HACERLO REINICIAR VISUAL STUDIO CODE).
 
  PASO 3.1- SI SOLICITA INSTALACIÓN DE LA LIBRERÍA NODEMON EJECUTAR EL COMANDO "npm install -D nodemon" EN LA TERMINAL ANTERIORMENTE MENCIONADA.

PASO 4- PARA CREAR LA BASE DE DATOS, EJECUTAR EL SCRIPT main.sql QUE SE ENCUENTRA EN LA CARPETA DEL PROYECTO.
PARA QUE FUNCIONE CORRECTAMENTE, MODIFICAR LAS VARIABLES DE ENTORNO DEL FICHERO .env SITUADO EN LA CARPETA RAÍZ DEL PROYECTO, PARA QUE EL USUARIO Y CONTRASEÑA COINCIDAN CON EL TU ORDENADOR.
  
  SI OCURRE ALGÚN ERROR CON LA VERSIÓN DEL CLIENTE EJECUTAR LAS SIGUIENTES DOS SENTENCIAS EN MYSQL WORKBENCH:
    1- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; (sustituyendo password por la contraseña en cuestión)
    2- flush privileges;
     

PASO 5- ESCRIBIR LA URL http://localhost:3000/ PARA ABRIR EL PORTAL WEB ASTOOLS.
