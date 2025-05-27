import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DraggableItem {
  id: string;
  text: string;
  category: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface ClassificationMissionProps {
  title: string;
  description: string;
  items: DraggableItem[];
  categories: Category[];
  onComplete: (score: number, totalItems: number) => void;
}

const ClassificationMission: React.FC<ClassificationMissionProps> = ({
  title,
  description,
  items,
  categories,
  onComplete
}) => {
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const [placedItems, setPlacedItems] = useState<{[key: string]: DraggableItem[]}>({});
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Inicializar el estado
  useEffect(() => {
    // Mezclar los elementos para presentarlos en orden aleatorio
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    setDraggableItems(shuffledItems);
    
    // Inicializar categorías vacías
    const initialPlacedItems: {[key: string]: DraggableItem[]} = {};
    categories.forEach(category => {
      initialPlacedItems[category.id] = [];
    });
    setPlacedItems(initialPlacedItems);
  }, [items, categories]);

  // Verificar si todos los elementos han sido colocados
  useEffect(() => {
    const allItemsPlaced = draggableItems.length === 0;
    if (allItemsPlaced && !isComplete) {
      // Calcular puntuación
      let correctPlacements = 0;
      Object.keys(placedItems).forEach(categoryId => {
        placedItems[categoryId].forEach(item => {
          if (item.category === categoryId) {
            correctPlacements++;
          }
        });
      });
      
      const finalScore = correctPlacements;
      setScore(finalScore);
      setIsComplete(true);
      
      // Proporcionar retroalimentación
      if (finalScore === items.length) {
        setFeedback('¡Perfecto! Has clasificado todos los elementos correctamente.');
      } else if (finalScore >= items.length * 0.7) {
        setFeedback('¡Buen trabajo! Has clasificado la mayoría de los elementos correctamente.');
      } else {
        setFeedback('Inténtalo de nuevo. Algunos elementos no están en la categoría correcta.');
      }
      
      // Notificar al componente padre
      onComplete(finalScore, items.length);
    }
  }, [draggableItems, placedItems, items.length, isComplete, onComplete]);

  // Manejar cuando un elemento es soltado en una categoría
  const handleDrop = (itemId: string, categoryId: string) => {
    // Encontrar el elemento
    const item = draggableItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Remover el elemento de la lista de elementos arrastrables
    setDraggableItems(prev => prev.filter(i => i.id !== itemId));
    
    // Añadir el elemento a la categoría seleccionada
    setPlacedItems(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId], item]
    }));
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="mb-6 text-gray-300">{description}</p>
      
      {/* Elementos para arrastrar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {draggableItems.map(item => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            className="bg-blue-600 p-3 rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.1 }}
            onDragEnd={(e, info) => {
              // Verificar si el elemento está sobre alguna categoría
              const elements = document.elementsFromPoint(info.point.x, info.point.y);
              const categoryElement = elements.find(el => el.getAttribute('data-category-id'));
              
              if (categoryElement) {
                const categoryId = categoryElement.getAttribute('data-category-id');
                if (categoryId) {
                  handleDrop(item.id, categoryId);
                }
              }
            }}
          >
            {item.image && (
              <img 
                src={item.image} 
                alt={item.text} 
                className="w-16 h-16 object-contain mx-auto mb-2" 
              />
            )}
            <div className="text-center font-medium">{item.text}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Categorías/Contenedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div 
            key={category.id}
            data-category-id={category.id}
            className="border-2 border-dashed border-gray-500 rounded-lg p-4 min-h-[200px] flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
            {category.image && (
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-12 h-12 object-contain mb-2" 
              />
            )}
            
            <div className="flex flex-wrap justify-center gap-2 mt-auto">
              {placedItems[category.id]?.map(item => (
                <div 
                  key={item.id}
                  className={`p-2 rounded-md ${
                    isComplete 
                      ? item.category === category.id 
                        ? 'bg-green-600' 
                        : 'bg-red-600'
                      : 'bg-blue-600'
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Resultados y retroalimentación */}
      {isComplete && (
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Resultados</h3>
          <p className="text-lg">Puntuación: {score} de {items.length}</p>
          <p className="mt-2">{feedback}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassificationMission; 