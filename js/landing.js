// Landing page interactivity with background slideshow
document.addEventListener("DOMContentLoaded", function () {
  const landingItems = document.querySelectorAll(".landing-item");
  const landingContainer = document.querySelector(".landing-container");
  const slides = document.querySelectorAll(".landing-bg-slideshow .slide");
  let isHovering = false;
  let resizeTimeout;
  let slideInterval;
  let currentSlide = 0;

  // Initialize background slideshow with images from /images/slides/ folder
  function initSlideshow() {
    if (slides.length === 0) {
      // Create default slides if none exist
      const slideshow = document.querySelector(".landing-bg-slideshow");
      if (slideshow) {
        const slideImages = [
          "images/slides/slide1.jpg",
          "images/slides/slide2.jpg",
          "images/slides/slide3.jpg",
          "images/slides/slide4.jpg",
        ];

        slideImages.forEach((src, index) => {
          const slide = document.createElement("div");
          slide.className = "slide";
          slide.style.backgroundImage = `url('${src}')`;
          if (index === 0) slide.classList.add("active");
          slideshow.insertBefore(
            slide,
            document.querySelector(".slide-overlay"),
          );
        });
      }

      // Re-select slides after creating them
      const newSlides = document.querySelectorAll(
        ".landing-bg-slideshow .slide",
      );
      if (newSlides.length > 0) {
        // Show first slide
        newSlides[0].classList.add("active");

        // Start slideshow
        slideInterval = setInterval(() => {
          nextSlide();
        }, 4000); // 4 seconds between slides
      }
      return;
    }

    // Show first slide
    slides[0].classList.add("active");

    // Start slideshow
    slideInterval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds between slides
  }

  // Move to next slide
  function nextSlide() {
    const currentSlides = document.querySelectorAll(
      ".landing-bg-slideshow .slide",
    );
    if (currentSlides.length === 0) return;

    // Remove active class from current slide
    currentSlides[currentSlide].classList.remove("active");

    // Move to next slide
    currentSlide = (currentSlide + 1) % currentSlides.length;

    // Add active class to next slide
    currentSlides[currentSlide].classList.add("active");
  }

  // Function to align all titles to bottom
  function alignTitlesToBottom() {
    if (window.innerWidth > 768) {
      landingItems.forEach((item) => {
        const content = item.querySelector(".landing-content");
        const title = item.querySelector(".landing-content h2");

        if (content && title) {
          // Ensure non-hovered cards have titles at bottom
          if (!item.classList.contains("hover-active")) {
            content.style.justifyContent = "flex-end";
            content.style.paddingBottom = "25px";
            title.style.marginBottom = "0";
          }
        }
      });
    }
  }

  // Initialize everything
  initSlideshow();
  alignTitlesToBottom();

  // Handle hover with title alignment
  landingItems.forEach((item) => {
    const handleMouseEnter = function () {
      if (window.innerWidth > 768 && !isHovering) {
        isHovering = true;

        // Reset all items first
        landingItems.forEach((otherItem) => {
          otherItem.classList.remove("hover-active");
          const otherContent = otherItem.querySelector(".landing-content");
          const otherTitle = otherItem.querySelector(".landing-content h2");

          if (otherContent && otherTitle) {
            otherContent.style.justifyContent = "flex-end";
            otherContent.style.paddingBottom = "25px";
            otherTitle.style.marginBottom = "0";
          }
        });

        // Activate hovered item
        item.classList.add("hover-active");
        const content = item.querySelector(".landing-content");
        const title = item.querySelector(".landing-content h2");

        if (content && title) {
          content.style.justifyContent = "center";
          content.style.paddingBottom = "";
          title.style.marginBottom = "15px";
        }

        // Force reflow for smoother animation
        void item.offsetWidth;
      }
    };

    const handleMouseLeave = function () {
      if (window.innerWidth > 768) {
        isHovering = false;
        item.classList.remove("hover-active");

        // Return to bottom alignment
        const content = item.querySelector(".landing-content");
        const title = item.querySelector(".landing-content h2");

        if (content && title) {
          content.style.justifyContent = "flex-end";
          content.style.paddingBottom = "25px";
          title.style.marginBottom = "0";
        }
      }
    };

    // Mouse events for desktop
    item.addEventListener("mouseenter", handleMouseEnter);
    item.addEventListener("mouseleave", handleMouseLeave);

    // Touch/click events for mobile
    item.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Toggle active state
        if (this.classList.contains("mobile-active")) {
          this.classList.remove("mobile-active");
        } else {
          // Close other items
          landingItems.forEach((otherItem) => {
            otherItem.classList.remove("mobile-active");
          });
          // Open this item
          this.classList.add("mobile-active");

          // Smooth scroll to center the active item
          if (landingContainer) {
            const itemRect = this.getBoundingClientRect();
            const containerRect = landingContainer.getBoundingClientRect();
            const scrollLeft = landingContainer.scrollLeft;

            const targetScroll =
              scrollLeft +
              (itemRect.left - containerRect.left) -
              containerRect.width / 2 +
              itemRect.width / 2;

            landingContainer.scrollTo({
              left: targetScroll,
              behavior: "smooth",
            });
          }
        }
      }
    });
  });

  // Handle Get Demo button click
  const demoButtons = document.querySelectorAll(".demo-btn");
  demoButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();

      // Add click feedback
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (
          this.parentElement.parentElement.parentElement.classList.contains(
            "hover-active",
          )
        ) {
          this.style.transform = "";
        }
      }, 200);

      // Analytics tracking
      console.log("Get Demo button clicked");

      if (typeof gtag !== "undefined") {
        gtag("event", "demo_request", {
          event_category: "engagement",
          event_label: "landing_page",
        });
      }
    });
  });

  // Handle window resize
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset all active states and realign titles
      landingItems.forEach((item) => {
        item.classList.remove("hover-active", "mobile-active");
        const content = item.querySelector(".landing-content");
        const title = item.querySelector(".landing-content h2");

        if (content && title) {
          content.style.justifyContent = "flex-end";
          content.style.paddingBottom = "25px";
          title.style.marginBottom = "0";
        }
      });

      // Reinitialize alignment
      alignTitlesToBottom();
    }, 250);
  }

  window.addEventListener("resize", handleResize);

  // Pause slideshow on hover for better performance
  landingContainer?.addEventListener("mouseenter", () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  });

  landingContainer?.addEventListener("mouseleave", () => {
    const currentSlides = document.querySelectorAll(
      ".landing-bg-slideshow .slide",
    );
    if (currentSlides.length > 0) {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 4000);
    }
  });

  // Cleanup
  window.addEventListener("beforeunload", function () {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    window.removeEventListener("resize", handleResize);
  });
});
