function caesarCipherEncrypt(plaintext) {
  let ciphertext = "";
  const key = Math.floor(Math.random() * 25 + 1); // generate random key 1-25
  for (let i = 0; i < plaintext.length; i++) {
    const asciiVal = plaintext.charCodeAt(i);
    let newAscii = asciiVal;
    if (asciiVal >= 97 && asciiVal <= 122 || asciiVal >= 65 && asciiVal <= 90) {
      newAscii += key; // apply shift if letter
      if (newAscii > 122) {
        newAscii = newAscii - 26;
      }
    }
    ciphertext += String.fromCharCode(asciiVal);
  }
  return ciphertext;
}
