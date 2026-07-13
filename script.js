// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

revealElements.forEach((element) => observer.observe(element));

// Active Navigation
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.id;
    }
  });

  // At the bottom of the page, always highlight Contact
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5
  ) {
    current = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
});

// Intro Typing effects
const text =
  "Developer with passion about building software and sharing technology contents.";

const typing = document.getElementById("typing");
const cursor = document.querySelector(".cursor");

let index = 0;

function type() {
  if (index < text.length) {
    typing.textContent += text.charAt(index);
    index++;
    setTimeout(type, 50);
  } else {
    cursor.style.display = "none";
  }
}

type();
