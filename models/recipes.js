const mongoose = require("mongoose")

const recipeSchema = mongoose.Schema({
    name: {type: String, required: true},
    userId: {type: String, required: true},
    ingredients: {type: String, required: true},
    description: {type: String, required: true },
    image: {type: String, required: false },
    tag: {type: String, required: false }
},{timestamps: true})

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;