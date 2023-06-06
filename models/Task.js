const { Usuario } = require("./Users");
const { db } = require("./index");
const { Sequelize, DataTypes } = require("sequelize");
const Tarefas = db.define(
  "tasks",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    nomeMateria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempo: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    rendimentoQuest: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    questionsTodo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
Usuario.hasMany(Tarefas, {
  foreignKey: {
    name: "userId",
    type: DataTypes.UUIDV4,
  },
});
Tarefas.belongsTo(Usuario);
module.exports = { Tarefas };
