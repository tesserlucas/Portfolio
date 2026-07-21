"use strict";

// Animações de entrada
if (window.AOS) {
  AOS.init({
    duration: 750,
    once: true,
    offset: 70,
    easing: "ease-out-cubic"
  });
}

const navbar = document.getElementById("mainNavbar");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const navLinks = document.querySelectorAll(".nav-link[href^='#']");
const sections = document.querySelectorAll("main section[id], header[id]");
const navbarCollapseElement = document.getElementById("navbarNav");
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function updateOnScroll() {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  if (navbar) {
    navbar.classList.toggle("scrolled", scrollTop > 40);
  }

  if (backToTop) {
    backToTop.classList.toggle("show", scrollTop > 500);
  }

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
}

window.addEventListener("scroll", updateOnScroll, { passive: true });
updateOnScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Fecha o menu mobile ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navbarCollapseElement || window.innerWidth >= 992 || !window.bootstrap) return;

    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapseElement, {
      toggle: false
    });

    collapseInstance.hide();
  });
});

// Marca a seção atual no menu
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", isCurrent);
        });
      });
    },
    {
      rootMargin: "-38% 0px -52% 0px",
      threshold: 0.01
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Efeito de texto digitado
const typingText = document.getElementById("typingText");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingText && !reduceMotion) {
  const roles = [
    "Desenvolvimento Web",
    "Engenharia da Computação",
    "Tecnologia e Infraestrutura",
    "Aprendizado Contínuo"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex += 1;
      typingText.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeRole, 1500);
        return;
      }
    } else {
      charIndex -= 1;
      typingText.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeRole, deleting ? 45 : 85);
  }

  typingText.textContent = "";
  typeRole();
}

// Envio do formulário com feedback visual
const contactForm = document.getElementById("contatoForm");
const submitButton = document.getElementById("submitButton");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactForm.classList.add("was-validated");

    if (!contactForm.checkValidity()) {
      if (formStatus) {
        formStatus.textContent = "Revise os campos destacados.";
        formStatus.className = "form-status error mb-0";
      }
      return;
    }

    const buttonText = submitButton?.querySelector(".button-text");
    const originalButtonText = buttonText?.textContent || "Enviar mensagem";

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (buttonText) {
      buttonText.textContent = "Enviando...";
    }

    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status mb-0";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      contactForm.reset();
      contactForm.classList.remove("was-validated");

      if (formStatus) {
        formStatus.textContent = "Mensagem enviada com sucesso!";
        formStatus.className = "form-status success mb-0";
      }
    } catch (error) {
      console.error(error);

      if (formStatus) {
        formStatus.textContent = "O envio falhou. Tente novamente em instantes.";
        formStatus.className = "form-status error mb-0";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }

      if (buttonText) {
        buttonText.textContent = originalButtonText;
      }
    }
  });
}
