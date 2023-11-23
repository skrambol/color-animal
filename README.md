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
```

## Available endpoints
* `GET /tuples`
  - gets all tuples
* `GET /tuples?random=true`
  - gets a random tuple
* `POST /tuples` body: `{color: "color", animal: "animal"}`
  - adds a new tuple to the list; possible to add duplicates
* `PUT /tuples/:color/:animal` body: `{color: "newColor", animal: "newAnimal"}`
  - updates all tuples (`:color`, `:animal`) to be `(newColor, newAnimal)`
* `DELETE /tuples/:color/:animal`
  - deletes all tuples (`:color`, `:animal`)


## Additional Questions

I finished the test in about 5 hours. I had to research on using [TypeScript for Express](https://blog.logrocket.com/how-to-set-up-node-typescript-express/) and using [TypeScript in Jest](https://medium.com/@natnael.awel/how-to-setup-testing-for-typescript-with-express-js-example-83d3efbb6fd4).

I would probably use MongoDB for this API since it the data is quite simple. Moreover, I am mostly familiar with using MongoDB on NodeJS backend which could help me finish the test faster.

A sample route for deleting a specific color would be `DELETE /tuples/:color`. However, there are things that still needs to be considered such as what would happen to its corresponding animal pair.
