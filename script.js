// console.log("lcodes")
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return `00:00`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(remainingSeconds).padStart(2, '0');

    return `${minutesFormatted}:${secondsFormatted}`;
}
async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`http://127.0.0.1:5501/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let i = 0; i < as.length; i++) {
            const elt = as[i];
            if (elt.href.endsWith(".mp3")) {
                songs.push(elt.href.split(`/${folder}/`)[1]);
            }
        }
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="playing icon">
            </div>
         </li>`
        }
        //attach an event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
        return songs
    } catch (error) {
        console.error("Error fetching songs:", error);
        return []; // Or handle the error appropriately
    }
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio(`/${folder}/`+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        play.src = "pause.svg"
        currentSong.play()
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums() {
    console.log("displaying albums");
    try {
        const folderResponse = await fetch('http://127.0.0.1:5501/songs/');
        const folderHTML = await folderResponse.text();
        const folderDiv = document.createElement("div");
        folderDiv.innerHTML = folderHTML;
        const anchors = folderDiv.getElementsByTagName("a");
        const cardContainer = document.querySelector(".cardContainer");
        const anchorArray = Array.from(anchors);

        for (let index = 0; index < anchorArray.length; index++) {
            const anchor = anchorArray[index];
            if (anchor.href.includes("/songs")) {
                // const folderName =  `http://127.0.0.1:5501${anchor.pathname}`
                const folderName = anchor.href.split("/").slice(-2)[0];
                const metadataResponse = await fetch(`http://127.0.0.1:5501${anchor.pathname}/info.json`);
                if (metadataResponse.ok) {
                    const folderMetadata = await metadataResponse.json();
                    const coverImagePath = `http://127.0.0.1:5501/${anchor.pathname}/folder.jpg`; 
                    const cardHTML = `
                        <div data-folder="${folderName}" class="card">
                            <div class="play">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                           <img src="${coverImagePath}" alt="coverpage of this playlist">
                            <h2>${folderMetadata.title}</h2>
                            <p>${folderMetadata.description}</p>
                        </div>`;

                    cardContainer.innerHTML += cardHTML;
                } else {
                    console.error(`Failed to fetch metadata for ${folderName}`);
                }
            }
        }

        // Array.from(document.getElementsByClassName("card")).forEach(card => {
        //     card.addEventListener("click", async item => {
        //         console.log("Fetching Songs");
        //         const folderPath = `songs/${item.currentTarget.dataset.folder}`;
        //         const songs = await getSongs(folderPath);
        //         playMusic(songs[0]);
        //     });
        // });
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                playMusic(songs[0])
    
            })
        })
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

async function main() {
    //get the list of all songs
    await getSongs("songs/fvt");
    playMusic(songs[0], true);
    //display all albumbs on the page
   await displayAlbums();
    //load the playlist whenever card is clicked
    // console.log(songs)
    //attach an event listner to play, next and previous songs
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //Listen for timeUpdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        //for automatically playing next song
        if (currentSong.currentTime == currentSong.duration) {
            currentSong.pause();
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1]);
            }
            else {
                playMusic(songs[0]);
            }
        }
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    //Add an event listner for hamburger
    document.querySelector(".hamburgur").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    //add an eventlistner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = `-120%`;
    })
    //add an eventlistner to previous
    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
        else {
            playMusic(songs[songs.length - 1]);
        }
    })
    //to next
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0]);
        }
    })
    //for increasing and decreasing the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value
        )
        currentSong.volume = parseInt(e.target.value) / 100;

    })

}
main()
