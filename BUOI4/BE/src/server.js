require('dotenv').config();

const express = require('express');
const cors = require('cors');

const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

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
(async () => {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        }
        );

    } catch (error) {
        console.error('Failed to connect to database', error);
    }
})();