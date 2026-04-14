const validarPedido = (pedido) => {
    if (!pedido) return { valido: false, error: "El pedido es nulo." };
    if (typeof pedido.cliente !== 'string' || pedido.cliente.trim() === "") {
        return { valido: false, error: "Nombre del cliente inválido o vacío." };
    }
    if (typeof pedido.cliente !== 'string' || pedido.producto.trim() === "") {
        return { valido: false, error: "Nombre del producto inválido." };
    }
    if (typeof pedido.cantidad !== 'number' || pedido.cantidad <= 0) {
        return { valido: false, error: "La cantidad debe ser un número mayor a 0." };
    }
    if (typeof pedido.precioUnitario !== 'number' || pedido.precioUnitario <= 0) {
        return { valido: false, error: "El precio unitario debe ser un número mayor a 0." };
    }
    return { valido: true, error: null };
};


const calcularTotales = (cantidad, precio, codigo) => {
    const subtotal = cantidad * precio;
    let descuento = 0;
    let tipoDescuento = "Ninguno";

    const codigoNormalizado = codigo ? codigo.toString().toUpperCase().trim() : "";

    if (codigoNormalizado === "VERANO20") {
        descuento = subtotal * 0.20;
        tipoDescuento = "Cupón VERANO20 (20%)";
    } else if (codigoNormalizado === "CLIENTE_VIP") {
        descuento = subtotal * 0.30;
        tipoDescuento = "Descuento VIP (30%)";
    } else if (codigoNormalizado === "BIENVENIDA") {
        descuento = 50;
        tipoDescuento = "Bono Bienvenida ($50)";
    }

    if (descuento > subtotal) descuento = subtotal;

    const totalFinal = subtotal - descuento;

    return {
        subtotal: subtotal,
        descuento: descuento,
        tipoDescuento: tipoDescuento,
        total: totalFinal
    };
};


const procesarPedido = (pedido) => {
    console.group(` Procesando pedido de: ${pedido.cliente || 'Desconocido'}`);

    const validacion = validarPedido(pedido);

    if (!validacion.valido) {
        console.error(` Error en el pedido: ${validacion.error}`);
        console.groupEnd();
        return;
    }

    const resultado = calcularTotales(
        pedido.cantidad,
        pedido.precioUnitario,
        pedido.codigoPromocion
    );

    const reporte = `
    
    REPORTE DE PEDIDO

    Cliente:      ${pedido.cliente.toUpperCase()}
    Producto:     ${pedido.producto}
    Cantidad:     ${pedido.cantidad} unidades
    Precio Unit.: $${pedido.precioUnitario.toFixed(2)}
    -----------------------------------------
    Subtotal:     $${resultado.subtotal.toFixed(2)}
    Descuento:   -$${resultado.descuento.toFixed(2)} [${resultado.tipoDescuento}]
    -----------------------------------------
    TOTAL A PAGAR: $${resultado.total.toFixed(2)}
    
            `;

    console.log(reporte);
    console.log(" Pedido procesado exitosamente.");
    console.groupEnd();
};


const listaDePedidos = [
    {
        cliente: "Juan Pérez",
        producto: "Laptop Gamer",
        cantidad: 1,
        precioUnitario: 1500.00,
        codigoPromocion: "descuento20%"
    },
    {
        cliente: "Ana García",
        producto: "Monitor 4K",
        cantidad: 2,
        precioUnitario: 300.50,
        codigoPromocion: ""
    },
    {
        cliente: "Carlos López",
        producto: "Teclado Mecánico",
        cantidad: 1,
        precioUnitario: 100,
        codigoPromocion: "cliente_vip"
    },
    {
        cliente: "",
        producto: "Mouse",
        cantidad: 5,
        precioUnitario: 20
    },
    {
        cliente: "Laura M.",
        producto: "Silla Ergonómica",
        cantidad: -1,
        precioUnitario: 250
    }
];

console.log("INICIANDO SISTEMA DE LOTES...");

for (const orden of listaDePedidos) {
    procesarPedido(orden);
}