const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");

const startDate = new Date("2023-05-30");
const endDay = new Date().setDate(new Date().getDate() + 20);
const outputFilename = "../data/movies.json";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMoviesForDate = async (date) => {
  const formattedDate = date.toISOString().split("T")[0];

  let data = JSON.stringify({
    operationName: null,
    variables: {
      date: `${formattedDate}`,
    },
    query:
      "query ($date: String, $ids: [ID], $movieId: ID, $movieIds: [ID], $titleClassId: ID, $titleClassIds: [ID], $siteIds: [ID], $everyShowingBadgeIds: [ID], $anyShowingBadgeIds: [ID], $resultVersion: String) {\n  showingsForDate(\n    date: $date\n    ids: $ids\n    movieId: $movieId\n    movieIds: $movieIds\n    titleClassId: $titleClassId\n    titleClassIds: $titleClassIds\n    siteIds: $siteIds\n    everyShowingBadgeIds: $everyShowingBadgeIds\n    anyShowingBadgeIds: $anyShowingBadgeIds\n    resultVersion: $resultVersion\n  ) {\n    data {\n      movie {\n        name\ndirectedBy\nreleaseDate\nposterImage\ntrailerYoutubeId\ntmdbId\n}\n}\n}\n}\n",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.glasgowfilm.org/graphql",
    headers: {
      accept: "*/*",
      "accept-language": "en",
      "circuit-id": "29",
      "client-type": "consumer",
      "content-type": "application/json",
      cookie:
        "ahoy_visit=e0225146-ae90-419b-b351-15edc7405677; ahoy_visitor=ce4feefb-00da-4111-bab9-d90f32cbb9f6; site_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqRXdNeUk9IiwiZXhwIjpudWxsLCJwdXIiOiJjb29raWUuc2l0ZV9pZCJ9fQ%3D%3D--e47c301e6af5b7a5c5f428589b4213fb341ee0d3; circuit_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik1qaz0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5jaXJjdWl0X2lkIn19--b01d831b8d1a8a37983e7b2eeaea0ff4b946c7f6; hardware_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6ImJuVnNiQT09IiwiZXhwIjpudWxsLCJwdXIiOiJjb29raWUuaGFyZHdhcmVfaWQifX0%3D--32879df57724b73b8ef7967fdfb563e327934da0; session_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqWTRPRGt3TURZd0xXWmtNemd0TkRZME5TMWhOakZoTFdKak56ZGxaVEk1WVdGaU9TST0iLCJleHAiOiIyMDI0LTA2LTExVDA4OjM3OjEyLjk5OFoiLCJwdXIiOiJjb29raWUuc2Vzc2lvbl9pZCJ9fQ%3D%3D--041c063165b4016001112cd13a273f5a61756042; ahoy_events=%5B%7B%22name%22%3A%22Page%20View%22%2C%22properties%22%3A%7B%22name%22%3A%22All%20Listings%22%2C%22id%22%3A1907%2C%22page_id%22%3A1907%2C%22title%22%3A%22All%20Listings%22%7D%2C%22time%22%3A1718009735.007%2C%22id%22%3A%224ce63d0e-7c98-4c50-8d17-68a5665f5920%22%2C%22js%22%3Atrue%2C%22visit_token%22%3A%22e0225146-ae90-419b-b351-15edc7405677%22%2C%22visitor_token%22%3A%22ce4feefb-00da-4111-bab9-d90f32cbb9f6%22%7D%2C%7B%22name%22%3A%22Viewed%20All%20Listings%22%2C%22properties%22%3A%7B%22id%22%3A1907%2C%22page_id%22%3A1907%2C%22title%22%3A%22All%20Listings%22%7D%2C%22time%22%3A1718009735.008%2C%22id%22%3A%22724a9c7c-c202-4341-a69d-403b146852ab%22%2C%22js%22%3Atrue%2C%22visit_token%22%3A%22e0225146-ae90-419b-b351-15edc7405677%22%2C%22visitor_token%22%3A%22ce4feefb-00da-4111-bab9-d90f32cbb9f6%22%7D%5D; ahoy_visit=e0225146-ae90-419b-b351-15edc7405677",
      dnt: "1",
      "is-electron-mode": "false",
      origin: "https://www.glasgowfilm.org",
      priority: "u=1, i",
      referer: "https://www.glasgowfilm.org/all-listings/",
      "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "site-id": "103",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    const movies = await Promise.all(
      response.data.data.showingsForDate.data.map(async (showing) => {
        const stats =
          showing.movie.tmdbId && (await getFilmStats(showing.movie.tmdbId));

        return {
          name: stats?.name || showing.movie.name,
          directedBy: showing.movie.directedBy,
          releaseDate: showing.movie.releaseDate,
          posterImage: stats?.image || showing.movie.posterImage,
          trailerYoutubeId: showing.movie.trailerYoutubeId,
          tmdbId: showing.movie.tmdbId,
          rating: stats?.rating,
        };
      })
    );

    return movies;
  } catch (error) {
    console.error(`Error fetching data for ${formattedDate}:`, error.message);
    return {};
  }
};

const getFilmStats = async (tmdbId) => {
  try {
    const url = `https://letterboxd.com/tmdb/${tmdbId}/`;

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const jsonLdScript = $('script[type="application/ld+json"]').html();

    if (!jsonLdScript) return {};

    const jsonData = JSON.parse(jsonLdScript.split(/\n/g)[2]);

    const stats = {
      title: jsonData.name,
      rating: jsonData.aggregateRating.ratingValue,
      genre: jsonData.genre,
      image: jsonData.image,
    };

    return stats;
  } catch (error) {
    console.error(`Error fetching data from Letterboxd:`, error.message);
    return [];
  }
};

const saveMoviesToFile = (movies) => {
  fs.writeFileSync(outputFilename, JSON.stringify(movies, null, 2));
};

const main = async () => {
  let moviesByDate = {};

  if (fs.existsSync(outputFilename)) {
    moviesByDate = JSON.parse(fs.readFileSync(outputFilename));
  }

  let currentDate = startDate;
  while (currentDate <= endDay) {
    const formattedDate = currentDate.toISOString().split("T")[0];

    if (moviesByDate.hasOwnProperty(formattedDate)) {
      console.log(
        `Data for ${formattedDate} found (${moviesByDate[formattedDate].length} films)`
      );
    }

    const movies = await fetchMoviesForDate(currentDate);
    moviesByDate[formattedDate] = movies;

    console.log(`Fetched ${movies.length} movies for ${formattedDate}`);
    saveMoviesToFile(moviesByDate);

    await wait(500); // Wait for 5 seconds

    currentDate.setDate(currentDate.getDate() + 1);
  }
};

main();
