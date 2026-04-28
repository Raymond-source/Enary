// js/script.js
// DEBUG: Check if script is loading
console.log("SCRIPT.JS IS LOADING - DEBUG MODE");
console.log("Document ready state:", document.readyState);

// Test if DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  // Check if FAQ items exist
  const faqItems = document.querySelectorAll(".faq-item");
  console.log(`Found ${faqItems.length} FAQ items on page`);

  if (faqItems.length > 0) {
    console.log("FAQ items found, first item:", faqItems[0]);
    console.log(
      "First FAQ question:",
      faqItems[0].querySelector(".faq-question"),
    );
  } else {
    console.error("NO FAQ ITEMS FOUND! Check if section is loading correctly");
  }
});
// Function to set favicon with fallback
function setFavicon() {
  // Check if a favicon already exists in HTML
  const existingHtmlFavicon = document.querySelector('link[rel="icon"]');

  // If there's already a favicon in the HTML, don't override it
  if (
    existingHtmlFavicon &&
    existingHtmlFavicon.getAttribute("href") !== "images/logo/logo.ico"
  ) {
    console.log(
      "Using existing favicon from HTML:",
      existingHtmlFavicon.getAttribute("href"),
    );
    return; // Exit function - keep the HTML favicon
  }

  // Only proceed if no favicon exists or it's the old one
  console.log("Setting default favicon");

  // Remove any existing favicon first
  if (existingHtmlFavicon) {
    existingHtmlFavicon.parentNode.removeChild(existingHtmlFavicon);
  }

  const existingAppleIcon = document.querySelector(
    'link[rel="apple-touch-icon"]',
  );
  if (existingAppleIcon) {
    existingAppleIcon.parentNode.removeChild(existingAppleIcon);
  }

  // Determine which favicon to use based on page
  const path = window.location.pathname;
  let iconFile = "enary.ico"; // Default to enary.ico

  if (path.includes("services")) {
    iconFile = "enary-services.ico";
  } else if (path.includes("about")) {
    iconFile = "enary-about.ico";
  } else if (path.includes("contact")) {
    iconFile = "enary-contact.ico";
  } else {
    iconFile = "enary.ico"; // Home page
  }

  // Create new favicon element
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/x-icon";
  favicon.href = getLogoPath(iconFile);

  // Add to head
  document.head.appendChild(favicon);

  // Also create Apple Touch Icon for mobile devices
  const appleTouchIcon = document.createElement("link");
  appleTouchIcon.rel = "apple-touch-icon";
  appleTouchIcon.href = getLogoPath(iconFile);
  document.head.appendChild(appleTouchIcon);

  console.log(`Favicon set to: ${iconFile}`);
}

// Function to get logo path
function getLogoPath(filename) {
  return `images/logo/${filename}`;
}

