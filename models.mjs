import mongoose from 'mongoose';

const tickerSchema = new mongoose.Schema({
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String
});

const Ticker = mongoose.model('Ticker', tickerSchema);

export default Ticker;
