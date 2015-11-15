Events = new Mongo.Collection("events");


if (Meteor.isClient) {
  var gatorApp = angular.module('Gator',['angular-meteor']);

  var markers = [];
  var map;
  var eventsChanged = function () {
      console.log("events changed!");
      for (var i = 0; i < markers.length; ++i) {
	  markers[i].setMap(null);
      }
      markers = [];

      if (map) {
	  var all = Events.find({});
	  console.log("all ", all);
	  all.forEach(function (event) {
		  console.log("event ", event);
		  markers.push(new google.maps.Marker({
			      position: event.location,
				  map: map,
				  }));
	      });
      }
  };
		 
  window.initMap = function() {
      map = new google.maps.Map(document.getElementById('map'), {
	      center: {lat: 40.0069364, lng: -105.272157},
	      zoom: 15
	  });

      eventsChanged();
  }

   gatorApp.controller('homeController', function ($scope, $meteor) {
    $scope.events = $meteor.collection(Events);

		 $scope.$watch('events', eventsChanged, true);
       });

    window.onload = function() {
    var webcam = (function(){
	    if (navigator.geolocation) {
		console.log("got location");
	    }

	    var video = document.getElementById('video'),
	    photo = document.getElementById('photo');

	    function play() {
		if (navigator.getUserMedia) {
		    navigator.getUserMedia({video: true, toString : function() {return "video";} }, onSuccess, onError);
		} else {
		    changeStatus('getUserMedia is not supported in this browser.', true);
		}
	    }

	    function onSuccess(stream) {
		var source;
		if (window.URL) {
		    source = window.URL.createObjectURL(stream);
		} else {
		    source = stream; // Opera and Firefox
		}

		video.autoplay = true;
		video.src = source;

		changeStatus('Connected.', false);
	    }

	    function onError() {
		    changeStatus('Please accept the getUserMedia permissions! Refresh to try again.', true);
	    }

	    function changeStatus(msg, error) {
		var status = document.getElementById('status');
		status.innerHTML = msg;
		status.style.color = (error) ? 'red' : 'green';
	    }

	    var location = null;

	    function takePhoto() {
		// set our canvas to the same size as our video
		photo.width = video.videoWidth / 2;
		photo.height = video.videoHeight / 2;

		var context = photo.getContext('2d');
		context.drawImage(video, 0, 0, photo.width, photo.height);
        
		// allow us to save
		var saveButton = document.getElementById('submitEvent');

		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition
			(function(position) {
			    console.log("current position ", position);
			    saveButton.disabled = false;
			    location = position;
			});
		} else {
		    saveButton.disabled = true;
		}

		video.pause();
	    }

	    function savePhoto() {
		document.getElementById('submitEvent').disabled = true;

		var data = photo.toDataURL("image/png").replace('data:image/png;base64,', '');

		console.log(data);

		var event = { image: "data:image/png;base64," + data,
			     text: document.getElementById("eventDescription").value,
			     createdAt: new Date() // current time
		};

		if (location) {
		    event.location = {lat: location.coords.latitude,
				     lng: location.coords.longitude};
		}
		Events.insert(event);

		video.play();
	    }

	    return {
		init: function() {
		    changeStatus('Please accept the permissions dialog.', true);

		    document.getElementById("takePicture").onclick = takePhoto;
		    document.getElementById("submitEvent").onclick = savePhoto;

		    navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

		    play();

		}()

	    }

	})();
    }

}