// Format phone number for display
function formatPhoneNumber(phone) {
  if (!phone) return "";

  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "");

  // South African number format: +27 81 219 4023
  if (digits.length === 11 && digits.startsWith("27")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
      8,
    )} ${digits.slice(8)}`;
  }

  // International format: +27812194023
  if (digits.length >= 10) {
    return `+${digits}`;
  }

  return phone;
}

// Helper function to animate stats values
function animateValue(element, start, end, duration, suffix = "") {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);

    const currentValue = Math.floor(easeOutQuart * (end - start) + start);
    element.textContent = currentValue + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

// Animate stats numbers
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");

  if (statNumbers.length === 0) return;

  // Create Intersection Observer to trigger animation when stats are visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target;
          const target = parseInt(statNumber.getAttribute("data-target"));
          const suffix = statNumber.textContent.replace(/[0-9]/g, ""); // Get + or % suffix

          // Animate the number
          animateValue(statNumber, 0, target, 1500, suffix);

          // Stop observing after animation starts
          observer.unobserve(statNumber);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  // Start observing each stat number
  statNumbers.forEach((statNumber) => {
    observer.observe(statNumber);
  });
}

// Initialize client logo marquee with ACTUAL client logos
function initClientMarquee() {
  const marqueeTrack = document.querySelector(".client-marquee-track");
  if (!marqueeTrack) return;

  // ACTUAL CLIENT LOGOS - Using branded placeholders for now
  const clients = [
    {
      name: "Lowveld Institute",
      logo: "images/logo/clients/lowveld-institute.png",
    },
    {
      name: "Green Energy Solutions",
      logo: "images/logo/clients/Green-Energy-Solutions.png",
    },
    {
      name: "Health Plus Medical",
      logo: "images/logo/clients/Health-Plus-Medical.png",
    },
    {
      name: "Retail Masters",
      logo: "images/logo/clients/Retail-Masters.png",
    },
    {
      name: "Tech Solutions",
      logo: "images/logo/clients/Tech-Solutions.png",
    },
    {
      name: "Toora Flex Med",
      logo: "images/logo/clients/Toora-Flex-Med.png",
    },
  ];

  console.log(`Initializing client marquee with ${clients.length} clients`);

  // Clear existing content
  marqueeTrack.innerHTML = "";

  // Add clients (duplicate for seamless loop)
  [...clients, ...clients].forEach((client, index) => {
    const logoDiv = document.createElement("div");
    logoDiv.className = "client-logo";

    // Create the logo element
    const logoImg = document.createElement("img");
    logoImg.src = client.logo;
    logoImg.alt = `${client.name} - Client of Enary Helpers & Nannies`;
    logoImg.loading = "lazy";
    logoImg.style.width = "100%";
    logoImg.style.height = "auto";
    logoImg.style.objectFit = "contain";

    // Add title for tooltip
    logoDiv.title = client.name;
    logoDiv.setAttribute("aria-label", `Client: ${client.name}`);

    // Add a subtle delay for staggered loading
    logoImg.style.transitionDelay = `${index * 0.1}s`;

    logoDiv.appendChild(logoImg);
    marqueeTrack.appendChild(logoDiv);
  });

  console.log(`Added ${clients.length * 2} logo elements to marquee`);

  // Initialize animation after images are loaded
  setTimeout(() => {
    setupMarqueeAnimation();
  }, 500);

  function setupMarqueeAnimation() {
    let animationId;
    let position = 0;
    const speed = 0.8; // Slightly slower for better visibility
    let isPaused = false;
    let isAnimating = false;

    function animate() {
      if (!isAnimating) {
        isAnimating = true;

        if (!isPaused) {
          position -= speed;

          // Get total width of half the logos (since we duplicated them)
          const logos = marqueeTrack.querySelectorAll(".client-logo");
          if (logos.length > 0) {
            const firstLogo = logos[0];
            const logoWidth = firstLogo.offsetWidth || 180; // Fallback width
            const gap = 40;
            const totalWidth = (logoWidth + gap) * (logos.length / 2);

            // Reset position when half the content has scrolled
            if (Math.abs(position) >= totalWidth) {
              position = 0;
            }

            marqueeTrack.style.transform = `translateX(${position}px)`;
          }
        }

        isAnimating = false;
      }
      animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();
    console.log("Marquee animation started");

    // Pause on hover
    marqueeTrack.addEventListener("mouseenter", () => {
      isPaused = true;
      marqueeTrack.style.cursor = "grab";
    });

    marqueeTrack.addEventListener("mouseleave", () => {
      isPaused = false;
      marqueeTrack.style.cursor = "default";
    });

    // Add click and drag functionality
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    marqueeTrack.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - marqueeTrack.offsetLeft;
      scrollLeft = position;
      marqueeTrack.style.cursor = "grabbing";
      isPaused = true;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      marqueeTrack.style.cursor = "grab";
      isPaused = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - marqueeTrack.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast factor
      position = scrollLeft - walk;
      marqueeTrack.style.transform = `translateX(${position}px)`;
    });

    // Touch support for mobile
    marqueeTrack.addEventListener("touchstart", (e) => {
      isPaused = true;
      startX = e.touches[0].pageX - marqueeTrack.offsetLeft;
      scrollLeft = position;
    });

    marqueeTrack.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const x = e.touches[0].pageX - marqueeTrack.offsetLeft;
      const walk = (x - startX) * 2;
      position = scrollLeft - walk;
      marqueeTrack.style.transform = `translateX(${position}px)`;
    });

    marqueeTrack.addEventListener("touchend", () => {
      isPaused = false;
    });

    // Pause when tab is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isPaused = true;
      } else {
        isPaused = false;
      }
    });

    // Handle window resize - recalculate positions
    window.addEventListener("resize", () => {
      position = 0;
      marqueeTrack.style.transform = `translateX(${position}px)`;
    });
  }
}

// Initialize reviews section
function initReviews() {
  const reviewsGrid = document.querySelector(".reviews-grid");
  if (!reviewsGrid) return;

  // Sample reviews - replace with your actual reviews
  const reviews = [
    {
      name: "John Smith",
      role: "CEO, TechCorp",
      rating: 5,
      content:
        "Enary Helpers & Nannies transformed our online presence. Their team was professional, responsive, and delivered exceptional results.",
      date: "2 weeks ago",
      source: "Google",
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      rating: 5,
      content:
        "Outstanding service! Our new website has increased conversions by 40%. Highly recommend Enary for any digital project.",
      date: "1 month ago",
      source: "Google",
    },
    {
      name: "Michael Brown",
      role: "Business Owner",
      rating: 4,
      content:
        "Great experience working with Enary Helpers & Nannies. They understood our needs and delivered a solution that exceeded our expectations.",
      date: "3 weeks ago",
      source: "Google",
    },
    {
      name: "Lisa Williams",
      role: "Operations Manager",
      rating: 5,
      content:
        "The Power BI dashboards they created revolutionized our data analysis. Highly professional and skilled team!",
      date: "1 month ago",
      source: "Google",
    },
  ];

  // Clear existing content
  reviewsGrid.innerHTML = "";

  // Add reviews
  reviews.forEach((review) => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";

    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < review.rating
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star"></i>';
    }

    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="review-rating">
          ${stars}
          <span>${review.rating}.0</span>
        </div>
        <div class="review-source">
          <i class="fab fa-google"></i>
          <span>${review.source}</span>
        </div>
      </div>
      <div class="review-content">
        <p>${review.content}</p>
      </div>
      <div class="review-author">
        <div class="author-info">
          <h4>${review.name}</h4>
          <p>${review.role}</p>
        </div>
        <div class="review-date">
          <i class="far fa-clock"></i>
          <span>${review.date}</span>
        </div>
      </div>
    `;

    reviewsGrid.appendChild(reviewCard);
  });

  console.log(`Added ${reviews.length} reviews to the page`);
}

