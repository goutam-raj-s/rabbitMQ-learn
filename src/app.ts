import express, { Application } from 'express';
import orderRoutes from './routes/orderRoutes';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use('/api/orders', orderRoutes);
    }
}

export default new App().app;
