import { simularRespuestaEstadoEnvio } from '@/lib/mockData';

export interface ProductoMock {
  id: string;
  vendedorId: string;
  categoriaId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  imagenes: string[];
  estado: string;
  estadoPrenda: string;
  talle: string;
  marca: string;
  stock: number;
  estadoPublicacion: string;
  createdAt: Date;
  updatedAt: Date;
  categoria: string;
}

export interface ItemCarritoMock {
  id: string;
  compradorId: string;
  productoId: string;
  producto: ProductoMock;
  cantidad: number;
  precioUnitario: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EstadoEnvioMock {
  id: string;
  pedidoId: string;
  codigoSeguimiento: string;
  empresaLogistica: string;
  estado: string;
  historialEstados: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PedidoMock {
  id: string;
  compradorId: string;
  numeroOrden: string;
  estado: string;
  montoTotal: number;
  montoProducto: number;
  montoEnvio: number;
  metodoPago?: string;
  direccionEnvio: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    pedidoId: string;
    productoId: string;
    producto: ProductoMock;
    cantidad: number;
    precioUnitario: number;
  }>;
  estadoEnvio: EstadoEnvioMock;
}

interface MockStore {
  productos: ProductoMock[];
  carritos: Map<string, ItemCarritoMock[]>;
  pedidos: PedidoMock[];
}

declare global {
  // eslint-disable-next-line no-var
  var __lamaBuyerMockStore: MockStore | undefined;
}

const now = Date.now();

const productosIniciales: ProductoMock[] = [
  {
    id: 'prod_1',
    vendedorId: 'seller_1',
    categoriaId: 'outerwear',
    titulo: 'Vintage Leather Jacket',
    descripcion: 'Classic brown leather jacket from the 80s',
    precio: 45.99,
    imagenUrl: 'https://media-assets.grailed.com/prd/listing/temp/c69f7dda1c06496eb651fba56fd14dc1',
    imagenes: ['https://media-assets.grailed.com/prd/listing/temp/c69f7dda1c06496eb651fba56fd14dc1'],
    estado: 'excelente',
    estadoPrenda: 'excelente',
    talle: 'M',
    marca: "Levi's",
    stock: 2,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 1 * 60 * 60 * 1000),
    updatedAt: new Date(now - 1 * 60 * 60 * 1000),
    categoria: 'Outerwear',
  },
  {
    id: 'prod_2',
    vendedorId: 'seller_2',
    categoriaId: 'pants',
    titulo: 'High-Waist Denim Jeans',
    descripcion: '90s style high-waist jeans, perfect condition',
    precio: 28.5,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyDwIoCRIjtwDc4sHW9sCe3OOHewkNjuz2NQ&s',
    imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyDwIoCRIjtwDc4sHW9sCe3OOHewkNjuz2NQ&s'],
    estado: 'buen estado',
    estadoPrenda: 'buen estado',
    talle: 'S',
    marca: 'Lee',
    stock: 5,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 2 * 60 * 60 * 1000),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000),
    categoria: 'Pants',
  },
  {
    id: 'prod_3',
    vendedorId: 'seller_3',
    categoriaId: 'tops',
    titulo: 'Retro Band T-Shirt',
    descripcion: 'Original 1995 concert tee',
    precio: 35,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKSOO4wMDajZKJ-Ni2D5lKQd5igSB-WKmWjQ&s',
    imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKSOO4wMDajZKJ-Ni2D5lKQd5igSB-WKmWjQ&s'],
    estado: 'regular',
    estadoPrenda: 'regular',
    talle: 'M',
    marca: 'Vintage',
    stock: 1,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 3 * 60 * 60 * 1000),
    updatedAt: new Date(now - 3 * 60 * 60 * 1000),
    categoria: 'Tops',
  },
  {
    id: 'prod_4',
    vendedorId: 'seller_1',
    categoriaId: 'dresses',
    titulo: 'Floral Midi Dress',
    descripcion: 'Beautiful 70s floral print dress',
    precio: 32,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs3wrPpuRNoZxqc4FohNWi1E6JVhMguxcubw&s',
    imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs3wrPpuRNoZxqc4FohNWi1E6JVhMguxcubw&s'],
    estado: 'buen estado',
    estadoPrenda: 'buen estado',
    talle: 'S',
    marca: 'Unknown',
    stock: 3,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 4 * 60 * 60 * 1000),
    updatedAt: new Date(now - 4 * 60 * 60 * 1000),
    categoria: 'Dresses',
  },
  {
    id: 'prod_5',
    vendedorId: 'seller_2',
    categoriaId: 'knitwear',
    titulo: 'Cashmere Cardigan',
    descripcion: 'Soft cream cashmere cardigan',
    precio: 52.99,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSBinY17yKVTHCpKpADZGsvA6v59l7ELPMOw&s',
    imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSBinY17yKVTHCpKpADZGsvA6v59l7ELPMOw&s'],
    estado: 'excelente',
    estadoPrenda: 'excelente',
    talle: 'M',
    marca: 'Zara',
    stock: 1,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 5 * 60 * 60 * 1000),
    updatedAt: new Date(now - 5 * 60 * 60 * 1000),
    categoria: 'Knitwear',
  },
  {
    id: 'prod_6',
    vendedorId: 'seller_3',
    categoriaId: 'outerwear',
    titulo: 'Oversized Blazer',
    descripcion: 'Navy oversized blazer, great for layering',
    precio: 42,
    imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4334phlWE5dzUTRg_bYJz7OskhEP_FQfXBw&s',
    imagenes: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4334phlWE5dzUTRg_bYJz7OskhEP_FQfXBw&s'],
    estado: 'buen estado',
    estadoPrenda: 'buen estado',
    talle: 'L',
    marca: 'H&M Vintage',
    stock: 2,
    estadoPublicacion: 'activa',
    createdAt: new Date(now - 6 * 60 * 60 * 1000),
    updatedAt: new Date(now - 6 * 60 * 60 * 1000),
    categoria: 'Outerwear',
  },
];

