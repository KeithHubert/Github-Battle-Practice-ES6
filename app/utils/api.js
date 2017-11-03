const axios = require('axios');]

const id = "838d136757aac6088edb";
const sec = "942abfabdef3e68b719c572c89c89518079c8722";
const params = `?client_id=${id}&client_secret=${sec}`;

function getProfile (username) {
  return axios.get(`https://api.github.com/users/${username}${params}`)
    .then(({ data }) => data);
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}
    &per_page=100`);
}


function getStarCount (repos) {
  return repos.data.reduce((count, { stargazers_count} ) => count +
    stargazers_count, 0);
}

function calculateScore ({ followers }, repos) {
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null;
}

function getUserData (player) {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([ profile, repos ]) => ({
      profile,
      score: calculateScore(profile, repos)
  }))
}

function sortPlayers (players) {
  return players.sort((a,b) => b.score - a.score);
}

module.exports = {
  battle (players) {
    return Promise.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },

  // When battle function runs, map over players, for each item in players we
  // getUserData, which calls getProfile and getRepos on specific player,
  // once data is returned it is an object formatted with profile and score.
  // Once all information is returned sortPlayers is called which sorts the array
  // (first player being the winner). If error it is caught with .catch(handleError)


  fetchPopularRepos (language) {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

    return axios.get(encodedURI).then(({ data }) => data.items);
  }
};

//axios.all takes in an array of promises
//will change to fetch
