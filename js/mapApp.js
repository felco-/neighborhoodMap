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
  var markInfo = new google.maps.InfoWindow();
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
    * Create Observables for the Info Window.
    */
    self.infoDowntown = ko.observable();
    self.infoGaleriaDoRock = ko.observable();
    self.infoTeatroMunicipal = ko.observable();
    self.infoMemorialAL = ko.observable();
    self.infoMasp = ko.observable();

    /*
    * Get Wikipedia Data for each Map Location.
    */
    $.ajax({
      url: "https://en.wikipedia.org/w/api.php?format=json&origin=*&utf8&action=query&rawcontinue=true&prop=extracts&exintro=true&explaintext=true&exchars=420&exsectionformat=wiki&titles=Praça_da_Sé",
      type: "GET",
      dataType: 'json',
      success: function(data) {
        self.infoDowntown("<h3>Praça da Sé</h3><br />Address: Praça da Sé - República<br /><br />" + data.query.pages[Object.keys(data.query.pages)[0]].extract + "<br /><br />Source: <a href='https://en.wikipedia.org/wiki/Praça_da_Sé' target='_blank'>https://en.wikipedia.org/wiki/Praça_da_Sé</a>");
      }
    });

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php?format=json&origin=*&utf8&action=query&rawcontinue=true&prop=extracts&exintro=true&explaintext=true&exchars=420&exsectionformat=wiki&titles=Galeria_do_Rock",
      type: "GET",
      dataType: 'json',
      success: function(data) {
        self.infoGaleriaDoRock("<h3>Galeria do Rock</h3><br />Address: Av. São João, 439 - República<br /><br />" + data.query.pages[Object.keys(data.query.pages)[0]].extract + "<br /><br />Source: <a href='https://en.wikipedia.org/wiki/Galeria_do_Rock' target='_blank'>https://en.wikipedia.org/wiki/Galeria_do_Rock</a>");
      }
    });

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php?format=json&origin=*&utf8&action=query&rawcontinue=true&prop=extracts&exintro=true&explaintext=true&exchars=420&exsectionformat=wiki&titles=Theatro_Municipal_(São_Paulo)",
      type: "GET",
      dataType: 'json',
      success: function(data) {
        self.infoTeatroMunicipal("<h3>Teatro Municipal</h3><br />Address: Praça Ramos de Azevedo - República<br /><br />" + data.query.pages[Object.keys(data.query.pages)[0]].extract + "<br /><br />Source: <a href='https://en.wikipedia.org/wiki/Theatro_Municipal_(São_Paulo)' target='_blank'>https://en.wikipedia.org/wiki/Theatro_Municipal_(São_Paulo)</a>");
      }
    });

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php?format=json&origin=*&utf8&action=query&rawcontinue=true&prop=extracts&exintro=true&explaintext=true&exchars=420&exsectionformat=wiki&titles=Latin_America_Memorial",
      type: "GET",
      dataType: 'json',
      success: function(data) {
        self.infoMemorialAL("<h3>Memorial da América Latina</h3><br />Address: Av. Auro Soares de Moura Andrade, 664 - Barra Funda<br /><br />" + data.query.pages[Object.keys(data.query.pages)[0]].extract  + "<br /><br />Source: <a href='https://en.wikipedia.org/wiki/Latin_America_Memorial' target='_blank'>https://en.wikipedia.org/wiki/Latin_America_Memorial</a>");
      }
    });

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php?format=json&origin=*&utf8&action=query&rawcontinue=true&prop=extracts&exintro=true&explaintext=true&exchars=420&exsectionformat=wiki&titles=São_Paulo_Museum_of_Art",
      type: "GET",
      dataType: 'json',
      success: function(data) {
        self.infoMasp("<h3>Museu de Arte de São Paulo</h3><br />Address: Av. Paulista, 1578 - Bela Vista<br /><br />" + data.query.pages[Object.keys(data.query.pages)[0]].extract + "<br /><br />Source: <a href='https://en.wikipedia.org/wiki/São_Paulo_Museum_of_Art' target='_blank'>https://en.wikipedia.org/wiki/São_Paulo_Museum_of_Art</a>");
      }
    });

    /*
    * Set an Observable Array with know Map Locations.
    */
    self.mapLocations = ko.observableArray([
      {idName: "downtown", markFun: function markFun() { downtown(); }, friendyName: "Praça Da Sé (Downtown)", infoContent: function infoContent() { return self.infoDowntown(); }, lat: -23.5503644, lng: -46.6339456},
      {idName: "galeriaDoRock", markFun: function markFun() { galeriaDoRock(); }, friendyName: "Galeria Do Rock", infoContent: function infoContent() { return self.infoGaleriaDoRock(); }, lat: -23.542665, lng: -46.6404518},
      {idName: "teatroMunicipal", markFun: function markFun() { teatroMunicipal(); }, friendyName: "Teatro Municipal", infoContent: function infoContent() { return self.infoTeatroMunicipal(); }, lat: -23.545235, lng: -46.6386151},
      {idName: "memorialAL", markFun: function markFun() { memorialAL(); }, friendyName: "Memorial Da America Latina", infoContent: function infoContent() { return self.infoMemorialAL(); }, lat: -23.5272349, lng: -46.6650873},
      {idName: "masp", markFun: function markFun() { masp(); }, friendyName: "Museu De Arte São Paulo", infoContent: function infoContent() { return self.infoMasp(); }, lat: -23.5613876, lng: -46.6558215}
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
          clickState = !clickState;
          if (clickState) {
            mapsMarker.setAnimation(google.maps.Animation.BOUNCE);
            markInfo.setContent(self.filterLocations()[cityLocation].infoContent());
            markInfo.open(map, mapsMarker);
            map.setZoom(18);
            map.setCenter(newMarker);
          } else {
            mapsMarker.setAnimation(null);
            map.setZoom(14);
            markInfo.close();
          }
          self.clickState = clickState;
        });

        /*
        * Create a function to listen for clicks in the Locations list
        * and open the Info Window. Tracks the Click State. In the click event
        * set the center to this Marker and Zoom In.
        */
        var functionName = self.filterLocations()[cityLocation].idName;
        window[functionName] = function() {
          clickState = !clickState;
          if (clickState) {
            mapsMarker.setAnimation(google.maps.Animation.BOUNCE);
            markInfo.setContent(self.filterLocations()[cityLocation].infoContent());
            markInfo.open(map, mapsMarker);
            map.setZoom(18);
            map.setCenter(newMarker);
          } else {
            mapsMarker.setAnimation(null);
            map.setZoom(14);
            markInfo.close();
          }
          self.clickState = clickState;
        }

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
