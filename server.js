const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes, Op } = require('sequelize');


const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'supersecretkey'; 

app.use(bodyParser.json());

// Configuração do Sequelize com SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Definindo o modelo de usuário
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  perfil: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Definindo o modelo de empresa
const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Definindo o modelo de contrato
const Contract = sequelize.define('Contract', {
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

// Relacionamento entre Contrato e Empresa
Company.hasMany(Contract);
Contract.belongsTo(Company);

// Sincroniza os modelos com o banco de dados e inicializa dados
async function initialize() {
  await sequelize.sync(); 
  
  try {
    // Inicializa alguns dados no banco
    const adminUser = await User.create({ username: 'admin', password: '123456789', perfil: 'admin', email: 'admin@dominio.com' });
    const regularUser = await User.create({ username: 'user', password: '123456', perfil: 'user', email: 'user@dominio.com' });
    const colabUser = await User.create({ username: 'wallace', password: '123', perfil: 'user', email: 'colab@dominio.com' });

    // Cria algumas empresas de exemplo
    const domino = await Company.create({ name: 'Domino' });
    const acme = await Company.create({ name: 'Acme' });
    const techCorp = await Company.create({ name: 'TechCorp' });

    // Cria alguns contratos de exemplo associados às empresas
    await Contract.create({ data_inicio: '2024-07-01', CompanyId: domino.id });
    await Contract.create({ data_inicio: '2024-07-02', CompanyId: acme.id });
    await Contract.create({ data_inicio: '2024-07-03', CompanyId: techCorp.id });

    console.log('Dados inicializados com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}

initialize();


// Middleware para verificar o token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Endpoint para login do usuário
app.post('/api/auth/login', async (req, res) => {
  const credentials = req.body;
  console.log('Received login request with credentials:', credentials); // Verifique os dados recebidos

  // Verifica se o objeto credentials e os campos necessários estão presentes
  if (!credentials || !credentials.username || !credentials.password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    let user = await User.findOne({ where: { username: credentials.username } });

    if (user && user.password === credentials.password) {
      // Gera o token JWT
      const token = jwt.sign({ id: user.id, username: user.username, perfil: user.perfil }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Endpoint para recuperar dados do usuário logado
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ data: req.user });
});

// Endpoint para recuperar todos os usuários (apenas para admin)
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.perfil !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  let users = await User.findAll();
  res.json({ data: users });
});

// Endpoint para recuperar contratos por empresa e data de início
app.get('/api/contracts/:companyId/:inicio', authenticateToken, async (req, res) => {
  const { companyId, inicio } = req.params;
  console.log('Recebido pedido para empresa com ID:', companyId, 'com data de início:', inicio);

  try {
    const startDate = new Date(inicio);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); 

    console.log('Consultando contratos entre:', startDate, 'e', endDate);

    let contracts = await Contract.findAll({
      where: {
        CompanyId: companyId,
        data_inicio: {
          [Op.gte]: startDate, 
          [Op.lt]: endDate 
        }
      }
    });

    console.log('Contratos encontrados:', contracts);

    if (contracts.length > 0) {
      res.status(200).json({ data: contracts });
    } else {
      console.log('Nenhum contrato encontrado para empresa com ID', companyId, 'com data de início', inicio);
      res.status(404).json({ message: 'Dados Não encontrados' });
    }
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


// Endpoint para retornar todas as empresas cadastradas
app.get('/api/companies', authenticateToken, async (req, res) => {
  try {
    const companies = await Company.findAll();

    if (companies.length > 0) {
      res.status(200).json({ data: companies });
    } else {
      res.status(404).json({ message: 'Nenhuma empresa encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});



// Exemplo de criação de usuário 
app.post('/api/users/create', async (req, res) => {
  try {
    let user = await User.create(req.body); 

    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Inicializa o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { sequelize, User, Contract, Company };