// Initialize dynamic contact forms
function initDynamicForms() {
  console.log("initDynamicForms: Starting service dropdown population...");

  const serviceSelect = document.getElementById("service");
  if (!serviceSelect) {
    console.log("initDynamicForms: No service select found on this page");
    return;
  }

  if (!window.siteConfig) {
    console.error("initDynamicForms: siteConfig not available");
    return;
  }

  if (!siteConfig.services || !Array.isArray(siteConfig.services)) {
    console.error("initDynamicForms: services array not found in config");
    return;
  }

  console.log(
    `initDynamicForms: Found ${siteConfig.services.length} services in config`,
  );

  // Clear existing options except the first one
  while (serviceSelect.options.length > 1) {
    serviceSelect.remove(1);
  }

  // Add services from config
  siteConfig.services.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  });

  console.log(
    `initDynamicForms: Added ${siteConfig.services.length} services to dropdown`,
  );
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (!mobileMenuBtn || !navLinks) return;

  // Function to close mobile menu
  const closeMobileMenu = () => {
    navLinks.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "auto";
  };

  // Function to open mobile menu
  const openMobileMenu = () => {
    navLinks.classList.add("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  // Toggle menu on button click
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (navLinks.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu when clicking links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      // Don't close if it's a get quote button that might trigger a modal
      if (!link.classList.contains("btn")) {
        closeMobileMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !navLinks.contains(e.target) &&
      !mobileMenuBtn.contains(e.target) &&
      navLinks.classList.contains("active")
    ) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Close menu on window resize (if resizing to desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      closeMobileMenu();
    }
  });
}

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's just a hash or links to another page
      if (
        targetId === "#" ||
        targetId.includes(".html") ||
        targetId.includes("://")
      ) {
        return;
      }

      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Product category filter
