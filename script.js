window.speechSynthesis.cancel();
let speechQueue = [];
let isSpeaking = false;

let voices = [];
let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    console.log(voices);
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

document.querySelector("button").addEventListener("click", () => {
    let text = document.querySelector("textarea").value;
    speechQueue = splitTextIntoChunks(text, 200); // Adjust chunk size as needed
    speakNext();
});

voiceSelect.addEventListener("change", () => {
    if (isSpeaking) {
        speechQueue.push(""); // Add empty string to force a voice change
    }
});

function speakNext() {
    if (speechQueue.length === 0) {
        isSpeaking = false;
        return;
    }
    isSpeaking = true;
    let chunk = speechQueue.shift();
    let speech = new SpeechSynthesisUtterance(chunk);
    speech.voice = voices[voiceSelect.value];
    speech.onend = () => {
        speakNext();
    };
    window.speechSynthesis.speak(speech);
}

// Function to split text into smaller chunks with appropriate pauses
function splitTextIntoChunks(text, chunkSize) {
    let chunks = [];
    let words = text.split(' ');
    let currentChunk = '';
    words.forEach(word => {
        if ((currentChunk + word).length <= chunkSize) {
            currentChunk += word + ' ';
        } else {
            if (currentChunk.trim() !== '') {
                chunks.push(currentChunk.trim());
            }
            currentChunk = word + ' ';
        }
    });
    if (currentChunk !== '') {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
