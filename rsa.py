import random
import math

def randomKey(n = 16):
    #generate possible key
    key = random.randrange(2**(n-1)+1, 2**n-1)

    #check if prime
    if key % 2 == 0 or key % 3 == 0:
        return randomKey()
    i = 5
    while (i**2 <= key):
        if key % i == 0 or key % (i+2) == 0:
            return randomKey()
        i += 6
    return key

# memory efficient computation of b^e mod m
# could also be done using Math.pow(b, e, m); implemented to demonstrate efficiency
def modExp(base, exp, mod):
    c = 1
    e = 0
     
    while (e < exp):
        c = (base * c) % mod
        e += 1

    return c
    
def gcd(a, b):
    while b > 0:
        temp = b
        b = a % b
        a = temp
    return a

def textToAscii(text):
    m = ""

    for char in text:
        ascii = str(ord(char))#[2:]
        m += ascii

    return int(m)

def rsaCipher(m): 
    # key generation
    p = randomKey()
    q = randomKey()

    n = p * q

    phi = (p-1) * (q-1)

    e = 3

    # compute ciphertext
    c = modExp(m, e, n)
    
    return c

def rsaEncrypt(text):
    m = textToAscii(text)
    ciphertext = rsaCipher(m)
    return ciphertext

