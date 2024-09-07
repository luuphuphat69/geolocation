const mongoose = require('mongoose');

const CountriesSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  iso3: {
    type: String,
    required: true
  },
  iso2: {
    type: String,
    required: true
  },
  numeric_code: {
    type: Number,
    required: true
  },
  phone_code: {
    type: String,
    required: true
  },
  capital: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  currency_name: {
    type: String,
    required: true
  },
  currency_symbol: {
    type: String,
    required: true
  },
  tld: {
    type: String,
    required: true
  },
  native: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  subregion: {
    type: String,
    required: true
  },
  timezones: {
    type: String,
  },
  latitude: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  longitude: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  emojiU: {
    type: String,
    required: true
  }
});

const Countries = mongoose.model('Countries', CountriesSchema, 'Countries');
module.exports = Countries;
