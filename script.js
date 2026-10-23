const siteRoot = new URL(".", document.currentScript.src);

// Keep old, shared section URLs working after the move to separate pages.
const legacyRoutes = {
  mission: "about/#mission", faith: "about/#faith", "ai-mission": "about/#ai-mission",
  worship: "worship/", prayer: "worship/#message", notice: "worship/#notice",
  "free-homepage": "learn/", faq: "learn/#faq", contact: "contact/",
  "lecture-contact": "contact/#lecture-contact", "journal-title": "stories/",
  "pathways-title": "learn/"
};
if (document.body.dataset.page === "home") {
  const route = legacyRoutes[location.hash.slice(1)];
  if (route) location.replace(new URL(route, siteRoot).href);
}

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
if (menuButton && siteNav) {
  document.documentElement.classList.add("has-menu-js");
  const closeMenu = () => menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", String(menuButton.getAttribute("aria-expanded") !== "true"));
  });
  siteNav.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu(); menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => { if (!event.target.closest(".site-header")) closeMenu(); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
}

async function loadBoardData() {
  const response = await fetch(new URL("content/site-data.json?v=20261023", siteRoot), {
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

if (document.querySelector("[data-board]")) loadBoardData()
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
  document.querySelectorAll(".section-heading, .faith-heading, .feature-panel, .pathway-card, .course-panel, .maker-principles article, .contact-card").forEach((item) => observer.observe(item));
}