function initProductFilter() {
  const categoryBtns = document.querySelectorAll(".category-btn");
  const serviceCards = document.querySelectorAll(".service-card");

  if (categoryBtns.length > 0 && serviceCards.length > 0) {
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        categoryBtns.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        const category = btn.dataset.category;

        // Filter service cards
        serviceCards.forEach((card) => {
          if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
}

// Form handling
function initForms() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Show success message
      alert(
        `Thank you ${name}! Your message has been received. We'll contact you at ${email} soon.`,
      );

      // Reset form
      contactForm.reset();
    });
  }
}

// Initialize system cards with mouse effects
function initSystemCards() {
  const cards = document.querySelectorAll(".system-card");

  if (cards.length === 0) return;

  cards.forEach((card) => {
    // Mouse move glow effect
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    // Click to flip effect (for mobile)
    card.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        card.classList.toggle("flipped");
      }
    });
  });

  console.log(`Initialized ${cards.length} system cards with mouse effects`);
}

// Initialize testimonials for nanny site
function initTestimonials() {
  const testimonialsGrid = document.getElementById("testimonials-grid");
  if (!testimonialsGrid) {
    console.log("No testimonials grid found on this page");
    return;
  }

  const testimonials = [
    {
      name: "Sarah van der Merwe",
      role: "Mother of two, Johannesburg",
      rating: 5,
      content:
        "Enary Helpers found us the most wonderful nanny for our twin boys. She's patient, caring, and the boys absolutely adore her. The vetting process was thorough and gave us complete peace of mind. We've been using her services for 6 months now and couldn't be happier. She's become like family to us and even helps with light household chores when the boys are napping.",
      avatar: "S",
    },
    {
      name: "Thabo Ndlovu",
      role: "Father, Pretoria",
      rating: 5,
      content:
        "We needed a part-time helper for after school care, and Enary delivered beyond our expectations. Our helper helps with homework, makes healthy snacks, and even teaches our daughter to bake! She's reliable, punctual, and great with kids. The booking process was seamless and the support team is always helpful.",
      avatar: "T",
    },
    {
      name: "Michelle Botha",
      role: "Working mom, Cape Town",
      rating: 5,
      content:
        "The emergency care service saved me when my regular nanny fell ill. Within hours, Enary sent a qualified temporary nanny who was absolutely wonderful with my kids. Lifesavers! The temporary nanny was professional, caring, and my kids loved her. I've now booked her for regular weekend care too.",
      avatar: "M",
    },
    {
      name: "David Pretorius",
      role: "Single father, Durban",
      rating: 5,
      content:
        "Finding a trustworthy nanny as a single parent was stressful, but Enary made the process seamless. They understood our needs and found someone who feels like family. The nanny they placed with us is patient, kind, and great with my son. She helps with school runs, homework, and even meal prep.",
      avatar: "D",
    },
    {
      name: "Jennifer Khumalo",
      role: "Grandmother, Soweto",
      rating: 4,
      content:
        "I needed help with my grandchildren while I recover from surgery. The helper Enary provided is kind, patient, and wonderful with the kids. Highly recommend! She goes above and beyond, even helping with light housework and preparing meals for the children. I'm so grateful for this service.",
      avatar: "J",
    },
    {
      name: "Mark Thompson",
      role: "Father of three, Pretoria",
      rating: 5,
      content:
        "Our nanny has been with us for 6 months now and she's absolutely fantastic. Enary's matching process really works - they understood exactly what our family needed. She's great with all three kids, handles bedtime routines perfectly, and even helps with tutoring. Best decision we ever made.",
      avatar: "M",
    },
  ];

  // Clear existing content
  testimonialsGrid.innerHTML = "";

  // Add testimonials
  testimonials.forEach((testimonial, index) => {
    const card = document.createElement("div");
    card.className = "testimonial-card";

    // Add expandable class if content is long
    if (testimonial.content.length > 150) {
      card.classList.add("expandable");
    }

    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < testimonial.rating
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star"></i>';
    }

    // Truncate long content for preview
    const previewContent =
      testimonial.content.length > 120
        ? testimonial.content.substring(0, 120) + "..."
        : testimonial.content;

    card.innerHTML = `
      <div class="testimonial-rating">${stars}</div>
      <div class="testimonial-content">
        <p class="testimonial-preview">"${previewContent}"</p>
        <p class="testimonial-full" style="display: none;">"${testimonial.content}"</p>
      </div>
      <div class="testimonial-author">
        <div class="author-avatar">${testimonial.avatar}</div>
        <div class="author-info">
          <h4>${testimonial.name}</h4>
          <p>${testimonial.role}</p>
        </div>
      </div>
      ${testimonial.content.length > 150 ? '<button class="testimonial-expand-btn">Read More <i class="fas fa-chevron-down"></i></button>' : ""}
    `;

    testimonialsGrid.appendChild(card);
  });
  // Force initialization after everything loads
  window.addEventListener("load", function () {
    console.log("Window load event - forcing FAQ initialization");
    setTimeout(function () {
      initFaqAccordion();
    }, 500);
  });
  // Add click handlers for expand buttons
  document.querySelectorAll(".testimonial-expand-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const card = this.closest(".testimonial-card");
      const preview = card.querySelector(".testimonial-preview");
      const full = card.querySelector(".testimonial-full");
      const icon = this.querySelector("i");

      if (full.style.display === "none" || full.style.display === "") {
        // Expand
        preview.style.display = "none";
        full.style.display = "block";
        this.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
        card.classList.add("expanded");
      } else {
        // Collapse
        preview.style.display = "block";
        full.style.display = "none";
        this.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
        card.classList.remove("expanded");
      }
    });
  });

  console.log(`Added ${testimonials.length} testimonials to the page`);
}

