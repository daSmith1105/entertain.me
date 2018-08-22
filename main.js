"use strict";

const EVENT_SEARCH_URL = 'https://api.eventful.com/json/events/search';
const ALT_PROXY = "https://david-proxy.herokuapp.com/json/events/search";
const api_key = 'FNKcDXFQvSBbpBvQ';
let currentKeyword = "";
let currentLocation = "";
let currentCategory = "";
let currentRadius = "";
let currentPage = 1;


function getCurrentLocation () {
        $.getJSON("https://ip-api.com/json/?callback=?", function(data) {
	   	console.log(`${data.zip}`);
	   	$('.js-location-query').val(`${data.zip}`);
	   	currentLocation = `${data.zip}`;
	});
}

function changeSearchLocation() {
	$('.change-location-button').on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 'fast');
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
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$('.form-container').removeClass('hide');
		$('.js-form').removeClass('hide');
		$('.category-container').removeClass('hide');
		$('.result-alert').addClass('hide');
		$('.page-alert').addClass('hide');
		$('.next-page').addClass('hide');
		$('.previous-page').addClass('hide');
		$('.js-display').addClass('hide');
		$('.result-nav').addClass('hide');
		currentPage = 1;
	});
}

function homeReset() {
	$('.logo, .home').on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$('.form-container').removeClass('hide');
		$('.js-form').removeClass('hide');
		$('.category-container').removeClass('hide');
		$('.page-alert').addClass('hide');
		$('.result-alert').addClass('hide');
		$('.next-page').addClass('hide');
		$('.previous-page').addClass('hide');
		$('.js-display').addClass('hide');
		$('.result-nav').addClass('hide');
		$('.return-to-app').addClass('hide');
		$('.external-site').addClass('hide');
		$('.sidenav').css("width", "0");
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

// AJAX Loading modal
function ajaxLoad() {
	$(document).ajaxStart(function(){
    		$('.loading').removeClass('hide');
		$('.loading-content').removeClass('hide');
		}).ajaxStop(function(){
    	$('.loading').addClass('hide');
	$('.loading-content').addClass('hide');
   });
}

function noResultToggle() {
	$('.js-no-result').removeClass('hide');
	currentPage = currentPage - 1;
	console.log('no results found');
//modal close
	$('.js-no-result-close').on('click', function(){
    		$('.js-no-result').addClass('hide');
	});
}

function setByCategoryNav() {
	$('.sidenav').find('a').not('.closebtn, .home').on('click', function(){
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
		$('html, body').animate({ scrollTop: 0 }, 'fast');
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
		$('html, body').animate({ scrollTop: 0 }, 'fast');
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
	$('.external-site').html(`<object class="embed col-10" data=${address} />`);
	$('.result-nav').addClass('hide');
	$('.category-container').addClass('hide');
	$('.result-alert').addClass('hide');
	$('.js-display').addClass('hide');
	$('.page-alert').addClass('hide');
	$('.next-page').addClass('hide');
	$('.previous-page').addClass('hide');
	$('.return-to-app').removeClass(`hide`);
	$('.external-site').removeClass(`hide`);

	$('.return-button').on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$('.result-nav').removeClass('hide');
		$('.category-container').removeClass('hide');
		$('.result-alert').removeClass('hide');
		$('.js-display').removeClass('hide');
	 	$('.next-page').removeClass('hide');
	 	$('.previous-page').addClass('hide');
	 	$('.page-alert').removeClass('hide');
	 	$('.return-to-app').addClass(`hide`);
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
	if(page < 1) {
		currentPage = 1;
	};
}

function renderResult(result) {
	console.log(result);
 	if (result.image !== null) {
		console.log(`${result.image.medium.url}`);
		const trimmed_url = 
		$('.cPage').html(currentPage);
		return `
	    <div class="individual-result col-10">
			<img class="descImg" src=${result.image.medium.url} alt="event image">
			<div class="info-container">
				<p class="title">${result.title}</p>
				<p class="time">${result.start_time}</p>
				<p class="venue">@ ${result.venue_name}</p>
				<p class="location">${result.city_name}, ${result.region_abbr}</p>
		    </div>
			<button class="details" onclick='displayDetails("${result.url}")'>More</button>
	    </div>`;
	} else {
		$('.cPage').html(currentPage);
		return `
	    <div class="individual-result col-10">
			<img class="descImg" src="https://png.icons8.com/ios/1600/no-camera.png" alt="no image available">
			<div class="info-container">
				<p class="title">${result.title}</p>
				<p class="time">${result.start_time}</p>
				<p class="venue">@ ${result.venue_name}</p>
				<p class="location">${result.city_name}, ${result.region_abbr}</p>
		    </div>
			<button class="details" onclick='displayDetails("${result.url}")'>More</button>
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
		  $('.category-container').addClass('hide');
		  $('.js-form').addClass('hide');
		  $('.result-nav').removeClass('hide');
		  $('.page-alert').removeClass('hide');
		  $('previous-page').addClass('hide');
	} else {
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
	app_key: api_key,
	dataType: 'jsonp',
	scheme: 'https'
  }
  	$.getJSON(EVENT_SEARCH_URL, query, callback);
}

function watchSplash() {
	$('.splash-go').on('click', function(){
		$('.splash-label').fadeOut(600);
		$('.splash ul').fadeOut(400);
		$('.splash button').fadeOut(350);
		$('.splash-logo').css({'width': '100%', 'height': 'auto'});
		$('.js-splash').fadeOut(4000);
		ajaxLoad();
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
	// getCurrentLocation();
	watchSplash();
	watchMainSubmit();
	sideNavToggle();
	setByCategoryNav();
	changeSearchLocation();
	navBack();
	nextPage();
	previousPage();
	homeReset();
}

$(appLoad);
