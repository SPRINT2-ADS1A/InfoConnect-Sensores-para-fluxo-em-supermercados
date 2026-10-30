CREATE DATABASE IF NOT EXISTS infoconnect;


USE infoconnect;


CREATE USER IF NOT EXISTS 'infoconnect_app'@'%' IDENTIFIED BY 'Arduino123@'


GRANT SELECT, INSERT ON infoconnect.* TO 'infoconnect_app'@'%';


FLUSH PRIVILEGES;


CREATE TABLE endereco (idEndereco INT PRIMARY KEY AUTO_INCREMENT, uf CHAR(2), cidade VARCHAR(100), logradouro VARCHAR(200), numero VARCHAR(20), cep CHAR(8));


CREATE TABLE cliente (idCliente INT PRIMARY KEY AUTO_INCREMENT, email VARCHAR(150) UNIQUE, senha VARCHAR(100), nome VARCHAR(100), cpf CHAR(11), fkSupermercado INT);


CREATE TABLE supermercado (idSupermercado INT PRIMARY KEY AUTO_INCREMENT, nomeFantasia VARCHAR(120), cnpj CHAR(14) UNIQUE, emailInstitucional VARCHAR(150), telefoneContato CHAR(11), fkCliente INT, fkEndereco INT, CONSTRAINT fk_supermercado_cliente FOREIGN KEY (fkCliente) REFERENCES cliente(idCliente), CONSTRAINT fk_supermercado_endereco FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco));


ALTER TABLE cliente ADD CONSTRAINT fk_cliente_supermercado FOREIGN KEY (fkSupermercado) REFERENCES supermercado(idSupermercado);


CREATE TABLE setor (idSetor INT PRIMARY KEY AUTO_INCREMENT, nomeSetor VARCHAR(80), gondola VARCHAR(80), fkSupermercado INT, CONSTRAINT fk_setor_supermercado FOREIGN KEY (fkSupermercado) REFERENCES supermercado(idSupermercado));


CREATE TABLE sensor (idSensor INT PRIMARY KEY AUTO_INCREMENT, tipoSensor VARCHAR(30) DEFAULT 'HC-SR04', dtInstalacao DATE, status ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo', ultimaManutencao DATE, fkSetor INT, CONSTRAINT fk_sensor_setor FOREIGN KEY (fkSetor) REFERENCES setor(idSetor), CONSTRAINT chk_sensor_manutencao CHECK (ultimaManutencao IS NULL OR ultimaManutencao >= dtInstalacao));


CREATE TABLE registro (idRegistro INT PRIMARY KEY AUTO_INCREMENT, dataHora DATETIME DEFAULT CURRENT_TIMESTAMP, distanciaCm DECIMAL(6,2), fkSensor INT, CONSTRAINT fk_registro_sensor FOREIGN KEY (fkSensor) REFERENCES sensor(idSensor));


INSERT INTO cliente (nome, email, senha) VALUES ('Ana Ribeiro', 'ana.ribeiro@infoconnect.test', 'senha123'), ('Bruno Martins', 'bruno.martins@infoconnect.test', 'senha123'), ('Carla Ferreira', 'carla.ferreira@infoconnect.test', 'senha123');


INSERT INTO endereco (uf, cidade, logradouro, numero, cep) VALUES ('SP', 'Sao Paulo', 'Rua Exemplo das Lojas', '120', '01001000'), ('SP', 'Sao Paulo', 'Avenida Ficticia do Mercado', '855', '04002000'), ('SP', 'Campinas', 'Rua Demonstracao', '42', '13010000');


INSERT INTO supermercado (nomeFantasia, cnpj, emailInstitucional, fkCliente, fkEndereco) VALUES ('Mercado Aurora', '12345678000195', 'contato@aurora.test', 1, 1), ('Supermercado Horizonte', '98765432000100', 'contato@horizonte.test', 2, 2), ('Mercado Bairro Bom', '11222333000181', 'contato@bairro-bom.test', 3, 3);


INSERT INTO cliente (nome, email, senha, fkSupermercado) VALUES ('Mariana Silva', 'mariana@aurora.test', 'senha1234', 1), ('Pedro Almeida', 'pedro@aurora.test', 'senha1234', 1), ('Luiza Costa', 'luiza@horizonte.test', 'senha1234', 2), ('Rafael Souza', 'rafael@bairro-bom.test', 'senha1234', 3);


INSERT INTO setor (nomeSetor, gondola, fkSupermercado) VALUES ('Bebidas', 'B1', 1), ('Higiene', 'H1', 1), ('Mercearia', 'M1', 1), ('Bebidas', 'B2', 2), ('Laticinios', 'L1', 2), ('Hortifruti', 'HF1', 3);


INSERT INTO sensor (tipoSensor, dtInstalacao, status, ultimaManutencao, fkSetor) VALUES ('HC-SR04', '2026-09-30', 'ativo', '2026-10-20', 1), ('HC-SR04', '2026-09-30', 'ativo', NULL, 2), ('HC-SR04', '2026-10-01', 'ativo', '2026-10-19', 3), ('HC-SR04', '2026-10-02', 'manutencao', '2026-10-27', 4), ('HC-SR04', '2026-10-02', 'ativo', NULL, 5), ('HC-SR04', '2026-10-03', 'ativo', '2026-10-18', 6);


INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-27 09:00:00', 120.00, 1), ('2026-10-27 09:00:01', 55.00, 1), ('2026-10-27 09:00:02', 48.00, 1), ('2026-10-27 09:00:03', 47.00, 1), ('2026-10-27 09:00:04', 115.00, 1), ('2026-10-27 10:30:00', 140.00, 1), ('2026-10-27 10:30:01', 68.00, 1), ('2026-10-27 10:30:03', 61.00, 1), ('2026-10-27 10:30:05', 125.00, 1);
