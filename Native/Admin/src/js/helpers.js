function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toastId = `toast-${Date.now()}`;

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.id = toastId;

  const toastContent = {
    success: `
            <div class="custom-toast__success-icon">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Check icon</span>
            </div>
            <div class="custom-toast__text">${message}</div>
            <button type="button" class="custom-toast__close" data-dismiss-target="#${toastId}" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        `,
    warning: `
            <div class="custom-toast__warning-icon">
                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
                </svg>
                <span class="sr-only">Warning icon</span>
            </div>
            <div class="custom-toast__text">${message}</div>
            <button aria-label="Close" class="custom-toast__close" data-dismiss-target="#${toastId}" type="button">
                <span class="sr-only">Close</span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
            </button>
        `,
    error: `
            <div class="custom-toast__error-icon">
                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
                <span class="sr-only">Error icon</span>
            </div>
            <div class="custom-toast__text">${message}</div>
            <button aria-label="Close" class="custom-toast__close" data-dismiss-target="#${toastId}" type="button">
                <span class="sr-only">Close</span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
            </button>
        `,
  };

  toast.innerHTML = toastContent[type] || toastContent.success;

  toastContainer.appendChild(toast);

  document
    .querySelector(`[data-dismiss-target="#${toastId}"]`)
    .addEventListener("click", () => {
      anime({
        targets: toast,
        opacity: [1, 0],
        translateY: [0, -50],
        easing: "easeInExpo",
        duration: 500,
        complete: () => {
          toastContainer.removeChild(toast);
        },
      });
      return;
    });

  anime({
    targets: toast,
    opacity: [0, 1],
    translateY: [-50, 0],
    easing: "easeOutExpo",
    duration: 500,
    complete: function () {
      setTimeout(() => {
        anime({
          targets: toast,
          opacity: [1, 0],
          translateY: [0, -50],
          easing: "easeInExpo",
          duration: 500,
          complete: function () {
            if (document.body.contains(toast)) {
              toastContainer.removeChild(toast);
            }
          },
        });
      }, 5000); // Display duration in milliseconds
    },
  });
}

window.showToast = showToast;

let spinner_html = `
  <span class="loading loading-spinner loading-lg bg-white"></span>
`;

function addOverlay(element_id) {
  let el = document.querySelector(`#${element_id}`);
  const loader = document.createElement("div");
  loader.classList =
    "overlay absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-2xl";
  loader.innerHTML = spinner_html;
  loader.setAttribute("name", "loader");
  el.appendChild(loader);
}

function removeOverlay(element_id) {
  let el = document.querySelector(`#${element_id}`);
  const loader = el.querySelector('[name="loader"]');
  if (loader) {
    loader.remove();
  } else {
    showToast("Not found overlay in select element!", "warning");
  }
}

// const setTheme = () => {
//   const theme = localStorage.getItem("theme") || "light";
//   document.querySelector("main").setAttribute("data-theme", theme);
// };
// setTheme();

function shortenAddress(address) {
  if (address.length < 10) return address;
  return address.slice(0, 6) + "..." + address.slice(-5);
}

// ctc
const check_before_connection = setInterval(async () => {
  if (await provider.getNetwork()) {
    clearInterval(check_before_connection);
    setClipboard();
  }
}, 500);

const setClipboard = () => {
  const ctcs = document.querySelectorAll("[data-ctc]");
  ctcs.forEach((ctc_el) => {
    ctc_el.addEventListener("click", (e) => {
      const ctc_text = ctc_el.getAttribute("data-ctc-content");
      navigator.clipboard
        .writeText(ctc_text)
        .then(() => {
          showToast("Copied to clipboard", "success");
        })
        .catch(() => {
          showToast("Error copied to clipboard, try again!", "warning");
        });
    });
    ctc_el.addEventListener("mouseenter", (e) => {
      var range = document.createRange();
      range.selectNode(ctc_el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });
    ctc_el.addEventListener("mouseleave", (e) => {
      window.getSelection().removeAllRanges();
    });
  });
};

const setTheme = () => {
  const selected_theme = localStorage.getItem("theme") || "dark";
  document.querySelector("body").setAttribute("data-theme", selected_theme);

  theme_options.forEach((el) => {
    if (el.getAttribute("data-set-theme") === selected_theme) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
};
setTheme();

function extractErrorReason(errorMessage) {
  const regex = /reason="([^"]+)"/;
  const match = errorMessage.toString().match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}
