require('dotenv').config();

const express = require('express');
const cors = require('cors');

const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const { startAutoConfirmService } = require('./services/orderService');

const {getHomepage} = require('./controllers/homeController');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
configViewEngine(app);

const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);
app.use('/v1/api', apiRoutes);
app.use('/v1/api/admin', adminRoutes);
app.use('/v1/api/auth', adminAuthRoutes);
app.use('/v1/api/cart', cartRoutes);
app.use('/v1/api/orders', orderRoutes);
(async () => {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
            console.log(`API docs: http://localhost:${PORT}/v1/api`);
            console.log(`Seed admin: POST http://localhost:${PORT}/v1/api/auth/seed-admin`);
            startAutoConfirmService();
        }
        );

    } catch (error) {
        console.error('Failed to connect to database', error);
    }
})();