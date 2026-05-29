-- CreateTable
CREATE TABLE "favorito_producto" (
    "favorito_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "clerk_user_id_comprador" TEXT NOT NULL,
    "fecha_agregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorito_producto_pkey" PRIMARY KEY ("favorito_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorito_producto_producto_id_clerk_user_id_comprador_key" ON "favorito_producto"("producto_id", "clerk_user_id_comprador");

-- CreateIndex
CREATE INDEX "favorito_producto_clerk_user_id_comprador_fecha_agregado_idx" ON "favorito_producto"("clerk_user_id_comprador", "fecha_agregado");

-- AddForeignKey
ALTER TABLE "favorito_producto" ADD CONSTRAINT "favorito_producto_clerk_user_id_comprador_fkey" FOREIGN KEY ("clerk_user_id_comprador") REFERENCES "comprador"("clerk_user_id_comprador") ON DELETE CASCADE ON UPDATE CASCADE;
