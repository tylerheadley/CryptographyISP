function generateRandomPrime(min, max) {
  // create array of prime numbers
  let primes = [];
  for (let i = min; i < max; i++) {
    if (isPrime(i)) {
      primes.push(i)
    }
  }
  // index random prime
  if (primes.length == 0) {
    return generateRandomPrime(max, 2 * max - min);
  }
  const index = Math.floor(Math.random() * primes.length);
  return primes[index];
}

function isPrime(num) {
  if (num == 2 || num == 3)
         return true;
     if (num <= 1 || num % 2 == 0 || num % 3 == 0)
         return false;  
   for (let i = 5; i * i <= num ; i+=6)
       if (num % i == 0 || num % (i + 2) == 0)
         return false;
   return true;
 }

// function textToInt(text) {
//   let m = "";
//   for (let i = 0; i < text.length; i++) {
//     let ascii = String(text.charCodeAt(i));
//     while (ascii.length < 3) {
//       ascii = "0" + ascii;
//     }
//     m += ascii;
//   }
//   return m;
// }


// Euclidean Algorithm
function gcd(a, b) {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

// // https://gist.github.com/iamlockon/2b84cf7cbe01dc096df5efbd884409e7
// function egcd(a,b) {
//   if (a < b) [a,b] = [b, a];
//   let s = 0, old_s = 1;
//   let t = 1, old_t = 0;
//   let r = b, old_r = a;
//   while (r != 0) {
//       let q = Math.floor(old_r/r);
//       [r, old_r] = [old_r - q*r, r];
//       [s, old_s] = [old_s - q*s, s];
//       [t, old_t] = [old_t - q*t, t];
//   }
//   return 
//   console.log("Bezout coef: ", old_s, old_t);
//   console.log("GCD: ", old_r);
//   console.log("Quot by GCD: ", s, t);
// }

// https://stackoverflow.com/questions/26985808/calculating-the-modular-inverse-in-javascript
function modInverse(a, m) {
  // validate inputs
  [a, m] = [Number(a), Number(m)]
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN // invalid input
  }
  a = (a % m + m) % m
  if (!a || m < 2) {
    return NaN // invalid input
  }
  // find the gcd
  const s = []
  let b = m
  while(b) {
    [a, b] = [b, a % b]
    s.push({a, b})
  }
  if (a !== 1) {
    return NaN // inverse does not exists
  }
  // find the inverse
  let x = 1
  let y = 0
  for(let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
  }
  return (y % m + m) % m
}

function modExp(base, exp, mod) {

  let c = 1;
  
  for (let e = 0; e < exp; e++) {
    c = (base * c) % mod;
  }

  return c;
}


function rsaEncrypt(text, p, q) {

  const n = p * q;

  const phi = (p-1) * (q-1);

  const e = 65537;

  let m = [];
  for (let i = 0; i < text.length; i++) {
    let num = "";
    while (num.length < 46 && i < text.length) {
      num += text.charCodeAt(i).toString(2);
      i++;
    }
    num = "0b" + num;
    m.push(Number(num));
  }

  const ct = [];
  for (let i = 0; i < m.length; i++) {
    ct.push(modExp(m[i], e, n))
  }

  //const d = modInverse(e,phi);
  //const pt = modExp(c, d, n); 
  // console.log(e);
  // console.log(phi);
  // //console.log(d);
  // //console.log((e*d)%phi);
  // console.log(m);
  // console.log(ct);
  return ct;
}

//rsaEncrypt("Hello World!", 5, 10); 


