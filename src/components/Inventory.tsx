import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Package, Plus, Search, Edit2, Trash2, CheckCircle } from 'lucide-react';

const SIZES = ['33/34', '35/36', '37/38', '39/40', '41/42', '43/44', '45/46'];
const COLORS = ['Branco', 'Preto', 'Azul Marinho', 'Laranja', 'Bege', 'Roxo', 'Rosa', 'Marsala'];

interface EditProductForm {
  name: string;
  salePrice: string;
  costPrice: string;
  stockQuantity: string;
}

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, markAsSold } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<EditProductForm>({
    name: '',
    salePrice: '',
    costPrice: '',
    stockQuantity: ''
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    basePrice: '',
    costPrice: '',
    quantity: ''
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product.id);
    setEditForm({
      name: product.name,
      salePrice: product.salePrice.toString(),
      costPrice: product.costPrice.toString(),
      stockQuantity: product.stockQuantity.toString()
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProduct(selectedProduct, {
        name: editForm.name,
        salePrice: Number(editForm.salePrice),
        costPrice: Number(editForm.costPrice),
        stockQuantity: Number(editForm.stockQuantity)
      });
      setShowEditModal(false);
      setSelectedProduct(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
    }
  };

  const handleMarkAsSold = (id: string) => {
    if (window.confirm('Marcar este produto como vendido?')) {
      markAsSold(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        const sku = `${newProduct.name.substring(0, 3).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${size.replace('/', '')}`;
        addProduct({
          name: `${newProduct.name} ${color} ${size}`,
          sku,
          salePrice: Number(newProduct.basePrice),
          costPrice: Number(newProduct.costPrice),
          stockQuantity: Number(newProduct.quantity)
        });
      });
    });

    setNewProduct({
      name: '',
      basePrice: '',
      costPrice: '',
      quantity: ''
    });
    setSelectedSizes([]);
    setSelectedColors([]);
    setShowAddModal(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Estoque</h1>
            <p className="text-gray-600 dark:text-gray-300">Gerenciamento de produtos</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Adicionar Produtos
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">R$ {product.salePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stockQuantity > 50 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      product.stockQuantity > 20 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.stockQuantity} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isSold 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {product.isSold ? 'Vendido' : 'Em Estoque'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!product.isSold && (
                      <>
                        <button 
                          onClick={() => handleMarkAsSold(product.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                          title="Marcar como vendido"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Editar Produto</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço de Venda (R$)
                </label>
                <input
                  type="number"
                  value={editForm.salePrice}
                  onChange={(e) => setEditForm(prev => ({ ...prev, salePrice: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço de Custo (R$)
                </label>
                <input
                  type="number"
                  value={editForm.costPrice}
                  onChange={(e) => setEditForm(prev => ({ ...prev, costPrice: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  value={editForm.stockQuantity}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Adicionar Produtos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Modelo
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Ex: Chinelo Casual"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço de Custo (R$)
                  </label>
                  <input
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, costPrice: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantidade por Variação
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cores Disponíveis
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map(color => (
                    <label key={color} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors(prev => [...prev, color]);
                          } else {
                            setSelectedColors(prev => prev.filter(c => c !== color));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanhos Disponíveis
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map(size => (
                    <label key={size} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes(prev => [...prev, size]);
                          } else {
                            setSelectedSizes(prev => prev.filter(s => s !== size));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Produtos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}