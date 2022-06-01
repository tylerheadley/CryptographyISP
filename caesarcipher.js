function caesarCipherEncrypt() {
  const plaintext = document.getElementById("inputtext");
  document.getElementById("displayInput").innerHTML = `Your input is <strong>${plaintext}</strong>`;
  let key = parseInt(document.getElementById("inputkey").value);
  if (!key) { // if key was not inputted it will have a falsy value
    key = Math.floor(Math.random() * 25 + 1); // generate random number 1-25
    document.getElementById("displayKey").innerHTML = `Random key: <strong>${key}</strong>`;
  }
  else if (key > 25 || key < 1) {
    document.getElementById("displayKey").innerHTML = 'ERR: Enter a key value from 1-25, or leave the field blank for a random key';
    return;
  }
  else {
    key = Math.floor(key);
    document.getElementById("displayKey").innerHTML = `Your input key is: <strong>${key}<strong>`;
  }
  let ciphertext = "";
  for (let i = 0; i < plaintext.length; i++) {
    const asciiVal = plaintext.charCodeAt(i);
    let newAscii = asciiVal;
    if (asciiVal >= 97 && asciiVal <= 122 || asciiVal >= 65 && asciiVal <= 90) {
      newAscii += key; // apply shift if letter
      if (newAscii > 122 || asciiVal < 97 && newAscii > 90) {
        newAscii -= 26; // wrap around if over
      }
    }
    ciphertext += String.fromCharCode(newAscii);
  }
  document.getElementById("displayOutput").innerHTML = `Your output is <strong>${ciphertext}</strong>`;
  return ciphertext;
}