"use strict";

const EVENT_SEARCH_URL = 'http://api.eventful.com/json/events/search';
const PROXY_SEARCH = "http://david-proxy.herokuapp.com/json/events/search"
const api_key = 'FNKcDXFQvSBbpBvQ';
let currentKeyword = "";
let currentLocation = "";
let currentCategory = "";
let currentRadius = "";
let currentPage = 1;

function renderResult(result) {
	console.log(result);
 	if (result.image !== null) {
		console.log(`${result.image.medium.url}`);
		return `
	    <div class="individual-result">
	      	<p class="title">${result.title}</p>
	      	<img class="descImg" src=${result.image.medium.url} alt=${result.title}>
	      <br>
	      <p class="venue">@ ${result.venue_name}</p>
	      <p class="location">${result.city_name}, ${result.region_abbr}</p>
	    </div>`;
	} else {
		return `
	    <div class="individual-result">
	      	<p class="title">${result.title}</p>
	      	<img class="descImg" src="https://png.icons8.com/ios/1600/no-camera.png" alt="no image available">
	      <br>
	      <p class="venue">@ ${result.venue_name}</p>
	      <p class="time">${result.start_time}</p>
	      <p class="location">${result.city_name}, ${result.region_abbr}</p>
	    </div>`; };
}

function displaySearchData(data) {
	  const results = data.events.event.map((item, index) => renderResult(item));
	  $('.js-display').html(results);
	  $('.js-display').removeClass('hide');
	  $('.form-container').addClass('hide');
	  $('.js-form').addClass('hide');
	  $('.result-alert').removeClass('hide');
	  $('footer').removeClass('hide');
}

function getDataFromApi(term, local, range, category, page, callback) {
  let query = {
    q: `${term}`,
    l: `${local}`,
    within: `${range}`,
    c: `${currentCategory}`,
    page_size: 4,
    page_number: currentPage,
    app_key: api_key
  }

  $.getJSON(PROXY_SEARCH, query, callback);

} 

function watchMainSubmit() {
  $('.js-form').submit(event => {
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

    getDataFromApi(currentKeyword, currentLocation, currentRadius, currentCategory, currentPage, displaySearchData);
  });
}

function appLoad() {
	watchMainSubmit();
}

$(appLoad);