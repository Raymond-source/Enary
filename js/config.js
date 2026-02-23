// js/config.js
const siteConfig = {
  whatsappNumber: "2762424619",
  phoneNumber: "+27 62 042 4619",
  emergencyNumber: "+27 62 042 4619",
  email: "info@enary.co.za",
  address: "172 Eagle Street, Montana Park, Pretoria.",
  whatsappMessage: "Hello  Flex, I'd like more information about your packages",
  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=61586508505155",
    twitter: "#",
    linkedin: "https://www.linkedin.com/company/toora-flex/?viewAsMember=true",
    instagram: "#",
  },
};

// Generate WhatsApp URL
function getWhatsAppUrl() {
  const encodedMessage = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
}

// Generate phone link
function getPhoneLink() {
  return `tel:${siteConfig.phoneNumber}`;
}

// Generate emergency phone link
function getEmergencyPhoneLink() {
  return `tel:${siteConfig.emergencyNumber}`;
}

// Format phone number for display
function formatPhoneNumber(phone) {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "+$1 $2 $3 $4");
  }
  return phone;
}
