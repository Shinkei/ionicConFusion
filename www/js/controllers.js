var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
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

app.controller('MenuController',['$scope', 'menuFactory', 'baseURL', '$ionicListDelegate', 'favoriteFactory', function($scope, menuFactory, baseURL, $ionicListDelegate, favoriteFactory) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = ''; // Filter
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading...";

    $scope.dishes = {};
    menuFactory.getDishesResource().query(
        function(response){
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function(response){
            $scope.message = "ERROR:"+response.status+" "+response.statusText;
        }
    );

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
    }
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
app.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function($scope, $stateParams, menuFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading...";
    $scope.dish = {};
    menuFactory.getDish(parseInt($stateParams.id, 10))
        .then(
            function(response){
                $scope.dish = response.data;
                $scope.showDish = true;
            },
            function(response){
                $scope.message = "ERROR: "+response.status+" "+response.statusText;
            }
        );

    $scope.filt = "";

}]);

// DishComments
app.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory){

    $scope.comment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function(){

        $scope.comment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.comment);
        menuFactory.getDishesResource().update({id:$scope.dish.id}, $scope.dish);
        $scope.comment = {rating:5, comment:"", author:"", date:""};
        $scope.commentForm.$setPristine();
    };
}]);

// Index Controller
app.controller('IndexController', ['$scope', 'menuFactory', 'corporateService', 'baseURL', function($scope, menuFactory, corporateService, baseURL){

    $scope.baseURL = baseURL;
    $scope.showDishes = false;
    $scope.showDish = false;
    $scope.messageDishes = "Loading...";
    $scope.messageDish = "Loading...";

    $scope.dishes = {};
    menuFactory.getDishes()
        .then(
            function(response){
                $scope.dishes = response.data;
                $scope.showDishes = true;
            },
            function(response){
                $scope.messageDishes = "ERROR:"+response.status+" "+response.statusText;
            }
        );

    $scope.dish = {};
    menuFactory.getDish(0)
        .then(
            function(response){
                $scope.dish = response.data;
                $scope.showDish = true;
            },
            function(response){
                $scope.messageDish = "ERROR: "+response.status+" "+response.statusText;
            }
        );

    $scope.promotion = {};
    $scope.showPromotion = false;
    $scope.messagePromotion = "Loading...";
    menuFactory.getPromoResource().get({id:0})
        .$promise.then(
            function(response){
                $scope.promotion = response;
                $scope.showPromotion = true;
            },
            function(response){
                $scope.messagePromotion = "ERROR: "+response.status+" "+response.statusText;
            });

    $scope.ceo = {};
    $scope.showCEO = false;
    $scope.messageCEO = "Loading...";
    corporateService.getLeaderResource().get({id:0})
        .$promise.then(
            function(response){
                $scope.ceo = response;
                $scope.showCEO = true;
            },
            function(response){
                $scope.messageCEO = "ERROR: "+response.status+" "+response.statusText;
            }
        );

}]);

app.controller('AboutController', ['$scope', 'corporateService', 'baseURL', function($scope, corporateService, baseURL){
    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.messageLeaders = 'Loading...';
    $scope.leaders = {};
    corporateService.getLeaderResource().query(
        function(response){
            $scope.leaders = response;
            $scope.showLeaders = true;
        },
        function(response){
            $scope.messageLeaders = "ERROR: "+response.status+" "+response.statusText;
        }
    );

}]);

app.controller('FavoriteController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function($scope, menuFactory, favoriteFactory, baseURL,$ionicListDelegate){
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = {};
    menuFactory.getDishes()
        .then(
            function(response){
                $scope.dishes = response.data;
            }
        );

    $scope.toggleDelete = function(){
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

    $scope.deleteFavorite = function(index){
        favoriteFactory.deleteFromFavorites(index);
        $scope.shouldShowDelete = false;
    }

}]);

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