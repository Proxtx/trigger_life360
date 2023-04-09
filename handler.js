let userSelect = triggerGui.getElementsByClassName("userSelect")[0];
let placeSelect = triggerGui.getElementsByClassName("placeSelect")[0];

const applyOptionArray = async (elem, options) => {
  elem.innerHTML = "";
  for (let option of options) {
    let oElem = document.createElement("option");
    oElem.innerText = option;
    oElem.value = option;
    elem.appendChild(oElem);
  }
};

applyOptionArray(userSelect, triggerGuiData.users);
applyOptionArray(placeSelect, triggerGuiData.places);

getTriggerConfiguration(() => {
  return {
    text: userSelect.value + " is present at " + placeSelect.value,
    data: {
      user: userSelect.value,
      place: placeSelect.value,
    },
  };
});

if (triggerPresetData) {
  userSelect.value = triggerPresetData.user;
  placeSelect.value = triggerPresetData.place;
}
