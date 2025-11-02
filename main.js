import { Jugador } from './modules/jugadores.js';
import { Enemigo, JefeFinal } from './modules/enemigos.js';
import { mercado } from './modules/mercado.js';
import { batalla, agruparPorNivel } from './modules/ranking.js';
import { showScene } from './utils/scene.js';

window.addEventListener('DOMContentLoaded', () => {

  let jugador;
  document.getElementById('btn-create-player').addEventListener('click', () => {
    const nombreInput = document.getElementById('player-name-input');
    const labelInput = document.querySelector('label[for="player-name-input"]');
    const btnCreate = document.getElementById('btn-create-player');

    const nombre = document.getElementById('player-name-input').value.trim();
    if (!nombre) {
      alert('Por favor, introduce tu nombre.');
      return;
    }

    jugador = new Jugador(nombre); // creamos una nueva instancia de la clase Jugador.

    // aqui mostraremos los datos del jugador
    const datosJugadorDiv = document.getElementById('player-stats');
    datosJugadorDiv.innerHTML = `
      <p>👤 Nombre: ${jugador.nombre}</p>
      <p>❤️ Vida: ${jugador.vida} / ${jugador.vidaMax}</p>
      <p>⚔️ Ataque: ${jugador.ataqueTotal}</p>
      <p>🛡️ Defensa: ${jugador.defensaTotal}</p>
    `;


    labelInput.style.display = 'none'; // ocultamos con el none 
    nombreInput.style.display = 'none';
    btnCreate.style.display = 'none';
    alert(`Jugador ${jugador.nombre} creado. Presiona CONTINUAR para ir al mercado.`);
  });

  // Botón para continuar a mercado
  document.getElementById('btn-to-market').addEventListener('click', () => {
    if (!jugador) {
      alert('Primero crea tu jugador.'); //si en caso no crea a jugador y da un button continuar le saldra la alert
      return;
    }
    showScene('scene-2');
    renderMercado();
  });


 
});
