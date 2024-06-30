window.onload = function () {
  new AirDatepicker("#deadline", {
    isMobile: true,
    timepicker: true,
    buttons: ["clear"],
  });

  const withdraw_form = document.getElementById("form");
  console.log();
  withdraw_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("efnekfjne");
    try {
      const deadline = await contract.deadline();

      let now = new Date();
      now.setHours(now.getHours() + 24);
      now = Math.floor(now.getTime() / 1000);

      if (deadline === 0n) {
        showToast("The swap is complete, there's nothing to withdraw", "error");
        return;
      } else if (deadline > now) {
        showToast("The swap isn't over yet, you can't withdraw yet", "error");
        return;
      }

      const tx = await contract.withdrawal();
      await tx.wait();
      showToast("Success withdraw all!");
    } catch (error) {
      console.log(error);
      const reason = extractErrorReason(error);
      console.log(reason);
      showToast("Error withdraw all! " + reason + ".", "error");
    }
  });
};
