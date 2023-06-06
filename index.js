const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Usuario } = require("./models/Users");
const { Tarefas } = require("./models/Task");
const { Sequelize } = require("sequelize");
const { z, number } = require("zod");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
function validPassword(password) {
  if (password.length > 7) return true;
  return false;
}

app.post("/signin", async (req, res, next) => {
  const user = await Usuario.findOne({
    where: {
      email: req.body.email,
    },
  });
  console.log(user);
  if (user && req.body.email && req.body.senha) {
    if (user.email === req.body.email && user.senha === req.body.senha) {
      token = jwt.sign(
        { email: user.email, nome: user.nome, id: user.id },
        process.env.PRIVATE_KEY,
        {
          algorithm: "RS256",
          expiresIn: 21600,
        }
      );
      return res.json({
        token,
        Authenticate: true,
      });
    }
    return res.json({
      Authenticate: false,
      erro: "PasswordWrong",
    });
  }
  return res.json({
    Authenticate: false,
    erro: "NotFound",
  });
});
app.post("/signup", async (req, res) => {
  const checkUser = await Usuario.findAll({
    where: {
      email: req.body.email,
    },
  });
  if (checkUser.length === 0) {
    if (!validPassword(req.body.senha))
      return res.json({
        created: false,
        erro: "InvalidPassword",
      });
    const newUser = await Usuario.create({
      email: req.body.email,
      senha: req.body.senha,
      nome: req.body.nome,
    });
    if (newUser) {
      const token = jwt.sign(
        { email: newUser.email, nome: newUser.nome, id: newUser.id },
        process.env.PRIVATE_KEY,
        {
          algorithm: "RS256",
          expiresIn: 21600,
        }
      );
      return res.json({
        token,
        created: true,
      });
    }
    return res.json({
      erro: "ErroCriar",
      created: false,
    });
  }
  return res.json({
    erro: "DuplicatedUser",
    created: false,
  });
});
app.get("/auth", (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(
    token,
    process.env.PUBLIC_KEY,
    { algorithms: ["RS256"] },
    (err, decoded) => {
      if (err) {
        res.json({ validToken: false, error: err }).status(401);
      } else {
        res.json({ validToken: true }).status(200);
      }
    }
  );
});

app.post("/task", (req, res) => {
  const token = req.headers.authorization;
  console.log(token, req.body.tempo);
  const timeConvert = (time) => {
    const [hour, minute] = time.split(":");
    return parseInt(hour) * 60 + parseInt(minute);
  };
  const newTime = timeConvert(req.body.tempo);
  console.log(newTime);
  jwt.verify(
    token,
    process.env.PUBLIC_KEY,
    { algorithms: ["RS256"] },
    (err, decoded) => {
      if (err) {
        res.json({ validToken: false, error: err }).status(401);
      } else {
        const TarefaSchema = z.object({
          materia: z.string(),
          tempo: z.number(),
          todo: z.coerce.boolean().default(false),
          rendimento: z.number().default(0),
        });
        try {
          const { materia, tempo, todo, rendimento } = TarefaSchema.parse({
            materia: req.body.materia,
            tempo: newTime,
          });
          const newTask = Tarefas.create({
            nomeMateria: materia,
            tempo: tempo,
            rendimentoQuest: rendimento,
            questionsTodo: todo,
            userId: decoded.id,
          });
          res.send(newTask).status(200);
        } catch (e) {
          res.send(e).status(401);
        }
      }
    }
  );
});

app.get('/task', (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(
    token,
    process.env.PUBLIC_KEY,
    { algorithms: ["RS256"] },
    async (err, decoded) => {
      if (err) {
        res.json({ validToken: false, error: err }).status(401);
      } else {
        console.log(decoded)
        const tasks = await Tarefas.findAll({
          where: {
            userId: decoded.id
          },
          order: [['questionsTodo', 'ASC']]
        })
        res.json(tasks).status(200)
      }
    }
  );
})

app.listen(3001);
