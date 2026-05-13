import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productos = [
  {
    titulo: 'Vintage Leather Jacket',
    descripcion: 'Classic brown leather jacket from the 80s',
    precio: 45.99,
    imagenUrl: 'https://media-assets.grailed.com/prd/listing/temp/c69f7dda1c06496eb651fba56fd14dc1',
    categoria: 'Outerwear',
    talle: 'M',
    marca: 'Levi\'s',
    estado: 'excelente',
    stock: 2,
    vendedorId: 'seller_1',
  },
  {
    titulo: 'High-Waist Denim Jeans',
    descripcion: '90s style high-waist jeans, perfect condition',
    precio: 28.50,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyDwIoCRIjtwDc4sHW9sCe3OOHewkNjuz2NQ&s',
    categoria: 'Pants',
    talle: 'S',
    marca: 'Lee',
    estado: 'buen estado',
    stock: 5,
    vendedorId: 'seller_2',
  },
  {
    titulo: 'Retro Band T-Shirt',
    descripcion: 'Original 1995 Nirvana concert tee',
    precio: 35.00,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKSOO4wMDajZKJ-Ni2D5lKQd5igSB-WKmWjQ&s',
    categoria: 'Tops',
    talle: 'M',
    marca: 'Vintage',
    estado: 'regular',
    stock: 1,
    vendedorId: 'seller_3',
  },
  {
    titulo: 'Floral Midi Dress',
    descripcion: 'Beautiful 70s floral print dress',
    precio: 32.00,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs3wrPpuRNoZxqc4FohNWi1E6JVhMguxcubw&s',
    categoria: 'Dresses',
    talle: 'S',
    marca: 'Unknown',
    estado: 'buen estado',
    stock: 3,
    vendedorId: 'seller_1',
  },
  {
    titulo: 'Cashmere Cardigan',
    descripcion: 'Soft cream cashmere cardigan',
    precio: 52.99,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSBinY17yKVTHCpKpADZGsvA6v59l7ELPMOw&s',
    categoria: 'Knitwear',
    talle: 'M',
    marca: 'Zara',
    estado: 'excelente',
    stock: 1,
    vendedorId: 'seller_2',
  },
  {
    titulo: 'Oversized Blazer',
    descripcion: 'Navy oversized blazer, great for layering',
    precio: 42.00,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4334phlWE5dzUTRg_bYJz7OskhEP_FQfXBw&s',
    categoria: 'Outerwear',
    talle: 'L',
    marca: 'H&M Vintage',
    estado: 'buen estado',
    stock: 2,
    vendedorId: 'seller_3',
  },
  {
    titulo: 'Silk Slip Skirt',
    descripcion: 'Emerald green silk slip skirt',
    precio: 24.99,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfzqzhji3EbMXRptgd0HGUICtv6LpkDgIvbA&s',
    categoria: 'Skirts',
    talle: 'XS',
    marca: 'Zara Vintage',
    estado: 'excelente',
    stock: 1,
    vendedorId: 'seller_1',
  },
  {
    titulo: 'White Sneakers',
    descripcion: 'Classic white leather sneakers',
    precio: 38.50,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy6jB_cOjZWoKgWRMwvviQwO6sNDC8SNwmAA&s',
    categoria: 'Shoes',
    talle: 'M',
    marca: 'Adidas',
    estado: 'buen estado',
    stock: 3,
    vendedorId: 'seller_2',
  },
  {
    titulo: 'Polka Dot Blouse',
    descripcion: 'Red and white polka dot blouse, 80s style',
    precio: 20.00,
    imagenUrl: 'https://ivyhouseboutique.com/cdn/shop/files/0L6A9055.jpg?v=1757005618&width=1080',
    categoria: 'Tops',
    talle: 'S',
    marca: 'Vintage',
    estado: 'regular',
    stock: 2,
    vendedorId: 'seller_3',
  },
  {
    titulo: 'Wool Peacoat',
    descripcion: 'Charcoal wool peacoat, perfect for winter',
    precio: 55.00,
    imagenUrl: 'https://i.etsystatic.com/13991272/r/il/53fcae/7398714987/il_570xN.7398714987_rl5v.jpg',
    categoria: 'Outerwear',
    talle: 'M',
    marca: 'Tommy Hilfiger',
    estado: 'excelente',
    stock: 1,
    vendedorId: 'seller_1',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const producto of productos) {
    await prisma.producto.create({
      data: producto,
    });
  }

  console.log('✓ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });