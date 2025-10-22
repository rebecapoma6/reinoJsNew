import { EUR } from '../utils/utils.js';

export class Producto {

  /**
   * Crea una nueva instancia de Producto.
   * @param {string} nombre - Nombre del producto.
   * @param {number} precio - Precio base del producto.
   * @param {string} rareza - Nivel de rareza (por ejemplo: "común", "raro", "épico").
   * @param {string} tipo - Tipo de producto (por ejemplo: "arma", "poción", "armadura").
   * @param {Object} bonus - Objeto con los bonus del producto, por ejemplo { ataque: 5, defensa: 2 }.
   */
  constructor(nombre, precio, rareza, tipo, bonus) {
    this.nombre = nombre;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
  }

  /**
   * Devuelve una representación en texto del producto.
   * @returns {string} Descripción del producto.
   */
  mostrarProducto() {
    // Convierte los bonus a un texto como "ataque+5, defensa+2"
    let bonusTexto = '';
    for (const clave in this.bonus) {
      bonusTexto += `${clave}+${this.bonus[clave]}, `;
    }
    // Quita la última coma y espacio
    bonusTexto = bonusTexto.slice(0, -2);

    return `${this.nombre} [${this.rareza}] (${this.tipo}) — ${EUR.format(this.precio)} — ${bonusTexto}`;
  }

  /**
   * Aplica un descuento al producto y devuelve una nueva instancia con el precio actualizado.
   * @param {number} porcentaje - Porcentaje de descuento (0–100).
   * @returns {Producto} Un nuevo producto con el precio reducido.
   */
  aplicarDescuento(porcentaje) {
    // Limita el porcentaje entre 0 y 100
    if (porcentaje < 0) porcentaje = 0;
    if (porcentaje > 100) porcentaje = 100;

    // Calcula el nuevo precio (Ejemplo: 200 * (1 - 0.25))
    const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));

    return new Producto(this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus);
  }
}
