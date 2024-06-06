import fetch from 'node-fetch';
import mongoose from 'mongoose';
import Ticker from './models.mjs';

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
    } finally {
        mongoose.connection.close();
    }
};

fetchData();
