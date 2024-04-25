CREATE DATABASE universidad;
USE universidad;


CREATE TABLE ciclosEscolar (
  idCiclo INT(11)AUTO_INCREMENT,
  fechaInicio DATE,
  fechaFin DATE,
  PRIMARY KEY (idCiclo)
);

CREATE TABLE pagos (
  idPago INT(11) AUTO_INCREMENT,
  idUsuario INT(11),
  monto DECIMAL(10,2),
  fechaEmision DATE,
  fechaPago DATE,
  estado VARCHAR(50),
  modalidad VARCHAR(50),
  concepto VARCHAR(50),
  PRIMARY KEY (idPago)
);

CREATE TABLE relación Usuario Ciclo (
  idRelacion INT(11) AUTO_INCREMENT,
  idUsuario INT(11),
  idCiclo INT(11),
  PRIMARY KEY (idRelacion)
);

CREATE TABLE usuarios (
  idUsuario INT(11) AUTO_INCREMENT,
  Nombre VARCHAR(50),
  Apellido_paterno VARCHAR(50),
  Apellido_materno VARCHAR(50),
  Correo VARCHAR(50),
  Contraseña VARCHAR(12),
  Matricula VARCHAR(7),
  Telefono INT(8),
  Referencia INT(8),
  PRIMARY KEY (idUsuario)
);