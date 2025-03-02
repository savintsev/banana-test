let originalElements = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTest") {
    startBananaTest();
  } else if (request.action === "reset") {
    resetPage();
  }
});

function shouldSkipNode(node) {
  // Skip if the node is an image, input, or doesn't contain text
  return (
    node.nodeType !== Node.TEXT_NODE &&
    (node.tagName === "IMG" ||
      node.tagName === "SVG" ||
      node.tagName === "INPUT" ||
      node.tagName === "TEXTAREA")
  );
}

function replaceTextInNode(node) {
  if (shouldSkipNode(node)) return;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text) {
      originalElements.set(node, node.textContent);
      node.textContent = "Banana";
    }
  } else {
    // For elements that directly accept value
    if (node.type === "submit" || node.type === "button") {
      if (node.value) {
        originalElements.set(node, node.value);
        node.value = "Banana";
      }
    }

    // Process child nodes
    Array.from(node.childNodes).forEach(replaceTextInNode);
  }
}

function startBananaTest() {
  const elements = document.querySelectorAll(
    'button, a, input[type="submit"], input[type="button"], .btn, [role="button"]'
  );

  elements.forEach((element) => {
    // Add visual indicator
    // element.style.border = "2px solid #e0e0e0";

    // Replace text while preserving structure
    replaceTextInNode(element);
  });
}

function resetPage() {
  originalElements.forEach((originalText, element) => {
    if (element.nodeType === Node.TEXT_NODE) {
      element.textContent = originalText;
    } else if (element.type === "submit" || element.type === "button") {
      element.value = originalText;
    }
  });

  // Reset borders
  const elements = document.querySelectorAll(
    'button, a, input[type="submit"], input[type="button"], .btn, [role="button"]'
  );
  elements.forEach((element) => {
    element.style.border = "";
  });

  originalElements.clear();
}
