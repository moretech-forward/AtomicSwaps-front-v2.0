const tabContainers = document.querySelectorAll("[data-tabs-container]");
tabContainers.forEach((tabContainer) => {
  const tabs = tabContainer.querySelectorAll("[data-tab-target]");

  const tabContents = tabContainer.querySelectorAll("[data-tab-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      tabs.forEach((el) => {
        el.classList.remove("tab-active");
      });
      tab.classList.add("tab-active");

      const tabId = tab.getAttribute("data-tab-target");
      tabContents.forEach((tabContent) => {
        if (tabContent.getAttribute("data-tab-content") === tabId) {
          tabContent.classList.add("flex");
          tabContent.classList.remove("hidden");
        } else {
          tabContent.classList.remove("flex");
          tabContent.classList.add("hidden");
        }
      });
    });
  });
});