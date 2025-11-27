import { Producto } from './producto.js';

export const mercado = [
  new Producto('Espada corta', 120, 'común', 'arma', { ataque: 8 },'image/espadaCorta.jpg'),
  new Producto('Arco de caza', 140, 'común', 'arma', { ataque: 7 },'image/arcoCaza.jpg'),
  new Producto('Armadura de cuero', 180, 'común', 'armadura', { defensa: 6 },'image/armadura.png'),
  new Producto('Poción pequeña', 40, 'común', 'consumible', { vida: 20 },'image/posionPeque.jpg'),
  new Producto('Espada rúnica', 460, 'raro', 'arma', { ataque: 18 },'image/runica.jpg'),
  new Producto('Escudo de roble', 320, 'raro', 'armadura', { defensa: 14 },'image/escudo.jpg'),
  new Producto('Poción grande', 110, 'raro', 'consumible', { vida: 60 },'image/posionGrande.jpg'),
  new Producto('Mandoble épico', 950, 'épico', 'arma', { ataque: 32 },'image/mandoble.jpg'),
  new Producto('Placas dracónicas', 880, 'épico', 'armadura', { defensa: 28 },'image/placaDragonica.jpg'),
  new Producto('Elixir legendario', 520, 'épico', 'consumible', { vida: 150 },'image/posionLegendario.jpg'),
];

export function filtrarPorRareza(rareza) {
  return mercado.filter(producto => producto.rareza === rareza);
}

export function aplicarDescuentoPorRareza(rareza, porcentaje) {
  return mercado.map(producto =>
    producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto
  );
}

export function buscarProducto(nombre) {
  return mercado.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

export function describirProducto(producto) {
  return producto.mostrarProducto();
}
