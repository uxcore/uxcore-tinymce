let count = 0;

module.exports = {
  uc_first: str => str.substring(0, 1).toUpperCase() + str.substring(1),
  uuid: () => {
    count += 1;
    return `uxcore-tinymce-${count}`;
  },
  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
};
