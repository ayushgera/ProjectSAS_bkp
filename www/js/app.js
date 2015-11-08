var app= angular.module('ionic.example', ['ionic','ui.router'])

app.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
      

      function userLocationUpdate(userInfo){
          if(!users[userInfo.id]) users[userInfo.id] = { id: userInfo.id };
          
          users[userInfo.id].name = userInfo.name;
          users[userInfo.id].latitude  = userInfo.latitude;
          users[userInfo.id].longitude = userInfo.longitude;
          users[userInfo.id].timestamp = new Date().getTime()
          refreshMarkers();
      } 


      function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        if(map!=null){
            
            $scope.loading = $ionicLoading.show({
                      content: 'Getting current location...',
                      showBackdrop: false
            });

            

            navigator.geolocation.getCurrentPosition(function(pos) {
                     var myLatlng2= new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                     $scope.map.setCenter(myLatlng2);
                     //$scope.loading.hide();
                     $ionicLoading.hide();
                     var marker = new google.maps.Marker({
                      position: myLatlng2,
                      map: map,
                      title: 'You Are Here!'
                     });

                    //Marker + infowindow + angularjs compiled ng-click
                    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
                    var compiled = $compile(contentString)($scope);

                    var infowindow = new google.maps.InfoWindow({
                      content: compiled[0]
                    });

                    

                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map,marker);
                    });

                }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        }
   
        $scope.map = map;
        refreshMarkers();
      }


      function refreshMarkers(){
          if (!map) return;
          /*if (!currentUserInfo.movedMapCenter && currentUserInfo.timestamp) {
              $('#user-name').val(currentUserInfo.name);
              $('#user-name').bind('keyup', function() {
                  currentUserInfo.name = $('#user-name').val();
              })
              currentUserInfo.movedMapCenter = true;
              map.setCenter(new google.maps.LatLng(
                  currentUserInfo.latitude, currentUserInfo.longitude));
          }*/

          for (var id in users) {
              var userInfo = users[id];

              if(userInfo.marker){

                  // If we havn't received any update from the user
                  //  We remove the marker of missing user
                  if( userInfo.id != currentUserInfo.id && 
                      userInfo.timestamp + 1000*30 < new Date().getTime() ){
                      userInfo.marker.setMap(null);
                      delete users[id];
                      continue;
                  }

              }else{

                  // Create a marker for the new user
                  var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
                    var compiled = $compile(contentString)($scope);

                    var infowindow = new google.maps.InfoWindow({
                      content: compiled[0]
                    });
                  var marker = new google.maps.Marker({ map:map });
                  google.maps.event.addListener(marker, 'click', function() {
                      infowindow.setContent(marker.getTitle())
                      infowindow.open(map, marker);
                  });

                  userInfo.marker = marker;
              }

              //Move the markers
              userInfo.marker.setTitle(userInfo.name);
              userInfo.marker.setPosition( 
                  new google.maps.LatLng(userInfo.latitude, userInfo.longitude));
          }
          
          $('#user-number').text(Math.max(Object.keys(users).length-1,0) +'')

          // Refresh the markers every 20 seconds
          clearTimeout(refreshTimeout) 
          refreshTimeout = setTimeout(refreshMarkers, 1000*20);
      }

      currentUserInfo = initLocationSharing(userLocationUpdate);
      google.maps.event.addDomListener(window, 'load', initialize);
      
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
    });

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home')

  $stateProvider.state('home', {
    url: '/home',
    views: {
      home: {
        templateUrl: 'home.html'
      }
    }
  });

  $stateProvider.state('report', {
    url: '/report',
    views: {
      report: {
        templateUrl: 'report.html'
      }
    }
  });

$stateProvider.state('help', {
    url: '/help',
    views: {
      help: {
        templateUrl: 'help.html'
      }
    }
  })
});
