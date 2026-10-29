-- =========================================================
-- GRUPO 01 --
-- =========================================================



CREATE DATABASE infoconnect;
USE infoconnect;

CREATE TABLE cliente (
    idcliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    email VARCHAR(45) NOT NULL,
    senha varchar (45),
    telefone VARCHAR(45),
    CONSTRAINT chkEmailCliente
        CHECK (email LIKE '%@%.%')
);

CREATE TABLE endereco (
    idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(45),
    cidade VARCHAR(45) NOT NULL,
    logradouro VARCHAR(45) NOT NULL,
    numero VARCHAR(45),
    cep VARCHAR(45)
);

CREATE TABLE supermercado (
    idSupermercado INT PRIMARY KEY AUTO_INCREMENT,
    nomeFantasia VARCHAR(50) NOT NULL,
    cnpj CHAR(18) UNIQUE NOT NULL,
    fkCliente INT NOT NULL,
    fkEndereco INT NOT NULL UNIQUE,
    CONSTRAINT fkClienteSupermercado
        FOREIGN KEY (fkCliente)
        REFERENCES cliente(idcliente),
    CONSTRAINT fkEnderecoSupermercado
        FOREIGN KEY (fkEndereco)
        REFERENCES endereco(idEndereco)
);

CREATE TABLE setor (
    idSetor INT PRIMARY KEY AUTO_INCREMENT,
    setor VARCHAR(45) NOT NULL,
    gondola VARCHAR(45),
    fkSupermercado INT NOT NULL,
    CONSTRAINT fkSupermercadoSetor
        FOREIGN KEY (fkSupermercado)
        REFERENCES Supermercado(idSupermercado)
);

CREATE TABLE sensor (
    idsensor INT PRIMARY KEY AUTO_INCREMENT,
    tipoSensor VARCHAR(10),
    dtInstalacao DATE,
    statuss VARCHAR(15) NOT NULL,
    ultimaManutencao DATE,
    fkSetor INT NOT NULL,
    CONSTRAINT chkStatusSensor
        CHECK (statuss IN ('Ativo', 'Inativo', 'Em manutenção')),
    CONSTRAINT fkSetorSensor
        FOREIGN KEY (fkSetor)
        REFERENCES setor(idSetor)
);

CREATE TABLE registro (
    idmonitoramento INT NOT NULL AUTO_INCREMENT,
    dataHora DATETIME default current_timestamp,
    distanciaCm FLOAT NOT NULL,
    fkSensor INT NOT NULL,
    PRIMARY KEY (idmonitoramento, fkSensor),
    CONSTRAINT fkSensorRegistro
        FOREIGN KEY (fkSensor)
        REFERENCES sensor(idsensor)
);

SELECT * FROM registro;

INSERT INTO cliente (nome, cpf, email, telefone) VALUES
('João Silva', '12345678901', 'joao.silva@gmail.com', '11987654321'),
('Maria Oliveira', '23456789012', 'maria.oliveira@gmail.com', '11976543210'),
('Pedro Santos', '34567890123', 'pedro.santos@gmail.com', '11965432109'),
('Ana Costa', '45678901234', 'ana.costa@gmail.com', '11954321098'),
('Lucas Martins', '56789012345', 'lucas.martins@gmail.com', '11943210987'),
('Juliana Souza', '67890123456', 'juliana.souza@gmail.com', '11932109876'),
('Rafael Almeida', '78901234567', 'rafael.almeida@gmail.com', '11921098765'),
('Camila Ferreira', '89012345678', 'camila.ferreira@gmail.com', '11910987654'),
('Bruno Rocha', '90123456789', 'bruno.rocha@gmail.com', '11999887766'),
('Fernanda Lima', '01234567890', 'fernanda.lima@gmail.com', '11988776655');

INSERT INTO endereco (estado, cidade, logradouro, numero, cep) VALUES
('SP', 'São Paulo', 'Rua das Flores', '100', '01001000'),
('SP', 'Campinas', 'Avenida Brasil', '250', '13010000'),
('RJ', 'Rio de Janeiro', 'Rua Central', '80', '20010000'),
('MG', 'Belo Horizonte', 'Rua Principal', '45', '30110000'),
('PR', 'Curitiba', 'Avenida Paraná', '500', '80010000'),
('RS', 'Porto Alegre', 'Rua Primavera', '120', '90010000'),
('BA', 'Salvador', 'Avenida Bahia', '300', '40010000'),
('DF', 'Brasília', 'Rua Central', '15', '70010000'),
('PE', 'Recife', 'Avenida Recife', '200', '50010000'),
('CE', 'Fortaleza', 'Rua São Lucas', '70', '60010000');

