import express from 'express';
import mongoose from 'mongoose';
import Ticker from './models.mjs';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const mongoUri = 'mongodb://localhost:27017/wazirx'; // Replace with your MongoDB URI
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchData = async () => {
    try {
        const response = await fetch('https://api.wazirx.com/api/v2/tickers');
        const data = await response.json();
        const tickers = Object.values(data).slice(0, 10);

        await Ticker.deleteMany({}); // Clear the collection

        for (const ticker of tickers) {
            await Ticker.create({
                name: ticker.name,
                last: ticker.last,
                buy: ticker.buy,
                sell: ticker.sell,
                volume: ticker.volume,
                base_unit: ticker.base_unit
            });
        }

        console.log('Data fetched and stored successfully');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // specify the views directory

app.get('/tickers', async (req, res) => {
    try {
        await fetchData(); // Fetch data each time the route is accessed
        const tickers = await Ticker.find();
        const dynamicData = [
            { value: '0.53%', time: '5 Mins' },
            { value: '1.43%', time: '1 Hour' },
            { value: 'Best Price to Trade: ₹ 59,05,632', time: 'Now' },
            { value: 'Average BTC/INR net price including commission: 2.73%', time: '1 Day' },
            { value: '8.44%', time: '7 Days' }
        ];
        res.render('tickers', { tickers, dynamicData });
    } catch (error) {
        res.status(500).send('Error fetching data from database');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
