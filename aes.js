/**
 * AES Implementation
 * @author Tyler Headley
 * @version: 1.0
 * 
 * This JavaScript program is capable of encrypting a plaintext input using AES-128
 * Implemented according to NIST specifications: https://csrc.nist.gov/csrc/media/publications/fips/197/final/documents/fips-197.pdf
 * Nb (number of columns in the state) = 4
 * Nk (number of 32 bit/4 byte words comprising the cipher key) = 4
 * Nr (number of encryption rounds) = 10
*/

// used for substitution stage
// substitute a byte with hex values XY --> SBox[x][y]
const SBox = 
    [
        [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
        [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
        [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
        [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
        [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
        [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
        [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
        [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
        [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
        [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
        [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
        [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
        [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
        [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
        [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
        [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
    ];


/** 
 * Generates a random 128 bit key
 * @return an array of 16 bytes  
 */ 
function randomKey() {
    const key = [];
    for (let i = 0; i < 16; i++) {

        // generate random byte (0-255)
        let byte = Math.floor(Math.random() * 256);

        key.push(byte);
    }
    return key;
}

/**
 * Converts input text to an array of numbers to be encrypted
 * @param {String} text string of 16 characters
 * @returns 4 x 4 grid of corresponding ascii values
 */
function textToBytes(text) {
    if (text.length !== 16) {
        console.log("ERR: textToBytes, invalid input");
        return;
    }

    let bytes = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 4; r++) {

            bytes[r][c] = text.charCodeAt(4*c + r); // convert to ascii code

        }
    }
    
    return bytes;
}

/**
 * logState prints and returns the current state as a string of hexadecimal values
 * @param {Array} grid current 4 x 4 state object
 * @param {Number} round current encryption round
 * @param {String} action previous transformation applied to state 
 * @returns a string of hex
 */
function logState(grid, round, action) {
    let hex = "";
    for(let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) { // traverse columns first
            if (grid[j][i].toString(16).length == 1) {
                hex += "0";
            }
            hex += grid[j][i].toString(16);
        }
    }
    console.log("round " + round + " | after " + action + " | " + hex);
    return hex;
}

/**
 * replaces each byte in the state according to the SBox
 * @param {Array} state 
 * @returns the updated state after the transformation
 */
function subBytes(state) {
    const newState = [];
    for (let r = 0; r < 4; r++) {
        const newRow = [];
        for (let c = 0; c < 4; c++) {
            const byte = state[r][c];
            const y = byte % 16;
            const x = Math.floor(byte / 16);
            const newByte = SBox[x][y];
            newRow.push(newByte);
        }
        newState.push(newRow);
    }
    return newState;
}

/**
 * applies a transformation to the state
 * a row's index = the # of columns that row is shifted to the left
 * row 0 --> no shift, row 1 --> shift 1 left, row 2 --> shift 2 left, row 3 --> shift 3 left
 * @param {Array} state 
 * @returns the updated state
 */
function shiftRows(state) {
    for (let r = 0; r < 4; r++) {
        for (let i = 0; i < r; i++) {
            const byte = state[r].shift();
            state[r].push(byte)
        }
    }
    return state;
}

/**
 * creates an array representing a polynomial for a binary number
 * A byte has eight bits --> can be represented as an array {b7, b6, b5, b4, b3, b2, b1, b0}
 * This byte corresponds to the polynomial b7x^7 + b6x^6 + b5x^5 + b4x^4 + b3x^3 + b2x^2 + b1x + b0
 * This polynomial would be represented by the array: [b7*7, b6*6, b5*5, b4*4, b3*3, b2*2, b1*1, b0*0]
    * Ex: the a byte with value 7e (decimal: 126) --> 01111101 --> x^6 + x^5 + x^4 + x^3 + x^2 + 1 --> [6, 5, 4, 3, 2, 0]
 * @param {Number} byte 
 * @returns an array representing a polynomial
 */
function createPolynomialArray(byte) {
    const binary = byte.toString(2);
    const arr = [];
    for (let i = 0; i < binary.length; i++) {
        if (binary.substring(i, i+1) === "1") {
            arr.push(binary.length-1 - i);
        }
    } 
    return arr;
}

/**
 * This function performs multiplication between two bytes over the finite field GF(2^8) [operator: ⋅]
 * Bytes are represented in polynomial form and multiplication occurs modulo an irreducible polynomial of degree 8
 * For AES, this polynomial is x^8 + x^4 + x^3 + x + 1
 * For more details and examples, view NIST AES description section 4.2: https://csrc.nist.gov/csrc/media/publications/fips/197/final/documents/fips-197.pdf
 * @param {Number} byte1 value from 0-255
 * @param {Number} byte2 value from 0-255
 * @returns the result of performing byte multiplication between the two bytes
 */
function byteMultiplication(byte1, byte2) {

    // make sure both operands are bytes
    if (byte1 > 255 || byte1 < 0 || byte2 > 255 || byte2 < 0) {
        console.log("ERR: invalid operands for byte multiplication");
    }

    // create corresponding polynomials for both operands
    const poly1 = createPolynomialArray(byte1);
    const poly2 = createPolynomialArray(byte2);

    // multiply polynomials by adding the exponents of terms
    let poly = [];
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            poly.push(poly1[i] + poly2[j]);
        }
    }

    // simplify using xor addition
    // if a term appears twice, remove both instances
    // ex: x^7 + x^3 + x^3 + x --> x^7 + x
    for (let k = 0; k < poly.length; k++) {
        for (let l = 0; l < k; l++) {
            if (poly[l] == poly[k]) {
                poly.splice(k, 1);
                poly.splice(l, 1);
                k -= 2;
                break;
            }
        }
    }

    // use modular reduction to find remainder over finite field
    // algorithm is based off of polynomial long division
    // Addition and subtraction are both XOR operations for polynomials (NIST 4.1)
    const mod = [8, 4, 3, 1, 0];
    while (Math.abs(poly[0]) > 7) {
        poly.sort((a, b) => b - a); // sort in descending order NOTE: might be unnecessary to algorithm

        // divide greatest term of dividend by greatest term of the divisor (modulus)
        let n = poly[0] - mod[0]; // division of polynomial terms corresponds to subtraction of their exponents

        let sub = [8, 4, 3, 1, 0]; // AES irreducible polynomial: x^8 + x^4 + x^3 + x + 1
        for (let i = 0; i < mod.length; i++) {
            sub[i] += n; // multiply divisor by the quotient x^n
        }

        // subtract (xor) the terms in the poly array with the terms in the sub array 
        poly = poly.filter(term => { // if both arrays contain the same term, remove that term from both arrays
            for (let j = 0; j < sub.length; j++) {
                if (sub[j] === term) {
                    sub.splice(j, 1);
                    return false;
                }
            }
            return true;
        });
        poly = poly.concat(sub); // add remaining terms 

        // repeat until the corresponding binary representation of the polynomial fits within one byte (meaning the greatest exponent is 7)
    }

    // convert from polynomial back to a byte
    let byte = 0;
    for (let i = 0; i < poly.length; i++) {
        byte += 2 ** poly[i];
    }
    
    return byte;
}

/**
 * transforms the state by performing a matrix multiplication on each column
 * each column is considered its own polynomial with the bytes in the column as coefficients of the polynomial
 * this polynomial is multiplied by 3x^3 + x^2 + x + 2 over modulo x^4 + 1, which corresponds to a matrix multiplication
 * this algorithm uses a switch statement to perform the transformation using pre-solved formulas for matrix multiplication of each row
 * For more details, see sections 5.1.3 and 4.1-4.3 of the NIST specifications: https://csrc.nist.gov/csrc/media/publications/fips/197/final/documents/fips-197.pdf
 * @param {Array} state 
 * @returns the updated state
 */
function mixColumns(state) {

    const newState = [];
    for (let r = 0; r < 4; r++) {

        const newRow = [];
        for (let c = 0; c < 4; c++) {
            switch(r) {
                // S <== state, S' <== newState
                case 0:
                    // S'[0][c] = ({02}⋅S[0][c]) ^ ({03}⋅S[1][c]) ^ S[2][c] ^ S[3][c]
                    newRow[c] = byteMultiplication(2, state[0][c]) ^ byteMultiplication(3, state[1][c]) ^ state[2][c] ^ state[3][c];
                    break;
                case 1: 
                    // S'[1][c] = S[0][c] ^ ({02}⋅S[1][c]) ^ ({03}⋅S[2][c]) ^ S[3][c]
                    newRow[c] = state[0][c] ^ byteMultiplication(2, state[1][c]) ^ byteMultiplication(3, state[2][c]) ^ state[3][c];
                    break;
                case 2: 
                    // S'[2][c] = S[0][c] ^ S[1][c] ^ ({02}⋅S[2][c]) ^ ({03}⋅S[3][c])
                    newRow[c] = state[0][c] ^ state[1][c] ^ byteMultiplication(2, state[2][c]) ^ byteMultiplication(3, state[3][c]);
                    break;
                case 3: 
                    // S'[3][c] = ({03}⋅S[0][c]) ^ S[1][c] ^ S[2][c] ^ ({02}⋅S[3][c])
                    newRow[c] = byteMultiplication(3, state[0][c]) ^ state[1][c] ^ state[2][c] ^ byteMultiplication(2, state[3][c]);
                    break;
                default: 
                    console.log("ERR: switch fail");
            }
        }
        newState.push(newRow);
    }

    return newState;
}

/**
 * Helper function for key expansion
 * substitutes a word using the Sbox
 * @param {Array} word an array of 4 bytes
 * @returns the updated word
 */
function subWord(word) {
    newWord = [];
    for (let i = 0; i < 4; i++) {
        const byte = word[i];
        const y = byte % 16;
        const x = Math.floor(byte / 16);
        newWord.push(SBox[x][y]);
    }
    return newWord;
}

/**
 * Helper function for key expansion
 * rotates a word 
 * @param {Array} word 
 * @returns the updated word
 */
function rotWord(word) {
    const temp = word.shift();
    word.push(temp);
    return word;
}

/**
 * Uses 128 bit key to create a longer array of round keys 
 * @param {Array} key array of 16 bytes = 128 bits
 * @returns keySchedule of length = Nb * (Nr+1) = 44 words, where each word is an array of 4 bytes
 */
function keyExpansion(key) {
    const rc = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]; // round constants

    keySchedule = new Array();

    let i = 0;
    // first 4 keys of key schedule are the 4 words from the original key
    for ( i ; i < 4; i++) {
        keySchedule.push([key[4*i], key[4*i + 1], key[4*i + 2], key[4*i + 3]]); 
    }

    // other 40 keys are derived by XORing the previous word w[i-1] with w[i-4]
    // for i multiples of 4, transformations are first applied
    for ( i ; i < 44; i++) {
        let temp = keySchedule[i-1].map(a => a); // deep clone previous key
        
        if (i % 4 == 0) {
            temp = subWord(rotWord(temp));
            temp[0] = temp[0] ^ rc[i/4-1];
        }

        let word = [];
        for (let w = 0; w < 4; w++) {
            word.push(keySchedule[i-4][w] ^ temp[w]);
        }
        keySchedule.push(word);
    }

    return keySchedule;
}

/**
 * applies XOR with each column and the corresponding round key 
 * @param {Array} state 
 * @param {Array} keySchedule
 * @param {Number} round used to apply the correct round key
 * @returns the updated state
 */
function addRoundKey(state, keySchedule, round) {
    let newState = []; 

    for (let r = 0; r < 4; r++) {
        let row = [];
        for (let c = 0; c < 4; c++) {
            row.push(state[r][c] ^ keySchedule[round*4 + c][r]);
        }
        newState.push(row);
    }

    return newState;
}

/**
 * Input message copied to state
 * Initialization vector (random salt) is added
 * Each transformation is applied 10 times
 * For the final round, the mixColumns() transformation is not applied
 * After the 10 rounds, the state can be converted to ciphertext
 * @param {Array} input 
 * @param {Array} key 16 bytes 
 * @returns ciphertext
 */
function cipher(input, key) {
    let state = input;

    const keySchedule = keyExpansion(key);
    logState(state, 0, "start");

    state = addRoundKey(state, keySchedule, 0); // initialization vector
    logState(state, 1, "start round");

    for (let round = 1; round < 10; round++) {
        logState(state, round, "start round"); 

        state = subBytes(state);
        logState(state, round, "subbytes");

        state = shiftRows(state);
        logState(state, round, "shiftrows");

        state = mixColumns(state);
        logState(state, round, "mixcolumns");

        state = addRoundKey(state, keySchedule, round);
    }

    logState(state, 10, "start round");

    // last round does not include mixColumns
    state = subBytes(state);
    logState(state, 10, "subbytes");

    state = shiftRows(state);
    logState(state, 10, "shiftrows");

    state = addRoundKey(state, keySchedule, 10);
    logState(state, 10, "addroundkey");

    return state;
}

/**
 * Takes in a string, converts it to ascii, and calls cipher to encrypt it
 * @param {String} text 
 */
function aesEncrypt(text) {
    document.getElementById("input").innerHTML = `Your input is ${text}`;
    const packets = [];

    for (let i = 0; i < text.length; i += 16) {
        let plaintext = text.substring(i, i+16);
        
        // pad message with null character 
        while (plaintext.length != 16) {
            plaintext += "\0"; 
        }
        console.log(plaintext);

        // convert to 4x4 grid of ascii values
        plaintext = textToBytes(plaintext);

        // generate random key
        const key = randomKey();
        document.getElementById("key").innerHTML = `Your output is ${key}`;

        let ciphertext = cipher(plaintext, key);

        packets.push(ciphertext);
    }
    document.getElementById("output").innerHTML = `Your output is ${packets}`;
    // console.log(packets);
    return packets;
}

function test() {
    text = [
        [0x00, 0x44, 0x88, 0xcc],
        [0x11, 0x55, 0x99, 0xdd],
        [0x22, 0x66, 0xaa, 0xee],
        [0x33, 0x77, 0xbb, 0xff]
    ];

    key = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];

    let ciphertext = cipher(text, key);

    logState(ciphertext, 10, "output");
}

test();
//aesEncrypt("Hello, how are you doing?");
