Events = new Mongo.Collection("events");


if (Meteor.isClient) {
  var gatorApp = angular.module('Gator',['angular-meteor']);

  var sections = ['nav', 'map', 'posts', 'add-post', 'map-header', 'groupup-image-container'];

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
				  animation: google.maps.Animation.DROP,
				  title: event.text,
				  map: map,
				  }));
	      });
      }
  };

  function notify(user, description) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "https://api.pushover.net/1/messages.json", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send("token=aVtFCWAdrR9q6xksfBx68XtECSCJX9&user=" + user + "&message=New Event: " + description);
  }
		 
  window.initMap = function() {
      map = new google.maps.Map(document.getElementById('map'), {
	      center: {lat: 40.0069364, lng: -105.272157},
	      zoom: 14
	  });

      eventsChanged();
  }

  angular.module('Gator').controller
      ('EventCtrl', ['$scope', '$meteor',
		     function ($scope, $meteor) {
	      console.log("controller!");
	   // $scope.events = $meteor.collection(Events);

	   $scope.events = $meteor.collection(function() {
	   		console.log('sorted')
        return Events.find({}, {sort: {createdAt: -1}})
      });

	   $scope.$watch('events', eventsChanged, true);
       }]);

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

		var description = document.getElementById("eventDescription").value;
		var event = { image: "data:image/png;base64," + data,
			      text: description,
			     createdAt: new Date() // current time
		};

		if (location) {
		    event.location = {lat: location.coords.latitude,
				     lng: location.coords.longitude};
		}
		Events.insert(event);

		// notify a couple of hard-coded users every time an event is added
		notify("uioE5od96kZfvvoLPcQymkHaVnVEJ9", description);
		notify("ucMsNS1eqbNTPY9vG6UqFQLceEGTZR", description);

		video.play();

		showPosts();
	    }

	    function postExamples() {
		Events.insert({ image: "/images/boat.jpg",
				text: "boating day -- everyone welcome",
			      createdAt: new Date(),
				location: {lat: 40.037940, lng: -105.237138} });
		Events.insert({ image: "/images/costumes.jpg",
				text: "ComicCon 2015 -- bring your costume!",
			      createdAt: new Date(),
			    location: {lat: 40.020524, lng: -105.267093} });

		Events.insert({ image: "http://i.telegraph.co.uk/multimedia/archive/02362/video-game-2_2362669b.jpg",
				text: "mario kart tournament",
			      createdAt: new Date(),
			      location: {lat: 40.004, lng: -105.273377} });

		Events.insert({ image: "https://d2fijpsef22722.cloudfront.net/photos/big/2048720215-indoor-trampoline-arena.jpg",
				text: "trampoline park",
			      createdAt: new Date(),
			      location: {lat: 40.01, lng: -105.279} });
	    }

	    return {
		init: function() {
		    changeStatus('Please accept the permissions dialog.', true);

		    document.getElementById("takePicture").onclick = takePhoto;
		    document.getElementById("submitEvent").onclick = savePhoto;
		    document.getElementById("postExamples").onclick = postExamples;

		    navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

		    play();

		}()

	    }


	   



	    
	})();



			function showNav() {
				if(document.getElementById('nav').style.display === 'block'){
					document.getElementById('nav').style.display = "none";
				} 

				else {
					document.getElementById('nav').style.display = "block";
				}
	    		
	    	}

	    	function showMap() {
	    		document.getElementById('map').style.display = "block";
	    		document.getElementById('map-header').style.display = "block";
	    		for(var i = 0; i < sections.length; i++){
	    			if(sections[i] !== 'map' && sections[i] !== 'map-header'){
	    				document.getElementById(sections[i].toString()).style.display = "none";
	    			}

	    		}
	    	}

	    	function showPosts() {
	    		document.getElementById('posts').style.display = "block";
	    		// document.getElementById('').style.display = "block";
	    		for(var i = 0; i < sections.length; i++){
	    			if(sections[i] !== 'posts'){
	    				document.getElementById(sections[i].toString()).style.display = "none";
	    			}
	    		}
	    		document.getElementById('eventDescription').value = '';

	    	}

	    	function showAddPost(){
	    		document.getElementById('add-post').style.display = "block";
	    		for(var i = 0; i < sections.length; i++){
	    			if(sections[i] !== 'add-post'){
	    				document.getElementById(sections[i].toString()).style.display = "none";
	    			}
	    		}	
	    	}

	    	function showGroup(){
	    		document.getElementById('groupup-image-container').style.display = "block";
	    		for(var i = 0; i < sections.length; i++){
	    			if(sections[i] !== 'groupup-image-container'){
	    				document.getElementById(sections[i].toString()).style.display = "none";
	    			}
	    		}	
	    	}

	    	function init() {
	    		document.getElementById('menu-icon').onclick = showNav
	    		document.getElementById('nav-home-link').onclick = showMap
	    		document.getElementById('nav-posts-link').onclick = showPosts
	    		document.getElementById('nav-addpost-link').onclick = showAddPost
	    		document.getElementById('post-event-button').onclick = showAddPost
	    		document.getElementById('nav-group-link').onclick = showGroup


	    	}

	    	init()

    }



}