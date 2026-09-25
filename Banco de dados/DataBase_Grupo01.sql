-- GRUPO 01:

CREATE DATABASE infoconnect; 

USE infoconnect;

CREATE TABLE supermercado (
idSupermercado INT PRIMARY KEY AUTO_INCREMENT,
nomeFantasia VARCHAR(50) NOT NULL,
cnpj CHAR(18) UNIQUE NOT NULL,
responsavel VARCHAR(50) NOT NULL,
telefone CHAR(11),
email VARCHAR(40) NOT NULL,
CONSTRAINT chkEmail CHECK( email LIKE '%@%.%'),
estado CHAR(2),
cidade VARCHAR(50) NOT NULL,
logradouro VARCHAR(50) NOT NULL 
);

CREATE TABLE monitoramento (
idMonitoramento INT PRIMARY KEY AUTO_INCREMENT,
dataHora DATETIME NOT NULL,
fluxoPessoas INT NOT NULL,
tempoPermanenciaS FLOAT NOT NULL,
distanciaCm FLOAT NOT NULL 
);


CREATE TABLE sensor (
idSensor INT PRIMARY KEY AUTO_INCREMENT,
tipoSensor VARCHAR(10),
dtInstalacao DATE,
corredor INT NOT NULL,
statuss VARCHAR(15) NOT NULL,
CONSTRAINT chkStatus CHECK( statuss IN('Ativo', 'Inativo', 'Em manutenção')),
ultimaManutencao DATE,
fkSupermercado INT,
fkMonitoramento INT
);

ALTER TABLE sensor 
ADD CONSTRAINT fkMonitoramentoSensor
	FOREIGN KEY (fkMonitoramento)
		REFERENCES monitoramento(idMonitoramento),
ADD CONSTRAINT fkSupermercadoSensor
	FOREIGN KEY (fkSupermercado)
		REFERENCES supermercado(idSupermercado);

CREATE TABLE usuario(
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45),
cargo VARCHAR(45),
fkUsuario INT,
CONSTRAINT usuario_usuario
	FOREIGN KEY (fkUsuario)
		REFERENCES usuario (idUsuario)
);

INSERT INTO supermercado (nomeFantasia, cnpj, responsavel, telefone, email, estado, cidade, logradouro) VALUES
('Supermercado Pague Menos', '12.345.678/0001-90', 'Carlos Almeida', '11987654321', 'carlos@paguemenos.com', 'SP', 'São Paulo', 'Rua das Flores'),
('Mercado São José', '23.456.789/0001-81', 'Mariana Souza', '11976543210', 'mariana@mercadosaojose.com', 'SP', 'Campinas', 'Avenida Brasil'),
('Supermercado Boa Esperança', '34.567.890/0001-72', 'Rafael Costa', '21965432109', 'rafael@boaesperanca.com', 'RJ', 'Rio de Janeiro', 'Rua Central'),
('Mercadinho do Bairro', '45.678.901/0001-63', 'Fernanda Lima', '31954321098', 'fernanda@mercadinhodobairro.com', 'MG', 'Belo Horizonte', 'Rua Principal'),
('Supermercado Avenida', '56.789.012/0001-54', 'Lucas Mendes', '41943210987', 'lucas@superavenida.com', 'PR', 'Curitiba', 'Avenida Paraná'),
('Mercado Primavera', '67.890.123/0001-45', 'Juliana Rocha', '51932109876', 'juliana@mercadoprimavera.com', 'RS', 'Porto Alegre', 'Rua Primavera'),
('Supermercado Estrela', '78.901.234/0001-36', 'André Martins', '71921098765', 'andre@superestrela.com', 'BA', 'Salvador', 'Avenida Bahia'),
('Mercado Central', '89.012.345/0001-27', 'Patrícia Gomes', '61910987654', 'patricia@mercadocentral.com', 'DF', 'Brasília', 'Rua Central'),
('Supermercado Nova Era', '90.123.456/0001-18', 'Bruno Oliveira', '81999887766', 'bruno@supernovaera.com', 'PE', 'Recife', 'Avenida Recife'),
('Mercadinho São Lucas', '01.234.567/0001-09', 'Camila Ferreira', '85988776655', 'camila@mercadinhosaolucas.com', 'CE', 'Fortaleza', 'Rua São Lucas');

