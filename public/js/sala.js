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
  <p class="popup-text">Esta zona de la sala de trabajo ágil es una de las más importantes, ya que es donde el equipo ágil se reúne y, por consiguiente, donde tienen lugar tomas de decisiones, reestructuración del backlog, ajustes del alcance del sprint o del proyecto, etc. Esta mesa simboliza el lugar de reunión del equipo y de realización de actividades. Por ello, en ASTools se han incluido las herramientas que realizan estas actividades en la mesa de la sala. Concretamente, ASTools proporcionas herramientas para realizar las actividades de: daily meetings, priorizaciones, estimaciones y retrospectivas.  </p>
  <p class="popup-subtitle">HERRAMIENTAS SOPORTE A EVENTOS</p>   
  <p class="popup-text">ASTools da soporte a la realización de una serie de actividades ágiles a través de un conjunto de herramientas.  A continuación, tienes acceso a estas herramientas y a la explicación previa para ponerlas en práctica de forma satisfactoria:</p>     
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
                <p class="popup-text">El backlog o pila de producto está en una pizarra a la vista de todos los miembros del producto. El backlog se trata de una lista ordenada por prioridad de las necesidades que el producto a desarrollar debe satisfacer. El backlog es el resultado de la fase previa al desarrollo, también conocida como pregame. Los elementos que la componen, normalmente historias de usuario, se estiman y priorizan para estar listos para ser seleccionados por el Equipo durante la Planificación del Sprint. Los elementos que lo componen se pueden descomponer en el sprint en elementos más pequeños y precisos, normalmente denominados tareas, para realizarlos más fácilmente. Los responsables de estimar estos elementos son los propios desarrolladores, aunque el Product Owner puede ayudarles, haciéndoles comprender mejor sus necesidades y lo que implican a la hora de desarrollarlas. La siguiente imagen representa dicho Backlog:</p>
                <div class="backlog-img">
                    <img src="/resources/backlog.png">
                </div> 
                <p class="popup-text">Si te apetece probar a construir un backlog, como complemento a ASTools, a continuación se encuentra un enlace a Azure DevOps dónde te ofrece esta funcionalidad:</p>     
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
    <p class="popup-text">Aunque pueda resultar curioso, la mayoría de las salas de trabajo ágiles, tienen una zona de relajación formada normalmente por unos sofás y, en ocasiones, una máquina expendedora de alimentos, refrescos o café. Estas zonas de las salas de trabajo, los equipos las utilizan en los descansos para desconectar del trabajo y socializar más entre ellos, lo cual, aunque pueda parecer un detalle menor, refuerza la idea de equipo que proponen las metodologías ágiles. Las ágiles persiguen que el equipo sea algo más que un mero grupo de trabajo, sino que el equipo tenga buenas relaciones interpersonales, ya que esto se verá reflejado en el trabajo desempeñado.</p>
    <div class="backlog-img">
        <img class="img-popup" src="/resources/relax.jpg">
    </div>
    <p class="popup-text">Imagen obtenida de https://pixabay.com/</p>`;

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
    <p class="popup-text">Esta es una práctica ágil muy asentada en las metodologías ágiles, que consiste en, como su nombre indica, programar en parejas (pares), lo cual refuerza el espíritu de equipo que proponen las metodologías ágiles. Al ser dos personas los que trabajan programando, si uno de ellos comete un error, el otro miembro puede darse cuenta y corregir dicho defecto. Además, también se refuerza el carácter multidisciplinar de estos equipos ya que un componente de la pareja puede tener más conocimiento en un área determinada mientras el otro aporte más en otros ámbitos. Finalmente, cabe destacar, que ambos miembros de la pareja deben conocer en todo momento qué hacen como si fueran uno, y no dejar que sea uno solo de la pareja, el que haga todo el trabajo, aunque sea más experto o sepa más de un determinado tema.</p>
    <p class="popup-subtitle">HERRAMIENTAS EXTERNAS PARA SOPORTE DE PAIR PROGRAMMING</p>   
    <p class="popup-text">Si te apetece indagar más sobre pair programming, a continuación se encontrar los enlaces a algunas herramientas para dar soporte al pair programming:</p>     
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

    popupContent.innerHTML=`<h1 class="popup-title">PIZARRA DEL SPRINT</h1>
    <p class="popup-text" >En la pizarra del sprint se representan los diferentes elementos que nos ayudan a monitorizar y hacer un seguimiento detallado de la evolución del sprint, elementos también muy útiles en las metodologías ágiles. Entre estos elementos se han de destacar el tablero Scrum o Kanban y los burndown o burnup charts. El tablero Scrum o kanban contiene las historias de usuario y tareas seleccionadas para el sprint. Estos muestran en todo momento lo que el equipo tiene pendiente por hacer, qué está haciendo y qué ha terminado. Hoy en día la utilización de tableros kanban está en auge, ya que tienen un valor añadido con respecto a los tableros Scrum, y es el hecho de que aporta una herramienta muy importante para controlar el trabajo que el equipo ágil puede gestionar en un momento determinado, el WIP (Work In Progress). Este WIP es una restricción del trabajo se puede realizar de forma simultánea, de forma que actúa como señal visual o baliza para identificar cuellos de botella en el trabajo. Además, los tableros se dividen en las etapas del ciclo de vida del desarrollo que son importantes para el equipo, limitando aquellas que el equipo considere oportuno con su correspondiente WIP. A continuación, se puede observar un ejemplo de tablero Kanban:
    </p>
    <div class="kanban-img">
        <img class="img-kanban" src="/resources/kanban.jpg">
    </div>
    <p class="popup-text">Imagen obtenida de https://commons.wikimedia.org/</p>  
    <p class="popup-text" >Por otro lado, los burndown o burnup charts relacionan el trabajo pendiente, representado en el eje Y, que normalmente está relacionado en Puntos Historia (Story Points) con el tiempo consumido desde el principio del Sprint, en el eje X. En el caso de los burndown su función es conocer el trabajo pendiente y en el caso de los burnup, el trabajo realizado. En este tipo de gráficos se suele representar tanto la evolución real de los equipos como la evolución estimada o ideal.
    A continuación, podemos observar un ejemplo de burndown chart:    
    </p>
    <div class="burndown-img">
        <img src="/resources/burndown.png">
    </div>
    <p class="popup-text">Imagen obtenida de https://commons.wikimedia.org/</p>  
    <p class="popup-text">Si te apetece probar a construir un sprint y visualizar tablero Kanban y su burndown chart, como complemento a ASTools, a continuación se encuentra un enlace a Azure DevOps que te puede ser de ayuda:</p>     
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