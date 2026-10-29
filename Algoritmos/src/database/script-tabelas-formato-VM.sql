CREATE DATABASE IF NOT EXISTS infoconnect;
USE infoconnect;
CREATE USER IF NOT EXISTS 'infoconnect_app'@'localhost' IDENTIFIED BY 'Arduino123@';
GRANT SELECT, INSERT ON infoconnect.* TO 'infoconnect_app'@'localhost';
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

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-27 09:05:00', 150.00, 2), ('2026-10-27 09:05:01', 70.00, 2), ('2026-10-27 09:05:02', 59.00, 2), ('2026-10-27 09:05:03', 58.00, 2), ('2026-10-27 09:05:05', 130.00, 2), ('2026-10-27 11:10:00', 115.00, 2), ('2026-10-27 11:10:01', 95.00, 2), ('2026-10-27 11:10:02', NULL, 2);

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-26 14:20:00', 108.00, 3), ('2026-10-26 14:20:01', 72.00, 3), ('2026-10-26 14:20:04', 119.00, 3), ('2026-10-27 16:42:00', 125.00, 3), ('2026-10-27 16:42:01', 63.00, 3), ('2026-10-27 16:42:02', 60.00, 3), ('2026-10-27 16:42:05', 122.00, 3);

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-26 11:10:00', 145.00, 4), ('2026-10-26 11:10:01', 75.00, 4), ('2026-10-26 11:10:05', 140.00, 4), ('2026-10-27 13:15:00', NULL, 4);

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-27 08:40:00', 135.00, 5), ('2026-10-27 08:40:01', 58.00, 5), ('2026-10-27 08:40:05', 128.00, 5), ('2026-10-27 12:25:00', 123.00, 5), ('2026-10-27 12:25:01', 65.00, 5), ('2026-10-27 12:25:02', 53.00, 5), ('2026-10-27 12:25:05', 133.00, 5);

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES ('2026-10-27 10:50:00', 149.00, 6), ('2026-10-27 10:50:01', 61.00, 6), ('2026-10-27 10:50:04', 110.00, 6), ('2026-10-27 15:30:00', 134.00, 6), ('2026-10-27 15:30:01', 88.00, 6), ('2026-10-27 15:30:02', 93.00, 6);

SELECT idCliente, nome, email FROM cliente ORDER BY nome;

SELECT sm.nomeFantasia AS supermercado, c.nome AS clienteResponsavel, e.cidade, e.uf FROM supermercado AS sm JOIN cliente AS c ON sm.fkCliente = c.idCliente JOIN endereco AS e ON sm.fkEndereco = e.idEndereco ORDER BY sm.nomeFantasia;

SELECT se.idSensor, se.tipoSensor, se.status, st.nomeSetor, st.gondola, sm.nomeFantasia AS supermercado FROM sensor AS se JOIN setor AS st ON se.fkSetor = st.idSetor JOIN supermercado AS sm ON st.fkSupermercado = sm.idSupermercado ORDER BY sm.nomeFantasia, st.nomeSetor;

SELECT se.idSensor, se.status, COUNT(r.idRegistro) AS totalLeituras FROM sensor AS se LEFT JOIN registro AS r ON se.idSensor = r.fkSensor GROUP BY se.idSensor, se.status ORDER BY totalLeituras DESC;

SELECT st.nomeSetor, st.gondola, sm.nomeFantasia AS supermercado, COUNT(r.idRegistro) AS totalLeituras FROM registro AS r JOIN sensor AS se ON r.fkSensor = se.idSensor JOIN setor AS st ON se.fkSetor = st.idSetor JOIN supermercado AS sm ON st.fkSupermercado = sm.idSupermercado GROUP BY st.nomeSetor, st.gondola, sm.nomeFantasia ORDER BY totalLeituras DESC;

SELECT fkSensor, ROUND(AVG(distanciaCm), 2) AS distanciaMediaCm FROM registro WHERE distanciaCm IS NOT NULL GROUP BY fkSensor ORDER BY fkSensor;

SELECT DATE_FORMAT(dataHora, '%Y-%m-%d %H:00:00') AS hora, COUNT(*) AS totalLeituras FROM registro GROUP BY DATE_FORMAT(dataHora, '%Y-%m-%d %H:00:00') ORDER BY hora;

SELECT se.idSensor, se.status, MAX(r.dataHora) AS ultimaLeitura FROM sensor AS se LEFT JOIN registro AS r ON r.fkSensor = se.idSensor GROUP BY se.idSensor, se.status ORDER BY se.idSensor;

SELECT se.idSensor, MAX(r.dataHora) AS ultimaLeitura FROM sensor AS se LEFT JOIN registro AS r ON r.fkSensor = se.idSensor WHERE se.status = 'ativo' GROUP BY se.idSensor HAVING ultimaLeitura IS NULL OR TIMESTAMPDIFF(MICROSECOND, ultimaLeitura, NOW(3)) > 2000000;

SELECT sm.nomeFantasia AS supermercado, COUNT(r.idRegistro) AS totalLeituras FROM supermercado AS sm JOIN setor AS st ON st.fkSupermercado = sm.idSupermercado JOIN sensor AS se ON se.fkSetor = st.idSetor JOIN registro AS r ON r.fkSensor = se.idSensor GROUP BY sm.nomeFantasia ORDER BY totalLeituras DESC;

SELECT * FROM registro WHERE fkSensor = 1 ORDER BY dataHora;
