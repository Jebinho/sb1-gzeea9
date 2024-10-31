import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { products } = useAppContext();

  const totalStock = products.reduce((sum, product) => sum + product.stockQuantity, 0);
  const totalSold = products.reduce((sum, product) => sum + product.soldQuantity, 0);
  const totalRevenue = products.reduce((sum, product) => sum + (product.salePrice * product.soldQuantity), 0);
  const totalCost = products.reduce((sum, product) => sum + (product.costPrice * (product.soldQuantity + product.stockQuantity)), 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Estoque Total</h3>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
          <p className="text-sm text-gray-500 mt-2">unidades em estoque</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Vendas</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSold}</p>
          <p className="text-sm text-gray-500 mt-2">unidades vendidas</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Receita</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">receita total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Custos</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">R$ {totalCost.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">custos totais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos com Baixo Estoque</h3>
          <div className="divide-y">
            {products
              .filter(product => product.stockQuantity < 20)
              .map(product => (
                <div key={product.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {product.stockQuantity} un.
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos Mais Vendidos</h3>
          <div className="divide-y">
            {products
              .sort((a, b) => b.soldQuantity - a.soldQuantity)
              .slice(0, 5)
              .map(product => (
                <div key={product.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {product.soldQuantity} vendidos
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}