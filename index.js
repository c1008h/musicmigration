// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = process.env.BEARER_TOKEN;

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

// const topTracksIds = [
//     '4QhnNyKDsAkXPwHkSnuc89','51vRumtqbkNW9wrKfESwfu','4iZ4pt7kvcaH6Yo8UoZ4s2','3NJ5Ksj7LNbvfNgEtl3o6Z','0bMoNdAnxNR0OuQbGDovrr'
// ];

// async function getRecommendations(){
//     // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
//     return (await fetchWebApi(
//       `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
//     )).tracks;
//   }
  
//   const recommendedTracks = await getRecommendations();
//   console.log(
//     recommendedTracks.map(
//       ({name, artists}) =>
//         `${name} by ${artists.map(artist => artist.name).join(', ')}`
//     )
//   );
//   https://developer.spotify.com/dashboard/create

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  try {
    const response = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=5', 'GET');
    console.log('Response:', response)
    if (!response) {
        throw new Error('Response is undefined');
    }

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(`Error fetching top tracks:`, error);
    return null;
  }
}

async function main() {
    const topTracks = await getTopTracks();
    console.log(
      topTracks?.map(
        ({name, artists}) =>
          `${name} by ${artists.map(artist => artist.name).join(', ')}`
      )
    );
}

main();