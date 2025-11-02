import { Jugador } from './modules/jugadores.js';
import { Enemigo, JefeFinal } from './modules/enemigos.js';
import { mercado } from './modules/mercado.js';
import { batalla, agruparPorNivel } from './modules/ranking.js';
import { showScene } from './utils/scene.js';

window.addEventListener('DOMContentLoaded', () => {

  let jugador;
  document.getElementById('btn-create-player').addEventListener('click', () => {
    const ocultarForm = document.getElementById('ocultar');
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
    ocultarForm.style.display = 'none';

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

 const enemigos = [
    new Enemigo('Goblin', 12, 50),
    new Enemigo('Orco', 25, 80),
    new JefeFinal('Dragón rojo', 40, 120, 'Llama infernal', 1.8),
  ];


  // escena de mercado
  const selecMercado = [];
  function renderMercado() {
    const containerMercado = document.getElementById('market-container');
    containerMercado.innerHTML = mercado.map((p, i) => `
      <div class="producto" data-index="${i}">
        <p>${p.mostrarProducto()}</p>
        <button class="select-btn">Seleccionar</button>
      </div>`).join('');

    document.querySelectorAll('.select-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = e.target.parentNode.dataset.index;
        const producto = mercado[i];
        if (selecMercado.includes(producto)) {
          selecMercado.splice(selecMercado.indexOf(producto), 1);
          e.target.textContent = 'Seleccionar';
        } else {
          selecMercado.push(producto);
          e.target.textContent = 'Quitar';
        }
      });
    });

    document.getElementById('btn-to-battle').addEventListener('click', () => {
      selecMercado.forEach(p => jugador.añadirItem(p));
      showScene('scene-3');
      renderJugador();
    });
  }


  function renderJugador() {
    const estadoJugador = document.getElementById('player-current');
    estadoJugador.innerHTML = jugador.mostrarJugador();

    const btnEnemigos = document.getElementById('btn-to-enemies');
    btnEnemigos.onclick = () => {
      showScene('scene-4');
      renderEnemigos();
    };
  }

  
  function renderEnemigos() {
    const containerEnemigo = document.getElementById('enemies-container');
    containerEnemigo.innerHTML = enemigos
      .map(enemigoBatlla => `
        <div class="enemy-card">
          <h3>${enemigoBatlla.nombre}</h3>
          <p>Tipo: ${enemigoBatlla.tipo}</p>
          <p>ATQ: ${enemigoBatlla.ataque}</p>
          <p>HP: ${enemigoBatlla.vida}</p>
          ${enemigoBatlla.tipo === 'jefe' ? `<p>🔥 Habilidad: ${enemigoBatlla.habilidadEspecial}</p>` : ''}
        </div>`
      )
      .join('');

    document.getElementById('btn-to-combat').onclick = () => {
      showScene('scene-5');
      renderBatallas();
    };
  }

  let index = 0;
  function renderBatallas() {
    if (index >= enemigos.length) {
      showScene('scene-6');
      renderResultado();
      return;
    }
    const enemigo = enemigos[index];
    const resultado = batalla(jugador, enemigo);
    document.getElementById('battle-output').innerHTML = `
      <h3>Batalla ${index + 1}</h3>
      <p>${jugador.nombre} vs ${enemigo.nombre}</p>
      <p>Ganador: ${resultado.ganador}</p>
      <p>+${resultado.puntosGanados} puntos</p>
    `;
    index++;
    document.getElementById('btn-next-battle').onclick = renderBatallas;
  }

  // escena de resultado final 
  function renderResultado() {
    const nivel = agruparPorNivel([jugador], 250);
    const cont = document.getElementById('final-result');
    const esPro = nivel.pro?.length > 0;
    cont.innerHTML = `
      <h2>${esPro ? '🏆 Eres un PRO 🏆' : '💀 Rookie 💀'}</h2>
      <p>Puntos totales: ${jugador.puntos}</p>
    `;
    document.getElementById('btn-restart').onclick = () => location.reload();
  }
 
});
