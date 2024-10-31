import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PlusCircle, MinusCircle, DollarSign } from 'lucide-react';

export default function Financial() {
  const { products, transactions } = useAppContext();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '' });

  // Calculate financial metrics
  const totalRevenue = transactions
    .filter(t => t.type === 'profit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const grossProfit = totalRevenue;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financeiro</h1>
            <p className="text-gray-600 dark:text-gray-300">Controle financeiro e análise de resultados</p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Adicionar Despesa
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Receita Total</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Despesas Totais</h3>
            <MinusCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Lucro Líquido</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {netProfit.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Margem de Lucro</h3>
            <PlusCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profitMargin.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Últimas Vendas</h3>
          <div className="divide-y dark:divide-gray-700">
            {transactions
              .filter(t => t.type === 'profit')
              .slice(0, 5)
              .map(transaction => (
                <div key={transaction.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    + R$ {transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Últimas Despesas</h3>
          <div className="divide-y dark:divide-gray-700">
            {transactions
              .filter(t => t.type === 'expense')
              .slice(0, 5)
              .map(transaction => (
                <div key={transaction.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    - R$ {transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Adicionar Nova Despesa</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
