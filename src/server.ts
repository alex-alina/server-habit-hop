import app from './app/app'
import AppDataSource from './db';

const PORT:number = Number(process.env.PORT) || 3002;
const HOST: string = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST);

 AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

console.log(`Koa server is listening on port ${PORT}`)