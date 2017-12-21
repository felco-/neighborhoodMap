/*
* Initialize the Google Maps
*/
function initMap() {
  /*
  * Set the main options for the Maps
  */
  var mapOptions = {
    zoom: 14,
    center: {lat: -23.5503644, lng: -46.6339456},
    mapTypeId: 'roadmap'
  };

  /*
  * Create a new Map and create the Map Markers Array.
  */
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var mapMarkersArr = [];

  /*
  * Initialize the Knockout View Model.
  */
  var mapLocationsModel = function() {
    /*
    * Create an Observable for the Filter function.
    */
    var self = this;
    self.currentFilter = ko.observable();

    /*
    * Set an Observable Array with know Map Locations.
    */
    self.mapLocations = ko.observableArray([
      {idName: "downtown", friendyName: "Praça Da Sé (Downtown)", infoContent: "<strong>Praça Da Sé</strong><br />Praça Da Sé - Sé", lat: -23.5503644, lng: -46.6339456},
      {idName: "galeriaDoRock", friendyName: "Galeria Do Rock", infoContent: "<strong>Galeria Do Rock</strong><br />Av. São João, 439 - República", lat: -23.542665, lng: -46.6404518},
      {idName: "teatroMunicipal", friendyName: "Teatro Municipal", infoContent: "<strong>Teatro Municipal</strong><br />Praça Ramos de Azevedo, s/n - República", lat: -23.545235, lng: -46.6386151},
      {idName: "memorialAL", friendyName: "Memorial Da America Latina", infoContent: "<strong>Memorial Da America Latina</strong><br />Av. Auro Soares de Moura Andrade, 664 - Barra Funda", lat: -23.5272349, lng: -46.6650873},
      {idName: "masp", friendyName: "Museu De Arte São Paulo", infoContent: "<strong>Museu De Arte São Paulo</strong><br />Av. Paulista, 1578 - Bela Vista", lat: -23.5613876, lng: -46.6558215}
    ]);

    /*
    * Create a function to return only the locations in the current filter.
    * Otherwise return all locations.
    */
    self.filterLocations = ko.computed(function() {
      if (!self.currentFilter()) {
        return self.mapLocations();
      } else {
        return ko.utils.arrayFilter(self.mapLocations(), function(cityLocations) {
          if (cityLocations.friendyName.toLowerCase().includes(self.currentFilter().toLowerCase())) {
            return cityLocations;
          }
        });
      }
    });

    /*
    * Create a function to set the current filter, clear all Map Markers and
    * set the Map Markers based on the current filter.
    */
    self.setFilter = function(cityLocations) {
      self.currentFilter(cityLocations);
      cleanMarkers(mapMarkersArr);
      mapMarkersArr = setMarkers(map, mapMarkersArr);
    }

    /*
    * Create a function to create Map Markers, Info Windows, click handlers
    * and store it into an Array.
    */
    function setMarkers(map, mapMarkersArr) {
      var mapBoundaries = new google.maps.LatLngBounds();
      var mapMarkersArr = [];

      /*
      * Loop through the current filter to create Map Markers, Info Windows and
      * click handlers.
      */
      Object.keys(self.filterLocations()).forEach(function(cityLocation) {
        var newMarker = new google.maps.LatLng(self.filterLocations()[cityLocation].lat, self.filterLocations()[cityLocation].lng);
        mapBoundaries.extend(newMarker);
        var clickState

        /*
        * Create a new Info Window and set the content.
        */
        var markInfo = new google.maps.InfoWindow({
          content: self.filterLocations()[cityLocation].infoContent
        });

        /*
        * Create a new Map Marker and set the position, map Object, title.
        */
        var mapsMarker = new google.maps.Marker({
          position: newMarker,
          map: map,
          title: self.filterLocations()[cityLocation].friendyName,
          animation: google.maps.Animation.DROP,
          clickable: true
        });

        /*
        * Create a event listener for Map Marker Icon to open the Info Window.
        * Tracks the Click State. In the click event set the center to this
        * Marker and Zoom In.
        */
        mapsMarker.addListener('click', function() {
          (function($) {
            clickState = !clickState;
            if (clickState) {
              mapsMarker.setAnimation(google.maps.Animation.BOUNCE);
              markInfo.open(map, mapsMarker);
              map.setZoom(18);
              map.setCenter(newMarker);
            } else {
              mapsMarker.setAnimation(null);
              map.setZoom(14);
              markInfo.close();
            }
            $(this).data('clickState', clickState);
          })(jQuery);
        });

        /*
        * Create a jQuery function to listen for clicks in the Locations list
        * and open the Info Window. Tracks the Click State. In the click event
        * set the center to this Marker and Zoom In.
        */
        (function($) {
          $('#' + self.filterLocations()[cityLocation].idName).on('click', function () {
            clickState = !clickState;
            if (clickState) {
              markInfo.open(map, mapsMarker);
              map.setZoom(18);
              map.setCenter(newMarker);
            } else {
              map.setZoom(14);
              markInfo.close();
            }
            $(this).data('clickState', clickState);
          });
        })(jQuery);

        /*
        * Update the map boundaries and update the Map Markers Array.
        */
        map.fitBounds(mapBoundaries);
        mapMarkersArr.push(mapsMarker);
      });
      return mapMarkersArr;
    }

    /*
    * Clean the Map Markers.
    */
    function cleanMarkers(mapMarkersArr) {
      while (mapMarkersArr.length > 0) {
        mapMarkersArr.pop().setMap(null);
      }
    }
  }

  /*
  * Initialize the mapApp with the mapLocationsModel. Apply the Knockout binds
  * and the locations filter without a value, return all Map Markers locations.
  */
  var mapApp = new mapLocationsModel();
  ko.applyBindings(mapApp);
  mapApp.setFilter();
}

/*
* Create a jQuery function to collapse and show the Sidebar to the user in the
* event of clicking in the Map Filter toggle.
*/
(function($) {
  $('#sidebarCollapse').on('click', function () {
    if ($('#sidebar').is(":visible")) {
      $('#sidebar').hide();
    } else {
      $('#sidebar').show();
    }
  });
})(jQuery);
