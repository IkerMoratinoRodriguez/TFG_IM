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
            Titulo VARCHAR(200) UNIQUE NOT NULL,
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
('El manifesto Ágil de 2001 define:',1),
('Seleccione el valor ágil FALSO',1),
('Sobre las metodologías ágiles...',1),
('¿Cuál de los siguientes es un principio ágil?',1);

INSERT INTO Opcion(Enunciado, Validez, IDPregunta) VALUES
('4 valores y 12 principios ágiles',1,1),
('4 valores y 4 principios ágiles',0,1),
('12 valores y 12 principios ágiles',0,1),
('12 valores y 4 principios ágiles',0,1),
('Individuos e interacciones sobre procesos y herramientas',0,2),
('Documentación extensiva sobre software funcional',1,2),
('Colaboración con el cliente sobre negociación contractual',0,2),
('Respuesta ante el cambio sobre seguir un plan',0,2),
('Fueron desarrolladas para la industra del software',1,3),
('Hoy en día se utilizan exclusivamente en la industria del software',0,3),
('Ya no se usan en la industria del software',0,3),
('Fueron desarrolladas en la automoción y se importaron a la industria del software',0,3),
('El software funcionando es la medida principal de progreso',1,4),
('Individuos e interacciones sobre procesos y herramientas',0,4),
('Nuestra mayor prioridad es satisfacer al cliente mediante una entrega grande de software al final del proyecto',0,4),
('El software aporta más valor, cuanto más complejo sea',0,4);

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
    SET existe = (SELECT COUNT(*) FROM autoevaluacion WHERE IDUsuario=IDUsr AND IDCuestionario=idCuestionario);
    IF(existe > 0) THEN
		SET notaUsr = (SELECT Puntuacion FROM autoevaluacion WHERE IDUsuario=IDUsr AND IDCuestionario=idCuestionario);
		IF(notaUsr < nota) THEN
			UPDATE autoevaluacion SET Puntuacion=nota WHERE IDUsuario=IDUsr AND IDCuestionario=idCuestionario;
        END IF;
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
        SET duplicados = (SELECT COUNT(*) FROM poker WHERE IDUsuario=usrID AND IDSala=roomID);
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

