var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.reservation = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

// Modal for the reservation form
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope:$scope
    }).then(function(modal){
        $scope.reserveform = modal;
    });

    $scope.closeReserve = function(){
        $scope.reserveform.hide();
    };

    $scope.reserve = function(){
        $scope.reserveform.show();
    };

    $scope.doReserve = function(){
        console.log('Doing reservation', $scope.reservation);
        $scope.reservation = {};
        $timeout(function(){
            $scope.closeReserve();
        }, 1000);
    };
});

app.controller('MenuController',['$scope', 'dishes', 'baseURL', '$ionicListDelegate', 'favoriteFactory', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, baseURL, $ionicListDelegate, favoriteFactory, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = ''; // Filter
    $scope.showDetails = false;

    $scope.dishes = dishes;

    $scope.select = function(setTab){
        $scope.tab = setTab;

        // Filter
        if(setTab === 2){
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3){
            $scope.filtText = "mains";
        }
        else if (setTab === 4){
            $scope.filtText = "dessert";
        }
        else{
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function(value){
        return ($scope.tab === value);
    };

    $scope.toggleDetails = function(){
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function(index){
        console.log('index: '+index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function(){
            $cordovaLocalNotification.schedule({
                id:1,
                title:'Added Favorite',
                text:$scope.dishes[index].name
            }).then(function(){
                console.log('added favorite', $scope.dishes[index].name);
            },function(){
                console.log('failed to add favorite');
            });

            $cordovaToast.show('Added Favorite '+$scope.dishes[index].name)
                .then(function(){
                    console.log('show toast');
                },function(){
                    console.log('error in toast');
            });
        });
    };

}]);

// Contact controller
app.controller('ContactController',['$scope', function($scope){
    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:""};

    var channels = [{value:"tel", label:"Tel."},
                    {value:"Email", label:"Email"}];
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

}]);

// Feddback Controller
app.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory){

    $scope.sendFeedback = function(){

        console.log($scope.feedback);
        if($scope.feedback.agree && ($scope.feedback.mychannel === "" || $scope.feedback.mychannel === null) && !$scope.feedback.mychannel){
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }else{
            $scope.invalidChannelSelection = false;
            feedbackFactory.getFeedbackResource().save($scope.feedback);
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:""};
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };

}]);

// Dishes Details
app.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'baseURL', 'favoriteFactory','$ionicPopover', '$ionicModal', function($scope, $stateParams, dish, baseURL, favoriteFactory, $ionicPopover, $ionicModal) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading...";
    $scope.dish = dish;

    $scope.filt = "";

    $scope.addFavorite = function(){
        favoriteFactory.addToFavorites($scope.dish.id);
        $scope.popover.hide();
    };

    $ionicPopover.fromTemplateUrl('templates/dishOptionsPopover.html', {
        scope: $scope
    }).then(function(popover){
        $scope.popover = popover
    });

    $scope.openOptions = function($event){
        $scope.popover.show($event);
    };

// Modal to add comment
    $ionicModal.fromTemplateUrl('templates/addComment.html', {
        scope:$scope
    }).then(function(modal){
        $scope.addCommentForm = modal;
    });

    $scope.closeCommentForm = function(){
        $scope.addCommentForm.hide();
    };

    $scope.comment = function(){
        $scope.addCommentForm.show();
        $scope.popover.hide();
    };

}]);

// DishComments
app.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory){

    $scope.comment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function(){

        $scope.comment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.comment);
        menuFactory.getDishesResource().update({id:$scope.dish.id}, $scope.dish);
        $scope.comment = {rating:5, comment:"", author:"", date:""};
        $scope.closeCommentForm();

    };
}]);

// Index Controller
app.controller('IndexController', ['$scope', 'dish', 'ceo', 'baseURL', 'promotions', function($scope, dish, ceo, baseURL, promotions){

    $scope.baseURL = baseURL;

    $scope.dish = dish;
    $scope.promotion = promotions;
    $scope.ceo = ceo;

}]);

app.controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL){
    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.messageLeaders = 'Loading...';
    $scope.leaders = leaders;
}]);

app.controller('FavoriteController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$timeout', function($scope, dishes, favoriteFactory, baseURL,$ionicListDelegate, $ionicPopup, $timeout){
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = dishes;

    $scope.toggleDelete = function(){
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

    $scope.deleteFavorite = function(index){
        var confirmPopup = $ionicPopup.confirm({
            title:'Confirm Delete',
            template:'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function(response){
            if (response) {
                favoriteFactory.deleteFromFavorites(index);
                $scope.shouldShowDelete = false;
            }else{
                console.log('Item deleted')
            }
        });
    };

}]);

// Filter of favorites, this should be in a separate file
app.filter('favoriteFilter', function(){
    return function(dishes, favorites){
        var result = [];

        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id) {
                result.push(dishes[j]);
                }
            }
        }

        return result;
    };
});