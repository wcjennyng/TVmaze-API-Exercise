/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */ 
      
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let tvShows = res.data.map(final=>{
    let show = final.show
 
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing"
    }
  })

 return tvShows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-light ep-btn">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  // TODO: return array-of-episode-info, as described in docstring above
  let eps = res.data.map(ep => ({
    id: ep.id,
    name: ep.name,
    season: ep.season,  
    number: ep.number
  }))
return eps;
}

//populates array of episode info into DOM
function populateEpisodes(eps) {
  const $epList = $('#episodes-list')
  $epList.empty();

  eps.forEach((ep) => {
    let $item = $(`<li>${ep.name} (season ${ep.season}, episode ${ep.number})</li>`)
  $epList.append($item)
  })
  $('#episodes-area').show()
}

//click handler that listens for clicks on button
$('#shows-list').on('click', ".ep-btn", async function epClick(evt) {
  let showId = $(evt.target).closest('.Show').data('show-id')
  let eps = await getEpisodes(showId)
  populateEpisodes(eps)
} )