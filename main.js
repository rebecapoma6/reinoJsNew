import { Jugador } from './modules/jugadores.js';
import { Enemigo, JefeFinal } from './modules/enemigos.js';
import { mercado } from './modules/mercado.js';
import { batalla, agruparPorNivel } from './modules/ranking.js';
import { showScene } from './utils/scene.js';
import { EUR, groupBy } from './utils/utils.js';

window.addEventListener('DOMContentLoaded', () => {

  let avatarSeleccionado = null;

  // Selección de avatar
  document.querySelectorAll('.selectable').forEach(img => {
    img.addEventListener('click', (e) => {
      // quitar selección anterior
      document.querySelectorAll('.selectable').forEach(i => i.classList.remove('selected'));
      // marcar este como seleccionado
      e.target.classList.add('selected');
      avatarSeleccionado = e.target.dataset.avatar;
    });
  });

  let jugador;
  document.getElementById('btn-create-player').addEventListener('click', () => {
    const ocultarForm = document.getElementById('ocultar');
    const nombre = document.getElementById('player-name-input').value.trim();
    if (!nombre) {
      alert('Por favor, introduce tu nombre.');
      return;
    }
    if (!avatarSeleccionado) {
      alert('Por favor, selecciona un avatar.');
      return;
    }

    jugador = new Jugador(nombre, avatarSeleccionado); // creamos una nueva instancia de la clase Jugador.

    // aqui mostraremos los datos del jugador
    const datosJugadorDiv = document.getElementById('player-stats');
    datosJugadorDiv.innerHTML = `     
      <img src="${jugador.avatar}" alt="Avatar" width="100">
       <p>👤 Nombre: ${jugador.nombre}</p>
      <p>❤️ Vida: ${jugador.vida} / ${jugador.vidaMax}</p>
      <p>⚔️ Ataque: ${jugador.ataqueTotal}</p>
      <p>🛡️ Defensa: ${jugador.defensaTotal}</p>
      <p>💯 Puntos: ${jugador.puntos}</p>
    `;
    ocultarForm.style.display = 'none';

    alert(`Jugador ${jugador.nombre} creado.`);
  });

  // Botón para continuar a mercado
  document.getElementById('btn-to-market').addEventListener('click', () => {
    if (!jugador) {
      alert('Primero crea tu jugador.'); //si en caso no crea a jugador y da un button continuar le saldra la alert
      return;
    }
    showScene('scene-2');
    // Mostrar footer vacío a partir del mercado
    const footer = document.getElementById('inventory-container');
    footer.style.display = 'flex';
    footer.innerHTML = ''; // vacío al inicio
    renderMercado();
  });


  const enemigos = [
    new Enemigo('Goblin', 12, 50,'image/Orcoh.jpg'),
    new Enemigo('Orco', 25, 80,'image/Gobln.jpg'),
    new JefeFinal('Dragón rojo', 40, 120, 'Llama infernal', 1.8,'image/dragon.jpg'),
  ];


  // escena de mercado
  const selecMercado = [];
  function renderMercado() {
    const containerMercado = document.getElementById('market-container');
    const footer = document.getElementById('inventory-container'); 
    containerMercado.innerHTML = mercado.map((p, i) => `
      <div class="producto" data-index="${i}">
        <p>${p.mostrarProducto()}</p>
        <button class="select-btn">Seleccionar</button>
      </div>`).join('');


    const containerTotal = document.createElement("div");
    containerTotal.id = "market-total";
    containerTotal.innerHTML = `<h3>Total: 0 €</h3>`;
    containerMercado.appendChild(containerTotal);

    function actulizarTotal() {
      const total = selecMercado.reduce((acc, item) => acc + item.precio, 0);
      containerTotal.innerHTML = `<h3>Total: ${EUR.format(total)}</h3>`;
    }



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
        actulizarTotal();
        // Actualizar footer
        footer.style.display = 'flex';
        footer.innerHTML = '';
        selecMercado.forEach(p => {
          const div = document.createElement('div');
          div.classList.add('item', 'added');
          setTimeout(() => div.classList.remove('added'), 500);
          div.innerHTML = `<img src="${p.imagen}" alt="${p.nombre}">`;
          footer.appendChild(div);
        });
      });
    });

    document.getElementById('btn-to-battle').onclick = () => {
      if (selecMercado.length === 0) {
        alert("Debes seleccionar al menos un producto.");
        return;
      }

      selecMercado.forEach(p => jugador.añadirItem(p));
      showScene('scene-3');
      renderJugador();
    };
  }


  function renderJugador() {
    const estadoJugador = document.getElementById('player-current');
    estadoJugador.innerHTML = jugador.mostrarJugador();

    const inventarioAgrup = groupBy(jugador.inventario, item => item.tipo);
    const containerInventario = document.createElement("div");
    containerInventario.innerHTML = `<h3>Inventario Agrupado:</h3>`;
    for (const tipo in inventarioAgrup) {
      containerInventario.innerHTML += `
      <p><strong>${tipo.toUpperCase()}</strong>:${inventarioAgrup[tipo].map(i => i.nombre).join(',')}</p>
      `;
    }

    estadoJugador.appendChild(containerInventario);

    const btnEnemigos = document.getElementById('btn-to-enemies');
    btnEnemigos.onclick = () => {
      showScene('scene-4');
      renderEnemigos();
    };
  }


  function renderEnemigos() {
    const containerEnemigo = document.getElementById('enemies-container');
    containerEnemigo.innerHTML = enemigos
      .map(enemigo => `
        <div class="enemy-card">
         <img src="${enemigo.imagen}" alt="${enemigo.nombre}">
          <h3>${enemigo.nombre}</h3>
          <p>Tipo: ${enemigo.tipo}</p>
          <p>ATQ: ${enemigo.ataque}</p>
          <p>HP: ${enemigo.vida}</p>
          ${enemigo.tipo === 'jefe' ? `<p>🔥 Habilidad: ${enemigo.habilidadEspecial}</p>` : ''}
        </div>`
      )
      .join('');

    document.getElementById('btn-to-combat').onclick = () => {
      showScene('scene-5');
      renderBatallas();
    };
  }




  let contadorBatalla = 0; //este sera el contador de batallas
  function renderBatallas() {
    if (contadorBatalla >= enemigos.length) {
      showScene('scene-6');
      renderResultado();
      return;
    }
    const enemigo = enemigos[contadorBatalla];
    const resultado = batalla(jugador, enemigo);
    const salidaBatalla = document.getElementById('battle-output');

document.getElementById("battle-player-img").src = jugador.avatar;
document.getElementById("battle-player-name").textContent = jugador.nombre;
document.getElementById("battle-enemy-img").src = enemigo.imagen;
document.getElementById("battle-enemy-name").textContent = enemigo.nombre;


    salidaBatalla.innerHTML = `
      <h3>Batalla ${contadorBatalla + 1}</h3>
      
      <p>Ganador: ${resultado.ganador}</p>
      <p>Puntos obtenidos: +${resultado.puntosGanados}</p>      
    `;
    contadorBatalla++;
    document.getElementById('btn-next-battle').onclick = renderBatallas;
  }

  // escena de resultado final 
  function renderResultado() {
    const nivel = agruparPorNivel([jugador], 250);
    const containerResultado = document.getElementById('final-result');

    let mensajeNivel;
    if (nivel.pro && nivel.pro.length > 0) {
      mensajeNivel = '🏆 Eres un VETERANO 🏆';
    } else {
      mensajeNivel = '💀 Novato 💀'
    }
    containerResultado.innerHTML = `
      <h2>${mensajeNivel}</h2>
      <p>Puntos totales: ${jugador.puntos}</p>
    `;
    document.getElementById('btn-restart').onclick = () => location.reload();
  }

});
