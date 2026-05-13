-- CreateTable
CREATE TABLE "Comprador" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombreComprador" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,
    "direccionEnvio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comprador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferenciaComprador" (
    "id" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "tallesPreferidos" TEXT[],
    "categoriasPreferidas" TEXT[],
    "vendedoresPreferidos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreferenciaComprador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "talle" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCarrito" (
    "id" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCarrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "numeroOrden" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "montoProducto" DOUBLE PRECISION NOT NULL,
    "montoEnvio" DOUBLE PRECISION NOT NULL,
    "metodoPago" TEXT,
    "direccionEnvio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadoEnvio" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "codigoSeguimiento" TEXT NOT NULL,
    "empresaLogistica" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "historialEstados" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstadoEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comprador_clerkUserId_key" ON "Comprador"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Comprador_email_key" ON "Comprador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PreferenciaComprador_compradorId_key" ON "PreferenciaComprador"("compradorId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCarrito_compradorId_productoId_key" ON "ItemCarrito"("compradorId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_numeroOrden_key" ON "Pedido"("numeroOrden");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedidoId_productoId_key" ON "ItemPedido"("pedidoId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoEnvio_pedidoId_key" ON "EstadoEnvio"("pedidoId");

-- AddForeignKey
ALTER TABLE "PreferenciaComprador" ADD CONSTRAINT "PreferenciaComprador_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadoEnvio" ADD CONSTRAINT "EstadoEnvio_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
