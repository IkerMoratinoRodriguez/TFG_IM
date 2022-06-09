// Initialize Variables
var closePopup = document.getElementById("popupclose");
var overlay = document.getElementById("overlay");
var popup = document.getElementById("popup");
var buttonR = document.getElementById("button-r");
var buttonB = document.getElementById("button-b");
var buttonRe = document.getElementById("button-re");
var buttonP = document.getElementById("button-p");
var buttonO = document.getElementById("button-o");
var popupContent = document.getElementById("popup-content");

overlay.onclick = function(){
  overlay.style.display = 'none';
  popup.style.display = 'none';
  window.onscroll = null;

}


// Close Popup Event
closePopup.onclick = function() {
  overlay.style.display = 'none';
  popup.style.display = 'none';
  window.onscroll = null;

};
// Show Overlay and Popup
buttonR.onclick = function() {

  popupContent.innerHTML=`<h1 class="popup-title">MESA DE REUNIONES</h1>
  <p class="popup-text">Esta zona de la sala de trabajo ágil es una de las más importantes, ya que es donde el equipo ágil se reúne y, por consiguiente, donde tienen lugar tomas de decisiones, reestructuración del backlog, ajustes del alcance del sprint o del proyecto, etc. En esta mesa tienen lugar las daily meetings, priorizaciones, estimaciones y retrospectivas, para cuyo soporte se han desarrollado las herramientas disponibles en ASTools. </p>
  <p class="popup-subtitle">HERRAMIENTAS SOPORTE A EVENTOS</p>   
  <p class="popup-text">A continuación, se pueden encontrar los enlaces a las herramientas para dar soporte a eventos de ASTools, que ocurren en la mesa de reuniones:</p>     
  <div class="popup-links">
      <a class="popup-link-tools" href="dailyExplain.html">DAILY MEETING</a>    
      <a class="popup-link-tools" href="priorizationtools.html">PRIORIZACIONES</a>
      <a class="popup-link-tools" href="estimationtools.html">ESTIMACIONES</a>
      <a class="popup-link-tools" href="retroExplain.html">RETROSPECTIVA</a>
  </div>`;

  overlay.style.display = 'block';
  popup.style.display = 'block';

  
}

buttonB.onclick = function() {
      popupContent.innerHTML = `
      <h1 class="popup-title">BACKLOG</h1>
                <p class="popup-text">El backlog o pila de producto se trata de una lista ordenada que representa el trabajo necesario para mejorar el producto. Los elementos que la componen están listos para ser seleccionados por el Equipo durante la Planificación del Sprint. Los elementos que lo componen, se pueden descomponer en elementos más pequeños y precisos para realizarlos más fácilmente. Los responsables de definir el tamaño de estos elementos son los propios desarrolladores, aunque el Product Owner puede ayudarles, haciéndoles comprender mejor estos elementos. La siguiente imagen representa dicho Backlog:</p>
                <div class="backlog-img">
                    <img src="/resources/backlog.png">
                </div> 
                <p class="popup-text">A continuación se encuentra un enlace a Azure DevOps que puede ser de ayuda, entre otras cosas, para representar un backlog y de esta forma, complementar esta herramienta:</p>     
                <div class="popup-links">
                    <a class="popup-link-one" href="https://azure.microsoft.com/es-es/services/devops/">AZURE DEV OPS</a>    
                </div>
      `;

      overlay.style.display = 'block';
      popup.style.display = 'block';

    //BLOQUEAR SCROLL
    window.scrollTo(top);
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function(){ window.scrollTo(x, y) };
}


buttonRe.onclick = function() {

    popupContent.innerHTML=`<h1 class="popup-title">ZONA RELAX</h1>
    <p class="popup-text">Aunque pueda resultar curioso, la mayoría de las salas de trabajo ágiles, tienen una zona de relajación formada normalmente por unos sofás y, en ocasiones, una máquina expendedora de alimentos, refrescos o cafés, que los equipos puedan utilizar en los descansos para desconectar del trabajo y socializar más entre ellos, lo cual, aunque pueda parecer un detalle menor, refuerza la idea de equipo que proponen las metodologías ágiles, que proponen que más que un grupo de trabajo, las relaciones interpersonales sean buenas, lo cual se verá reflejado en el trabajo desempeñado. </p>
    <div class="backlog-img">
        <img class="img-popup" src="/resources/relax.jpg">
    </div>`;

    overlay.style.display = 'block';
    popup.style.display = 'block';

    //BLOQUEAR SCROLL
    window.scrollTo(top);
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function(){ window.scrollTo(x, y) };

}

