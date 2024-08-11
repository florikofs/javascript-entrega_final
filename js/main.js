
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
            document.getElementById("productosAgregados").innerHTML = "No hay productos seleccionados.";
            inicializar = true;
        }
        this.invitados = parseInt(document.getElementById("cantInvitados").value);
        this.abstemios = parseInt(document.getElementById("cantAbstemios").value);
        this.bebedores = this.invitados - this.abstemios;
        console.log("Cantidad de bebedores " + this.bebedores);
        this.calculoTotalLitros();
        guardarInvitadosLS(this.invitados, this.abstemios);
        refrescarInvitadosPant();
        cargarLista(inicializar);
    }

    //CALCULO DE LITROS POR TIPO DE BEBIDA SEGÚN TIPO DE INVITADO
    calculoTotalLitros = () => {
        this.totalConAlcohol = this.bebedores * this.consumoConAlcohol;
        this.totalSinAlcohol = this.abstemios * this.consumoSinAlcohol;
        this.totalRestanteConAlcohol = this.totalConAlcohol;
        this.totalRestanteSinAlcohol = this.totalSinAlcohol;
    }

    //CALCULO DE LITROS RESTANTES
    restoTotalLitros = (litrosBotella, bebidaConAlcohol) => {
        if (bebidaConAlcohol == true) {
            this.totalRestanteConAlcohol -= litrosBotella;
        } else {
            this.totalRestanteSinAlcohol -= litrosBotella;
        }
    }
}

//CARD PRODUCTO
function crearListadoProd(listado) {
    listado.forEach(producto => {
        let cardProd = `<div class="card text-center m-2" style="width: 16rem;">
                            <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre + " " + producto.litrosBotella + " lts."}</h5>
                                <p class="card-text">${producto.marca}</p>
                            </div>  
                            <div class="card-body d-flex justify-content-center d-flex align-items-end">  
                                <button class="btn btn-dark" onclick="agregarProducto(${producto.id})">Agregar</button>
                            </div>
                        </div>`;
        document.getElementById("bebidaStore").innerHTML += cardProd;
    });
};

// AGREGAR A LA LISTA
function agregarProducto(id) {
    if (calculos.invitados == 0) {
        Swal.fire({
            title: "No se pudo agregar el producto",
            text: "Primero necesitás especificar los invitados y abstemios.",
            icon: "warning"
        });
    } else {
        const lista = JSON.parse(localStorage.getItem("productosAgregadosLS")) || [];
        const i = lista.findIndex(item => item.id == id)
        const producto = PRODUCTOS.find(item => item.id == id);
        producto.cantidad = 1;
        if (i == -1) {
            lista.push(producto);
        } else {
            lista[i].cantidad += 1;
        }

        calculos.restoTotalLitros(producto.litrosBotella, producto.bebidaConAlcohol);
        refrescarInvitadosPant();

        guardarListaLS(lista);
        const prodAgregados = document.getElementById("productosAgregados");
        prodAgregados.innerHTML = "";
        cargarLista(false);
    }
}

function guardarListaLS(a) {
    localStorage.setItem("productosAgregadosLS", JSON.stringify(a));
}

function guardarInvitadosLS(invitados, abstemios) {
    localStorage.setItem("cantInvitados", JSON.stringify(invitados));
    localStorage.setItem("cantAbstemios", JSON.stringify(abstemios));
}

function refrescarInvitadosPant() {
    const litrosTotalConAlcohol = document.getElementById("litrosTotalConAlcohol");
    litrosTotalConAlcohol.innerHTML = calculos.totalRestanteConAlcohol;
    const litrosTotalSinAlcohol = document.getElementById("litrosTotalSinAlcohol");
    litrosTotalSinAlcohol.innerHTML = calculos.totalRestanteSinAlcohol;
}

function cargarLista(inicializar) {
    if (inicializar == true) {
        const textoInicial = document.getElementById("productosAgregados");
        textoInicial.innerHTML = `<p Para agregar productos, primero completá los datos de invitados</p>`;
    } else {
        const lista = JSON.parse(localStorage.getItem("productosAgregadosLS")) || [];
        lista.forEach(e => {
            const prodAgregados = document.getElementById("productosAgregados");
            prodAgregados.innerHTML += `<p class="my-1">${" x" + e.cantidad + " " + e.nombre + " " + e.marca}</p>`;

            //CUANDO SE INICIALIZA LA LISTA SE RECALCULAN LOS TOTALES
            if (inicializar == true) {
                calculos.restoTotalLitros(e.litrosBotella * e.cantidad, e.bebidaConAlcohol);
            }
        })
    }
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

function limpiarDatos() {
    localStorage.clear();
    location.reload();
}

let calculos = new Calculos();
let PRODUCTOS = [];
cargarInvitadosLS();
cargarLista(true);


fetch('datos.json')
    .then((res) => res.json())
    .then((data) => {
        crearListadoProd(data);
        PRODUCTOS = data;
    })