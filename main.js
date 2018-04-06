"use strict";

const EVENT_SEARCH_URL = 'http://api.eventful.com/json/events/search';
const PROXY_SEARCH = "http://david-proxy.herokuapp.com/json/events/search"
const api_key = 'FNKcDXFQvSBbpBvQ';
let currentKeyword = "";
let currentLocation = "";
let currentCategory = "";
let currentRadius = "";
let currentPage = 1;

function getCurrentLocation () {
	 if ("geolocation" in navigator){ 
        const geo = navigator.geolocation;
        geo.getCurrentPosition(function(position){ 
                const userLat = position.coords.latitude;
                const userLong = position.coords.longitude;
                const userLocation = `${userLat},${userLong}`;
                console.log('User Position:' + userLocation);
                $('.js-location-query').attr('value', userLocation);
                currentLocation = userLocation;
                console.log(currentLocation);
             });
    } else {
        console.log("Browser doesn't support geolocation!");
        currentLocation = '90210';
    }
}

function changeSearchLocation() {
	$('.change-location-button').on('click', function() {
		currentKeyword = currentKeyword;
		currentLocation = $('.js-change-location').val();
		currentRadius = currentRadius ;
    	currentCategory = currentCategory;
		console.log(currentKeyword);
    	console.log(currentLocation);
    	console.log(currentRadius);
    	console.log(currentCategory);
    	currentPage = 1;
    	$('.js-change-location').val('');
		getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
	});
}

function navBack() {
	$('.back').on('click', function() {
		$('.form-container').removeClass('hide');
		$('.js-form').removeClass('hide');
		$('.category-container').removeClass('hide');
		$('.result-alert').addClass('hide');
		$('.next-page').addClass('hide');
		$('.previous-page').addClass('hide');
		$('.js-display').addClass('hide');
		$('.result-nav').addClass('hide');
		currentPage = 1;
	});
}

function sideNavToggle() {
// nav open
	$('.burger-icon').on('click', function(){
    	$('.sidenav').css("width", "250px");
	});
	$('.all-button').on('click', function(){
    	$('.sidenav').css("width", "250px");
	});
//nav close
	$('.closebtn').on('click', function(){
    	$('.sidenav').css("width", "0");
	});
}

function noResultToggle() {
	$('.js-no-result').removeClass('hide');
//modal close
	$('.js-no-result-close').on('click', function(){
    	$('.js-no-result').addClass('hide');
	});
}

function setByCategoryNav() {
	$('.sidenav').find('a').not('.closebtn').on('click', function(){
		currentKeyword = currentKeyword;
		if (currentLocation === null) {
			currentLocation = $('.js-location-query').val();
		} else {
			currentLocation = currentLocation;
		}
    	currentRadius = 10;
    	currentCategory = "";
    	currentCategory = event.currentTarget.id;
    	console.log(currentKeyword);
    	console.log(currentLocation);
    	console.log(currentRadius);
    	console.log(currentCategory);
    	currentPage = 1;
    	$('.previous-page').addClass('hide');
    	$('.next-page').addClass('hide');
    	$('.sidenav').css("width", "0");
    	$('.external-site').addClass('hide');

		getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
	});
}

function nextPage() {
	$('.next-page').on('click', function() {
		currentKeyword = currentKeyword;
    	currentLocation = currentLocation;
    	currentRadius = currentRadius ;
    	currentCategory = currentCategory;
    	currentPage++;
    	checkPageCount(currentPage);
    	console.log(currentKeyword);
    	console.log(currentLocation);
    	console.log(currentRadius);
    	console.log(currentCategory);
    	console.log(currentPage);

		getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
	});
}

function previousPage() {
	$('.previous-page').on('click', function() {
		currentKeyword = currentKeyword;
    	currentLocation = currentLocation;
    	currentRadius = currentRadius;
    	currentCategory = currentCategory;
    	currentPage--;
    	checkPageCount(currentPage);
    	console.log(currentKeyword);
    	console.log(currentLocation);
    	console.log(currentRadius);
    	console.log(currentCategory);
    	console.log(currentPage);

		getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
	});
}

