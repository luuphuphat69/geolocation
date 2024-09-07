const mongoose = require('mongoose');
const CitiesSchema = new mongoose.Schema({
    id:{
        type: Number
    },
    name:{
        type: String
    },
    state_id:{
        type: Number
    },
    state_code:{
        type: String
    },
    state_name:{
        type: String
    },
    country_id:{
        type: Number
    },
    country_code:{
        type: String
    },
    country_name:{
        type: String
    },
    latitude:{
        type: mongoose.Types.Decimal128
    },
    longtitude:{
        type: mongoose.Types.Decimal128
    },
    wikiDataId:{
        typeL: String
    }
});
const Citites = mongoose.model("Cities", CitiesSchema, "Cities");
module.exports = Citites;