let carrito = localStorage.getItem('carrito');
if (!carrito) {
    carrito = [];
}
console.log(carrito);