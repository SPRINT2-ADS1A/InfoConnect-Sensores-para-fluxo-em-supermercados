	CREATE USER 'infoconnect_app'@'localhost'
		IDENTIFIED BY 'app123@';

	GRANT SELECT, INSERT ON infoconnect.*
		TO 'infoconnect_app'@'localhost';

	FLUSH PRIVILEGES;

	CREATE DATABASE IF NOT EXISTS infoconnect;

	USE infoconnect;



	-- endereco: localizacao fisica de cada loja.

	CREATE TABLE endereco (
		idEndereco INT PRIMARY KEY AUTO_INCREMENT,
		uf CHAR(2),
		cidade VARCHAR(100),
		logradouro VARCHAR(200),
		numero VARCHAR(20),
		cep CHAR(8)
	);

	-- supermercado: um cliente pode contratar varias lojas.
	CREATE TABLE supermercado (
		idSupermercado INT PRIMARY KEY AUTO_INCREMENT,
		nomeFantasia VARCHAR(120),
		cnpj CHAR(14) UNIQUE,
		emailInstitucional VARCHAR(150),
        telefoneContato CHAR(11),
		fkCliente INT,
		fkEndereco INT,
		CONSTRAINT fk_supermercado_cliente FOREIGN KEY (fkCliente)
			REFERENCES cliente(idCliente),
		CONSTRAINT fk_supermercado_endereco FOREIGN KEY (fkEndereco)
			REFERENCES endereco(idEndereco)
	);

	-- usuario: funcionario que acessa o painel de um supermercado.
	CREATE TABLE cliente(
		idCliente INT PRIMARY KEY AUTO_INCREMENT,
		email VARCHAR(150) UNIQUE,
		senha VARCHAR(100),
        nome VARCHAR(100),
        cpf CHAR(11),

		fkSupermercado INT,
		CONSTRAINT fk_usuario_supermercado FOREIGN KEY (fkSupermercado)
			REFERENCES supermercado(idSupermercado)
	);

	-- setor: cada linha identifica a gondola monitorada dentro da loja.
	CREATE TABLE setor (
		idSetor INT PRIMARY KEY AUTO_INCREMENT,
		nomeSetor VARCHAR(80),
		gondola VARCHAR(80),
		fkSupermercado INT,
		CONSTRAINT fk_setor_supermercado FOREIGN KEY (fkSupermercado)
			REFERENCES supermercado(idSupermercado)
	);

	-- sensor: 
	CREATE TABLE sensor (
		idSensor INT PRIMARY KEY AUTO_INCREMENT,
		tipoSensor VARCHAR(30) DEFAULT 'HC-SR04',
		dtInstalacao DATE,
		status ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo',
		ultimaManutencao DATE,
		fkSetor INT ,
		CONSTRAINT fk_sensor_setor FOREIGN KEY (fkSetor)
			REFERENCES setor(idSetor),
		CONSTRAINT chk_sensor_manutencao CHECK (
			ultimaManutencao IS NULL OR ultimaManutencao >= dtInstalacao
		)
	);

	-- registro: apenas os quatro campos solicitados.
	CREATE TABLE registro (
		idRegistro INT PRIMARY KEY AUTO_INCREMENT,
		dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
		distanciaCm DECIMAL(6,2),
		fkSensor INT,
		PRIMARY KEY (idRegistro),
		CONSTRAINT fk_registro_sensor FOREIGN KEY (fkSensor)
			REFERENCES sensor(idSensor),
		CONSTRAINT chk_registro_prolongada CHECK (prolongada IN (0, 1))
	);




	INSERT INTO cliente (nome, email, senha) VALUES
		('Ana Ribeiro', 'ana.ribeiro@infoconnect.test', 'senha123'),
		('Bruno Martins', 'bruno.martins@infoconnect.test', 'senha123'),
		('Carla Ferreira', 'carla.ferreira@infoconnect.test', 'senha123');

	INSERT INTO endereco (uf, cidade, logradouro, numero, cep) VALUES
		('SP', 'Sao Paulo', 'Rua Exemplo das Lojas', '120', '01001000'),
		('SP', 'Sao Paulo', 'Avenida Ficticia do Mercado', '855', '04002000'),
		('SP', 'Campinas', 'Rua Demonstracao', '42', '13010000');

	INSERT INTO supermercado
		(nomeFantasia, cnpj, emailInstitucional, fkCliente, fkEndereco) VALUES
		('Mercado Aurora', '12345678000195', 'contato@aurora.test', 1, 1),
		('Supermercado Horizonte', '98765432000100', 'contato@horizonte.test', 2, 2),
		('Mercado Bairro Bom', '11222333000181', 'contato@bairro-bom.test', 3, 3);

	INSERT INTO cliente (nome, email, senha, fkSupermercado) VALUES
		('Mariana Silva', 'mariana@aurora.test', 'senha1234', 1),
		('Pedro Almeida', 'pedro@aurora.test', 'senha1234', 1),
		('Luiza Costa', 'luiza@horizonte.test', 'senha1234', 2),
		('Rafael Souza', 'rafael@bairro-bom.test', 'senha1234', 3);

	INSERT INTO setor (nomeSetor, gondola, fkSupermercado) VALUES
		('Bebidas', 'B1', 1),
		('Higiene', 'H1', 1),
		('Mercearia', 'M1', 1),
		('Bebidas', 'B2', 2),
		('Laticinios', 'L1', 2),
		('Hortifruti', 'HF1', 3);

	INSERT INTO sensor
		(tipoSensor, dtInstalacao, status, ultimaManutencao, fkSetor) VALUES
		('HC-SR04', '2026-09-30', 'ativo', '2026-10-20', 1),
		('HC-SR04', '2026-09-30', 'ativo', NULL, 2),
		('HC-SR04', '2026-10-01', 'ativo', '2026-10-19', 3),
		('HC-SR04', '2026-10-02', 'manutencao', '2026-10-27', 4),
		('HC-SR04', '2026-10-02', 'ativo', NULL, 5),
		('HC-SR04', '2026-10-03', 'ativo', '2026-10-18', 6);

	INSERT INTO registro (dataHora, distanciaCm, fkSensor) VALUES
		-- sensor 1: duas permanencias prolongadas.
		('2026-10-27 09:00:00.000', 120.00, 1),
		('2026-10-27 09:00:01.000',  55.00, 1),
		('2026-10-27 09:00:02.000',  48.00, 1),
		('2026-10-27 09:00:03.000',  47.00, 1),
		('2026-10-27 09:00:04.000', 115.00, 1),
		('2026-10-27 10:30:00.000', 140.00, 1),
		('2026-10-27 10:30:01.000',  68.00, 1),
		('2026-10-27 10:30:03.000',  61.00, 1),
		('2026-10-27 10:30:05.000', 125.00, 1),

		-- sensor 2: uma permanencia prolongada e leituras comuns.
		('2026-10-27 09:05:00.000', 150.00, 2),
		('2026-10-27 09:05:01.000',  70.00, 2),
		('2026-10-27 09:05:02.000',  59.00, 2),
		('2026-10-27 09:05:03.000',  58.00, 2),
		('2026-10-27 09:05:05.000', 130.00, 2),
		('2026-10-27 11:10:00.000', 115.00, 2),
		('2026-10-27 11:10:01.000',  95.00, 2),
		('2026-10-27 11:10:02.000', NULL,   2),

		-- sensor 3: duas permanencias prolongadas.
		('2026-10-26 14:20:00.000', 108.00, 3),
		('2026-10-26 14:20:01.000',  72.00, 3),
		('2026-10-26 14:20:04.000', 119.00, 3),
		('2026-10-27 16:42:00.000', 125.00, 3),
		('2026-10-27 16:42:01.000',  63.00, 3),
		('2026-10-27 16:42:02.000',  60.00, 3),
		('2026-10-27 16:42:05.000', 122.00, 3),

		-- sensor 4: registrou antes de entrar em manutencao.
		('2026-10-26 11:10:00.000', 145.00, 4),
		('2026-10-26 11:10:01.000',  75.00, 4),
		('2026-10-26 11:10:05.000', 140.00, 4),
		('2026-10-27 13:15:00.000', NULL,   4),

		-- sensor 5: duas permanencias prolongadas.
		('2026-10-27 08:40:00.000', 135.00,  5),
		('2026-10-27 08:40:01.000',  58.00,  5),
		('2026-10-27 08:40:05.000', 128.00,  5),
		('2026-10-27 12:25:00.000', 123.00, 5),
		('2026-10-27 12:25:01.000',  65.00,  5),
		('2026-10-27 12:25:02.000',  53.00,  5),
		('2026-10-27 12:25:05.000', 133.00,  5),
		
		-- sensor 6: uma permanencia prolongada.
		('2026-10-27 10:50:00.000', 149.00, 0, 6),
		('2026-10-27 10:50:01.000',  61.00, 0, 6),
		('2026-10-27 10:50:04.000', 110.00, 1, 6),
		('2026-10-27 15:30:00.000', 134.00, 0, 6),
		('2026-10-27 15:30:01.000',  88.00, 0, 6),
		('2026-10-27 15:30:02.000',  93.00, 0, 6);

	-- ================================================================
	-- CONSULTAS PARA O DASHBOARD0
	-- ================================================================

	-- select para listar os clientes que contrataram o sistema.
	SELECT idCliente, nome, email
	FROM cliente
	ORDER BY nome;

	-- select para mostrar as lojas e os respectivos clientes responsaveis.
	SELECT
		sm.nomeFantasia AS supermercado,
		c.nome AS clienteResponsavel,
		e.cidade,
		e.uf
	FROM supermercado AS sm
	JOIN cliente AS c ON sm.fkCliente = c.idCliente
	JOIN endereco AS e ON sm.fkEndereco = e.idEndereco
	ORDER BY sm.nomeFantasia;

	-- select para listar cada sensor, seu status, sua loja e sua gondola.
	SELECT
		se.idSensor,
		se.tipoSensor,
		se.status,
		st.nomeSetor,
		st.gondola,
		sm.nomeFantasia AS supermercado
	FROM sensor AS se
	JOIN setor AS st ON se.fkSetor = st.idSetor
	JOIN supermercado AS sm ON st.fkSupermercado = sm.idSupermercado
	ORDER BY sm.nomeFantasia, st.nomeSetor;

	-- select para contar quantas permanencias prolongadas cada sensor detectou.
	-- Cada permanencia concluida deve ter apenas um registro com prolongada = 1.
	SELECT
		se.idSensor,
		se.status,
		COALESCE(SUM(r.prolongada), 0) AS totalProlongadas
	FROM sensor AS se
	LEFT JOIN registro AS r ON se.idSensor = r.fkSensor
	GROUP BY se.idSensor, se.status
	ORDER BY totalProlongadas DESC;

	-- select para contar permanencias prolongadas por setor e por gondola.
	SELECT
		st.nomeSetor,
		st.gondola,
		sm.nomeFantasia AS supermercado,
	FROM registro AS r
	JOIN sensor AS se ON r.fkSensor = se.idSensor
	JOIN setor AS st ON se.fkSetor = st.idSetor
	JOIN supermercado AS sm ON st.fkSupermercado = sm.idSupermercado
	ORDER BY totalProlongadas DESC;

	-- select para calcular a distancia media por sensor, ignorando leituras nulas.
	SELECT
		fkSensor,
	FROM registro
	WHERE distanciaCm IS NOT NULL
	GROUP BY fkSensor
	ORDER BY fkSensor;

	-- select para contar permanencias prolongadas em cada hora do dia.
	SELECT
		DATE_FORMAT(dataHora, '%Y-%m-%d %H:00:00') AS hora,
	FROM registro
	GROUP BY DATE_FORMAT(dataHora, '%Y-%m-%d %H:00:00')
	ORDER BY hora;

	-- select para descobrir a ultima leitura recebida de cada sensor.
	SELECT
		se.idSensor,
		se.status,
	FROM sensor AS se
	ORDER BY se.idSensor;

	-- select para identificar sensores ativos sem leitura ha mais de 2 segundos.
	-- Em um banco apenas com dados antigos ficticios, todos os sensores ativos
	-- aparecerao como sem comunicacao: o resultado real depende da coleta ativa.
	SELECT
		se.idSensor,
		MAX(r.dataHora) AS ultimaLeitura
	FROM sensor AS se
	LEFT JOIN registro AS r ON r.fkSensor = se.idSensor
	WHERE se.status = 'ativo'
	   OR TIMESTAMPDIFF(MICROSECOND, ultimaLeitura, NOW(3)) > 2000000;

	-- select para contar permanencias prolongadas por supermercado.
	SELECT
		sm.nomeFantasia AS supermercado,
	FROM supermercado AS sm
	JOIN setor AS st ON st.fkSupermercado = sm.idSupermercado
	JOIN sensor AS se ON se.fkSetor = st.idSetor
	JOIN registro AS r ON r.fkSensor = se.idSensor
	ORDER BY totalProlongadas DESC;

	-- select para ver apenas as leituras de um sensor especifico, em ordem.
	SELECT *
	FROM registro
	WHERE fkSensor = 1
	ORDER BY dataHora;

	-- LIMITACAO DOCUMENTADA:
	-- Sem colunas de estado e validade, nao e possivel obter com SELECTs
	-- simples o numero exato de entradas ou a duracao de cada permanencia.
	-- A coluna prolongada apenas sinaliza eventos prolongados concluídos.
