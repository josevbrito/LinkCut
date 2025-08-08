document.getElementById('shorten-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const longUrlInput = document.getElementById('long-url');
    const resultContainer = document.getElementById('result-container');
    const resultLink = document.getElementById('result-link');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-button');
    
    // Reset previous state
    resultContainer.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'block';
    submitButton.disabled = true;

    const longUrl = longUrlInput.value;

    try {
        const response = await fetch('http://localhost:3000/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: longUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to shorten URL');
        }

        const data = await response.json();
        
        // Update the result section with the new URL
        resultLink.textContent = data.shortenedUrl;
        resultLink.href = data.shortenedUrl;
        resultContainer.style.display = 'block';
        longUrlInput.value = ''; // Clear the input field

    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.style.display = 'block';
    } finally {
        loadingMessage.style.display = 'none';
        submitButton.disabled = false;
    }
});

document.getElementById('copy-button').addEventListener('click', () => {
    const resultLink = document.getElementById('result-link');
    const shortenedUrl = resultLink.textContent;
    
    // Use the clipboard API to copy the text
    navigator.clipboard.writeText(shortenedUrl).then(() => {
        const copyButton = document.getElementById('copy-button');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});