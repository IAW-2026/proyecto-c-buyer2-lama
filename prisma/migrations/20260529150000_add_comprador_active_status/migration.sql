-- AlterTable
ALTER TABLE "comprador" ADD COLUMN "esta_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "fecha_desactivacion" TIMESTAMP(3);
