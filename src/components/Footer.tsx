'use client';

export function Footer() {
  return (
    <footer className="bg-lama-primary text-white p-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Sobre Lama</h3>
            <p className="text-sm opacity-90">
              Marketplace especializado en compra y venta de ropa usada y vintage.
              Moda sostenible para todos.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contacto</h3>
            <p className="text-sm opacity-90">Email: info@lama.com</p>
            <p className="text-sm opacity-90">Teléfono: +54 11 0000-0000</p>
            <p className="text-sm opacity-90">Horario: Lun-Vie 9am-6pm</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Enlaces</h3>
            <ul className="text-sm opacity-90 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-lama-secondary pt-6 text-center text-sm opacity-75">
          <p>&copy; 2026 Lama Marketplace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
