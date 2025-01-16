document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ttsForm');
    const synthesizeBtn = document.getElementById('synthesizeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const audioContainer = document.getElementById('audioContainer');
    const audioPlayer = document.getElementById('audioPlayer');
    const errorAlert = document.getElementById('errorAlert');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset previous state
        errorAlert.classList.add('d-none');
        audioContainer.classList.add('d-none');
        loadingIndicator.classList.remove('d-none');
        synthesizeBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('/synthesize', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to synthesize speech');
            }

            // Get the audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Update audio player
            audioPlayer.src = audioUrl;
            audioContainer.classList.remove('d-none');
            audioPlayer.play();

        } catch (error) {
            errorAlert.textContent = error.message;
            errorAlert.classList.remove('d-none');
        } finally {
            loadingIndicator.classList.add('d-none');
            synthesizeBtn.disabled = false;
        }
    });

    // Clean up object URL when audio is done
    audioPlayer.addEventListener('ended', function() {
        URL.revokeObjectURL(audioPlayer.src);
    });
});
