import app from './app/app'
import AppDataSource from './db';

const PORT:number = Number(process.env.PORT) || 3002;

app.listen(PORT);

 AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

console.log(`Koa server is listening on port ${PORT}`)