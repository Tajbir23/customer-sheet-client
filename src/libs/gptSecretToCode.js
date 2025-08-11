// Base32 decoding map
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const base32Map = {}
for (let i = 0; i < base32Chars.length; i++) {
    base32Map[base32Chars[i]] = i
}

// Decode base32 string to bytes array
const base32Decode = (str) => {
    // Remove padding and convert to uppercase
    str = str.replace(/=+$/, '').toUpperCase()
    
    const buffer = new Uint8Array(Math.floor(str.length * 5 / 8))
    let bits = 0
    let value = 0
    let index = 0

    for (let i = 0; i < str.length; i++) {
        const char = str[i]
        if (!(char in base32Map)) {
            throw new Error('Invalid base32 character: ' + char)
        }
        value = (value << 5) | base32Map[char]
        bits += 5

        if (bits >= 8) {
            buffer[index++] = (value >>> (bits - 8)) & 255
            bits -= 8
        }
    }

    return buffer
}

// HMAC-SHA1 implementation
const hmacSha1 = async (key, message) => {
    const encoder = new TextEncoder()
    const keyBuffer = key instanceof Uint8Array ? key : encoder.encode(key)
    const messageBuffer = message instanceof Uint8Array ? message : encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageBuffer
    )

    return new Uint8Array(signature)
}

const gptSecretToCode = async (secret) => {
    try {
        // Decode the base32 secret
        const key = base32Decode(secret)
        
        // Calculate the time counter (30-second intervals since Unix epoch)
        let timeCounter = Math.floor(Date.now() / 30000)
        
        // Convert counter to 8-byte buffer
        const counterBuffer = new Uint8Array(8)
        for (let i = 7; i >= 0; i--) {
            counterBuffer[i] = timeCounter & 0xff
            timeCounter >>>= 8
        }

        // Calculate HMAC-SHA1
        const hmac = await hmacSha1(key, counterBuffer)
        
        // Get offset from last nibble
        const offset = hmac[hmac.length - 1] & 0xf
        
        // Generate 4-byte code
        const code = ((hmac[offset] & 0x7f) << 24) |
                    ((hmac[offset + 1] & 0xff) << 16) |
                    ((hmac[offset + 2] & 0xff) << 8) |
                    (hmac[offset + 3] & 0xff)
        
        // Get 6 digits
        const digits = code % 1000000
        
        // Pad with leading zeros if necessary
        return digits.toString().padStart(6, '0')
    } catch (error) {
        console.error('Error generating TOTP:', error)
        throw new Error('Failed to generate authentication code')
    }
}

export default gptSecretToCode