function displayDetails(address) {
	$('.external-site').html(`<object class="embed" data=${address} />`);
	$('.result-nav').addClass('hide');
	$('.category-container').addClass('hide');
	$('.result-alert').addClass('hide');
	$('.js-display').addClass('hide');
	$('.page-alert').addClass('hide');
	$('.next-page').addClass('hide');
	$('.previous-page').addClass('hide');
	$('.returnToApp').removeClass(`hide`);
	$('.external-site').removeClass(`hide`);

	$('.return-button').on('click', function() {
		$('.result-nav').removeClass('hide');
		$('.category-container').removeClass('hide');
		$('.result-alert').removeClass('hide');
		$('.js-display').removeClass('hide');
	 	$('.next-page').removeClass('hide');
	 	$('.previous-page').addClass('hide');
	 	$('.page-alert').removeClass('hide');
	 	$('.returnToApp').addClass(`hide`);
	 	$('.external-site').addClass(`hide`);
	 	checkPageCount(currentPage);
	  });
}

function checkPageCount(page) {
	if (page >= 2) {
		$(document).find('.previous-page').removeClass('hide');
	} else {
		$(document).find('.previous-page').addClass('hide');
	};
}

function renderResult(result) {
	console.log(result);
 	if (result.image !== null) {
		console.log(`${result.image.medium.url}`);
		$('.cPage').html(currentPage);
		return `
	    <div class="individual-result">
	      	<p class="title">${result.title}</p>
	      	<img class="descImg" src=${result.image.medium.url} alt=${result.title}>
	      <br>
	      <p class="venue">@ ${result.venue_name}</p>
	      <p class="location">${result.city_name}, ${result.region_abbr}</p>
	      <button class="details" onclick='displayDetails("${result.url}")'>Learn More</button>
	    </div>`;
	} else {
		$('.cPage').html(currentPage);
		return `
	    <div class="individual-result">
	      	<p class="title">${result.title}</p>
	      	<img class="descImg" src="https://png.icons8.com/ios/1600/no-camera.png" alt="no image available">
	      <br>
	      <p class="venue">@ ${result.venue_name}</p>
	      <p class="time">${result.start_time}</p>
	      <p class="location">${result.city_name}, ${result.region_abbr}</p>
	      <button class="details" onclick='displayDetails("${result.url}")'>Learn More</button>
	    </div>`; };
}

function displaySearchData(data) {
	if (data.events !== null) {
	  const results = data.events.event.map((item, index) => renderResult(item));
	  	  checkPageCount(currentPage);
		  $('.js-display').html(results);
		  $('.js-display').removeClass('hide');
		  $('.result-alert').removeClass('hide');
		  $('.form-container').addClass('hide');
		  $('.js-form').addClass('hide');
		  $('.result-nav').removeClass('hide');
		  $('.page-alert').removeClass('hide');
		  $('previous-page').addClass('hide');
} else {
		  $('.next-page').addClass('hide');
		  noResultToggle();
	}
}

function getDataFromApi(term, local, range, category, page, callback) {
  let query = {
    q: `${term}`,
    l: `${local}`,
    within: `${range}`,
    c: `${currentCategory}`,
    sort_order: 'date',
    page_size: 4,
    page_number: currentPage,
    app_key: api_key
  }
  	$.getJSON(PROXY_SEARCH, query, callback);
} 

function watchSplash() {
	$('.splash-go').on('click', function(){
		$('.js-splash').addClass('hide');
		('.slide')
	});
}

function watchMainSubmit() {
  $('.js-form').on('submit', function(event) {
    event.preventDefault();
    const queryLocation = $(event.currentTarget).find('.js-location-query');
    const queryRadius = $(event.currentTarget).find('.js-radius-query');
    const queryKeyword = $(event.currentTarget).find('.js-keyword-query');
    const queryCategory = $(event.currentTarget).find('.category-select');
    currentKeyword = queryKeyword.val();
    currentLocation = queryLocation.val();
    currentRadius = queryRadius.val();
    currentCategory = queryCategory.val();
    console.log(currentKeyword);
    console.log(currentLocation);
    console.log(currentRadius);
    console.log(currentCategory);
 
    queryRadius.val("10");
    queryLocation.val("");

    getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
  });
}

function appLoad() {
	watchSplash();
	getCurrentLocation();
	watchMainSubmit();
	sideNavToggle();
	setByCategoryNav();
	changeSearchLocation();
	navBack();
	nextPage();
	previousPage();
}

$(appLoad);