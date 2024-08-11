//CÁLCULOS
class Calculos {
    constructor() {
        this.invitados = 0;
        this.abstemios = 0;
        this.formulario = document.getElementById("formulario");
        this.bebedores = 0;
        this.formulario.addEventListener("submit", this.calculoBebedores);
        this.consumoConAlcohol = 1.5;
        this.consumoSinAlcohol = 1;
        this.totalConAlcohol = 0;
        this.totalSinAlcohol = 0;
        this.totalRestanteConAlcohol = 0;
        this.totalRestanteSinAlcohol = 0;
    }

    // CALCULO INVITADOS
    calculoBebedores = (e) => {
        //SI EL USUARIO PRESIONÓ EL BOTÓN CALCULAR SE BORRA EL STORAGE
        let inicializar = false;
        if (e != null) {
            localStorage.clear();
            document.getElementById("productosAgregados").innerHTML = "";
            inicializar = true;
        }
        this.invitados = parseInt(document.getElementById("cantInvitados").value);
        this.abstemios = parseInt(document.getElementById("cantAbstemios").value);
        this.bebedores = this.invitados - this.abstemios;
        console.log("Cantidad de bebedores " + this.bebedores);
        this.calculoTotalLitros();
        guardarInvitados(this.invitados, this.abstemios);
        refrescarInvitadosPant();
        cargarCarrito(inicializar);
    }

    //CALCULO DE LITROS POR TIPO DE BEBIDA SEGÚN TIPO DE INVITADO
    calculoTotalLitros = () => {
        this.totalConAlcohol = this.bebedores * this.consumoConAlcohol;
        this.totalSinAlcohol = this.abstemios * this.consumoSinAlcohol;
        this.totalRestanteConAlcohol = this.totalConAlcohol;
        this.totalRestanteSinAlcohol = this.totalSinAlcohol;
    }

    //CALCULA LISTROS RESTANTES
    restoTotalLitros = (litrosBotella, bebidaConAlcohol) => {
        if (bebidaConAlcohol == true) {
            this.totalRestanteConAlcohol -= litrosBotella;
        } else {
            this.totalRestanteSinAlcohol -= litrosBotella;
        }
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
    const carrito = JSON.parse(localStorage.getItem("productos_agregados")) || [];
    const i = carrito.findIndex(item => item.id == id)
    const producto = PRODUCTOS.find(item => item.id == id);
    producto.cantidad = 1;
    if (i == -1) {
        carrito.push(producto);
    } else {
        carrito[i].cantidad += 1;
    }

    calculos.restoTotalLitros(producto.litrosBotella, producto.bebidaConAlcohol);
    refrescarInvitadosPant();

    guardarCarritoLS(carrito);
    const prodAgregados = document.getElementById("productosAgregados");
    prodAgregados.innerHTML = "";
    cargarCarrito(false);
}

function guardarCarritoLS(a) {
    localStorage.setItem("productos_agregados", JSON.stringify(a));
}

function guardarInvitados(invitados, abstemios) {
    localStorage.setItem("cantInvitados", JSON.stringify(invitados));
    localStorage.setItem("cantAbstemios", JSON.stringify(abstemios));
}

function refrescarInvitadosPant() {
    const litrosTotalConAlcohol = document.getElementById("litrosTotalConAlcohol");
    litrosTotalConAlcohol.innerHTML = calculos.totalRestanteConAlcohol;
    const litrosTotalSinAlcohol = document.getElementById("litrosTotalSinAlcohol");
    litrosTotalSinAlcohol.innerHTML = calculos.totalRestanteSinAlcohol;
}

function cargarCarrito(inicializar) {
    const carrito = JSON.parse(localStorage.getItem("productos_agregados")) || [];
    carrito.forEach(e => {
        const prodAgregados = document.getElementById("productosAgregados");
        prodAgregados.innerHTML += `<p>${" x" + e.cantidad + " " + e.nombre + " " + e.marca}</p>`;

        //CUANDO SE INICIALIZA EL CARRITO SE RECALCULAN LOS TOTALES
        if (inicializar == true) {
            calculos.restoTotalLitros(e.litrosBotella * e.cantidad, e.bebidaConAlcohol);
        }
    })
    refrescarInvitadosPant();
}

function cargarInvitadosLS() {
    const invitados = JSON.parse(localStorage.getItem("cantInvitados")) || 0;
    const abstemios = JSON.parse(localStorage.getItem("cantAbstemios")) || 0;
    if (invitados != 0 && abstemios != 0) {
        document.getElementById("cantInvitados").value = invitados;
        document.getElementById("cantAbstemios").value = abstemios;
        calculos.calculoBebedores(null);
    }
}


let calculos = new Calculos();
crearListadoProd(PRODUCTOS);
cargarInvitadosLS();

