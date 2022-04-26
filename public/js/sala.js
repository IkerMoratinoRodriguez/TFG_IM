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
  <p class="popup-text">Esta zona de la sala de trabajo ágil, es una de las más importantes, ya que es donde el equipo ágil se reúne, y por consiguiente, donde tienen lugar tomas de decisiones, reestructuración del backlog, ajustes del alcance del sprint o del proyecto, etc. En esta mesa tienen lugar las daily meetings, priorizaciones, estimaciones y retrospectivas, para cuyo soporte se han desarrollado las herramientas disponibles en ASTools.</p>
  <p class="popup-subtitle">HERRAMIENTAS SOPORTE A EVENTOS</p>   
  <p class="popup-text">A continuación se pueden encontrar los enlaces a las herramientas para dar soporte a eventos de ASTools, que ocurren en la mesa de reuniones:</p>     
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
                <p class="popup-text">En esta pizarra, normalmente se repersenta uno de los elementos principales en las metodologías ágiles: el backlog. Dicho elemento, es usado para conocer, en cada momento, las tareas que tenemos pendientes de empezar, los que están en curso y los que ya se han completado. <br>La siguiente imagen representa dicho Backlog:</p>
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
    <p class="popup-text">Esta es una práctia muy usual en las metodologías ágiles, que consiste en, como su nombre indica, programar en parejas(pares), lo cual refuerza el espíritu de equipo que proponen las metodologías ágiles. Al ser dos personas los que trabajan programando y no uno, si uno de ellos comete un error, el otro miembro puede darse cuenta y corregir dicho defecto. Además también se refuerza el carácter multidisciplinar de estos equipos ya que un componente de la pareja puede tener más conocimiento en un área determinado mientras el otro aporte más en otros ámbitos. Finalmente cabe destacar, que ambos miembros de la pareja deben conocer en todo momento qué hacen como si fueran uno, y no dejar que sea uno solo de la pareja, el que haga todo el trabajo aunque sea más experto o sepa más de un determinado tema.</p>
    <p class="popup-subtitle">HERRAMIENTAS EXTERNAS PARA SOPORTE DE PAIR PROGRAMMING</p>   
    <p class="popup-text">A continuación se pueden encontrar los enlaces a algunas herramientas para dar soporte al pair programming y que pueden ser útiles para complementar esta herramienta:</p>     
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
    <p class="popup-text" >En esta pizarra se representan diferentes elementos también muy úiles en las metodologías ágiles, como por ejemplo los burndown o burnup charts. Ambos representan unidades de trabajo y de tiempo, no obstante, el burndown muestra la cantidad de trabajo pendiente, mientras que el burnup representa la cantidad de trabajo realizada hasta el momento.En ambos tipos de gráficos se muestra tanto el flujo ideal, (que sería el representado por la línea con pendiente constante) y el flujo real, que es la línea que representa el trabajo que se va realizando durante el sprint.<br> A continuación podemos observar un ejemplo de burndown chart:</p>
    <div class="backlog-img">
        <img src="/resources/burndown.png">
    </div> 
    <p class="popup-text" >Otro elemento que suele estar muy presente en este tipo de pizarras es la representación de flujos de trabajo Kanban. Pese a que Kanban es una metodología diferente a Scrum, ambas se pueden (y es muy común) mezclar, ya que ésta aporta una herramienta muy importante para controlar el trabajo que el equipo ágil puede gestionar en un momento determinado, el WIP (Work In Progress). Además dichos tableros se dividen en diferentes apartados, representando cada uno de ellos una etapa del ciclo de vida del desarrollo, limitando mediante la señal visual del WIP, la cantidad de elementos de trabajo que puede haber en cada una de las fases<br> A continuación se puede observar un ejemplo de tablero Kanban:</p>
    <div class="backlog-img">
        <img class="img-popup" src="/resources/kanban.jpg">
    </div> 
    <p class="popup-text">A continuación se encuentra un enlace a Azure DevOps que puede ser de ayuda, entre otras cosas, para representar un burndown chart a partir del trabajo realizado, así como para registrar un tablero kanban y de esta forma, complementar esta herramienta:</p>     
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