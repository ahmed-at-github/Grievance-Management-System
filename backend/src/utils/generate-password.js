import generator from 'generate-password';

function generatePass() {
    const password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        excludeSimilarCharacters: true, // Avoids characters like 'l', 'I', 'O', '0'
        strict: true, // Ensures at least one character from each specified type
    });

    return password;
}

export { generatePass };
