let userSelect = window.triggerGui.getElementsByClassName("userSelect")[0];
let movementSelect =
  window.triggerGui.getElementsByClassName("movementSelect")[0];
let placeSelect = window.triggerGui.getElementsByClassName("placeSelect")[0];

const applyOptionArray = async (elem, options) => {
  elem.innerHTML = "";
  for (let option of options) {
    let oElem = document.createElement("option");
    oElem.innerText = option;
    oElem.value = option;
    elem.appendChild(oElem);
  }
};

applyOptionArray(userSelect, window.triggerGuiData.users);
applyOptionArray(placeSelect, window.triggerGuiData.places);

window.getTriggerConfiguration = () => {
  return {
    text:
      userSelect.value +
      " " +
      movementSelect.value +
      (movementSelect.value == "arrives" ? " at " : " ") +
      placeSelect.value,
    data: {
      user: userSelect.value,
      movement: movementSelect.value,
      place: placeSelect.value,
    },
  };
};
