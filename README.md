## Installing on local (with Docker)

1. Build the docker image

```
docker build -t color-animal .
```

2. Create a container using the previously built image.

```
docker create --name color-animal-dev -v "$(pwd)"/src:/app/src -p 3000:3000 color-animal
```

3. Run the created container and check the logs.
```
docker start color-animal-dev
docker logs -f color-animal-dev
```

4. Visit `localhost:3000/tuples` in your web browser to see the data.

5. (Optional) Run the tests in the docker container.
```
docker exec -t color-animal-dev npm run test
```

## Installing on local (without Docker)

1. Install npm dependencies.

```
npm install
```

2. Run the dev environment.
```
npm run dev
```

3. Visit `localhost:3000/tuples` in your web browser to see the data.

4. (Optional) Run the tests.
```
npm run test
