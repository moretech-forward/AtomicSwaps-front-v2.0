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

    // TODO: валидация
    // TODO: обработка формы

    console.log(formData);
  });
};