buttonP.onclick = function() {

    popupContent.innerHTML=`<h1 class="popup-title">PAIR PROGRAMMING</h1>
    <p class="popup-text">Esta es una práctica muy usual en las metodologías ágiles, que consiste en, como su nombre indica, programar en parejas (pares), lo cual refuerza el espíritu de equipo que proponen las metodologías ágiles. Al ser dos personas los que trabajan programando y no uno, si uno de ellos comete un error, el otro miembro puede darse cuenta y corregir dicho defecto. Además, también se refuerza el carácter multidisciplinar de estos equipos ya que un componente de la pareja puede tener más conocimiento en un área determinado mientras el otro aporte más en otros ámbitos. Finalmente cabe destacar, que ambos miembros de la pareja deben conocer en todo momento qué hacen como si fueran uno, y no dejar que sea uno solo de la pareja, el que haga todo el trabajo, aunque sea más experto o sepa más de un determinado tema.</p>
    <p class="popup-subtitle">HERRAMIENTAS EXTERNAS PARA SOPORTE DE PAIR PROGRAMMING</p>   
    <p class="popup-text">A continuación, se pueden encontrar los enlaces a algunas herramientas para dar soporte al pair programming y que pueden ser útiles para complementar esta herramienta:</p>     
    <div class="popup-links">
        <a class="popup-link" href="https://duckly.com/">DUCKLY</a>    
        <a class="popup-link" href="https://plugins.jetbrains.com/plugin/14225-codetogether">CODE TOGETHER (IntelliJ)</a>
        <a class="popup-link" href="https://visualstudio.microsoft.com/es/services/live-share/">VISUAL STUDIO LIVE SHARE</a>
    </div>`;

    overlay.style.display = 'block';
    popup.style.display = 'block';
    //BLOQUEAR SCROLL
    window.scrollTo(top);
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function(){ window.scrollTo(x, y) };
    
}

buttonO.onclick = function() {

    popupContent.innerHTML=`<h1 class="popup-title">PIZARRA CON OTROS ELEMENTOS</h1>
    <p class="popup-text" >En esta pizarra se representan diferentes elementos también muy úiles en las metodologías ágiles, como por ejemplo los burndown o burnup charts. Estos gráficos relacionan el trabajo pendiente, representado en el eje Y que normalmente está relacionado en Puntos Historia (Story Points) con el tiempo consumido desde el principio del Sprint, en el eje X. En el caso de los burndown su función es conocer el trabajo pendiente y en el caso de los burnup, el trabajo realizado. En este tipo de gráficos se suele representar tanto la evolución real de los equipos como la evolución estimada o ideal
    A continuación, podemos observar un ejemplo de burndown chart:
    </p>
    <div class="backlog-img">
        <img src="/resources/burndown.png">
    </div> 
    <p class="popup-text" >Otro elemento que suele estar muy presente en este tipo de pizarras es la representación de flujos de trabajo Kanban. Pese a que Kanban es una metodología diferente a Scrum, ambas se pueden (y es muy común) mezclar, ya que ésta aporta una herramienta muy importante para controlar el trabajo que el equipo ágil puede gestionar en un momento determinado, el WIP (Work In Progress). Además, dichos tableros se dividen en diferentes apartados, representando cada uno de ellos una etapa del ciclo de vida del desarrollo, limitando mediante la señal visual del WIP, la cantidad de elementos de trabajo que puede haber en cada una de las fases
    A continuación, se puede observar un ejemplo de tablero Kanban:
    </p>
    <div class="backlog-img">
        <img class="img-popup" src="/resources/kanban.jpg">
    </div> 
    <p class="popup-text">A continuación, se encuentra un enlace a Azure DevOps que puede ser de ayuda, entre otras cosas, para representar un burndown chart a partir del trabajo realizado, así como para registrar un tablero kanban y de esta forma, complementar esta herramienta:</p>     
    <div class="popup-links">
        <a class="popup-link-one" href="https://azure.microsoft.com/es-es/services/devops/">AZURE DEV OPS</a>    
    </div>`;

    overlay.style.display = 'block';
    popup.style.display = 'block';
    //BLOQUEAR SCROLL
    window.scrollTo(top);
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function(){ window.scrollTo(x, y) };
}