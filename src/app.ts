import express from "express";
import { Routes } from "./interfaces/routes.interface";
import { connect } from "mongoose";

class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectDatabase();
    }

    public startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on http://localhost:${this.port}`);
        });
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use("/api", route.router);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        });
    }

    private async connectDatabase() {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is missing in environment variables");
        }
        try {
            await connect(uri);
            console.log("Database connected...");
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}

export default App;
