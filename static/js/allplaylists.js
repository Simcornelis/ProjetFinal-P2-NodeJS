customElements.define("playlist-box", Playlist);

let creator_idQuery = "";

window.addEventListener("load", async () => {
	const playlistList = document.getElementsByClassName("playlist-list")[0];

	async function getPlaylists() {
		clear();
		fetch(
			"/playlists/findplaylists?search_query=" +
			creator_idQuery +
			"&userID_query=" +
			userID
		)
		.then((response) => {
			if(!response.ok) {
				throw new Error();
			}
			return response;
		})
		.then((response) => response.json())
		.then((playlists) => {
			playlists.forEach((playlist) => {
				const playlistBox = document.createElement("playlist-box");
				playlistBox.initialisePlaylistBox(playlist);
				playlistList.appendChild(playlistBox);
			});
		})
		.catch((error) => console.error(error));
	}

  getPlaylists();

  /**
   * Clear the display of the playlists collection
   */
  function clear() {
    const playlistBoxes = document.querySelectorAll("playlist-box");
    playlistBoxes.forEach((box) => box.remove());
  }
});


