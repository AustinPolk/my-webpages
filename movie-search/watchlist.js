'use strict';

function init_watchlist()
{
    localStorage.setItem('user-watchlist-json', JSON.stringify({
        movies: []
    }));   
}

function set_watchlist(new_watchlist)
{
    const watchlist_json = JSON.stringify(new_watchlist);
    localStorage.setItem('user-watchlist-json', watchlist_json);
}

function get_watchlist()
{
    const watchlist_json = localStorage.getItem('user-watchlist-json');
    return JSON.parse(watchlist_json);
}

function get_or_create_watchlist()
{
    let watchlist = get_watchlist();
    if (watchlist == null)
    {
        init_watchlist();
        watchlist = get_watchlist();
    }
    return watchlist
}

// used in index.js
function add_to_watchlist(movie)
{
    const watchlist = get_or_create_watchlist();
    watchlist.movies.push(movie);
    set_watchlist(watchlist);
}

function create_watchlist_movie_card(movie)
{
    // get the relevant info from the stored movie object
    const title = movie._title;
    const imdbId = movie._imdbId;
    const year_of_release = movie._year_of_release;
    const plot_summary = movie._plot_summary;
    const poster_src = movie._poster_src;

    // create a div with class "movie-card"
    const movie_card = document.createElement('div');

    // add the poster img, add to card
    const poster_img = document.createElement('img')
    poster_img.setAttribute('src', poster_src);
    poster_img.setAttribute('alt', `poster for ${title}(${year_of_release})`);
    movie_card.appendChild(poster_img);

    // add a div with class "movie-info", add to card
    const movie_info = document.createElement('div');
    movie_info.setAttribute('class', 'movie-info');

    // add an h5 with the movie title
    const movie_title = document.createElement('h5');
    movie_title.textContent = title
    movie_info.appendChild(movie_title);

    // add some info in p
    const movie_id = document.createElement('p');
    movie_id.textContent = `ImdbId: ${imdbId}`;
    movie_info.appendChild(movie_id);

    const movie_year = document.createElement('p');
    movie_year.textContent = `Released: ${year_of_release}`;
    movie_info.appendChild(movie_year);
    
    const movie_plot = document.createElement('p');
    movie_plot.textContent = plot_summary;
    movie_info.appendChild(movie_plot);
    
    // add finished movie info to movie card
    movie_card.appendChild(movie_info);

    return movie_card;
}

function get_watchlist_section()
{
    const watchlist = document.getElementById("watchlist-section");
    return watchlist;
}

function imdbId_is_present_in_watchlist(imdbId)
{
    const watchlist = get_or_create_watchlist();
    for (let i = 0; i < watchlist.movies.length; i++)
    {
        const movie = watchlist.movies[i];
        if (movie._imdbId === imdbId)
        {
            return true;
        }
    }
    return false;
}