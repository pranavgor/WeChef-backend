const authHelper = require('../helper/auth')
const RecipeSchema = require('../models/recipes');
const User = require('../models/users');

module.exports = function(router){
    
    var createPost = router.route('/create');
    var userRecipe = router.route('/self');
    var favouriteRecipe = router.route('/self/fav/manage');
    var userFavourites = router.route('/self/fav');
    var recipeDetails = router.route('/get/:id')
    var allRecipes = router.route('/all');

    createPost.post(authHelper, async (req,res) => {
        console.log('user', req.user)

        const requestBody = req.body.body;

        if(!requestBody.name || !requestBody.ingredients || !requestBody.description){
            res.status(400).json({message: "Please provide Name, Ingredients and Description of your new recipe"}).send();
            return
        }
        console.log("HERE 2")

        const newRecipe = new RecipeSchema({
            name: requestBody.name,
            userId: req.user.id,
            ingredients: requestBody.ingredients,
            description: requestBody.description,
            image: requestBody.image,
            tag: requestBody.tag
        })

        newRecipe.save();

        console.log("HERE 3")
        res.json({
            message: "Success"
        })
    })


    userRecipe.get(authHelper, async(req,res) => {

        const filter = {
            userId : req.user.id
        }

        const user = await User.findById(req.user.id);

        var userFavs = new Set(user.favourites)

        var result = []

        const allUserRecipes = await RecipeSchema.find(filter).sort({createdAt : -1});

        await Promise.all(allUserRecipes.map(async (item) => {
            var currDict = item;

            if(userFavs.has(item._id.toString())){
                currDict.isFav = true
            }
            else {
                currDict.isFav = false
            }
            console.log(currDict)
            var dict = {}
            dict.data = currDict
            dict.isFav = currDict.isFav
            result.push(dict)
        }))

        res.json({
            message : "Success",
            data : result
        })
    })

    // Favourite this recipe api 
    favouriteRecipe.put(authHelper, async (req, res) => {
        const userId = req.user.id
        const setFav = req.body.body.setFav
        const newFav = req.body.body.recipeId

        if(setFav){
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$push : {
                    favourites : newFav
                }}, {new : true}
            )
    
            res.json({
                message : "Success",
                data : updatedUser
            })
        }

        else {

            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$pullAll : {
                    favourites : [newFav]
                }}, {new : true}
            )
    
            res.json({
                message : "Success",
                data : updatedUser
            })
        }
        
        
    })

    // get user favourite recipe
    userFavourites.get(authHelper, async (req,res) => {
        const user = await User.findById(req.user.id)
        console.log("User found = ",user);

        var favRecipeSet = new Set()

        await Promise.all(user.favourites.map(async (item) => {
            var currRecipe = await RecipeSchema.findById(item);
            console.log("hi")
            favRecipeSet.add(currRecipe);
        }));

        const favs = [...favRecipeSet];
        favs.sort();
        res.json({
            message : "Success",
            data : favs
        })

    })

    //Get specific recipe details
    recipeDetails.get(authHelper, async (req, res) => {

        const recipeId = req.params.id


        var recipe = await RecipeSchema.findById(recipeId)
        console.log(recipe);
        
        recipe.isFav = false;

        const user = await User.findById(req.user.id)
        console.log(user);

        if(user.favourites.includes(recipeId)){
            recipe.isFav = true;
        }
        console.log(recipe);

        res.json({
            message: "Success",
            data: recipe,
            isFav : recipe.isFav
        })
    })

    // get all recipes sort by timestamp
    allRecipes.get(authHelper, async (req,res) => {

        var userFavs = await User.findById(req.user.id);


        var favSet = new Set(userFavs.favourites);

        var result = []

        const allRecipes = await RecipeSchema.find().sort({createdAt : -1});

        
        await Promise.all(allRecipes.map(async (item) => {
            var currDict = item;

            if(favSet.has(item._id.toString())){
                currDict.isFav = true
            }
            else {
                currDict.isFav = false
            }
            console.log(currDict)
            var dict = {}
            dict.data = currDict
            dict.isFav = currDict.isFav
            result.push(dict)
        }))
        

        console.log(result)
        res.json({
            message : "Success",
            data : result
        })
    })



    return router;
}