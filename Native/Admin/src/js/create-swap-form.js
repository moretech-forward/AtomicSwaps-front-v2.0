window.onload = function () {
  new AirDatepicker("#deadline", {
    isMobile: true,
    timepicker: true,
    buttons: ["clear"],
  });

  const create_swap_form = document.getElementById("create-swap-form");
  create_swap_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(create_swap_form);

    let is_initiator = formData.get("is_initiator");
    const other_party = formData.get("other_party");
    let swap_amount = formData.get("swap_amount");
    let key = formData.get("key");
    let deadline = formData.get("deadline");

    if (!other_party || !swap_amount || !key || !deadline) {
      showToast("Please fill all fields!", "error");
      return;
    }

    // amount to ether
    swap_amount = ethers.parseEther(swap_amount);

    // key = hash key or key
    // is_initiator = true or false
    if (is_initiator) {
      key = ethers.keccak256(ethers.toUtf8Bytes(key));
      is_initiator = true;
    } else {
      if (!ethers.isBytesLike(key)) {
        showToast(
          'Wrong key, you need to get a key in the format "0x..."!',
          "error"
        );
        return;
      }
      is_initiator = false;
    }

    deadline = stringDateToTimestamp(deadline);

    let now = new Date();
    now.setHours(now.getHours() + 24);
    now = Math.floor(now.getTime() / 1000);

    if (deadline < now) {
      showToast("The deadline should start no earlier than tomorrow!", "info");
      return;
    }

    console.log("is initiator", is_initiator);
    console.log("other_party", other_party);
    console.log("amount", swap_amount);
    console.log("deadline", deadline);
    console.log("key", key);

    try {
      const tx = await contract.createSwap(
        other_party,
        swap_amount,
        key,
        deadline,
        is_initiator,
        {
          value: swap_amount,
        }
      );

      await tx.wait();

      showToast("The swap was successful!");
    } catch (error) {
      console.log(error);
      const reason = extractErrorReason(error);
      console.log(reason);
      showToast("Failed to create a swap! " + reason, "error");
    }
    // TODO: валидация
    // TODO: обработка формы
  });
};

function stringDateToTimestamp(dateString) {
  // Splitting a string into parts
  const parts = dateString.split(" ");
  const dateParts = parts[0].split(".");
  const timeParts = parts[1].split(":");

  // Creating a Date object
  const date = new Date(
    dateParts[2], // Год
    dateParts[1] - 1, // Месяц (нумерация месяцев начинается с 0)
    dateParts[0], // День
    timeParts[0], // Час
    timeParts[1] // Минуты
  );

  // Convert to timestamp in seconds
  const timestampInSeconds = Math.floor(date.getTime() / 1000);

  return timestampInSeconds;
}

// TODO: в глобальную область видимости
function extractErrorReason(errorMessage) {
  const regex = /reason="([^"]+)"/;
  const match = errorMessage.toString().match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}
