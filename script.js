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

loadBoardData()
  .then(renderBoards)
  .catch((error) => {
    console.error(error);
    document.querySelectorAll("[data-board]").forEach((target) => {
      const message = document.createElement(target.tagName === "UL" ? "li" : "p");
      message.textContent = "소식을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.";
      target.replaceChildren(message);
    });
  });

// Content stays visible if JavaScript or observation is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-once");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section-heading, .faith-heading, .feature-panel, .pathway-card, .maker-principles article, .contact-card").forEach((item) => observer.observe(item));
}
