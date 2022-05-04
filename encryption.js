function caesarCipherEncrypt(plaintext, key) {
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
  return ciphertext;
}
