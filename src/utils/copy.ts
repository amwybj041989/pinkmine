function selectText(textbox, startIndex, stopIndex) {
  if (textbox.createTextRange) {
    const range = textbox.createTextRange();
    range.collapse(true);
    range.moveStart('character', startIndex);
    range.moveEnd('character', stopIndex - startIndex);
    range.select();
  } else {
    textbox.setSelectionRange(startIndex, stopIndex);
    textbox.focus();
  }
}

function fallbackCopyTextToClipboard(copyTxt) {
  return new Promise((resolve, reject) => {
    let textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    textArea.value = copyTxt;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return resolve(true);
      } else {
        this.selectText(textArea, 0, copyTxt.length);
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return resolve(true);
        } else {
          document.body.removeChild(textArea);
          return reject('failed');
        }
      }
    } catch (err) {
      document.body.removeChild(textArea);
      return reject('failed');
    }

    document.body.removeChild(textArea);
  });
}
export let copy = (val) => {
  return new Promise((resolve, rej) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val).then(
        () => {
          return resolve(111);
        },
        (err) => {
          // console.error('err: ', err)
          this.fallbackCopyTextToClipboard(val)
            .then(() => {
              return resolve(111);
            })
            .catch((err) => {
              return reject('failed');
            });
        }
      );
    } else {
      this.fallbackCopyTextToClipboard(val)
        .then(() => {
          return resolve(111);
        })
        .catch((err) => {
          return reject('failed');
        });
    }
  });
};
