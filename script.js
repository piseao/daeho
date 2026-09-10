async function loadBoardData() {
  const response = await fetch("content/site-data.json?v=20260908-2", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("게시판 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

function postItem(post) {
  return `
    <li class="post-item">
      <div class="post-meta">
        <span>${post.category}</span>
        <time datetime="${post.date}">${post.date}</time>
      </div>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-summary">${post.summary}</p>
    </li>
  `;
}

function storyCard(story) {
  return `
    <article class="story-card">
      <div>
        <span class="post-meta">${story.category}</span>
        <h3>${story.title}</h3>
      </div>
      <p>${story.summary}</p>
    </article>
  `;
}

function renderBoards(data) {
  document.querySelectorAll("[data-board]").forEach((target) => {
    const key = target.dataset.board;
    const items = data[key] || [];

    if (key === "stories") {
      target.innerHTML = items.map(storyCard).join("");
      return;
    }

    target.innerHTML = items.map(postItem).join("");
  });
}

function setupHeroVideo() {
  const iframe = document.querySelector(".hero-video");
  if (!iframe || !window.YT?.Player) return;

  new window.YT.Player(iframe, {
    events: {
      onReady(event) {
        event.target.mute();
        event.target.playVideo();
      },
      onStateChange(event) {
        const playerFrame = event.target.getIframe();
        playerFrame.classList.toggle(
          "is-playing",
          event.data === window.YT.PlayerState.PLAYING,
        );
      },
      onError(event) {
        event.target.getIframe().classList.remove("is-playing");
      },
    },
  });
}

function loadHeroVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.onYouTubeIframeAPIReady = setupHeroVideo;

  const apiScript = document.createElement("script");
  apiScript.src = "https://www.youtube.com/iframe_api";
  apiScript.async = true;
  document.head.append(apiScript);
}

loadBoardData()
  .then(renderBoards)
  .catch((error) => {
    console.error(error);
  });

loadHeroVideo();
