'use strict';

const OMDb_APIKEY = 'ed70b0f4'

function get_movie_list()
{
    const movie_list = document.getElementById("movie-list-section");
    return movie_list;
}

function reset_movie_list()
{
    const movie_list = get_movie_list();
    while (movie_list.children.length > 0)
    {
        movie_list.removeChild(movie_list.firstChild);
    }
}

function add_to_movie_list(new_card)
{
    const movie_list = get_movie_list();
    movie_list.appendChild(new_card);
}

function create_index_movie_card(title,
    imdbId,
    year_of_release,
    plot_summary,
    poster_src,
    in_watchlist,
    add_to_watchlist_callback
)
{
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

    // if the movie isn't in the watchlist already, create a button to add it
    if (in_watchlist === false)
    {
        // add a labeled button to add the movie to the watch-list
        const add_button = document.createElement('button');
        add_button.setAttribute('class', 'add-btn');
        add_button.textContent = '+';

        const button_label = document.createElement('label');
        button_label.textContent = 'Add to watchlist';
        
        // when clicking the button, add this movie to the watchlist
        add_button.addEventListener('click', () => {
            const movie = {
                _title: title,
                _imdbId: imdbId,
                _year_of_release: year_of_release,
                _plot_summary: plot_summary,
                _poster_src: poster_src
            }
            add_to_watchlist_callback(movie);
            movie_info.removeChild(button_label);
            movie_info.removeChild(add_button);

            const new_label = document.createElement('label');
            new_label.textContent = '✅ Added to watchlist';
            movie_info.appendChild(new_label);
        });
        
        // add finished button and label to the movie info
        movie_info.appendChild(add_button);
        movie_info.appendChild(button_label);
    }
    // otherwise let the user know it's already in their watchlist
    else
    {
        const label = document.createElement('label');
        label.textContent = '✅ Added to watchlist';
        movie_info.appendChild(label);
    }

    // add finished movie info to movie card
    movie_card.appendChild(movie_info);

    return movie_card
}

async function query_omdb(query_str)
{
    const url = 'https://www.omdbapi.com';
    const apikey = `apikey=${OMDb_APIKEY}`;
    const s = `s=${query_str}`;
    const type = 'type=movie';

    const full_url = `${url}/?${apikey}&${s}&${type}`;
    const api_response = await fetch(full_url);
    const query_results = await api_response.json();

    return query_results;
}

async function query_additional_info_for_movie(imdbId)
{
    const url = 'https://www.omdbapi.com';
    const apikey = `apikey=${OMDb_APIKEY}`;
    const i = `i=${imdbId}`;
    const type = 'type=movie';

    const full_url = `${url}/?${apikey}&${i}&${type}`;
    const api_response = await fetch(full_url);
    const query_result = await api_response.json();

    return query_result
}