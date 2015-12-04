function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

export function getRandomEpisode() {
	//Find all seasons that have unwatched episodes..
	var unwatchedSeasons = [];
	for (var i = 0; i < JSON.parse(localStorage.getItem('totalSeasons')); i++){
		var unwatchedEpisodes =  JSON.parse(localStorage.getItem('SouthParkSeason' + (i+1).toString()));
		if(unwatchedEpisodes && unwatchedEpisodes.length != 0){
			var index = unwatchedSeasons.length;
			unwatchedSeasons[index] = i+1;
		}
	}
	var seasonIndex = randomInt(1,unwatchedSeasons.length);
	unwatchedEpisodes = JSON.parse(localStorage.getItem('SouthParkSeason' + (unwatchedSeasons[seasonIndex])));
	var episodeIndex = randomInt(1,unwatchedEpisodes.length);
	return {season: unwatchedSeasons[seasonIndex], episode : unwatchedEpisodes[episodeIndex]};
}
