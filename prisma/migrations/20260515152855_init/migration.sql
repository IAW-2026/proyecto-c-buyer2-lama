-- CreateTable
CREATE TABLE "comprador" (
    "clerk_user_id_comprador" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre_comprador" TEXT NOT NULL,
    "DNI" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion_envio" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comprador_pkey" PRIMARY KEY ("clerk_user_id_comprador")
);

-- CreateTable
CREATE TABLE "preferencias_comprador" (
    "preferencia_id" TEXT NOT NULL,
    "clerk_user_id_comprador" TEXT NOT NULL,
    "talles_preferidos" TEXT[],
    "categorias_preferidas" TEXT[],
    "vendedores_preferidos" TEXT[],

    CONSTRAINT "preferencias_comprador_pkey" PRIMARY KEY ("preferencia_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comprador_email_key" ON "comprador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_comprador_clerk_user_id_comprador_key" ON "preferencias_comprador"("clerk_user_id_comprador");

-- AddForeignKey
ALTER TABLE "preferencias_comprador" ADD CONSTRAINT "preferencias_comprador_clerk_user_id_comprador_fkey" FOREIGN KEY ("clerk_user_id_comprador") REFERENCES "comprador"("clerk_user_id_comprador") ON DELETE CASCADE ON UPDATE CASCADE;
