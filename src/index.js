const { request, response } = require("express");
const express = require("express");
const { uuid, isUuid } = require('uuidv4');


const app = express();

app.use(express.json());

function validateRepositoryId(request, response, next) {
    const { id } = request.params;

    if(!isUuid(id)) {
        return response.status(400).json({message:"repository id invalid."});
    }

    next();
}

app.use('/repositories/:id',validateRepositoryId);

app.get('/',(request, response) => {
    return response.status(200).json({message:"NumeroUm"});
})


repositories = []
app.get('/repositories',(request, response) => {
    return response.status(200).json(repositories);
});

app.post('/repositories',(request, response) => {
    const {title, url, techs} = request.body;

    const repository = {id: uuid(), title, url, techs, likes: 0}; 

    repositories.push(repository);

    return response.status(200).json(repository);
});

app.put('/repositories/:id',(request, response) => {
    const { id } = request.params;
    const {title, url, techs} = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
        return response.status(400).json({error: "repository not found."});
    }

    const { likes } = repositories[repositoryIndex];

    const repository = {id,title,url,techs,likes};

    repositories[repositoryIndex] = repository;

    return response.status(200).json(repository);
});

app.delete('/repositories/:id',(request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
        return response.status(400).json({error: "repository not found."});
    }

    repositories.splice(repositoryIndex,1);

    return response.status(204).send();
});

app.post('/repositories/:id/like',(request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
        return response.status(400).json({error: "repository not found."});
    }

    var { title, url, techs, likes } = repositories[repositoryIndex];
    likes = likes + 1;
    const repository = { id, title, url, techs, likes };
    repositories[repositoryIndex] = repository;

    return response.status(200).json(repository);

});

app.listen(3334);