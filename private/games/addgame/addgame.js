function checkBoxLimitation(limit, currentBox) {
  let list = [
    "category1",
    "category2",
    "category3",
    "category4",
    "category5",
    "category6",
    "category7",
  ];
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (document.getElementById(list[i]).checked) {
      count++;
    }
    if (count > limit) {
      currentBox.checked = false;
    }
  }
}
