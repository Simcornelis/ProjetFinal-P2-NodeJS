class Playlist extends HTMLElement {

	_id;
	title;
	creatorID;
	gameIDs;

	constructor() {
	  super();
	}
  
	/**
	 * @param {{
	 * _id: string,
	 *  title: string,
	 *  creatorID: string,
	 *  gameIDs: string[],
	 * }} playlist
	 */
	initialisePlaylistBox(playlist) {
		Object.assign(this, playlist);

		const playlistTitle = document.createElement("div");
		playlistTitle.className = "playlist-title";
		playlistTitle.innerText = this.title;
		this.appendChild(playlistTitle);

		const playlistGames = document.createElement("ul");
		playlistGames.className = "playlist-games";

		this.gameIDs.forEach((gameIDs) => {
			const playlistGame = document.createElement("li");
			playlistGame.className = "playlist-game";
			playlistGame.innerText = gameIDs;
			playlistGames.appendChild(playlistGame);
		})

		this.appendChild(playlistGames);
  
		const playlistCreator = document.createElement("div");
		playlistCreator.className = "playlist-creator";
		playlistCreator.innerText = this.creatorID || "Unknown Creator";
		this.appendChild(playlistCreator);

  
		/**
		 * Render of the HTML
		 * 
		 * <playlist-box class="box">
		 * 		<div class="playlist-title">The title</div>
		 * 		<ul class="playlist-games">
		 * 			<li class="playlist-game">game_id</li>
		 * 			<li class="playlist-game">game_id</li>
		 * 			<li class="playlist-game">game_id</li>
		 * 			<li class="playlist-game">game_id</li>
		 * 		</ul>
		 * </playlist-box>
		*/

	}
}
  