// Initialize FAQ accordion
// Initialize FAQ accordion - SIMPLE TEST VERSION
function initFaqAccordion() {
  console.log("initFaqAccordion function called");

  const faqItems = document.querySelectorAll(".faq-item");
  console.log(`Found ${faqItems.length} FAQ items in initFaqAccordion`);

  if (faqItems.length === 0) {
    console.error("No FAQ items found in initFaqAccordion");
    return;
  }

  faqItems.forEach((item, index) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = question.querySelector("i");

    console.log(`Setting up FAQ item ${index + 1}:`, question);

    // Remove any existing event listeners (just in case)
    question.replaceWith(question.cloneNode(true));

    // Get fresh references after clone
    const newQuestion = item.querySelector(".faq-question");
    const newIcon = newQuestion.querySelector("i");

    // Set initial state
    answer.style.display = "none";
    item.classList.remove("active");

    // Add click handler
    newQuestion.addEventListener("click", function (e) {
      console.log(`FAQ item ${index + 1} clicked`);
      e.preventDefault();

      if (item.classList.contains("active")) {
        // Close
        console.log(`Closing FAQ item ${index + 1}`);
        item.classList.remove("active");
        answer.style.display = "none";
        if (newIcon) newIcon.style.transform = "rotate(0deg)";
      } else {
        // Open
        console.log(`Opening FAQ item ${index + 1}`);
        item.classList.add("active");
        answer.style.display = "block";
        if (newIcon) newIcon.style.transform = "rotate(180deg)";
      }
    });
  });

  console.log("FAQ accordion initialization complete");
}

