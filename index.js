// Match each navigation link to its page section.
const navLinks = Array.from(
  document.querySelectorAll(".main-nav a[href^='#']"),
);
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);
const pageContent = document.querySelector(".page-content");
const desktopLayout = window.matchMedia("(min-width: 768px)");
let sectionObserver;

// Keep the visual highlight and screen-reader state in sync.
function setActiveSection(section) {
  navLinks.forEach((link) => {
    const isActive = link.hash === `#${section.id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// Watch sections inside the desktop scroller, or the window on mobile.
function observeSections() {
  sectionObserver?.disconnect();

  if (sections.length === 0) {
    return;
  }

  const root = desktopLayout.matches ? pageContent : null;
  sectionObserver = new IntersectionObserver(
    () => {
      // Select the section crossing a line near the top of the visible content.
      const rootTop = root
        ? root.getBoundingClientRect().top + root.clientTop
        : 0;
      const rootHeight = root ? root.clientHeight : window.innerHeight;
      const activeLine = rootTop + rootHeight * 0.275;
      const activeSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= activeLine && bounds.bottom > activeLine;
      });

      if (activeSection) {
        setActiveSection(activeSection);
      }
    },
    {
      root,
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

observeSections();
desktopLayout.addEventListener("change", observeSections);

const filterButtons = document.querySelectorAll(".portfolio-filters button");
const portfolioCards = document.querySelectorAll(".portfolio-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    portfolioCards.forEach((card) => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matches;
    });

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
  });
});

const contactForm = document.querySelector(".contact-form");
const contactStatus = document.querySelector("#contact-form-status");

if (
  contactForm instanceof HTMLFormElement &&
  contactStatus instanceof HTMLElement
) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (submitButton instanceof HTMLButtonElement) {
    const originalButtonText = submitButton.textContent;

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      contactStatus.textContent = "Sending your message...";
      contactStatus.classList.remove("text-success", "text-danger");
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Formspree returned status ${response.status}`);
        }

        contactStatus.textContent =
          "Thanks! Your message was sent successfully.";
        contactStatus.classList.add("text-success");
        contactForm.reset();
      } catch (error) {
        console.error("Contact form submission failed:", error);
        contactStatus.textContent =
          "Sorry, your message couldn't be sent. Please try again!";
        contactStatus.classList.add("text-danger");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || "Send Message";
      }
    });
  }
}
