const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getIndexOfItem = (id) =>
{
  const index = repositories.map((item) => item.id).indexOf(id);
  return index === -1 ? undefined : index;
};
const updateRepoUseIndex = (index, newTitle, newUrl, newTechs) =>
{
  const repoUpdated = { ...repositories[index], title: newTitle, url: newUrl, techs: newTechs };
  repositories[index] = repoUpdated;
};

app.get("/repositories", (request, response) =>
{
  return response.json(repositories);
});

app.post("/repositories", (request, response) =>
{
  const { title, url, techs } = request.body;
  const project = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) =>
{
  const { id } = request.params;
  const idIndex = getIndexOfItem(id);
  idIndex ?? response.status(400).end();

  const { title, url, techs } = request.body;
  updateRepoUseIndex(idIndex, title, url, techs);

  return response.json(repositories[idIndex]);
});

app.delete("/repositories/:id", (request, response) =>
{
  const { id } = request.params;
  const idIndex = getIndexOfItem(id);
  idIndex ?? response.status(400).end();

  repositories.splice(idIndex, 1);
  return response.status(204).end();
});

app.post("/repositories/:id/like", (request, response) =>
{
  const { id } = request.params;
  const idIndex = getIndexOfItem(id);
  idIndex ?? response.status(400).end();

  repositories[idIndex].likes++;

  return response.json({ likes: repositories[idIndex].likes });
});

module.exports = app;
