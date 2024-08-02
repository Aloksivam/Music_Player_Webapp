console.log("lcodes");

async function fetchSongs() {
  try {
    const response = await fetch("http://127.0.0.1:5500/SpotifyClone/songs/");
    if (!response.ok) {
      throw new Error("Failed to fetch songs.");
    }
    const textResponse = await response.text();
    return textResponse;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return null;
  }
}

async function getSongsList() {
  const response = await fetchSongs();
  if (response === null) {
    console.error("Unable to get songs.");
    return [];
  }

  const element = document.createElement("div");
  element.innerHTML = response;
  const anchors = element.getElementsByTagName("a");

  const songs = Array.from(anchors)
    .filter(elt => elt.href.endsWith(".mp3"))
    .map(elt => elt.href.split("/songs/")[1]);

  return songs;
}

async function playFirstSong() {
  const songs = await getSongsList();
  if (songs.length === 0) {
    console.error("No songs found.");
    return;
  }

  const audio = new Audio(songs[0]);
  audio.addEventListener("loadeddata", () => {
    const duration = audio.duration;
    console.log("Duration of the first song:", duration);
    audio.play();
  });

  // Optional: Handle audio errors
  audio.addEventListener("error", (err) => {
    console.error("Audio error:", err);
  });
}

async function main() {
  await playFirstSong();
}

main();