function getStore() {
  if (!globalThis.__lamaBuyerMockStore) {
    globalThis.__lamaBuyerMockStore = {
      productos: productosIniciales,
      carritos: new Map(),
      pedidos: [],
    };
  }

  return globalThis.__lamaBuyerMockStore;
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function matchesText(producto: ProductoMock, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;

  return [producto.titulo, producto.descripcion, producto.marca].some((field) =>
    field.toLowerCase().includes(value)
  );
}

export function listarProductosMock(filters: {
  search?: string;
  categoria?: string;
  talle?: string;
  precioMin?: number;
  precioMax?: number;
  page?: number;
  limit?: number;
}) {
  const {
    search = '',
    categoria = '',
    talle = '',
    precioMin = 0,
    precioMax = 10000,
    page = 1,
    limit = 12,
  } = filters;

  const productos = getStore()
    .productos.filter((producto) => producto.estadoPublicacion === 'activa')
    .filter((producto) => matchesText(producto, search))
    .filter((producto) => !categoria || producto.categoria === categoria)
    .filter((producto) => !talle || producto.talle === talle)
    .filter((producto) => producto.precio >= precioMin && producto.precio <= precioMax)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const skip = (page - 1) * limit;

  return {
    productos: productos.slice(skip, skip + limit),
    total: productos.length,
  };
}

export function listarCategoriasYTallesMock() {
  const productos = getStore().productos.filter(
    (producto) => producto.estadoPublicacion === 'activa'
  );

  return {
    categorias: Array.from(new Set(productos.map((producto) => producto.categoria))).sort(),
    talles: Array.from(new Set(productos.map((producto) => producto.talle))).sort(),
  };
}

export function obtenerProductoMock(id: string) {
  return getStore().productos.find((producto) => producto.id === id) ?? null;
}

export function crearProductoMock(data: Partial<ProductoMock>) {
  const createdAt = new Date();
  const producto: ProductoMock = {
    id: createId('prod'),
    vendedorId: data.vendedorId || 'seller_mock',
    categoriaId: data.categoriaId || data.categoria || 'mock',
    titulo: data.titulo || 'Producto mock',
    descripcion: data.descripcion || '',
    precio: Number(data.precio || 0),
    imagenUrl: data.imagenUrl || '',
    imagenes: data.imagenes || (data.imagenUrl ? [data.imagenUrl] : []),
    estado: data.estado || data.estadoPrenda || 'buen estado',
    estadoPrenda: data.estadoPrenda || data.estado || 'buen estado',
    talle: data.talle || 'U',
    marca: data.marca || 'Mock',
    stock: Number(data.stock || 1),
    estadoPublicacion: data.estadoPublicacion || 'activa',
    createdAt,
    updatedAt: createdAt,
    categoria: data.categoria || data.categoriaId || 'Mock',
  };

  getStore().productos.unshift(producto);
  return producto;
}

export function obtenerCarritoMock(compradorId: string) {
  const items = getStore().carritos.get(compradorId) || [];
  const total = items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);

  return {
    items,
    total,
    cantidad: items.reduce((sum, item) => sum + item.cantidad, 0),
  };
}

