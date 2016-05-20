'use strict';

var app = angular.module('conFusion.services', ['ngResource']);

app.constant("baseURL", "http://192.168.70.239:3000/");

app.factory('menuFactory', ['$resource', '$http', 'baseURL', function($resource, $http, baseURL) {
    var menuFac = {};

    var resourceDishes = $resource(baseURL+"dishes/:id", null, {'update':{method:'PUT'}});
    var resourcePromo = $resource(baseURL+"promotions/:id", null, {'update':{method:'PUT'}});

    menuFac.getDishesResource = function(){
        return resourceDishes;
    };

    menuFac.getPromoResource = function(){
        return resourcePromo;
    };

    // still use the $http service to have an idea of how to use the service
    menuFac.getDishes = function(){
        return $http.get(baseURL+"dishes");
    };

    menuFac.getDish = function(id){
        return $http.get(baseURL+"dishes/"+id);
    };

// I have to reimplement this method to get a random dish
    // menuFac.getRandomDish = function(){
    //     var random_number = parseInt(Math.random()*dishes.length);
    //     return $http.get(baseURL+"dishes/"+id);
    // };

    return menuFac;
}]);

app.factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL){
    return $resource(baseURL+"leadership/:id", null, {'update':{method:'PUT'}});
}]);

app.factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var feedbackFactory = {};
    var resourceFeedback = $resource(baseURL+"feedback/:id", null, {'update':{method:'PUT'}});

    feedbackFactory.getFeedbackResource = function(){
        return resourceFeedback;
    }

    return feedbackFactory;
}]);

app.factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function($resource, baseURL, $localStorage){
    var favFac = {};
    var favoriteO = $localStorage.getObject('favorites', '{"favorites":[]}');
    var favorites = favoriteO.favorites;

    favFac.addToFavorites = function(index){
        for (var i = 0, len = favorites.length; i < len; i++) {
            if (favorites[i].id === index) {
                return;
            }
        }
        favorites.push({id:index});
        $localStorage.storeObject('favorites', favoriteO);
    };

    favFac.getFavorites = function(){
        return favorites;
    };

    favFac.deleteFromFavorites = function(index){
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                favorites.splice(i, 1);
                $localStorage.storeObject('favorites', favoriteO);
            }
        }
    };

    return favFac;
}]);

// These factories are used to be implementes with the resolve implementation in app.js
app.factory('dishesFactory', ['$resource', 'baseURL', function($resource, baseURL){
    return $resource(baseURL+"dishes/:id", null, {'update':{method:'PUT'}});
}]);

app.factory('promotionsFactory', ['$resource','baseURL', function($resource, baseURL){
    return $resource(baseURL+"promotions/:id", null, {'update':{method:'PUT'}});
}]);

// Factory to get and save objects in the browser's local storage
app.factory('$localStorage', ['$window', function($window){
    let storage = {};

    storage.store = function(key, value){
        $window.localStorage[key] = value;
    };

    storage.get = function(key, defaultValue){
        return $window.localStorage[key] || defaultValue;
    };

    storage.storeObject = function(key, value){
        $window.localStorage[key] = JSON.stringify(value);
    };

    storage.getObject = function(key, defaultValue){
        return JSON.parse($window.localStorage[key] || defaultValue);
    };

    return storage;
}]);