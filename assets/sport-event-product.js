document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('submitButton');
  const form = document.getElementById('customForm');
  const price = document.getElementById('variantPrice');
  const image = document.getElementById('variantImage');
  const variantSelector = document.getElementById('variantSelector');

  let variantId = variantSelector.value;

  //for some reason, srcset interferes picture changing
  image.removeAttribute('srcset');

  variantSelector.addEventListener('change', function () {
    variantId = variantSelector.value;
    const selectedOption = variantSelector.querySelector(`[value='${variantId}']`);

    image.src = selectedOption.dataset.image;
    price.textContent = selectedOption.dataset.price;
  });

  button.addEventListener('click', function () {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    fetch('/cart/clear.js', { method: 'POST' })
      .then(() => {
        return fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: 1,
            properties: {
              Name: formData.get('first_name'),
              Phone: formData.get('phone'),
              Postcode: formData.get('postal_code'),
              'Date-of-birth': formData.get('birthdate'),
              Gender: formData.get('gender'),
              'User code': formData.get('user_code'),
            },
          }),
        });
      })
      .then(() => {
        window.location.href = '/checkout';
      });
  });
});
