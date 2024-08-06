
//CÁLCULOS
class calculos {
    constructor() {
        this.invitados = 0;
        this.abstemios = 0;
        this.formulario = document.getElementById("formulario");
        this.bebedores = 0;
        this.formulario.addEventListener("submit", this.calculoBebedores);
    }

    // CALCULO INVITADOS
    calculoBebedores = (e) => {
        e.preventDefault();
        this.invitados = parseInt(document.getElementById("cantInvitados").value);
        this.abstemios = parseInt(document.getElementById("cantAbstemios").value);
        this.bebedores = this.invitados - this.abstemios;
        console.log("Cantidad de bebedores " + this.bebedores);
    }
    
}

//CARD PRODUCTO DEL STORE
function crearListadoProd(listado) {
    listado.forEach(producto => {
        let cardProd = `<div class="card text-center m-2" style="width: 16rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre + " " + producto.litrosBotella + " lts."}</h5>
                    <p class="card-text">${producto.marca}</p>
                    <button class="btn btn-dark" onclick="agregarProducto(${producto.id})">Agregar</button>
                </div>
                </div>`;
        document.getElementById("bebidaStore").innerHTML += cardProd;
    });
};


// AGREGAR AL CARRITO
function agregarProducto(id) {
    const producto = PRODUCTOS.find(item => item.id == id);
    const carrito = JSON.parse(localStorage.getItem("productos_agregados")) || [];
    carrito.push(producto);
    guardarCarritoLS(carrito);
    const prodAgregados = document.getElementById("productosAgregados");
    prodAgregados.innerHTML = "";
    cargarCarritoLS();
}

function guardarCarritoLS(a) {
    localStorage.setItem("productos_agregados", JSON.stringify(a));
}

function cargarCarritoLS() {
    const carrito = JSON.parse(localStorage.getItem("productos_agregados")) || [];
    carrito.forEach(e => {
        const prodAgregados = document.getElementById("productosAgregados");
        prodAgregados.innerHTML += `<p>${e.nombre + " " + e.marca}</p>`;
    })
}




new calculos();
crearListadoProd(PRODUCTOS);
cargarCarritoLS()