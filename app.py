import os
import logging
from flask import Flask, render_template, request, send_file, jsonify
from gtts import gTTS
import tempfile

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        text = request.form.get('text', '').strip()
        language = request.form.get('language', 'en')

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Create a temporary file for the audio
        temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
        
        # Generate speech
        tts = gTTS(text=text, lang=language, slow=False)
        tts.save(temp_file.name)
        
        # Send the file
        return send_file(
            temp_file.name,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )

    except Exception as e:
        logger.error(f"Error during synthesis: {str(e)}")
        return jsonify({'error': 'Failed to synthesize speech'}), 500

    finally:
        # Clean up the temporary file
        try:
            os.unlink(temp_file.name)
        except Exception as e:
            logger.error(f"Error cleaning up temporary file: {str(e)}")
