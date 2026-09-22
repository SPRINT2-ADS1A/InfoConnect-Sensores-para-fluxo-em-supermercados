-- GRUPO 5:
-- BIANCA FERREIRA DE MELO - RA: 01262000
-- GABRIELA FERREIRA CAMARGO MARCELINO - RA: 01262007
-- GREGORY LOPES PEDROSO CASARINI - RA: 01262110
-- ISABELLE SILVA BACCO - RA: 01262085
-- JULIA CAROLINA BRITO DOS SANTOS - RA: 01262062
-- KAUÃ AUGUSTO DE ARAÚJO ÁGUAS - RA: 01262114
-- LAURA DE ARAÚJO - RA: 01262023
-- LUCA KENZO PONGELUPPE YAMAMURA - RA: 01262121
-- PEDRO HENRIQUE RODRIGUES DO AMARAL - RA: 01262017
-- VIVIANE MEIRA MARQUES - RA: 01262064
-- ZANEE LOPES PEREIRA - RA: 01262083


CREATE DATABASE infoconnect; 

USE infoconnect;

CREATE TABLE cliente (
idCliente INT PRIMARY KEY AUTO_INCREMENT,
nomeFantasia VARCHAR(50) NOT NULL,
CNPJ CHAR(18) UNIQUE NOT NULL,
responsavel VARCHAR(100) NOT NULL,
telefone CHAR(11),
email VARCHAR(40) NOT NULL,
CONSTRAINT chkEmail CHECK( email LIKE '%@%.%'),
dtAdesao DATE NOT NULL,
vencimentoContrato DATE,
cidade VARCHAR(50) NOT NULL,
UF CHAR(2) NOT NULL 
);

CREATE TABLE sensor (
idSensor INT PRIMARY KEY AUTO_INCREMENT,
tipoSensor VARCHAR(10),
dtInstalacao DATETIME,
corredor INT NOT NULL,
statuss VARCHAR(20) NOT NULL,
CONSTRAINT chkStatus CHECK( statuss IN('Ativo', 'Inativo', 'Em manutenção')),
ultimaManutencao DATETIME
);


CREATE TABLE monitoramento (
idMonitoramento INT PRIMARY KEY AUTO_INCREMENT,
dataHora DATETIME NOT NULL,
fluxoPessoas INT NOT NULL,
tempoPermanenciaS FLOAT NOT NULL,
distanciaCm FLOAT NOT NULL 
);

INSERT INTO cliente VALUES
(default,'Supermercado Pague Menos', '12.345.678/0001-90', 'Carlos Almeida', '11987654321', 'carlos@paguemenos.com', '2025-01-15', '2027-01-15', 'São Paulo', 'SP'),
(default,'Mercado São José', '23.456.789/0001-81', 'Mariana Souza', '11976543210', 'mariana@mercadosaojose.com', '2025-02-20', '2027-02-20', 'Campinas', 'SP'),
(default,'Supermercado Boa Esperança', '34.567.890/0001-72', 'Rafael Costa', '21965432109', 'rafael@boaesperanca.com', '2025-03-10', '2027-03-10', 'Rio de Janeiro', 'RJ'),
(default,'Mercadinho do Bairro', '45.678.901/0001-63', 'Fernanda Lima', '31954321098', 'fernanda@mercadinhodobairro.com', '2025-04-05', '2027-04-05', 'Belo Horizonte', 'MG'),
(default,'Supermercado Avenida', '56.789.012/0001-54', 'Lucas Mendes', '41943210987', 'lucas@superavenida.com', '2025-05-12', '2027-05-12', 'Curitiba', 'PR'),
(default,'Mercado Primavera', '67.890.123/0001-45', 'Juliana Rocha', '51932109876', 'juliana@mercadoprimavera.com', '2025-06-18', '2027-06-18', 'Porto Alegre', 'RS'),
(default,'Supermercado Estrela', '78.901.234/0001-36', 'André Martins', '71921098765', 'andre@superestrela.com', '2025-07-22', '2027-07-22', 'Salvador', 'BA'),
(default,'Mercado Central', '89.012.345/0001-27', 'Patrícia Gomes', '61910987654', 'patricia@mercadocentral.com', '2025-08-14', '2027-08-14', 'Brasília', 'DF'),
(default,'Supermercado Nova Era', '90.123.456/0001-18', 'Bruno Oliveira', '81999887766', 'bruno@supernovaera.com', '2025-09-03', '2027-09-03', 'Recife', 'PE'),
(default,'Mercadinho São Lucas', '01.234.567/0001-09', 'Camila Ferreira', '85988776655', 'camila@mercadinhosaolucas.com', '2025-10-11', '2027-10-11', 'Fortaleza', 'CE');

INSERT INTO sensor VALUES
(default,'HC-SR04', '2025-01-10 08:30:00', 1, 'Ativo', '2025-08-10 09:00:00'),
(default,'HC-SR04', '2025-01-15 10:00:00', 3, 'Ativo', '2025-07-15 10:30:00'),
(default,'HC-SR04', '2025-02-05 14:20:00', 5, 'Inativo', '2025-08-05 15:00:00'),
(default,'HC-SR04', '2025-02-18 09:15:00', 4, 'Ativo', '2025-08-18 09:45:00'),
(default,'HC-SR04', '2025-03-12 11:30:00', 2, 'Em manutenção', '2025-09-01 13:00:00'),
(default,'HC-SR04', '2025-04-20 16:00:00', 10, 'Ativo', '2025-08-20 16:30:00'),
(default,'HC-SR04', '2025-05-08 08:45:00', 15, 'Ativo', '2025-08-08 09:15:00'),
(default,'HC-SR04', '2025-06-14 12:10:00', 11, 'Inativo', '2025-07-14 12:40:00'),
(default,'HC-SR04', '2025-07-25 15:30:00', 4, 'Ativo', '2025-08-25 16:00:00'),
(default,'HC-SR04', '2025-08-03 10:20:00', 7, 'Em manutenção', '2025-09-03 11:00:00');

INSERT INTO monitoramento VALUES
(default,'2026-09-01 08:00:00', 125, 45.5, 80.2),
(default,'2026-09-01 10:30:00', 210, 62.3, 75.8),
(default,'2026-09-01 12:00:00', 350, 80.7, 68.4),
(default,'2026-09-02 09:15:00', 180, 55.2, 72.6),
(default,'2026-09-02 11:45:00', 275, 70.8, 65.3),
(default,'2026-09-02 14:30:00', 320, 85.4, 60.9),
(default,'2026-09-03 08:20:00', 145, 40.6, 82.1),
(default,'2026-09-03 13:10:00', 290, 77.5, 69.7),
(default,'2026-09-04 16:00:00', 410, 95.2, 55.8),
(default,'2026-09-05 18:30:00', 380, 88.9, 58.5);


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