INSERT INTO monitoramento (dataHora, fluxoPessoas, tempoPermanenciaS, distanciaCm) VALUES
('2026-09-01 08:00:00', 125, 45.5, 80.2),
('2026-09-01 10:30:00', 210, 62.3, 75.8),
('2026-09-01 12:00:00', 350, 80.7, 68.4),
('2026-09-02 09:15:00', 180, 55.2, 72.6),
('2026-09-02 11:45:00', 275, 70.8, 65.3),
('2026-09-02 14:30:00', 320, 85.4, 60.9),
('2026-09-03 08:20:00', 145, 40.6, 82.1),
('2026-09-03 13:10:00', 290, 77.5, 69.7),
('2026-09-04 16:00:00', 410, 95.2, 55.8),
('2026-09-05 18:30:00', 380, 88.9, 58.5);

INSERT INTO sensor (tipoSensor, dtInstalacao, corredor, statuss, ultimaManutencao, fkSupermercado, fkMonitoramento) VALUES
('HC-SR04', '2025-01-10', 1, 'Ativo', '2025-08-10', 1, 1),
('HC-SR04', '2025-01-15', 3, 'Ativo', '2025-07-15', 2, 2),
('HC-SR04', '2025-02-05', 5, 'Inativo', '2025-08-05', 3, 3),
('HC-SR04', '2025-02-18', 4, 'Ativo', '2025-08-18', 4, 4),
('HC-SR04', '2025-03-12', 2, 'Em manutenção', '2025-09-01', 5, 5),
('HC-SR04', '2025-04-20', 10, 'Ativo', '2025-08-20', 6, 6),
('HC-SR04', '2025-05-08', 15, 'Ativo', '2025-08-08', 7, 7),
('HC-SR04', '2025-06-14', 11, 'Inativo', '2025-07-14', 8, 8),
('HC-SR04', '2025-07-25', 4, 'Ativo', '2025-08-25', 9, 9),
('HC-SR04', '2025-08-03', 7, 'Em manutenção', '2025-09-03', 10, 10);

INSERT INTO usuario VALUES
(default, 'Carlos Almeida', 'Gerente', NULL),
(default, 'Mariana Souza', 'Supervisora', 1),
(default, 'Rafael Costa', 'Analista', 1),
(default, 'Fernanda Lima', 'Operadora', 2),
(default, 'Lucas Mendes', 'Operador', 2),
(default, 'Juliana Rocha', 'Analista', 3),
(default, 'André Martins', 'Técnico', 3),
(default, 'Patrícia Gomes', 'Supervisora', 1),
(default, 'Bruno Oliveira', 'Operador', 8),
(default, 'Camila Ferreira', 'Operadora', 8);


-- SELECTS TABELA CLIENTE --
SELECT * FROM cliente;

SELECT
	CONCAT('Empresa: ', nomeFantasia, ' | CNPJ: ', CNPJ, ' | Responsável: ', responsavel, ' | Email: ', email) AS 'Dados do Cliente'
FROM cliente;

SELECT nomeFantasia, CNPJ, responsavel, email FROM cliente
	WHERE nomeFantasia LIKE 'Supermercado%';
    
SELECT nomeFantasia AS 'Empresa', responsavel AS 'Responsável', telefone AS 'Telefone para contato', cidade AS 'Cidade',
	CASE
    WHEN UF = 'SP'
    THEN 'São Paulo'
    END AS 'Estado'
FROM cliente
	WHERE UF = 'SP';
    
-- SELECTS TABELA SENSOR --
SELECT * FROM sensor;

SELECT 
	CONCAT('Tipo de sensor: ', tipoSensor, ' | Data de Instalação: ', dtInstalacao, ' | Localização do sensor: Corredor ', corredor, 
    ' | Status: ', statuss) AS 'Dados do Sensor'
FROM sensor;

SELECT tipoSensor AS 'Nome do sensor',
	CASE
    WHEN tipoSensor = 'HC-SR04'
	THEN 'Sensor Ultrassônico de Distância'
    END AS 'Tipo do sensor',
    CONCAT('Corredor ', corredor) AS 'Corredor da instalação', dtInstalacao AS 'Data da instalação'
FROM sensor;

-- SELECTS TABELA MONITORAMENTO -- 
SELECT * FROM monitoramento;

SELECT fluxoPessoas AS 'Quantidade de pessoas que passaram no corredor', tempoPermanenciaS AS 'Tempo de permanência (seg)', distanciaCm AS 'Distância (cm)'
FROM monitoramento;

SELECT fluxoPessoas AS 'Quantidade de pessoas que passaram no corredor', tempoPermanenciaS AS 'Tempo de permanência (seg)',
	CONCAT(FORMAT((fluxoPessoas / tempoPermanenciaS), 2)) AS 'Tempo de permanencia médio por pessoa'
FROM monitoramento;