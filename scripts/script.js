var LCBOKey = "MDo1ZTc4YTcyYy03MzdkLTExZTUtOGRmZS1lM2ZiYWFhODVmMGM6QU5OMWNmM0t1S09HcEtnQWlWSUR2eGhrbzdyakVUa3dSMzFi";

var googleAPI = "AIzaSyDvdJsbRPNlJMzuNrgRQuoDw3EjsLoG7WU";

// main functions:

var findLCBO = {};

var checkInventory = {};

var selectBooze = {};

// universal variables:

var userStoreNumber;

var userfindLCBOinfo;

var LCBOlat;

var LCBOlong;

var withinArea = false;

var boozeSuggestion;

var stockNumber;

function initStoreMap() {
      var start = {lat: LCBOlat, lng: LCBOlong};
      var end = userfindLCBOinfo.alley;

      var map = new google.maps.Map(document.getElementById('map'), {
                  center: start,
                  scrollwheel: false,
                  zoom: 16,
                  disableDefaultUI: false,
                  zoomControlOptions: {style: google.maps.ZoomControlStyle.DEFAULT,},
                  disableDoubleClickZoom: true,
                  scrollwheel: false,
                  draggable : true,
                  streetViewControl: false
            });
      var image = 'images/LCBOmarker.png';
      var alleyImage = 'images/drink.png'
      var directionsDisplay = new google.maps.DirectionsRenderer({
                  map: map,
                  icon: image,
                  suppressMarkers: true,
                  polylineOptions: {strokeColor: "red"}
            });
      var styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
      map.setOptions({styles: styles});

      // Set Google Maps destination, origin and travel mode.
      var request = {
      destination: end,
      origin: start,
      travelMode: google.maps.TravelMode.WALKING
      };

      // Pass the directions request to the directions service.
      var directionsService = new google.maps.DirectionsService();
      var marker = new google.maps.Marker({
            position: {lat: LCBOlat, lng: LCBOlong},
            map: map,
            icon: image
            });
      directionsService.route(request, function(response, status) {
            $('.green').on('click', function() {
                  if (status == google.maps.DirectionsStatus.OK) {
                  // Display the route on the map.
                  directionsDisplay.setDirections(response);
                  marker = new google.maps.Marker({
                  position: userfindLCBOinfo.alley,
                  map: map,
                  icon: alleyImage
                  });
                  }
            });
      });
};

// find closest LCBO and find out if it's valid part 1

findLCBO.getAddress = function() {
      $('form.location').on('submit', function(e) {
            e.preventDefault();
            address = $('input.enterLocation').val();
            if (address !== '') {
                  findLCBO.storeLookup(address);
            }
      });
}

//...part 2...

findLCBO.storeLookup = function(userChoice) {
      $.ajax({
            url: 'http://lcboapi.com/stores',
            dataType: 'jsonp',
            method: 'GET',
            data: {
                  geo: userChoice + ' toronto',
                  per_page: 5,
                  key: LCBOKey
            }
      }).then(function(res) {
            findLCBO.isLocal(res.result[0].id);
            console.log(res);
      });
};

//...part 3...

findLCBO.isLocal = function(userStore) {
      for (var i = 0; i < torontoLCBOs.length; i++) {
               if (torontoLCBOs[i].id === userStore) {
                  withinArea = true;
                  userfindLCBOinfo = torontoLCBOs[i];
               }
            };
            if (withinArea === null) {
                  $('.errorBox').removeClass('displayNone');
                  $('.errorBox').addClass('technicalDifficulties')
            } else if (withinArea === true) {
                  userStoreNumber = userStore;
                  console.log("lcbo is valid. store number " + userStoreNumber);
                  withinArea = false;
                  LCBOlat = userfindLCBOinfo.latitude;
                  LCBOlong = userfindLCBOinfo.longitude;
                  $('p.LCBOname').text(" " + userfindLCBOinfo.name + " ");
                  $('p.LCBOaddress').text(" " + userfindLCBOinfo.address_line_1 + " ");
                  initStoreMap();
                  $('header').addClass('displayNone');
                  $('section.yourLCBO').removeClass('displayNone');
                  $('.okButton1').on('click', function() {
                        selectBooze.randBooze();
                        $('.yourLCBO').removeClass('displayFlex').addClass('displayNone');
                        $('.yourBooze').removeClass('displayNone').addClass('displayFlex');
                  });      

            } else {
                  $('.errorBox').removeClass('displayNone').addClass('technicalDifficulties');
                  alert("Looks like you're outside our coverage area. Sorry :(");
                  $('.errorBox').on('click', function() {
                        $(this).removeClass('technicalDifficulties').addClass('displayNone');
                  });
            };
};


// randomly select a booze from list

selectBooze.randBooze = function() {
      boozeSuggestion = boozeInfo[Math.floor(Math.random() * boozeInfo.length)];
      console.log("boozeSuggestion = " + boozeSuggestion.id)
      checkInventory.search(boozeSuggestion.id);
};


// check if user's LCBO has random booze in stock. If not, run randomizer again.

checkInventory.search = function(ID) {
      $.ajax({
            url: 'http://lcboapi.com/stores/' + userStoreNumber + '/products/' + ID + '/inventory',
            dataType: 'jsonp',
            method: 'GET',
      }).then(function(res) {
            if (res.result === null) {
                  console.log("NULL result");
                  selectBooze.randBooze();
            } else if (res.result.quantity === 0) {
                  console.log("not in stock");
                  selectBooze.randBooze();
            } else if (res.result.quantity > 0) {
                  console.log("it worked!" + res.result.quantity);
                  stockNumber = res.result.quantity;
                  selectBooze.displayOnPage();
            } else {
                  alert("something went horribly horrribly wrong. sorry.");
            }
      });
};

// display the sweet sweet Booze

selectBooze.displayOnPage = function() {
      $.ajax({
            url: 'http://lcboapi.com/products/' + boozeSuggestion.id,
            dataType: 'jsonp',
            method: 'GET',
      }).then(function(res) {
            $('.yourBooze').addClass('displayFlex').removeClass('displayNone');
            console.log(res.result.name);
            $('div.displayBooze img').attr('src', res.result.image_thumb_url);
            $('h2.boozeTitle').text(res.result.name);
            $('h2.boozeTitle').text(boozeSuggestion.gydoNAME);
            $('p.boozeBlurb').text(boozeSuggestion.blurb);
            $('p.boozePercentPriceStock').text(res.result.alcohol_content / 100 + '% alcohol / $' + (res.result.price_in_cents / 100).toFixed(2) );
            $('p.atYourStore').html("<b>" + stockNumber + " in stock at " + userfindLCBOinfo.name + "</b>");
            $('.green').on('click', function() {
                  $('.yourBooze').removeClass('displayFlex').addClass('displayNone');
                  $('.yourLCBO').removeClass('displayNone').addClass('displayFlex');
                  $('p.closestLCBO').addClass('displayNone');
                  $('p.LCBOname').text("Nearest drinking alley.");
                  $('p.LCBOaddress').text("");
                  $('.okButton1').addClass('displayNone');
                  $('.playAgain').removeClass('displayNone').addClass('displayInlineBlock');
            });
            $('.grey').on('click', function() {
                  selectBooze.randBooze();
            })
      });
};

$(function() {
      findLCBO.getAddress();
});