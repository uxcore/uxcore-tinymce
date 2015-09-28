let count = 0;

module.exports = {
    uc_first: (str) => {
        return str[0].toUpperCase() + str.substring(1);
    },
    uuid: () => {
        return 'uxcore-tinymce-' + count++;
    },
    isEqual: (a, b) => {
        return JSON.stringify(a) == JSON.stringify(b);
    }
}