INSERT INTO Supermercado (nomeFantasia, cnpj, fkCliente, fkEndereco) VALUES
('Supermercado Pague Menos', '12.345.678/0001-90', 1, 1),
('Mercado São José', '23.456.789/0001-81', 2, 2),
('Supermercado Boa Esperança', '34.567.890/0001-72', 3, 3),
('Mercadinho do Bairro', '45.678.901/0001-63', 4, 4),
('Supermercado Avenida', '56.789.012/0001-54', 5, 5),
('Mercado Primavera', '67.890.123/0001-45', 6, 6),
('Supermercado Estrela', '78.901.234/0001-36', 7, 7),
('Mercado Central', '89.012.345/0001-27', 8, 8),
('Supermercado Nova Era', '90.123.456/0001-18', 9, 9),
('Mercadinho São Lucas', '01.234.567/0001-09', 10, 10);

INSERT INTO setor (setor, gondola, fkSupermercado) VALUES
('Bebidas', 'Gôndola 01', 1),
('Limpeza', 'Gôndola 02', 1),
('Alimentos', 'Gôndola 03', 2),
('Higiene', 'Gôndola 04', 2),
('Bebidas', 'Gôndola 05', 3),
('Congelados', 'Gôndola 06', 4),
('Mercearia', 'Gôndola 07', 5),
('Limpeza', 'Gôndola 08', 6),
('Alimentos', 'Gôndola 09', 7),
('Bebidas', 'Gôndola 10', 8),
('Higiene', 'Gôndola 11', 9),
('Mercearia', 'Gôndola 12', 10);

INSERT INTO sensor (tipoSensor, dtInstalacao, statuss, ultimaManutencao, fkSetor) VALUES
('HC-SR04', '2025-01-10', 'Ativo', '2025-08-10', 1),
('HC-SR04', '2025-01-15', 'Ativo', '2025-07-15', 1),
('HC-SR04', '2025-02-05', 'Inativo', '2025-08-05', 2),
('HC-SR04', '2025-02-18', 'Ativo', '2025-08-18', 3),
('HC-SR04', '2025-03-12', 'Em manutenção', '2025-09-01', 4),
('HC-SR04', '2025-04-20', 'Ativo', '2025-08-20', 5),
('HC-SR04', '2025-05-08', 'Ativo', '2025-08-08', 6),
('HC-SR04', '2025-06-14', 'Inativo', '2025-07-14', 7),
('HC-SR04', '2025-07-25', 'Ativo', '2025-08-25', 8),
('HC-SR04', '2025-08-03', 'Em manutenção', '2025-09-03', 9),
('HC-SR04', '2025-08-10', 'Ativo', '2025-09-10', 10),
('HC-SR04', '2025-08-15', 'Ativo', '2025-09-15', 11);


SELECT * FROM cliente;

SELECT
    CONCAT(
        'Cliente: ', nome,
        ' | CPF: ', cpf,
        ' | Email: ', email,
        ' | Telefone: ', telefone
    ) AS 'Dados do Cliente'
FROM cliente;

SELECT * FROM Supermercado;

SELECT
    s.nomeFantasia AS 'Supermercado',
    s.cnpj AS 'CNPJ',
    c.nome AS 'Cliente responsável',
    e.cidade AS 'Cidade',
    e.estado AS 'Estado',
    e.logradouro AS 'Logradouro',
    e.numero AS 'Número'
FROM Supermercado s
 JOIN cliente c
    ON s.fkCliente = c.idcliente
 JOIN endereco e
    ON s.fkEndereco = e.idEndereco;

SELECT * FROM setor;
SELECT * FROM sensor;

SELECT
    se.idsensor AS 'ID Sensor',
    se.tipoSensor AS 'Tipo de Sensor',
    se.statuss AS 'Status',
    st.setor AS 'Setor',
    st.gondola AS 'Gôndola',
    sp.nomeFantasia AS 'Supermercado'
FROM sensor se
 JOIN setor st
    ON se.fkSetor = st.idSetor
 JOIN Supermercado sp
    ON st.fkSupermercado = sp.idSupermercado;

SELECT * FROM registro;

SELECT
    r.dataHora AS 'Data e Hora',
    r.distanciaCm AS 'Distância (cm)',
    CASE
        WHEN r.aproximacao = 1 THEN 'Sim'
        ELSE 'Não'
    END AS 'Aproximação',
    r.fkSensor AS 'Sensor'
FROM registro r
ORDER BY r.fkSensor, r.dataHora;

SELECT
    sp.nomeFantasia AS supermercado,
    st.setor,
    st.gondola,
    se.idsensor,
    r.dataHora,
    r.distanciaCm,
    r.aproximacao
FROM registro r
 JOIN sensor se
    ON r.fkSensor = se.idsensor
 JOIN setor st
    ON se.fkSetor = st.idSetor
 JOIN Supermercado sp
    ON st.fkSupermercado = sp.idSupermercado
ORDER BY r.dataHora;
