Events = new Mongo.Collection("events");


if (Meteor.isClient) {
  var gatorApp = angular.module('Gator',['angular-meteor', 'ui.router']);
  // counter starts at 0
//   Session.setDefault('counter', 0);

//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });

//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });

   gatorApp.config(function($urlRouterProvider, $stateProvider, $locationProvider){
 
      $locationProvider.html5Mode(true);
 
      $stateProvider
        // .state('/', {
        //   url: '/login',
        //   templateUrl: 'client/templates/partials/login.html',
        //   controller: 'loginController'
        // })

        .state('home', {
          url: '/home',
          templateUrl: 'client/templates/partials/home.html',
          controller: 'homeController'
        })

        // .state('posts', {
        // 	url: '/posts',
        // 	templateUrl: 'client/templates/partials/posts.html',
        // 	controller: 'postsController'
        // });
 
      $urlRouterProvider.otherwise("/");
    });

  //  gatorApp.controller('loginController', function ($scope, $meteor) {
  //   // $scope.parties = $meteor.collection(Parties);
  //   console.log('It works!')
  // });

   gatorApp.controller('homeController', function ($scope, $meteor) {
    $scope.events = $meteor.collection(Events);
    console.log('It works!')
  });

   // gatorApp.controller('postsController', function ($scope, $meteor) {
   //  // $scope.parties = $meteor.collection(Parties);
   //  console.log('It works!')



    
  });
}