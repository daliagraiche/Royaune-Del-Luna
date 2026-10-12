
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll("#menu .menu_card");
    const navLinks = document.querySelectorAll("#navbarre nav a");
    const menuSection = document.querySelector("#menu");

    document.documentElement.classList.add("js-ready");

    if ("IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const card = entry.target;
                const siblings = [
                    ...(card.parentElement?.querySelectorAll(".menu_card") || [])
                ];

                card.style.transitionDelay =
                    `${Math.min(Math.max(siblings.indexOf(card), 0) % 4, 3) * 60}ms`;

                card.classList.add("is-visible");
                observer.unobserve(card);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });

        cards.forEach(card => cardObserver.observe(card));
    } else {
        cards.forEach(card => card.classList.add("is-visible"));
    }

    if (menuSection && !document.querySelector(".category-menu")) {
        const categoryNames = [
            { match: /entr/i, label: "Entrées" },
            { match: /plat/i, label: "Plats" },
            { match: /pizza/i, label: "Pizzas" },
            { match: /hamburger/i, label: "Hamburgers" },
            { match: /taco/i, label: "Tacos" },
            { match: /sandwich/i, label: "Sandwichs" },
            { match: /dessert/i, label: "Desserts" },
            { match: /boisson/i, label: "Boissons" }
        ];

        const headings = [
            ...menuSection.querySelectorAll(":scope > h1")
        ];

        const quickMenu = document.createElement("nav");
        quickMenu.className = "category-menu";
        quickMenu.setAttribute(
            "aria-label",
            "Accès rapide aux catégories du menu"
        );

        const title = document.createElement("span");
        title.className = "category-menu-title";
        title.textContent = "Explorer";
        quickMenu.appendChild(title);

        let count = 0;

        headings.forEach(heading => {
            const text = heading.textContent.trim();
            const category = categoryNames.find(item =>
                item.match.test(text)
            );

            if (!category) return;

            const id = `categorie-${count++}`;
            heading.id = id;

            const link = document.createElement("a");
            link.href = `#${id}`;
            link.textContent = category.label;
            link.dataset.target = id;

            quickMenu.appendChild(link);
        });

        if (count) {
            menuSection.before(quickMenu);
        }

        quickMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", event => {
                const target = document.getElementById(
                    link.dataset.target
                );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            });
        });

        if ("IntersectionObserver" in window) {
            const categoryObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    quickMenu.querySelectorAll("a").forEach(link => {
                        const active =
                            link.dataset.target === entry.target.id;

                        link.classList.toggle("active", active);

                        if (active) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            }, {
                rootMargin: "-18% 0px -70% 0px",
                threshold: 0
            });

            headings.forEach(heading => {
                if (heading.id) categoryObserver.observe(heading);
            });
        }
    }

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    navLinks.forEach(link => {
        const targetPage = (link.getAttribute("href") || "")
            .split("/")
            .pop()
            .toLowerCase();

        if (targetPage && targetPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    const topButton = document.createElement("button");
    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.setAttribute(
        "aria-label",
        "Retour en haut de la page"
    );
    topButton.title = "Retour en haut";
    topButton.innerHTML = "↑";

    document.body.appendChild(topButton);

    const updateTopButton = () => {
        topButton.classList.toggle(
            "is-visible",
            window.scrollY > 450
        );
    };

    window.addEventListener("scroll", updateTopButton, {
        passive: true
    });

    updateTopButton();

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });

    document.querySelectorAll("#menu .menu_image img").forEach(image => {
        image.loading = "lazy";
        image.decoding = "async";

        if (!image.hasAttribute("alt") || !image.alt.trim()) {
            const name = image.closest(".menu_card")
                ?.querySelector("h2")?.textContent?.trim();

            image.alt = name
                ? `Photo de ${name}`
                : "Photo d'un plat du restaurant";
        }
    });
});