// Main initialization function
function initEnary() {
  console.log("initEnary: Initializing...");

  // Initialize mobile menu
  initMobileMenu();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize product filter
  initProductFilter();

  // Initialize forms
  initForms();

  // Initialize dynamic forms
  initDynamicForms();

  // Initialize stats animation
  animateStats();

  // Initialize client marquee
  initClientMarquee();

  // Initialize reviews
  initReviews();

  // Initialize system cards
  initSystemCards();

  // Initialize testimonials
  initTestimonials();

  // Initialize FAQ accordion
  initFaqAccordion();

  console.log("initEnary: Initialization complete");

  // Extra check for services after a delay
  setTimeout(() => {
    const serviceSelect = document.getElementById("service");
    if (serviceSelect && serviceSelect.options.length <= 1) {
      console.log("initEnary: Services not populated, retrying...");
      initDynamicForms();
    }

    // Double-check FAQ accordion
    initFaqAccordion();
  }, 1000);
}

// Enhanced Components object with all functionality
const Components = {
  // Load header navigation
  loadHeader: function () {
    const header = document.getElementById("main-header");
    if (!header) return;

    header.innerHTML = `
      <div class="container header-container">
        <a href="index.html" class="logo" aria-label="Enary Helpers & Nannies Home">
          <img
            src="${getLogoPath("logo-mark.png")}"
            alt="Enary Helpers & Nannies Logo"
            class="logo-img"
            width="40"
            height="40"
          />
          <div class="logo-text">Enary <span>Helpers & Nannies</span></div>
        </a>

        <button class="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
          <i class="fas fa-bars"></i>
        </button>

        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services & Products</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="contact.html" class="btn">Get Quote</a></li>
        </ul>
      </div>
    `;
  },

  // Load footer
  loadFooter: function () {
    const footer = document.getElementById("main-footer");
    if (!footer) return;

    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-col">
            <h3>Enary Helpers & Nannies</h3>
            <p>
              Professional nanny and helper placement services for families across South Africa. 
              We connect you with trusted, vetted caregivers who become part of your family.
            </p>
            <div class="social-links">
              <a href="${siteConfig.socialLinks?.facebook || "#"}" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>
              <a href="${siteConfig.socialLinks?.twitter || "#"}" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
              <a href="${siteConfig.socialLinks?.linkedin || "#"}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in"></i></a>
              <a href="${siteConfig.socialLinks?.instagram || "#"}" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            </div>
          </div>

          <div class="footer-col">
            <h3>Quick Links</h3>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="services.html">Services & Products</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3>Our Services</h3>
            <ul class="footer-links">
              <li><a href="services.html">Full-Time Nannies</a></li>
              <li><a href="services.html">Part-Time Helpers</a></li>
              <li><a href="services.html">Elderly Companions</a></li>
              <li><a href="services.html">Emergency Care</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3>Contact Info</h3>
            <ul class="footer-links">
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span class="contact-address">${siteConfig.address || "172 Eagle Street, Montana, Pretoria"}</span>
              </li>
              <li>
                <i class="fas fa-phone-alt"></i>
                <a href="${getPhoneLink()}" class="contact-phone">${formatPhoneNumber(siteConfig.phoneNumber)}</a>
              </li>
              <li>
                <i class="fas fa-envelope"></i>
                <a href="mailto:${siteConfig.email}" class="contact-email">${siteConfig.email}</a>
              </li>
              ${
                siteConfig.emergencyNumber
                  ? `
              <li>
                <i class="fas fa-exclamation-circle"></i>
                <a href="${getEmergencyPhoneLink()}" class="contact-emergency">Emergency: ${formatPhoneNumber(siteConfig.emergencyNumber)}</a>
              </li>
              `
                  : ""
              }
            </ul>
          </div>
        </div>

        <div class="copyright">
          <p>
            &copy; <span class="current-year"></span> Enary Helpers & Nannies. All rights reserved. Site by
            <a
              href="https://www.tooraflex.co.za"
              target="_blank"
              rel="noopener noreferrer"
              class="tooraflex-name"
              aria-label="Visit Tooraflex website"
            >
              <span class="terra-part">Toora</span><span class="flex-part">flex</span>
              <img
                src="${getLogoPath("logo.ico")}"
                alt="Tooraflex Logo"
                class="tooraflex-icon"
                width="16"
                height="16"
              />
            </a>
          </p>
        </div>
      </div>
    `;
  },

  // Load WhatsApp floating button
  loadWhatsAppButton: function () {
    const whatsappFloat = document.getElementById("whatsapp-float");
    if (!whatsappFloat) return;

    whatsappFloat.innerHTML = `
      <a href="${getWhatsAppUrl()}" 
         target="_blank" 
         class="whatsapp-float-link"
         aria-label="Chat with us on WhatsApp">
          <i class="fab fa-whatsapp"></i>
      </a>
      <div class="whatsapp-float-text">Chat with us</div>
    `;
  },

  // Update contact info dynamically
  updateContactInfo: function () {
    // Update all address elements
    document.querySelectorAll(".contact-address").forEach((el) => {
      el.textContent =
        siteConfig.address || "172 Eagle Street, Montana, Pretoria";
    });

    // Update all phone links
    document.querySelectorAll(".contact-phone").forEach((el) => {
      if (el.tagName === "A") {
        el.href = getPhoneLink();
      }
      el.textContent = formatPhoneNumber(siteConfig.phoneNumber);
    });

    // Update all email links
    document.querySelectorAll(".contact-email").forEach((el) => {
      if (el.tagName === "A") {
        el.href = `mailto:${siteConfig.email}`;
      }
      el.textContent = siteConfig.email;
    });

    // Update all emergency phone links
    document.querySelectorAll(".contact-emergency").forEach((el) => {
      if (el.tagName === "A") {
        el.href = getEmergencyPhoneLink();
      }
      el.textContent = `Emergency: ${formatPhoneNumber(siteConfig.emergencyNumber)}`;
    });
  },

  // Update current year in footer
  updateCurrentYear: function () {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll(".current-year").forEach((el) => {
      el.textContent = currentYear;
    });
  },

  // Initialize all components
  initAll: function () {
    console.log("Components.initAll: Starting...");

    // Set favicon FIRST - before anything else
    setFavicon();

    this.loadHeader();
    this.loadFooter();
    this.loadWhatsAppButton();
    this.updateContactInfo();
    this.updateCurrentYear();

    // Initialize main functionality after components are loaded
    setTimeout(() => {
      initEnary();
    }, 100);

    console.log("Components.initAll: Complete");
  },
};

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded: Starting initialization...");

  // Check if config is loaded
  if (typeof siteConfig === "undefined") {
    console.error(
      "DOMContentLoaded: Config.js not loaded! Make sure config.js is loaded before script.js",
    );

    // Try to load config manually
    const script = document.createElement("script");
    script.src = "js/config.js";
    script.onload = function () {
      console.log("DOMContentLoaded: Config loaded manually, initializing...");
      Components.initAll();
    };
    document.head.appendChild(script);
    return;
  }

  // Check if WhatsApp functions are available
  if (
    typeof getWhatsAppUrl === "undefined" ||
    typeof getPhoneLink === "undefined" ||
    typeof getEmergencyPhoneLink === "undefined"
  ) {
    console.error(
      "DOMContentLoaded: Config.js functions not loaded! Make sure config.js has required functions",
    );
    return;
  }

  console.log("DOMContentLoaded: Config loaded, initializing components...");

  // Initialize all components and functionality
  Components.initAll();
});

// Make Components available globally
window.Components = Components;
window.initEnary = initEnary;

// Debug function to test client logos
window.debugClientLogos = function () {
  const logos = document.querySelectorAll(".client-logo img");
  console.log(`Found ${logos.length} client logos`);
  logos.forEach((logo, index) => {
    console.log(`Logo ${index + 1}:`, {
      src: logo.src,
      alt: logo.alt,
      loaded: logo.complete,
    });
  });
};
