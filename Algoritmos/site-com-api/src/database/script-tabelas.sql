-- Execute este arquivo com um usuario administrador do MySQL.
-- Ajuste a senha abaixo e depois configure a mesma senha no .env.dev.
CREATE DATABASE IF NOT EXISTS infoconnect;
USE infoconnect;

CREATE USER IF NOT EXISTS 'infoconnect_app'@'localhost'
    IDENTIFIED BY 'ALTERE_ESTA_SENHA';
GRANT SELECT, INSERT ON infoconnect.* TO 'infoconnect_app'@'localhost';
FLUSH PRIVILEGES;

-- endereco: localizacao de cada supermercado.
CREATE TABLE endereco (
    idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    uf CHAR(2),
    cidade VARCHAR(100),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    cep CHAR(8)
);

-- cliente: responsavel pela conta e pelo acesso ao painel.
CREATE TABLE cliente (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) UNIQUE,
    senha VARCHAR(100),
    nome VARCHAR(100),
    cpf CHAR(11)
);

-- supermercado: um cliente pode cadastrar mais de uma loja.
CREATE TABLE supermercado (
    idSupermercado INT PRIMARY KEY AUTO_INCREMENT,
    nomeFantasia VARCHAR(120),
    cnpj CHAR(14) UNIQUE,
    telefoneContato CHAR(11),
    fkCliente INT,
    fkEndereco INT,
    CONSTRAINT fk_supermercado_cliente FOREIGN KEY (fkCliente)
        REFERENCES cliente(idCliente),
    CONSTRAINT fk_supermercado_endereco FOREIGN KEY (fkEndereco)
        REFERENCES endereco(idEndereco)
);

-- setor: identifica as gondolas monitoradas.
CREATE TABLE setor (
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    nomeSetor VARCHAR(80),
    gondola VARCHAR(80),
    fkSupermercado INT,
    CONSTRAINT fk_setor_supermercado FOREIGN KEY (fkSupermercado)
        REFERENCES supermercado(idSupermercado)
);

-- sensor: identifica o aparelho instalado em cada setor.
CREATE TABLE sensor (
    idSensor INT PRIMARY KEY AUTO_INCREMENT,
    tipoSensor VARCHAR(30) DEFAULT 'HC-SR04',
    dtInstalacao DATE,
    status ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo',
    ultimaManutencao DATE,
    fkSetor INT,
    CONSTRAINT fk_sensor_setor FOREIGN KEY (fkSetor)
        REFERENCES setor(idSetor),
    CONSTRAINT chk_sensor_manutencao CHECK (
        ultimaManutencao IS NULL OR ultimaManutencao >= dtInstalacao
    )
);

-- registro: uma leitura de distancia por sensor.
CREATE TABLE registro (
    idRegistro INT PRIMARY KEY AUTO_INCREMENT,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    distanciaCm DECIMAL(6,2),
    fkSensor INT,
    CONSTRAINT fk_registro_sensor FOREIGN KEY (fkSensor)
        REFERENCES sensor(idSensor)
);

-- inserts

-- ENDERECO
-- Cadastra os enderecos dos supermercados.

INSERT INTO endereco (uf, cidade, logradouro, numero, cep) VALUES
('SP', 'São Paulo', 'Rua Augusta', '1500', '01305000'),
('SP', 'São Paulo', 'Avenida Paulista', '800', '01310000'),
('SP', 'Campinas', 'Rua das Flores', '250', '13010000');


-- CLIENTE
-- Cadastra os clientes que possuem supermercados.

INSERT INTO cliente (nome, email, senha, cpf) VALUES
('Carlos Silva', 'carlos@gmail.com', '123456', '12345678901'),
('Mariana Costa', 'mariana@gmail.com', '654321', '98765432100');


-- SUPERMERCADO
-- Cadastra os supermercados vinculados aos clientes.

INSERT INTO supermercado (nomeFantasia, cnpj, telefoneContato, fkCliente, fkEndereco) VALUES
('Mercado Central', '12345678000190', '11987654321', 1, 1),
('Super Bom', '98765432000110', '11976543210', 1, 2),
('Mercado Popular', '45678912000155', '19988887777', 2, 3);


-- SETOR
-- Cadastra os setores e gondolas monitoradas.

INSERT INTO setor (nomeSetor, gondola, fkSupermercado) VALUES
('Bebidas', 'Gondola A1', 1),
('Limpeza', 'Gondola B1', 1),
('Alimentos', 'Gondola C1', 2),
('Higiene', 'Gondola D1', 3);


-- SENSOR
-- Cadastra os sensores instalados em cada setor.

INSERT INTO sensor (tipoSensor, dtInstalacao, status, ultimaManutencao, fkSetor) VALUES
('HC-SR04', '2026-10-01', 'ativo', NULL, 1),
('HC-SR04', '2026-10-02', 'ativo', NULL, 2),
('HC-SR04', '2026-10-03', 'ativo', NULL, 3),
('HC-SR04', '2026-10-04', 'manutencao', '2026-10-20', 4);


-- REGISTRO
-- Registra as distancias identificadas pelos sensores.

INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES
('2026-10-28 10:00:00', 150.00, 1),
('2026-10-28 10:01:00', 80.00, 1),
('2026-10-28 10:02:00', 45.00, 1),
('2026-10-28 10:03:00', 120.00, 1),

('2026-10-28 10:00:00', 200.00, 2),
('2026-10-28 10:01:00', 90.00, 2),
('2026-10-28 10:02:00', 35.00, 2),

('2026-10-28 10:00:00', 180.00, 3),
('2026-10-28 10:01:00', 60.00, 3),
('2026-10-28 10:02:00', 25.00, 3);






-- selects


-- Aproximacoes por setor na semana.
SELECT st.nomeSetor, st.gondola, r.dataHora, r.distanciaCm
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN setor st ON s.fkSetor = st.idSetor
WHERE r.distanciaCm < 90
AND r.dataHora >= '2026-10-19'
AND r.dataHora < '2026-10-26'
ORDER BY r.dataHora;


-- Aproximacoes nos pontos C e D.
SELECT st.nomeSetor, st.gondola, r.dataHora, r.distanciaCm
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN setor st ON s.fkSetor = st.idSetor
WHERE r.distanciaCm < 90
AND (st.idSetor = 3 OR st.idSetor = 4);


-- Aproximacoes entre 12h e 16h de quarta-feira.
SELECT st.nomeSetor, r.dataHora, r.distanciaCm
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN setor st ON s.fkSetor = st.idSetor
WHERE r.distanciaCm < 90
AND r.dataHora >= '2026-10-21 12:00:00'
AND r.dataHora < '2026-10-21 16:00:00';


-- Enderecos cadastrados.
SELECT * FROM endereco;


-- Clientes cadastrados.
SELECT idCliente, nome, email, cpf FROM cliente;


-- Supermercados do cliente 1.
SELECT * FROM supermercado
WHERE fkCliente = 1;


-- Setores do supermercado 1.
SELECT * FROM setor
WHERE fkSupermercado = 1;


-- Sensores ativos.
SELECT * FROM sensor
WHERE status = 'ativo';


-- Registros de aproximacao.
SELECT * FROM registro
WHERE distanciaCm < 90;