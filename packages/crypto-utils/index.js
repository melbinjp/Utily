/**
 * Encodes a string into Base64, correctly handling Unicode characters.
 * @param {string} str The string to encode.
 * @returns {string} The Base64 encoded string.
 */
function encodeBase64(str) {
    if (typeof str !== 'string') return '';
    // Use unescape and encodeURIComponent to handle Unicode characters correctly.
    return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decodes a Base64 string, correctly handling Unicode characters.
 * @param {string} str The Base64 string to decode.
 * @returns {string} The decoded string.
 */
function decodeBase64(str) {
    if (typeof str !== 'string') return '';
    // Use decodeURIComponent and escape to handle Unicode characters correctly.
    return decodeURIComponent(escape(atob(str)));
}

// In a real-world scenario with modules, you would use export.
// For simple browser environments without a bundler, we'll attach them to the window.
// This is a simplification to avoid setting up a full build process for now.
if (typeof window !== 'undefined') {
    window.cryptoUtils = {
        encodeBase64,
        decodeBase64
    };
}

// For environments that do support modules (like a potential future build setup)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        encodeBase64,
        decodeBase64
    };
}
