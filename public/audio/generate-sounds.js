// Este script genera efectos de sonido para nuestro quiz
// Para usarlo, necesitas ejecutarlo en un entorno de Node.js con la librería 'audioworklet' instalada
// npm install web-audio-api audio-recorder-polyfill

const fs = require('fs');
const { AudioContext } = require('web-audio-api');
const MediaRecorder = require('audio-recorder-polyfill');

// Función para generar un tono con frecuencia y duración específicas
function generateTone(frequency, duration, type = 'sine') {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.5;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  
  // Fade out para evitar clics
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, duration * 1000);
  
  // Grabar el audio generado
  const chunks = [];
  const mediaRecorder = new MediaRecorder(audioCtx.destination.stream);
  
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };
  
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/mp3' });
    const buffer = blob.arrayBuffer();
    fs.writeFileSync(`output-${frequency}-${type}.mp3`, Buffer.from(buffer));
  };
  
  mediaRecorder.start();
  setTimeout(() => {
    mediaRecorder.stop();
  }, duration * 1000);
}

// Generar sonidos para el quiz
generateTone(440, 0.3); // click.mp3
generateTone(523, 0.5, 'square'); // option1.mp3
generateTone(587, 0.5, 'triangle'); // option2.mp3
generateTone(659, 0.5, 'sawtooth'); // option3.mp3
generateTone(698, 0.5, 'square'); // option4.mp3

// Generar sonido de cuenta regresiva
generateTone(440, 0.2, 'sine');
setTimeout(() => {
  generateTone(440, 0.2, 'sine');
}, 500);
setTimeout(() => {
  generateTone(880, 0.5, 'sine');
}, 1000);

// Generar sonido de finalización
function generateJingle() {
  generateTone(523, 0.2, 'sine');
  setTimeout(() => {
    generateTone(659, 0.2, 'sine');
  }, 200);
  setTimeout(() => {
    generateTone(784, 0.4, 'sine');
  }, 400);
}
generateJingle();

console.log('Sonidos generados exitosamente!'); 