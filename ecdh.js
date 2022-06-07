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

Number.prototype.mod = function(m) {
    return ((this % m) + m) % m;
}

class EllipticCurve {
    //E(Fp) : y^2 = x^3 + ax + b (mod p)
    a; // curve parameter
    b; // curve parameter
    p; // prime modulus
    g; // generator point
    cyclicGroup; 
    n; // order

    constructor(a, b, p, g) {
        this.a = a;
        this.b = b;
        this.p = p;
        this.g = g;
        this.cyclicGroup = this.generateCyclicGroup();
        this.n = this.cyclicGroup.length;       
    }

    get a() {return this.a;}
    get b() {return this.b;}
    get p() {return this.p;}
    get G() {return this.g;}
    get cyclicGroup() {return this.cyclicGroup;}
    get n() {return this.n;}

    addition(p, q) {
        const rise = (p.y - q.y);
        const run = (p.x - q.x);
        const s = this.divisionOverGF(rise, run, this.p);
        const xR = (s**2 - p.x - q.x).mod(this.p);
        const yR = ((s * (p.x - xR) - p.y)).mod(this.p);
        return new Point(xR, yR);
    }

    double(p) {
        const s = this.divisionOverGF((3 * (p.x**2) + this.a), 2 * p.y, this.p);
        const xR = ((s**2) - (2 * p.x)).mod(this.p);
        const yR = (s * (p.x - xR) - p.y).mod(this.p);

        return new Point(xR, yR);
    }

    divisionOverGF(numerator, denominator, mod) {
        const a = modInverse(denominator, mod);
        const b = numerator.mod(mod);
        return (a * b).mod(mod);
    }

    scalarMult(k, p = this.g) {
        let kG = this.double(p);
        for (let i = 2; i < k; i++) {
            kG = this.addition(p, kG)
        }
        return kG;
    }

    generateCyclicGroup() {
        console.log('enter');
        this.cyclicGroup = [];
        this.cyclicGroup.push(this.g);
        this.cyclicGroup.push(this.double(this.g));
        while (this.cyclicGroup[this.cyclicGroup.length - 1].x != this.G.x) {
            this.cyclicGroup.push(this.addition(this.g, this.cyclicGroup[this.cyclicGroup.length - 1]))
        }
        this.cyclicGroup.push(Infinity);
        return this.cyclicGroup;
    }

}

class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {return this.x;}
    get y() {return this.y;}
}

function cipher() {
    const e = new EllipticCurve(0, 7, 97, new Point(23, 7));

    const alpha = Math.floor(Math.random() * (e.n-1)) + 1; // alice private key
    const beta = Math.floor(Math.random() * (e.n-1)) + 1; // bob private key

    const a = e.scalarMult(alpha); // alice public key
    const b = e.scalarMult(beta); // bob public key

    const sharedSecret = e.scalarMult(alpha, b); // alice computation
    const verify = e.scalarMult(beta, a); // bob computation
    
    console.log(e.cyclicGroup);
    console.log(sharedSecret);
    console.log(verify);
}

cipher();

