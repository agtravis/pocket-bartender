newIng = '<span class="clickable-ingredient">' + newIng + '</span>';

for (var i = 1; i <= 3; ++i) {
  document
    .getElementById('ingredients' + [i])
    .addEventListener('click', function(event) {
      console.log(event.toElement.textContent);
      openModal(event.toElement.textContent);
    });
}
