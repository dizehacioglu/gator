Events = new Mongo.Collection("events");


if (Meteor.isClient) {
  var gatorApp = angular.module('Gator',['angular-meteor', 'ui.router']);


   gatorApp.controller('homeController', function ($scope, $meteor) {
    $scope.events = $meteor.collection(Events);
    console.log('It works!')
  });

}