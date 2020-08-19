const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validUuid(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repositorie ID not found' });
  }
  return next();
}

app.use('/repositories/:id', validUuid);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(data);
  return response.json(data);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  let repository = repositories.find((repo) => repo.id === id);

  if (!repository)
    return response.status(400).json({ error: 'Repository not found.' });

  repository = { ...repository, title, url, techs };

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex((index) => index.id === id);

  if (indexRepository < 0) {
    return response.json({ error: 'Repositorie not found' });
  }

  repositories.splice(indexRepository, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.find((index) => index.id === id);

  if (!indexRepository)
    return response.status(400).json({ error: 'Repository not found.' });

  indexRepository.likes += 1;

  return response.json(indexRepository);
});

module.exports = app;
