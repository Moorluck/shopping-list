'use client';

import { useState, useEffect } from 'react';
import { ShoppingListItem } from '../app/api/shopping-list/route';

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchItems = async () => {
    try {
      setError(null);
      const response = await fetch('/api/shopping-list');
      if (!response.ok) {
        throw new Error('Erreur');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAdding(true);
    try {
      setError(null);
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Le produit n\'a pas pu être ajouté');
      }

      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
      setInputText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Le produit n\'a pas pu être ajouté');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/shopping-list/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Le produit n\'a pas pu être supprimé');
      }

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Le produit n\'a pas pu être supprimé');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Liste de course
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={addItem} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ajoute un produit à la liste..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !inputText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Chargement' : 'Ajouter'}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-md shadow-sm border border-gray-200">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Pas encore de produit.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-gray-900">{item.text}</p>
                    <p className="text-sm text-gray-500">
                      Ajouté le {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}