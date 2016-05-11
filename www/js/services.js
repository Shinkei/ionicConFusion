'use strict';

var app = angular.module('conFusion.services', ['ngResource']);

app.constant("baseURL", "http://localhost:3000/");

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

app.service('corporateService', ['$resource', 'baseURL', function($resource, baseURL){

    var resourceLeader = $resource(baseURL+"leadership/:id", null, {'update':{method:'PUT'}});

    this.getLeaderResource = function(){
        return resourceLeader;
    };
}]);

app.factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var feedbackFactory = {};
    var resourceFeedback = $resource(baseURL+"feedback/:id", null, {'update':{method:'PUT'}});

    feedbackFactory.getFeedbackResource = function(){
        return resourceFeedback;
    }

    return feedbackFactory;
}]);

app.factory('favoriteFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var favFac = {};
    var favorites = [];

    favFac.addToFavorites = function(index){
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                return;
            }
        }
        favorites.push({id:index});
    };

    favFac.getFavorites = function(){
        return favorites;
    };

    favFac.deleteFromFavorites = function(index){
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                favorites.splice(i, 1);
            }
        }
    };

    return favFac;
}]);