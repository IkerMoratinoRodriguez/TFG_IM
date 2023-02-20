CREATE SCHEMA IF NOT EXISTS bdASTools ;
USE bdASTools;

CREATE TABLE Usuario (
        ID int NOT NULL AUTO_INCREMENT,
        Nombre varchar(80) UNIQUE NOT NULL,
        Password varchar(40) NOT NULL,
        PRIMARY KEY (ID)
        );
        
CREATE TABLE Sala (
			ID int NOT NULL AUTO_INCREMENT,
            Nombre varchar(80) UNIQUE NOT NULL,
            Password varchar(40) NOT NULL, 
            EstadoDotVoting TINYINT NOT NULL default 0, 
            PRIMARY KEY (ID)
            );

CREATE TABLE poker (
            IDUsuario INT NOT NULL,
            IDSala INT NOT NULL,
            SocketID VARCHAR(22),
            Estimacion VARCHAR(4) DEFAULT '-1',
            PRIMARY KEY (IDUsuario, IDSala),
            CONSTRAINT FK_usr_poker_table FOREIGN KEY (IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
            CONSTRAINT FK_room_poker_table FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
            );
            
CREATE TABLE DotVoting (
			IDUsuario INT NOT NULL,
            IDSala INT NOT NULL,
            SocketID VARCHAR(22),
            Votos INT DEFAULT -1,
            PRIMARY KEY (IDUsuario, IDSala),
            CONSTRAINT FK_usr_dot_table FOREIGN KEY (IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
            CONSTRAINT FK_room_dot_table FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
            );

CREATE TABLE UserStory (
			IDSala INT NOT NULL,
            Titulo VARCHAR(200) NOT NULL,
            Votos INT DEFAULT 0,
            PRIMARY KEY(IDSala, Titulo),
            CONSTRAINT FKUSuserstory_room FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
);

CREATE TABLE retrospectiva(
	IDUsuario INT NOT NULL,
    IDSala INT NOT NULL,
    SocketID VARCHAR(22),
    PRIMARY KEY(IDUsuario, IDSala),
    CONSTRAINT FK_usRetro FOREIGN KEY(IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    CONSTRAINT FK_roomRetro FOREIGN KEY(IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
);

CREATE TABLE historial_retro(
	ID int NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(80) NOT NULL,
    IDSala INT NOT NULL,
	PRIMARY KEY(ID),
    CONSTRAINT FKRetro_history FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE,
    CONSTRAINT UniqueRetroNameInRoom UNIQUE(Nombre, IDSala) 
);

CREATE TABLE postit_retro(
	ID INT NOT NULL AUTO_INCREMENT,
    Titulo VARCHAR(200) NOT NULL,
    IDSala INT NOT NULL,
    Tipo TINYINT NOT NULL DEFAULT 0,
    IDRetro INT,
    PRIMARY KEY(ID),
    CONSTRAINT FKPostit_retro FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE,
    CONSTRAINT FKIDRetro_retro FOREIGN KEY (IDRetro) REFERENCES historial_retro(ID) ON DELETE CASCADE
);

CREATE TABLE daily(
	IDUsuario INT NOT NULL,
    IDSala INT NOT NULL,
    SocketID VARCHAR(22),
    PRIMARY KEY(IDUsuario, IDSala),
    CONSTRAINT FK_usDaily FOREIGN KEY(IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    CONSTRAINT FK_roomDaily FOREIGN KEY(IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
);

CREATE TABLE historial_daily(
	ID int NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(80) NOT NULL,
    IDSala INT NOT NULL,
	PRIMARY KEY(ID),
    CONSTRAINT FKDaily_history FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE,
    CONSTRAINT UniqueRetroNameInRoom UNIQUE(Nombre, IDSala)
);

CREATE TABLE postit_daily(
	ID INT NOT NULL AUTO_INCREMENT,
    Titulo VARCHAR(200) NOT NULL,
    Tipo TINYINT NOT NULL DEFAULT 0,
    IDDaily INT,
    PRIMARY KEY(ID),
    CONSTRAINT FKIDDaily_daily FOREIGN KEY (IDDaily) REFERENCES historial_daily(ID) ON DELETE CASCADE
);

CREATE TABLE coloca_postit_daily(
	IDUsuario INT NOT NULL,
    IDSala INT NOT NULL,
    IDPostitDaily INT NOT NULL,
    PRIMARY KEY(IDUsuario, IDSala, IDPostitDaily),
    CONSTRAINT FK_usPostitDaily FOREIGN KEY(IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    CONSTRAINT FK_postPostitDaily FOREIGN KEY(IDPostitDaily) REFERENCES postit_daily(ID) ON DELETE CASCADE,
    CONSTRAINT FK_roomPostitDaily FOREIGN KEY(IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
);

CREATE TABLE Cuestionario(
	ID INT NOT NULL AUTO_INCREMENT,
    Titulo VARCHAR(60),
    PRIMARY KEY(ID)
);

CREATE TABLE autoevaluacion(
	IDUsuario INT,
    IDCuestionario INT,
    Puntuacion FLOAT,
    PRIMARY KEY(IDUsuario, IDCuestionario),
    CONSTRAINT FK_usautoev FOREIGN KEY(IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    CONSTRAINT FK_cuestautoev FOREIGN KEY(IDCuestionario) REFERENCES Cuestionario(ID) ON DELETE CASCADE
);

CREATE TABLE Pregunta(
	ID INT NOT NULL AUTO_INCREMENT,
    Enunciado VARCHAR(300),
    IDCuestionario INT,
    PRIMARY KEY(ID),
    CONSTRAINT FK_idcuestionario FOREIGN KEY(IDCuestionario) REFERENCES Cuestionario(ID) ON DELETE CASCADE
);

CREATE TABLE Opcion(
	ID INT NOT NULL AUTO_INCREMENT,
    Enunciado VARCHAR(300),
    Validez TINYINT NOT NULL, -- 0 falsa 1 correcta 
    IDPregunta INT, 
    PRIMARY KEY(ID),
    CONSTRAINT FK_idpreguntaopcion FOREIGN KEY(IDPregunta) REFERENCES Pregunta(ID) ON DELETE CASCADE
);

-- CUESTIONARIOS 
INSERT INTO Cuestionario(Titulo) VALUES
('Metodologías Ágiles'),('Scrum 1'),('Scrum 2'),('Herramientas');

-- PREGUNTAS DE CUESTIONARIOS 
INSERT INTO Pregunta(Enunciado, IDCuestionario) VALUES
('El Manifiesto Ágil de 2001 define:',1),
('Seleccione el valor ágil FALSO:',1),
('Señale cuál de las siguientes no es una práctica común en las metodologías ágiles…',1),
('¿Cuál de los siguientes es un principio ágil?',1),
('Las metodologías ágiles…',1),
('¿Qué afirmación es FALSA?',1),
('Respecto a los equipos ágiles…',1),
('Selecciona la afirmación correcta respecto a los principios ágiles:',1),
('Según la Guía Scrum, un equipo Scrum está formado por…',2),
('Según la Guía Scrum, ¿cuáles son los pilares de dicha metodología?',2),
('Las actividades Scrum son…',2),
('Según la Guía Scrum…',2),
('Los artefactos Scrum son…',2),
('El compromiso del Incremento se denomina…',2),
('Los valores Scrum definidos por la Guía Scrum son…',2),
('En cuanto a los desarrolladores Scrum…',2),
('Según la Guía Scrum, cuando un equipo es demasiado grande este debe…',2),
('En cuanto a los Sprints de Scrum…',2),
('Scrum se basa en…',3),
('Los pilares empíricos de Scrum son…',3),
('Según la Guía Scrum, un equipo tiene típicamente máximo…',3),
('Señale cuál de los siguientes roles NO pertenece a un equipo Scrum',3),
('Selecciona la respuesta correcta relacionada con las actividades Scrum:',3),
('En relación con el Sprint definido por Scrum…',3),
('En relación al Daily Scrum...',3),
('Los participantes de una Retrospectiva son…',3),
('Señale la afirmación FALSA relacionada con la Definición de Hecho (Definition of Done) …',3),
('En relación al Scrum Master…',3),
('Con respecto a las Daily Meeting, señale la afirmación FALSA.',4),
('En relación al Poker Game…',4),
('En el ámbito del Dot Voting…',4),
('En relación con las Retrospectivas del Barco de Vela…',4),
('Las daily meeting…',4),
('Señale la afirmación correcta relacionada con el Poker Game…',4),
('Señale la afirmación FALSA relacionada con el Dot Voting…',4),
('En una Retrospectiva… (señale la FALSA)',4),
('En el Dot Voting…',4),
('En el Poker Game…',4);

INSERT INTO Opcion(Enunciado, Validez, IDPregunta) VALUES
('4 valores y 12 principios ágiles.',1,1),
('4 valores y 4 principios ágiles.',0,1),
('12 valores y 12 principios ágiles.',0,1),
('12 valores y 4 principios ágiles.',0,1),
('Documentación extensiva sobre software funcional.',1,2),
('Individuos e iteraciones sobre procesos y herramientas.',0,2),
('Colaboración con el cliente sobre negociación contractual.',0,2),
('Respuesta ante el cambio sobre seguir un plan.',0,2),
('Integración y revisión de código solamente en el cierre del proyecto.',1,3),
('Entregas pequeñas y frecuentes de versiones de software funcional.',0,3),
('Pair programming.',0,3),
('Diseño sencillo.',0,3),
('El software funcionando es la medida principal de progreso.',1,4),
('Individuos e interacciones sobre procesos y herramientas.',0,4),
('Nuestra mayor prioridad es satisfacer al cliente mediante una entrega grande de software al final del proyecto.',0,4),
('El software aporta más valor, cuanto más complejo sea.',0,4),
('Aceptan el cambio y tratan de usarlo para generar valor.',1,5),
('Siguen la planificación inicial en todo momento, pase lo que pase.',0,5),
('La medida principal de progreso es la comunicación con el cliente.',0,5),
('El equipo ágil debe estar estructurado jerárquicamente.',0,5),
('Los responsables del negocio y los desarrolladores apenas tienen contacto.',1,6),
('Los proyectos se desarrollan entorno a individuos motivados.',0,6),
('La atención contínua a la excelencia técnica y al buen diseño mejoran la agilidad.',0,6),
('La simplicidad, o el arte de maximizar la cantidad de trabajo no realizado, es esencial.',0,6),
('Deben ser multidisciplinares y auto-organizados.',1,7),
('Deben ser multidisciplinares, pero son organizados por sus jefes.',0,7),
('Todas las personas de un mismo equipo tienen conocimientos similares, para centrarse en un área concreta.',0,7),
('En ágiles se trabaja de manera individual, no por equipos.',0,7),
('Definen las bases de las metodologías ágiles.',1,8),
('Hay tantos como técnicas.',0,8),
('Hay algunos más importantes que otros.',0,8),
('En el Manifesto Ágil aparecen junto a los valores, pero éstos son más importantes.',0,8),
('Desarrolladores, Product Owner y Scrum Master.',1,9),
('Solo desarrolladores.',0,9),
('Desarrolladores, Cliente y Scrum Master.',0,9),
('Desarrolladores, Jefes y Product Owner.',0,9),
('Transparencia, inspección y adaptación.',1,10),
('Transparencia y adaptación.',0,10),
('Transparencia e inspección.',0,10),
('Inspección y adaptación.',0,10),
('Sprint, que engloba a Sprint Planning, Daily Scrum, Review y Retrospective.',1,11),
('Sprint Planning, Daily Scrum, Review y Retrospective.',0,11),
('Sprint Planning, Daily Scrum, Priorization y Estimation.',0,11),
('Solamente el Sprint. ',0,11),
('El Scrum Master puede ser desarrollador.',1,12),
('El Scrum Master siempre debe ser desarrollador.',0,12),
('El Scrum Master nunca puede ser desarrollador.',0,12),
('Puede no haber Scrum Master en un equipo Scrum.',0,12),
('Product Backlog, Sprint Backlog e Increment.',1,13),
('Burndown y Sprint Backlog.',0,13),
('Product Backlog y Sprint Backlog.',0,13),
('Burndown, Burnup y Kanban Chart.',0,13),
('Definición de Hecho (Definition of Done).',1,14),
('Objetivo de Producto.',0,14),
('Objetivo de Sprint.',0,14),
('Backlog.',0,14),
('Compromiso, Coraje, Respeto, Enfoque y Sinceridad.',1,15),
('Compromiso, Fortaleza, Respeto, Concentración y Sinceridad.',0,15),
('Amiguismo, Coraje, Respeto, Concentración y Sinceridad.',0,15),
('Compromiso, Coraje, Respeto, Lealtad y Sinceridad.',0,15),
('Sus habilidades deben ser muy variadas y adaptarse al dominio de trabajo del proyecto actual.',1,16),
('Deben ser expertos en un área concreta.',0,16),
('No todos deben poder adaptar su trabajo al Objetivo del Sprint.',0,16),
('Deben trabajar bien individualmente pero no colectivamente.',0,16),
('Dividirse en varios equipos pequeños.',1,17),
('Elegir a un líder que les represente.',0,17),
('Hacer subdivisiones jerárquicas, pero mantener el mismo equipo.',0,17),
('Nada, ya que el número de miembros de un equipo no importa en Scrum.',0,17),
('Son de longitud fija, de un mes o menos.',1,18),
('La longitud no se puede fijar nunca.',0,18),
('Son de longitud fija, de mínimo un mes y máximo 2.',0,18),
('Siempre se realizan menos de 5 Sprints para cualquier producto.',0,18),
('El empirismo y el pensamiento lean.',1,19),
('El empirismo y la transparencia.',0,19),
('El empirismo y la lealtad.',0,19),
('La transparencia, la inspección y la adaptación.',0,19),
('Transparencia, inspección y adaptación.',1,20),
('Compromiso, Coraje, Respeto, Concentración y Sinceridad.',0,20),
('Empirismo y pensamiento lean.',0,20),
('Un Sprint corto y una entrega frecuente.',0,20),
('10 personas',1,21),
('7 personas',0,21),
('5 personas',0,21),
('20 personas',0,21),
('Stakeholders',1,22),
('Product Owner',0,22),
('Desarrolladores',0,22),
('Scrum Master',0,22),
('Una Daily Scrum dura aproximadamente 15 minutos.',1,23),
('Durante la Revisión del Sprint se construye el Sprint Backlog del siguiente Sprint.',0,23),
('La Retrospectiva es la actividad en la que se revisa el progreso del Sprint hacia su Objetivo.',0,23),
('En la Planificación del Sprint solamente participan los desarrolladores y el Scrum Master.',0,23),
('Aunque es una actividad más, actúa como contenedor de las demás, ya que se desarrollan dentro de un Sprint.',1,24),
('En un momento determinado, la calidad puede verse afectada negativamente.',0,24),
('El alcance se puede renegociar con el Scrum Master',0,24),
('Se puede hacer cualquier tipo de cambio en el Sprint Backlog.',0,24),
('Siempre se lleva a cabo en el mismo lugar y a la misma hora.',1,25),
('Siempre se utiliza la técnica de las 3 preguntas.',0,25),
('Suele durar entre 15 y 30 minutos.',0,25),
('Nunca se utiliza la técnica de las 3 preguntas, ya que la Guía Scrum define un procedimiento específico para dicho evento.',0,25),
('El equipo Scrum al completo.',1,26),
('El equipo Scrum y los stakeholders.',0,26),
('Solamente los desarrolladores.',0,26),
('Los desarrolladores y el Scrum Master.',0,26),
('Cuando un equipo Scrum se subdivide, cada uno adopta una Definición de Hecho diferente.',1,27),
('Es el compromiso que define Scrum para los Incrementos.',0,27),
('En el momento en el que un elemento del Product Backlog cumple con ella, se inicia un Incremento.',0,27),
('Los desarrolladores deben adaptarse a ella.',0,27),
('Actúa como líder del equipo.',1,28),
('Es el jefe del equipo Scrum, de manera que organiza el trabajo que hará cada desarrollador.',0,28),
('Nunca puede tener el papel de desarrollador.',0,28),
('Sirve al equipo, pero no al Product Owner.',0,28),
('Sólo se pueden llevar a cabo aplicando la técnica de las tres preguntas.',1,29),
('La técnica de las 3 preguntas es de las más usadas, pero existen otras.',0,29),
('La técnica de las 3 preguntas está compuesta por las preguntas ¿qué hice ayer?, ¿qué problemas encontré? y ¿qué haré mañana?',0,29),
('Se debe registrar que usuario ha puesto qué postit.',0,29),
('Todos los participantes eligen su carta en silencio y la muestran todos a la vez.',1,30),
('Antes de que cada participante elija su carta, habla con sus compañeros para saber qué carta elegir.',0,30),
('Es una técnica de priorización.',0,30),
('El valor de las cartas numéricas de la baraja utilizada siempre debe seguir la sucesión de Fibonacci. ',0,30),
('El número de votos asignados a cada usuario cuando se utiliza la regla de ⅓ depende del número de elementos a priorizar.',1,31),
('Cada usuario tiene siempre n/2 votos, siendo n el número de ítems a priorizar.',0,31),
('La regla de ⅓ es la mejor para aplicar en un Dot Voting.',0,31),
('La regla del Pareto no es útil en este tipo de priorización.',0,31),
('Es solo una forma de llevar a cabo este tipo de actividades, pero hay muchas más.',1,32),
('El ancla simboliza los futuros peligros.',0,32),
('En el apartado de “viento” podríamos incluir el hecho de no comprender bien la tecnología.',0,32),
('Siempre se lleva a cabo, al menos una retrospectiva de este tipo en cada proyecto.',0,32),
('Todas son correctas.',1,33),
('Es una sesión de no más de 15 minutos.',0,33),
('No siempre se usa la técnica de las 3 preguntas.',0,33),
('Se llevan a cabo diariamente. ',0,33),
('El valor de los SP se escoge frente a un valor de referencia que el equipo fija previamente.',1,34),
('El valor que indica la carta indica el número de horas que se va a dedicar al elemento estimado.',0,34),
('La carta del 0 significa que no sabe de qué se trata el elemento a estimar.',0,34),
('La carta de la taza de café indica que el participante que la ha elegido tiene sueño.',0,34),
('Solo existen 3 tipos de votación (las reglas de ½, ⅓ y Pareto), y ninguna más puede aplicarse en ningún caso.',1,35),
('Cada usuario tiene un número de votos de acuerdo a unas reglas que se deciden antes de realizar la votación.',0,35),
('Un usuario puede votar varias veces el mismo ítem.',0,35),
('Dot Voting es una técnica de priorización. ',0,35),
('El desconocimiento de la herramienta iría en el apartado del “viento”.',1,36),
('La buena relación entre los miembros del equipo iría en el apartado de “viento”.',0,36),
('La puntualidad de los miembros del equipo iría en el apartado de “viento”.',0,36),
('El mal entendimiento del objetivo del Sprint iría en el apartado de “ancla”.',0,36),
('Cada usuario reparte sus votos entre los elementos a priorizar, y no puede utilizar más de los que se le han asignado en ninguna circunstancia. ',1,37),
('En Dot Voting nunca hay debate, la priorización surge del resultado de dicha técnica, sin posibles ajustes.',0,37),
('Cada usuario tiene tantos votos como ítems hay a priorizar. Cada usuario tiene tantos votos como ítems hay a priorizar. ',0,37),
('Los votos se pueden intercambiar entre los miembros que realizan la votación',0,37),
('Si no ha habido consenso se llevan a cabo más rondas hasta que se alcance un acuerdo.',1,38),
('Para obtener la estimación definitiva se hace una media entre los votos de todos los participantes.',0,38),
('Los participantes que seleccionan la carta de la taza de café no participan más en la priorización ya que están cansados.',0,38),
('Cuando un participante selecciona la carta de la pregunta se establece un turno de preguntas al resto de los participantes, para intentar aclarar sus dudas.',0,38);
-- FUNCIÓN PARA ALMACENAR O INTRODUCIR NOTA EN UN CUESTIONARIO DE UN USUARIO
DELIMITER $$
CREATE FUNCTION insert_grade(usr VARCHAR(80), idCuestionario INT, nota FLOAT) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE IDUsr INT;
    DECLARE existe TINYINT;
    DECLARE notaUsr FLOAT;
    SET IDUsr = (SELECT ID FROM usuario WHERE Nombre=usr);
    IF(IDUsr IS NULL) THEN
		RETURN (-1);
    END IF;
    SET existe = (SELECT COUNT(*) FROM autoevaluacion WHERE autoevaluacion.IDUsuario=IDUsr AND autoevaluacion.IDCuestionario=idCuestionario);
    IF(existe > 0) THEN
		SET notaUsr = (SELECT Puntuacion FROM autoevaluacion WHERE autoevaluacion.IDUsuario=IDUsr AND autoevaluacion.IDCuestionario=idCuestionario);
		IF(notaUsr < nota) THEN
			UPDATE autoevaluacion SET Puntuacion=nota WHERE autoevaluacion.IDUsuario=IDUsr AND autoevaluacion.IDCuestionario=idCuestionario;
        END IF;
        RETURN(existe);
	ELSE 
		INSERT INTO autoevaluacion(IDUsuario, IDCuestionario, Puntuacion)
        VALUES(IDUsr,idCuestionario,nota);
    END IF;
    RETURN(0);
END$$


DELIMITER $$
CREATE FUNCTION try_passwd(passwd VARCHAR(40), nombreComprobar VARCHAR(80), usuariosala INT) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE passwd_con_sha VARCHAR(40);
    DECLARE contra_encrip VARCHAR(40);
    DECLARE existe INT;
    IF (usuariosala = 0) THEN
		SET existe = (SELECT COUNT(*) FROM Usuario WHERE NOMBRE=nombreComprobar);
        IF existe=0 THEN
			RETURN 2; -- No existe el usuario
		END IF;
		SET contra_encrip = (SELECT Password FROM Usuario WHERE Nombre=nombreComprobar);
	ELSE 
		SET existe = (SELECT COUNT(*) FROM Sala WHERE NOMBRE=nombreComprobar);
        IF existe=0 THEN
			RETURN 2; -- No existe la sala
		END IF;
		SET contra_encrip = (SELECT Password FROM Sala WHERE Nombre=nombreComprobar);
	END IF;    
    SET passwd_con_sha = SHA(passwd);
    IF(STRCMP(passwd_con_sha,contra_encrip)=0) THEN
		RETURN 0;
	ELSE 
		RETURN 1;
    END IF;
END$$


-- JOIN ROOM (USUARIO, SALA, SOCKETID)
DELIMITER $$
CREATE FUNCTION insertPokerConnection(usrInput VARCHAR(80), roomInput VARCHAR(80), socketInput varchar(22)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE usrID INT;
    DECLARE duplicados INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
        SET duplicados = (SELECT COUNT(*) FROM poker WHERE IDUsuario=usrID AND IDSala=roomID);
        IF (duplicados > 0) THEN
			RETURN 2; -- Ya existe el par
        ELSE
			INSERT INTO poker(IDUsuario, IDSala, SocketID) VALUES (usrID, roomID, socketInput);
			RETURN 0;
        END IF;
	ELSE
		RETURN 1; -- Si no ha encontrado alguno de los dos (usuario o sala)
    END IF;
END$$

-- ELIMINAR USUARIO DE SALA, DEVOLVIENDO LA SALA
DELIMITER $$
CREATE FUNCTION deleteUserPokerRoom(socketInput varchar(22)) 
RETURNS VARCHAR(80)
DETERMINISTIC 
BEGIN
	
    DECLARE roomID INT;
    DECLARE roomName VARCHAR(80);
    
    SET roomID = (SELECT IDSala FROM poker WHERE SocketID=socketInput);
    IF(roomID > 0) THEN
		 DELETE FROM poker 
         WHERE SocketID=socketInput;
         SET roomName = (SELECT Nombre FROM sala WHERE ID=roomID);
         RETURN roomName;
	ELSE
		return '';
    END IF;
    
END$$

-- INSERTAR ESTIMACION
DELIMITER $$
CREATE FUNCTION insertEstimation(usrInput VARCHAR(80), roomInput VARCHAR(80), estimationInput VARCHAR(4)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE roomID INT;
    DECLARE usrID INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
		UPDATE poker 
		SET Estimacion = estimationInput
		WHERE IDSala = roomID AND IDUsuario = usrID;
        RETURN 0;
    ELSE
		RETURN 1;
    END IF;
	
END $$


-- ELIMINAR ESTIMACIONES DE UNA SALA
DELIMITER $$
CREATE FUNCTION resetRoomEstimations(roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE roomID INT;
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    IF(roomID > 0) THEN
		UPDATE poker
		SET Estimacion=DEFAULT
        WHERE poker.IDSala=roomID;
        RETURN 0;
    ELSE
		RETURN 1;
    END IF;
END $$

-- NÚMERO DE ESTIMACIONES DE UNA SALA (SHOWESTIMATIONS)
DELIMITER $$
CREATE FUNCTION showRoomEstimations(roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE roomID INT;
    DECLARE numEstimaciones INT;	
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    IF(roomID > 0) THEN
		SET numEstimaciones = (SELECT COUNT(*) FROM poker WHERE poker.IDSala=roomID AND poker.Estimacion <> '-1');
        RETURN numEstimaciones;
    ELSE
		RETURN -1;
    END IF;
END $$
          
DELIMITER $$
CREATE FUNCTION insertDotVotingConnection(usrInput VARCHAR(80), roomInput VARCHAR(80), socketInput varchar(22)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE usrID INT;
    DECLARE duplicados INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
        SET duplicados = (SELECT COUNT(*) FROM poker WHERE IDUsuario=usrID AND IDSala=roomID);
        IF (duplicados > 0) THEN
			RETURN 2; -- Ya existe el par, nunca va a saltar porque da el fallo como error
        ELSE
			INSERT INTO dotvoting(IDUsuario, IDSala, SocketID) VALUES (usrID, roomID, socketInput);
			RETURN 0;
        END IF;
	ELSE
		RETURN 1; -- Si no ha encontrado alguno de los dos (usuario o sala). No debería saltar ya que se comprueba antes de entrar
    END IF;
END$$


-- INSERTAR NÚMERO DE VOTOS
DELIMITER $$
CREATE FUNCTION insertVotingMode(roomInput VARCHAR(80), votingMode INT) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE duplicados INT;
    
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (roomID > 0) THEN
		UPDATE dotVoting 
		SET Votos = votingMode
		WHERE IDSala = roomID;
        RETURN 0;
	ELSE
		RETURN 1; -- Si no ha encontrado la sala
    END IF;
END$$

-- INSERTAR UNA USER STORy EN LA TABLA USERSTORY
DELIMITER $$
CREATE FUNCTION insertUserStory(titleInput VARCHAR(200), roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    IF (roomID > 0) THEN
		INSERT INTO userstory(Titulo,IDSala)
        VALUES (titleInput, roomID);
        RETURN 0;
	ELSE
		RETURN 1; -- Si no ha encontrado la sala
    END IF;
END$$


-- SELECCIONAR ID DE UNA SALA INTRODUCIDA
DELIMITER $$
CREATE FUNCTION roomID(roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (roomID > 0) THEN
		RETURN roomID;
	ELSE
		RETURN -1; -- Si no ha encontrado la sala
    END IF;
END$$

DELIMITER $$
CREATE FUNCTION userID(userInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE usrID INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=userInput);
    
    IF (usrID > 0) THEN
		RETURN usrID;
	ELSE
		RETURN -1; -- Si no ha encontrado el usuario
    END IF;
END$$

DELIMITER $$
CREATE FUNCTION eliminarPuntosUsrSala(userInput VARCHAR(80), roomInput VARCHAR(80), puntos INT) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE usrID INT;
    DECLARE roomID INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=userInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
		UPDATE dotvoting
        SET Votos = Votos - puntos
        WHERE IDUsuario=usrID
        AND IDSala=roomID;
        RETURN 0;
	ELSE
		RETURN -1; -- Si no ha encontrado el usuario
    END IF;
END$$

-- INSERT RETROSPECTIVE CONNECTION
DELIMITER $$
CREATE FUNCTION insertRetroConnection(usrInput VARCHAR(80), roomInput VARCHAR(80), socketInput varchar(22)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE usrID INT;
    DECLARE duplicados INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
        SET duplicados = (SELECT COUNT(*) FROM retrospectiva WHERE IDUsuario=usrID AND IDSala=roomID);
        IF (duplicados > 0) THEN
			RETURN 2; -- Ya existe el par, nunca va a saltar porque da el fallo como error
        ELSE
			INSERT INTO retrospectiva(IDUsuario, IDSala, SocketID) VALUES (usrID, roomID, socketInput);
			RETURN 0;
        END IF;
	ELSE
		RETURN 1; -- Si no ha encontrado alguno de los dos (usuario o sala). No debería saltar ya que se comprueba antes de entrar
    END IF;
END$$

DELIMITER $$
CREATE FUNCTION saveRetro(titleInput VARCHAR(80), roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE roomID INT;
    DECLARE duplicatedEntry BOOL;
    DECLARE retroIDOut INT;
    SET roomID = (SELECT ID FROM sala WHERE Nombre=roomInput);
    IF (roomID > 0) THEN
		IF((SELECT COUNT(*) FROM historial_retro WHERE Nombre=titleInput AND IDSala=roomID)>=1) THEN
			SET duplicatedEntry = TRUE;
            RETURN -1; -- YA EXISTÍA ESE TITULO EN ESA SALA
		ELSE
			INSERT INTO historial_retro(Nombre,IDSala) VALUES (titleInput,roomID);
            SET retroIDOut = (SELECT ID FROM historial_retro WHERE Nombre=titleInput AND IDSala=roomID);
            RETURN retroIDOut;
        END IF;	
	ELSE 
		RETURN -2; -- NO SE ENCUENTRA LA SALA
    END IF;
END$$

-- INSERT DAILY CONNECTION
DELIMITER $$
CREATE FUNCTION insertDailyConnection(usrInput VARCHAR(80), roomInput VARCHAR(80), socketInput varchar(22)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE usrID INT;
    DECLARE duplicados INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
        SET duplicados = (SELECT COUNT(*) FROM daily WHERE IDUsuario=usrID AND IDSala=roomID);
        IF (duplicados > 0) THEN
			RETURN 2; -- Ya existe el par, nunca va a saltar porque da el fallo como error
        ELSE
			INSERT INTO daily(IDUsuario, IDSala, SocketID) VALUES (usrID, roomID, socketInput);
			RETURN 0;
        END IF;
	ELSE
		RETURN 1; -- Si no ha encontrado alguno de los dos (usuario o sala). No debería saltar ya que se comprueba antes de entrar
    END IF;
END$$

DELIMITER $$
CREATE FUNCTION insertPostitDaily(usrInput VARCHAR(80), roomInput VARCHAR(80), tipoInput TINYINT, tituloInput VARCHAR(300)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE lastID INT;
    DECLARE roomID INT;
    DECLARE usrID INT;
    
	INSERT INTO postit_daily(Titulo, Tipo)
	VALUES(tituloInput,tipoInput);
    SET lastID = (SELECT LAST_INSERT_ID());

    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
	IF (usrID > 0 AND roomID > 0 AND lastID > 0) THEN
		INSERT INTO coloca_postit_daily(IDUsuario, IDSala, IDPostitDaily) 
		VALUES(usrID,roomID,lastID); 
        RETURN 0;
	ELSE 
		RETURN 1;
    END IF;
END $$

DELIMITER $$
CREATE FUNCTION saveDaily(titleInput VARCHAR(80), roomInput VARCHAR(80)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE roomID INT;
    DECLARE duplicatedEntry BOOL;
    DECLARE retroIDOut INT;
    SET roomID = (SELECT ID FROM sala WHERE Nombre=roomInput);
    IF (roomID > 0) THEN
		IF((SELECT COUNT(*) FROM historial_daily WHERE Nombre=titleInput AND IDSala=roomID)>=1) THEN
			SET duplicatedEntry = TRUE;
            RETURN -1; -- YA EXISTÍA ESE TITULO EN ESA SALA
		ELSE
			INSERT INTO historial_daily(Nombre,IDSala) VALUES (titleInput,roomID);
            SET retroIDOut = (SELECT LAST_INSERT_ID());
            RETURN retroIDOut;
        END IF;	
	ELSE 
		RETURN -2; -- NO SE ENCUENTRA LA SALA
    END IF;
END$$


DELIMITER $$
CREATE FUNCTION usrPasswdChange(userInput VARCHAR(80), oldPswd VARCHAR(40), newPswd VARCHAR(40)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE shaOldPswd VARCHAR(40);
	IF ((SELECT nombre FROM usuario WHERE Nombre=userInput) IS NOT NULL) THEN
		SET shaOldPswd = SHA(oldPswd);
        IF ((SELECT Password as p FROM usuario WHERE Nombre=userInput) = shaOldPswd) THEN
			UPDATE usuario SET Password = SHA(newPswd) WHERE Nombre=userInput;
            RETURN 0;
        ELSE
			RETURN 2;
        END IF;
	ELSE
		RETURN 1;
    END IF;
END $$

DELIMITER $$
CREATE FUNCTION roomPasswdChange(roomInput VARCHAR(80), oldPswd VARCHAR(40), newPswd VARCHAR(40)) 
RETURNS INT
DETERMINISTIC 
BEGIN
	DECLARE shaOldPswd VARCHAR(40);
	IF ((SELECT nombre FROM sala WHERE Nombre=roomInput) IS NOT NULL) THEN
		SET shaOldPswd = SHA(oldPswd);
        IF ((SELECT Password as p FROM sala WHERE Nombre=roomInput) = shaOldPswd) THEN
			UPDATE sala SET Password = SHA(newPswd) WHERE Nombre=roomInput;
            RETURN 0;
        ELSE
			RETURN 2;
        END IF;
	ELSE
		RETURN 1;
    END IF;
END $$


/*
	NUEVO
*/

CREATE TABLE retrospectiva_calif(
	IDUsuario INT NOT NULL,
    IDSala INT NOT NULL,
    SocketID VARCHAR(22),
    PRIMARY KEY(IDUsuario, IDSala),
    CONSTRAINT FK_usRetroCalif FOREIGN KEY(IDUsuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    CONSTRAINT FK_roomRetroCalif FOREIGN KEY(IDSala) REFERENCES Sala(ID) ON DELETE CASCADE
);

CREATE TABLE historial_retro_calif(
	ID int NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(80) NOT NULL,
    IDSala INT NOT NULL,
	PRIMARY KEY(ID),
    CONSTRAINT FKRetroCalif_history FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE,
    CONSTRAINT UniqueRetroCalifNameInRoom UNIQUE(Nombre, IDSala) 
);

CREATE TABLE postit_retro_calif(
	ID INT NOT NULL AUTO_INCREMENT,
    Titulo VARCHAR(200) NOT NULL,
    IDSala INT NOT NULL,
    Tipo TINYINT NOT NULL DEFAULT 0,
    IDRetro INT,
    PRIMARY KEY(ID),
    CONSTRAINT FKPostit_retroCalif FOREIGN KEY (IDSala) REFERENCES Sala(ID) ON DELETE CASCADE,
    CONSTRAINT FKIDRetro_retroCalif FOREIGN KEY (IDRetro) REFERENCES historial_retro_calif(ID) ON DELETE CASCADE
);

-- INSERT RETROSPECTIVE CONNECTION
DELIMITER $$
CREATE FUNCTION insertRetroCalifConnection(usrInput VARCHAR(80), roomInput VARCHAR(80), socketInput varchar(22)) 
RETURNS INT
DETERMINISTIC 
BEGIN
    DECLARE roomID INT;
    DECLARE usrID INT;
    DECLARE duplicados INT;
    
    SET usrID=(SELECT ID FROM usuario WHERE usuario.Nombre=usrInput);
    SET roomID=(SELECT ID FROM sala WHERE sala.Nombre=roomInput);
    
    IF (usrID > 0 AND roomID > 0) THEN
        SET duplicados = (SELECT COUNT(*) FROM retrospectiva_calif WHERE IDUsuario=usrID AND IDSala=roomID);
        IF (duplicados > 0) THEN
			RETURN 2; -- Ya existe el par, nunca va a saltar porque da el fallo como error
        ELSE
			INSERT INTO retrospectiva_calif(IDUsuario, IDSala, SocketID) VALUES (usrID, roomID, socketInput);
			RETURN 0;
        END IF;
	ELSE
		RETURN 1; -- Si no ha encontrado alguno de los dos (usuario o sala). No debería saltar ya que se comprueba antes de entrar
    END IF;
END$$