export function agregarItemCarritoMock(compradorId: string, productoId: string, cantidad: number) {
  const producto = obtenerProductoMock(productoId);

  if (!producto || producto.stock < cantidad) {
    return null;
  }

  const store = getStore();
  const items = store.carritos.get(compradorId) || [];
  const existing = items.find((item) => item.productoId === productoId);
  const updatedAt = new Date();

  if (existing) {
    const nextCantidad = existing.cantidad + cantidad;
    if (nextCantidad > producto.stock) return null;

    existing.cantidad = nextCantidad;
    existing.updatedAt = updatedAt;
    store.carritos.set(compradorId, items);
    return existing;
  }

  const item: ItemCarritoMock = {
    id: createId('cart_item'),
    compradorId,
    productoId,
    producto,
    cantidad,
    precioUnitario: producto.precio,
    createdAt: updatedAt,
    updatedAt,
  };

  store.carritos.set(compradorId, [...items, item]);
  return item;
}

export function actualizarItemCarritoMock(
  compradorId: string,
  itemId: string,
  cantidad: number
) {
  const store = getStore();
  const items = store.carritos.get(compradorId) || [];
  const item = items.find((cartItem) => cartItem.id === itemId);

  if (!item || item.producto.stock < cantidad) return null;

  item.cantidad = cantidad;
  item.updatedAt = new Date();
  store.carritos.set(compradorId, items);
  return item;
}

export function removerItemCarritoMock(compradorId: string, itemId: string) {
  const store = getStore();
  const items = store.carritos.get(compradorId) || [];
  store.carritos.set(
    compradorId,
    items.filter((item) => item.id !== itemId)
  );
}

export function vaciarCarritoMock(compradorId: string) {
  getStore().carritos.set(compradorId, []);
}

export function crearPedidoMock(params: {
  compradorId: string;
  metodoPago: string;
  direccionEnvio: string;
}) {
  const carrito = obtenerCarritoMock(params.compradorId);
  if (carrito.items.length === 0) return null;

  const createdAt = new Date();
  const montoProducto = carrito.total;
  const montoEnvio = 15;
  const montoTotal = montoProducto + montoEnvio;
  const numeroOrden = `ORD-${Date.now()}`;
  const pedidoId = createId('ord');
  const envioMock = simularRespuestaEstadoEnvio(numeroOrden);

  const pedido: PedidoMock = {
    id: pedidoId,
    compradorId: params.compradorId,
    numeroOrden,
    estado: 'pendiente_pago',
    montoProducto,
    montoEnvio,
    montoTotal,
    metodoPago: params.metodoPago,
    direccionEnvio: params.direccionEnvio,
    createdAt,
    updatedAt: createdAt,
    items: carrito.items.map((item) => ({
      id: createId('order_item'),
      pedidoId,
      productoId: item.productoId,
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
    })),
    estadoEnvio: {
      id: envioMock.envio_id,
      pedidoId,
      codigoSeguimiento: envioMock.codigo_seguimiento,
      empresaLogistica: envioMock.empresa_logistica,
      estado: envioMock.estado,
      historialEstados: envioMock.historial_estados.map((historial) =>
        JSON.stringify(historial)
      ),
      createdAt,
      updatedAt: createdAt,
    },
  };

  getStore().pedidos.unshift(pedido);
  vaciarCarritoMock(params.compradorId);

  return pedido;
}

export function listarPedidosPorCompradorMock(compradorId: string) {
  return getStore().pedidos.filter((pedido) => pedido.compradorId === compradorId);
}

export function obtenerPedidoPorCompradorMock(id: string, compradorId: string) {
  return (
    getStore().pedidos.find(
      (pedido) => pedido.compradorId === compradorId && pedido.id === id
    ) ?? null
  );
}

export function obtenerPedidoMock(id: string) {
  return (
    getStore().pedidos.find(
      (pedido) => pedido.id === id || pedido.numeroOrden === id
    ) ?? null
  );
}

export function listarOrdenesMock(filters: { estado?: string; page?: number; limit?: number }) {
  const { estado = '', page = 1, limit = 10 } = filters;
  const ordenes = getStore()
    .pedidos.filter((pedido) => !estado || pedido.estado === estado)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const skip = (page - 1) * limit;

  return {
    ordenes: ordenes.slice(skip, skip + limit),
    total: ordenes.length,
  };
}

export function obtenerStatsOrdenesMock() {
  const pedidos = getStore().pedidos;

  return {
    totalPedidos: pedidos.length,
    ingresosTotales: pedidos.reduce((sum, pedido) => sum + pedido.montoTotal, 0),
  };
}
