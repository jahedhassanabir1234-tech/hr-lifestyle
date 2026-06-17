export const trackEvent = (eventName, params = {}) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }
};

export const trackCustom = (eventName, params = {}) => {
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }
};

// E-commerce standard events
export const trackViewContent = (product) => {
  trackEvent("ViewContent", {
    content_name: product.name,
    content_ids: [product._id],
    content_type: "product",
    value: product.discountPrice || product.price,
    currency: "BDT",
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent("AddToCart", {
    content_name: product.name,
    content_ids: [product._id],
    content_type: "product",
    value: (product.discountPrice || product.price) * quantity,
    currency: "BDT",
    num_items: quantity,
  });
};

export const trackPurchase = (total, items = []) => {
  trackEvent("Purchase", {
    value: total,
    currency: "BDT",
    num_items: items.length,
    content_ids: items.map((i) => i.product?._id),
    content_type: "product",
  });
};

export const trackInitiateCheckout = (total, items = []) => {
  trackEvent("InitiateCheckout", {
    value: total,
    currency: "BDT",
    num_items: items.length,
  });
};

export const trackSearch = (searchString) => {
  trackEvent("Search", { search_string: searchString });
};
