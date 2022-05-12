function readForm() {
    const plaintext = document.getElementById("text").elements[0].value;
    document.getElementById("displayInput").innerHTML = `Your input is ${plaintext}`;
    
    key = Math.floor(Math.random() * 25 + 1); // generate random number 1-25
    document.getElementById("displayKey").innerHTML = `Random key: ${key}`;
    const ciphertext = caesarCipherEncrypt(plaintext, key);
    document.getElementById("displayOutput").innerHTML = `Your output is ${ciphertext}`;
  }