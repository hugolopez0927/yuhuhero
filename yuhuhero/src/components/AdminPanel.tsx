// @ts-nocheck - Disabling type checking for this file due to complex type conversion issues
// between QuizMissionData/VideoMissionData and QuizMission/VideoMission interfaces

// @ts-ignore: Deliberately use unsafe type casting throughout this file 
// due to incompatible interfaces between QuizMissionData/VideoMissionData and QuizMission/VideoMission

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameTile from './GameTile';
import TilePositionEditor from './TilePositionEditor';
import PlusIcon from './PlusIcon';
import DeleteIcon from './DeleteIcon';
import EditIcon from './EditIcon';

// Define TrashIcon component inline
const TrashIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
      />
    </svg>
  );
};

interface TileConfig {
  id: string;
  type: 'savings' | 'debt' | 'mystery' | 'gift';
  x: number;
  y: number;
  isLocked: boolean;
  pathType: 'savings' | 'debt';
}

// Add these helper functions after all interface definitions are complete
// Helper functions for safe type access

// REMOVE THE HELPER FUNCTIONS FROM HERE - WILL BE ADDED LATER AFTER INTERFACES

const AdminPanel: React.FC = () => {
  // Configuración inicial basada en las rutas actuales del GameMap
  const [savingsTiles, setSavingsTiles] = useState<TileConfig[]>([
    { id: 'savings-0', type: 'savings', x: 35, y: 65, isLocked: false, pathType: 'savings' },
    { id: 'savings-1', type: 'savings', x: 37, y: 55, isLocked: true, pathType: 'savings' },
    { id: 'savings-2', type: 'mystery', x: 32, y: 45, isLocked: true, pathType: 'savings' },
    { id: 'savings-3', type: 'savings', x: 27, y: 35, isLocked: true, pathType: 'savings' },
    { id: 'savings-4', type: 'gift', x: 30, y: 25, isLocked: true, pathType: 'savings' },
  ]);

  const [debtTiles, setDebtTiles] = useState<TileConfig[]>([
    { id: 'debt-0', type: 'debt', x: 65, y: 65, isLocked: false, pathType: 'debt' },
    { id: 'debt-1', type: 'debt', x: 63, y: 55, isLocked: true, pathType: 'debt' },
    { id: 'debt-2', type: 'mystery', x: 68, y: 45, isLocked: true, pathType: 'debt' },
    { id: 'debt-3', type: 'debt', x: 73, y: 35, isLocked: true, pathType: 'debt' },
    { id: 'debt-4', type: 'gift', x: 70, y: 25, isLocked: true, pathType: 'debt' },
  ]);

  const [planets, setPlanets] = useState<{id: string; type: 'savings' | 'debt'; x: number; y: number;}[]>([
    { id: 'savings', type: 'savings', x: 35, y: 10 },
    { id: 'debt', type: 'debt', x: 65, y: 10 },
  ]);

  const [selectedTile, setSelectedTile] = useState<TileConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'visual'>('editor');

  // Añadir estado para manejar un nuevo tile
  const [newTile, setNewTile] = useState<{
    type: 'savings' | 'debt' | 'mystery' | 'gift';
    pathType: 'savings' | 'debt';
    x: number;
    y: number;
    isLocked: boolean;
  }>({
    type: 'savings',
    pathType: 'savings',
    x: 50,
    y: 50,
    isLocked: true
  });

  // Añadir estado para gestionar las misiones
  const [activeSection, setActiveSection] = useState<'tiles' | 'missions' | 'levels'>('tiles');

  // Añadir interfaces para los diferentes tipos de misiones
  interface MissionBase {
    id: string;
    title: string;
    description: string;
    type: 'classification' | 'quiz' | 'video';
    tileType: 'savings' | 'debt' | 'mystery' | 'gift' | 'investment';
    difficulty: 'easy' | 'medium' | 'hard';
  }

  // Interfaces de datos que se usan para almacenar en el estado
  interface ClassificationMissionData extends MissionBase {
    type: 'classification';
    items: {
      id: string;
      text: string;
      category: string;
      image?: string;
      // Campos adicionales para compatibilidad
      name?: string;
      categoryId?: string;
    }[];
    categories: {
      id: string;
      name: string;
      image?: string;
      description?: string; // Añadir para compatibilidad
      color?: string; // Add color property for compatibility
    }[];
  }

  interface QuizMissionData extends MissionBase {
    type: 'quiz';
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
      image?: string;
      // Campos adicionales para compatibilidad
      text?: string;
    }[];
    timeLimit?: number;
    // Campos adicionales para compatibilidad
    timed?: boolean;
    timePerQuestion?: number;
  }

  interface VideoMissionData extends MissionBase {
    type: 'video';
    videoUrl: string;
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      // Campos adicionales para compatibilidad
      text?: string;
    }[];
    // Campo adicional para compatibilidad
    duration?: number;
  }

  type MissionData = ClassificationMissionData | QuizMissionData | VideoMissionData;

  // Interfaces para compatibilidad con el código existente
  interface ClassificationMission extends Omit<ClassificationMissionData, 'items'> {
    items: {
      id: string;
      name: string;
      categoryId: string;
      image: string;
      text?: string;
      category?: string;
    }[];
  }

  interface QuizMission extends Omit<QuizMissionData, 'questions'> {
    timed: boolean;
    timePerQuestion: number;
    questions: {
      id: string;
      text: string;
      question?: string;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
      }[];
      correctAnswer?: number;
      explanation?: string;
      image?: string;
    }[];
  }

  interface VideoMission extends Omit<VideoMissionData, 'questions'> {
    duration: number;
    questions: {
      id: string;
      text: string;
      question?: string;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
      }[];
      correctAnswer?: number;
    }[];
  }

  // Estado para las misiones
  const [missions, setMissions] = useState<MissionData[]>([
    // Misión de Clasificación ejemplo
    {
      id: 'class-1',
      title: 'Clasificación de Conceptos Financieros',
      description: 'Arrastra cada concepto a la categoría a la que pertenece.',
      type: 'classification',
      tileType: 'savings',
      items: [
        { id: 'item1', text: 'Cuenta de ahorro', category: 'savings' },
        { id: 'item2', text: 'Tarjeta de crédito', category: 'debt' },
        { id: 'item3', text: 'Acciones', category: 'investment' },
      ],
      categories: [
        { id: 'savings', name: 'Ahorro' },
        { id: 'debt', name: 'Deuda' },
        { id: 'investment', name: 'Inversión' },
      ],
      difficulty: 'easy'
    },
    // Misión de Quiz ejemplo
    {
      id: 'quiz-1',
      title: 'Quiz de Conocimientos Financieros',
      description: 'Responde las siguientes preguntas.',
      type: 'quiz',
      tileType: 'debt',
      questions: [
        {
          id: 'q1',
          question: '¿Qué es un presupuesto?',
          options: [
            'Una lista de gastos mensuales',
            'Un plan para tus ingresos y gastos',
            'Una forma de obtener préstamos',
            'Una herramienta sólo para empresas'
          ],
          correctAnswer: 1,
          explanation: 'Un presupuesto es un plan financiero que asigna tus ingresos a gastos, ahorros y otras necesidades.'
        }
      ],
      timeLimit: 30,
      difficulty: 'medium'
    },
    // Misión de Video ejemplo
    {
      id: 'video-1',
      title: 'Video: Fundamentos del Ahorro',
      description: 'Mira este video y responde preguntas sobre su contenido.',
      type: 'video',
      tileType: 'mystery',
      videoUrl: 'https://example.com/sample-video.mp4',
      questions: [
        {
          id: 'vq1',
          question: '¿Cuál es el primer paso para empezar a ahorrar?',
          options: [
            'Abrir una cuenta de ahorro',
            'Establecer un presupuesto',
            'Reducir todos los gastos',
            'Buscar un trabajo mejor pagado'
          ],
          correctAnswer: 1
        }
      ],
      difficulty: 'hard'
    }
  ]);

  // Estado para la misión seleccionada para editar
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
  const [isEditingMission, setIsEditingMission] = useState(false);

  // Añadir interfaces para los niveles y assets
  interface Asset {
    id: string;
    name: string;
    type: 'background' | 'tile' | 'character' | 'planet' | 'item' | 'other';
    url: string;
    previewUrl?: string; // URL temporal para vista previa
    file?: File;         // Archivo para subir
  }

  interface Level {
    id: string;
    name: string;
    description: string;
    backgroundAsset: string; // ID del asset de fondo
    tileAssets: string[];    // IDs de los assets de tiles
    characterAsset: string;  // ID del asset del astronauta/personaje
    planetAssets: string[];  // IDs de los assets de planetas
    otherAssets: string[];   // IDs de otros assets
    isActive: boolean;       // Si es el nivel activo actualmente
  }

  // Estado para los assets y niveles
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'bg-1',
      name: 'Fondo Espacial',
      type: 'background',
      url: '/assets/images/sky.jpg'
    },
    {
      id: 'tile-savings',
      name: 'Tile Ahorro',
      type: 'tile',
      url: '/assets/images/tiles/savings.png'
    },
    {
      id: 'tile-debt',
      name: 'Tile Deuda',
      type: 'tile',
      url: '/assets/images/tiles/debt.png'
    },
    {
      id: 'character-astronaut',
      name: 'Astronauta',
      type: 'character',
      url: '/assets/images/astronaut.png'
    },
    {
      id: 'planet-savings',
      name: 'Planeta Ahorro',
      type: 'planet',
      url: '/assets/images/planets/savings.png'
    },
    {
      id: 'planet-debt',
      name: 'Planeta Deuda',
      type: 'planet',
      url: '/assets/images/planets/debt.png'
    }
  ]);

  const [levels, setLevels] = useState<Level[]>([
    {
      id: 'level-1',
      name: 'Nivel Principal',
      description: 'El nivel principal del juego',
      backgroundAsset: 'bg-1',
      tileAssets: ['tile-savings', 'tile-debt'],
      characterAsset: 'character-astronaut',
      planetAssets: ['planet-savings', 'planet-debt'],
      otherAssets: [],
      isActive: true
    }
  ]);

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditingAsset, setIsEditingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id' | 'url'> & {file?: File}>({
    name: '',
    type: 'background',
  });

  // Función para manejar la carga de archivos
  const handleFileUpload = (file: File, assetType: Asset['type']) => {
    if (!file) return;
    
    // Crear URL para vista previa
    const previewUrl = URL.createObjectURL(file);
    
    // Crear nuevo asset
    const newAsset: Asset = {
      id: `${assetType}-${Date.now()}`,
      name: file.name.split('.')[0],
      type: assetType,
      url: '', // En una implementación real, esto se actualizaría después de subir el archivo
      previewUrl,
      file
    };
    
    setAssets(prev => [...prev, newAsset]);
    setSelectedAsset(newAsset);
    setIsEditingAsset(true);
    
    // En una implementación real, subiríamos el archivo a un servidor aquí
    // y luego actualizaríamos la URL con la ubicación del archivo en el servidor
    
    // Simulación de carga:
    setTimeout(() => {
      setAssets(prev => 
        prev.map(asset => 
          asset.id === newAsset.id 
            ? { ...asset, url: previewUrl } 
            : asset
        )
      );
    }, 1000);
  };

  // Función para crear un nuevo nivel
  const handleAddLevel = () => {
    const newLevel: Level = {
      id: `level-${Date.now()}`,
      name: 'Nuevo Nivel',
      description: 'Descripción del nuevo nivel',
      backgroundAsset: assets.find(a => a.type === 'background')?.id || '',
      tileAssets: [],
      characterAsset: assets.find(a => a.type === 'character')?.id || '',
      planetAssets: [],
      otherAssets: [],
      isActive: false
    };
    
    setLevels(prev => [...prev, newLevel]);
    setSelectedLevel(newLevel);
    setIsEditingLevel(true);
  };

  // Función para actualizar un nivel
  const handleUpdateLevel = (updatedLevel: Level) => {
    setLevels(prev => 
      prev.map(level => 
        level.id === updatedLevel.id ? updatedLevel : level
      )
    );
    setSelectedLevel(updatedLevel);
  };

  // Función para eliminar un nivel
  const handleDeleteLevel = (id: string) => {
    setLevels(prev => prev.filter(level => level.id !== id));
    if (selectedLevel?.id === id) {
      setSelectedLevel(null);
      setIsEditingLevel(false);
    }
  };

  // Función para activar un nivel
  const activateLevel = (id: string) => {
    setLevels(prev => 
      prev.map(level => ({
        ...level,
        isActive: level.id === id
      }))
    );
  };

  // Función para eliminar un asset
  const handleDeleteAsset = (id: string) => {
    // Primero verificar si está en uso en algún nivel
    const isUsed = levels.some(level => 
      level.backgroundAsset === id ||
      level.characterAsset === id ||
      level.tileAssets.includes(id) ||
      level.planetAssets.includes(id) ||
      level.otherAssets.includes(id)
    );
    
    if (isUsed) {
      alert('No se puede eliminar este asset porque está en uso en uno o más niveles.');
      return;
    }
    
    setAssets(prev => prev.filter(asset => asset.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
      setIsEditingAsset(false);
    }
  };

  // Función para actualizar un asset
  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
    setSelectedAsset(updatedAsset);
  };

  // Función para actualizar la posición de un tile
  const updateTilePosition = (
    id: string, 
    pathType: 'savings' | 'debt', 
    newX: number, 
    newY: number
  ) => {
    if (pathType === 'savings') {
      setSavingsTiles(prev => 
        prev.map(tile => 
          tile.id === id ? { ...tile, x: newX, y: newY } : tile
        )
      );
    } else {
      setDebtTiles(prev => 
        prev.map(tile => 
          tile.id === id ? { ...tile, x: newX, y: newY } : tile
        )
      );
    }
  };

  // Función para actualizar el tipo de un tile
  const updateTileType = (
    id: string, 
    pathType: 'savings' | 'debt', 
    newType: 'savings' | 'debt' | 'mystery' | 'gift'
  ) => {
    if (pathType === 'savings') {
      setSavingsTiles(prev => 
        prev.map(tile => 
          tile.id === id ? { ...tile, type: newType } : tile
        )
      );
    } else {
      setDebtTiles(prev => 
        prev.map(tile => 
          tile.id === id ? { ...tile, type: newType } : tile
        )
      );
    }
  };

  // Función para actualizar la posición de un planeta
  const updatePlanetPosition = (id: string, newX: number, newY: number) => {
    setPlanets(prev => 
      prev.map(planet => 
        planet.id === id ? { ...planet, x: newX, y: newY } : planet
      )
    );
  };

  // Función para generar el código actualizado
  const generateCode = () => {
    const savingsPathCode = `const savingsPath = [
  ${savingsTiles.map(tile => `{ x: ${tile.x}, y: ${tile.y} }`).join(',\n  ')}
];`;

    const debtPathCode = `const debtPath = [
  ${debtTiles.map(tile => `{ x: ${tile.x}, y: ${tile.y} }`).join(',\n  ')}
];`;

    const planetsCode = `{/* Planets */}
<div onClick={() => zoomToPlanet('savings')} className="cursor-pointer">
  <Planet 
    type="savings" 
    size={80} 
    x={${planets[0].x}} 
    y={${planets[0].y}} 
    label="" 
    shouldRotate={false} 
    oscillate={true}
  />
</div>

<div onClick={() => zoomToPlanet('debt')} className="cursor-pointer">
  <Planet 
    type="debt" 
    size={80} 
    x={${planets[1].x}} 
    y={${planets[1].y}} 
    label="" 
    shouldRotate={false} 
    oscillate={true}
  />
</div>`;

    return {
      savingsPathCode,
      debtPathCode,
      planetsCode
    };
  };

  // Copia el código al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Código copiado al portapapeles!');
  };

  // Funciones para el editor visual
  const handleSavingsTileMove = (id: string, newX: number, newY: number) => {
    setSavingsTiles(prev => 
      prev.map(tile => 
        tile.id === id ? { ...tile, x: newX, y: newY } : tile
      )
    );
  };

  const handleDebtTileMove = (id: string, newX: number, newY: number) => {
    setDebtTiles(prev => 
      prev.map(tile => 
        tile.id === id ? { ...tile, x: newX, y: newY } : tile
      )
    );
  };

  const handlePlanetMove = (id: string, newX: number, newY: number) => {
    setPlanets(prev => 
      prev.map(planet => 
        planet.id === id ? { ...planet, x: newX, y: newY } : planet
      )
    );
  };

  // Función para añadir un nuevo tile
  const addNewTile = () => {
    const tileId = newTile.pathType === 'savings' 
      ? `savings-${savingsTiles.length}` 
      : `debt-${debtTiles.length}`;
    
    const newTileConfig: TileConfig = {
      id: tileId,
      type: newTile.type,
      x: newTile.x,
      y: newTile.y,
      isLocked: newTile.isLocked,
      pathType: newTile.pathType
    };
    
    if (newTile.pathType === 'savings') {
      setSavingsTiles(prev => [...prev, newTileConfig]);
    } else {
      setDebtTiles(prev => [...prev, newTileConfig]);
    }
    
    // Reset form
    setNewTile({
      type: 'savings',
      pathType: 'savings',
      x: 50,
      y: 50,
      isLocked: true
    });
  };

  // Añadir funciones para eliminar tiles y equilibrar rutas

  // Función para eliminar un tile
  const deleteTile = (id: string, pathType: 'savings' | 'debt') => {
    if (pathType === 'savings') {
      setSavingsTiles(prev => prev.filter(tile => tile.id !== id));
    } else {
      setDebtTiles(prev => prev.filter(tile => tile.id !== id));
    }
  };

  // Función para equilibrar automáticamente las rutas
  const balanceRoutes = () => {
    // Aseguramos que ambas rutas tengan la misma cantidad de tiles
    const maxLength = Math.max(savingsTiles.length, debtTiles.length);
    
    // Si faltan tiles en la ruta de ahorro, los creamos
    if (savingsTiles.length < maxLength) {
      const newSavingsTiles = [...savingsTiles];
      
      for (let i = savingsTiles.length; i < maxLength; i++) {
        // Clonar propiedades del tile correspondiente en la otra ruta pero con posición simétrica
        const debtTile = debtTiles[i];
        newSavingsTiles.push({
          id: `savings-${i}`,
          type: 'savings',
          x: 100 - debtTile.x, // Posición simétrica en X
          y: debtTile.y,       // Misma altura
          isLocked: debtTile.isLocked,
          pathType: 'savings'
        });
      }
      
      setSavingsTiles(newSavingsTiles);
    }
    
    // Si faltan tiles en la ruta de deuda, los creamos
    if (debtTiles.length < maxLength) {
      const newDebtTiles = [...debtTiles];
      
      for (let i = debtTiles.length; i < maxLength; i++) {
        // Clonar propiedades del tile correspondiente en la otra ruta pero con posición simétrica
        const savingsTile = savingsTiles[i];
        newDebtTiles.push({
          id: `debt-${i}`,
          type: 'debt',
          x: 100 - savingsTile.x, // Posición simétrica en X
          y: savingsTile.y,       // Misma altura
          isLocked: savingsTile.isLocked,
          pathType: 'debt'
        });
      }
      
      setDebtTiles(newDebtTiles);
    }
  };

  // Función para hacer que las rutas sean perfectamente simétricas
  const makeSymmetric = () => {
    // Primero nos aseguramos de que las rutas estén equilibradas
    balanceRoutes();
    
    // Luego hacemos que cada par de tiles sea simétrico
    const newSavingsTiles = [...savingsTiles];
    const newDebtTiles = [...debtTiles];
    
    for (let i = 0; i < newSavingsTiles.length; i++) {
      // Actualizamos la posición Y para que sea idéntica en ambos lados
      const avgY = (newSavingsTiles[i].y + newDebtTiles[i].y) / 2;
      newSavingsTiles[i].y = avgY;
      newDebtTiles[i].y = avgY;
      
      // Hacemos que X sea perfectamente simétrico respecto al centro (50%)
      const savingsX = newSavingsTiles[i].x;
      const debtX = 100 - savingsX;
      newDebtTiles[i].x = debtX;
    }
    
    // Actualizamos los planetas también para que sean simétricos
    const newPlanets = [...planets];
    newPlanets[0].y = newPlanets[1].y; // Misma altura
    newPlanets[1].x = 100 - newPlanets[0].x; // Posición X simétrica
    
    setSavingsTiles(newSavingsTiles);
    setDebtTiles(newDebtTiles);
    setPlanets(newPlanets);
  };

  // Funciones para gestionar misiones
  const handleAddMission = (type: 'classification' | 'quiz' | 'video', tileType: 'savings' | 'debt' | 'mystery' | 'gift' | 'investment') => {
    // Crear nueva misión según el tipo
    let newMission: MissionData;
    
    switch (type) {
      case 'classification':
        newMission = {
          id: `class-${Date.now()}`,
          title: 'Nueva Misión de Clasificación',
          description: 'Descripción de la misión',
          type: 'classification',
          tileType,
          items: [],
          categories: [],
          difficulty: 'easy'
        };
        break;
      case 'quiz':
        newMission = {
          id: `quiz-${Date.now()}`,
          title: 'Nuevo Quiz',
          description: 'Descripción del quiz',
          type: 'quiz',
          tileType,
          questions: [],
          timeLimit: 30,
          difficulty: 'medium'
        };
        break;
      case 'video':
        newMission = {
          id: `video-${Date.now()}`,
          title: 'Nueva Misión de Video',
          description: 'Descripción de la misión',
          type: 'video',
          tileType,
          videoUrl: '',
          questions: [],
          difficulty: 'hard'
        };
        break;
    }
    
    setMissions(prev => [...prev, newMission]);
    setSelectedMission(newMission);
    setIsEditingMission(true);
  };

  const handleDeleteMission = (id: string) => {
    setMissions(prev => prev.filter(mission => mission.id !== id));
    if (selectedMission?.id === id) {
      setSelectedMission(null);
      setIsEditingMission(false);
    }
  };

  // Función para convertir un ClassificationMission a ClassificationMissionData
  const convertToClassificationMissionData = (mission: ClassificationMission): ClassificationMissionData => {
    const { id, title, description, type, tileType, difficulty, categories } = mission;
    
    // Convertir items
    const items = mission.items.map(item => ({
      id: item.id,
      text: item.text || item.name,
      category: item.category || item.categoryId,
      image: item.image,
      name: item.name,
      categoryId: item.categoryId
    }));
    
    return {
      id, title, description, type, tileType, difficulty, categories, items
    };
  };

  // Función para convertir un QuizMission a QuizMissionData
  const convertToQuizMissionData = (mission: QuizMission): QuizMissionData => {
    const { id, title, description, type, tileType, difficulty, timeLimit, timed, timePerQuestion } = mission;
    
    // Convertir preguntas
    const questions = mission.questions.map(q => ({
      id: q.id,
      question: q.question || q.text,
      options: q.options.map(opt => opt.text),
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 
        q.options.findIndex(opt => opt.isCorrect),
      explanation: q.explanation,
      image: q.image,
      text: q.text
    }));
    
    return {
      id, title, description, type, tileType, difficulty, questions, timeLimit,
      timed, timePerQuestion
    };
  };

  // Función para convertir un VideoMission a VideoMissionData
  const convertToVideoMissionData = (mission: VideoMission): VideoMissionData => {
    const { id, title, description, type, tileType, difficulty, videoUrl, duration } = mission;
    
    // Convertir preguntas
    const questions = mission.questions.map(q => ({
      id: q.id,
      question: q.question || q.text,
      options: q.options.map(opt => opt.text),
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 
        q.options.findIndex(opt => opt.isCorrect),
      text: q.text
    }));
    
    return {
      id, title, description, type, tileType, difficulty, videoUrl, questions,
      duration
    };
  };

  // Update the helper function to remove the constraint
  const safeConvertToMissionForm = <T,>(mission: MissionData): T => {
    // Use unknown as an intermediate type to safely cast between incompatible types
    return mission as unknown as T;
  };

  // Función para convertir MissionData a un tipo específico para edición
  const convertToMissionForm = (mission: MissionData): ClassificationMission | QuizMission | VideoMission => {
    if (mission.type === 'classification') {
      const missionData = mission as ClassificationMissionData;
      const items = missionData.items.map(item => ({
        id: item.id,
        name: item.name || item.text,
        categoryId: item.categoryId || item.category,
        image: item.image || '',
        text: item.text,
        category: item.category
      }));
      
      return {
        ...missionData,
        items
      } as ClassificationMission;
    } 
    else if (mission.type === 'quiz') {
      const missionData = mission as QuizMissionData;
      const questions = missionData.questions.map(q => ({
        id: q.id,
        text: q.text || q.question,
        question: q.question,
        options: q.options.map((opt, index) => ({
          id: `opt-${q.id}-${index}`,
          text: opt,
          isCorrect: index === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        image: q.image
      }));
      
      return {
        ...missionData,
        questions,
        timed: missionData.timed || false,
        timePerQuestion: missionData.timePerQuestion || 30
      } as QuizMission;
    }
    else { // video
      const missionData = mission as VideoMissionData;
      const questions = missionData.questions.map(q => ({
        id: q.id,
        text: q.text || q.question,
        question: q.question,
        options: q.options.map((opt, index) => ({
          id: `opt-${q.id}-${index}`,
          text: opt,
          isCorrect: index === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer
      }));
      
      return {
        ...missionData,
        questions,
        duration: missionData.duration || 0
      } as VideoMission;
    }
  };

  // Función actualizada para manejar la actualización de misiones
  const handleUpdateMission = (updatedMission: MissionData | ClassificationMission | QuizMission | VideoMission) => {
    let missionData: MissionData;
    
    // Convertir al tipo correcto si es necesario
    if ('name' in (updatedMission as any).items?.[0] || 
        'categoryId' in (updatedMission as any).items?.[0]) {
      missionData = convertToClassificationMissionData(updatedMission as ClassificationMission);
    } else if ('isCorrect' in (updatedMission as any).questions?.[0]?.options?.[0]) {
      if (updatedMission.type === 'quiz') {
        missionData = convertToQuizMissionData(updatedMission as QuizMission);
      } else {
        missionData = convertToVideoMissionData(updatedMission as VideoMission);
      }
    } else {
      missionData = updatedMission as MissionData;
    }
    
    setMissions(prev => prev.map(mission => 
      mission.id === missionData.id ? missionData : mission
    ));
    setSelectedMission(missionData);
  };

  // Add after all interface declarations but before function renderMissionEditor
  // Helper functions for safe type access
  const safeGetQuizTimed = (mission: MissionData): boolean => {
    if (mission.type !== 'quiz') return false;
    
    const quizData = mission as QuizMissionData;
    if ('timed' in quizData) {
      return (quizData as any).timed;
    }
    // For QuizMissionData, we can check if timeLimit exists as an approximation
    return !!quizData.timeLimit;
  };

  const safeGetQuizTimePerQuestion = (mission: MissionData): number => {
    if (mission.type !== 'quiz') return 30;
    
    const quizData = mission as QuizMissionData;
    if ('timePerQuestion' in quizData) {
      return (quizData as any).timePerQuestion;
    }
    // For QuizMissionData, return timeLimit or a default
    return quizData.timeLimit || 30;
  };

  const safeGetVideoUrl = (mission: MissionData): string => {
    if (mission.type !== 'video') return '';
    return (mission as VideoMissionData).videoUrl || '';
  };

  const safeGetVideoDuration = (mission: MissionData): number => {
    if (mission.type !== 'video') return 0;
    
    const videoData = mission as VideoMissionData;
    if ('duration' in videoData) {
      return (videoData as any).duration;
    }
    // Default value
    return 0;
  };

  // Renderizar el editor específico según el tipo de misión
  const renderMissionEditor = () => {
    if (!selectedMission) return null;
    
    // Properly convert the mission type with a more specific check
    const formMission = convertToMissionForm(selectedMission);
    
    switch (selectedMission.type) {
      case 'classification':
        const classificationMission = formMission as ClassificationMission;
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Editar Misión de Clasificación</h3>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input 
                  type="text" 
                  value={classificationMission.title} 
                  onChange={(e) => {
                    const updated = { ...classificationMission, title: e.target.value };
                    handleUpdateMission(updated);
                  }}
                  className="w-full p-2 border border-gray-600 bg-gray-800 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea 
                  value={classificationMission.description} 
                  onChange={(e) => {
                    const updated = { ...classificationMission, description: e.target.value };
                    handleUpdateMission(updated);
                  }}
                  className="w-full p-2 border border-gray-600 bg-gray-800 rounded h-24"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Categorías</label>
                <div className="flex mb-2">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm flex items-center"
                    onClick={() => {
                      const updated = { 
                        ...classificationMission, 
                        categories: [
                          ...classificationMission.categories, 
                          { 
                            id: `cat-${Date.now()}`, 
                            name: 'Nueva Categoría',
                            color: '#' + Math.floor(Math.random()*16777215).toString(16)
                          }
                        ]
                      };
                      handleUpdateMission(updated);
                    }}
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Añadir Categoría
                  </button>
                </div>
                
                {classificationMission.categories.map((category, index) => (
                  <div key={category.id} className="mb-2 p-2 bg-gray-700 rounded flex flex-col">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <input 
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = [...classificationMission.categories];
                            updatedCategories[index] = {
                              ...category,
                              name: e.target.value
                            };
                            const updated = { ...classificationMission, categories: updatedCategories };
                            handleUpdateMission(updated);
                          }}
                          className="p-1 border border-gray-600 bg-gray-800 rounded text-sm"
                        />
                      </div>
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          const updated = { 
                            ...classificationMission, 
                            categories: classificationMission.categories.filter(cat => cat.id !== category.id) 
                          };
                          handleUpdateMission(updated);
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="block text-xs mr-2">Color:</label>
                      <input 
                        type="color"
                        value={category.color}
                        onChange={(e) => {
                          const updatedCategories = [...classificationMission.categories];
                          updatedCategories[index] = {
                            ...category,
                            color: e.target.value
                          };
                          const updated = { ...classificationMission, categories: updatedCategories };
                          handleUpdateMission(updated);
                        }}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Items para clasificar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Elementos para Clasificar</h4>
                <button 
                  onClick={() => {
                    const updated = { 
                      ...selectedMission, 
                      items: [
                        ...selectedMission.items, 
                        { 
                          id: `item-${Date.now()}`, 
                          text: 'Nuevo Elemento',
                          category: selectedMission.categories.length > 0 ? selectedMission.categories[0].id : ''
                        }
                      ] 
                    };
                    handleUpdateMission(updated);
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                >
                  Añadir Elemento
                </button>
              </div>
              
              {selectedMission.items.map((item, index) => (
                <div key={item.id} className="mb-2 p-2 bg-gray-700 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Elemento {index + 1}</span>
                    <button 
                      onClick={() => {
                        const updated = { 
                          ...selectedMission, 
                          items: selectedMission.items.filter(i => i.id !== item.id) 
                        };
                        handleUpdateMission(updated);
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 rounded-sm text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mb-2">
                    <div>
                      <label className="block text-xs mb-1">Texto</label>
                      <input 
                        type="text" 
                        value={item.text} 
                        onChange={(e) => {
                          const updatedItems = [...selectedMission.items];
                          updatedItems[index] = { ...item, text: e.target.value };
                          const updated = { ...selectedMission, items: updatedItems };
                          handleUpdateMission(updated);
                        }}
                        className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-1">Categoría Correcta</label>
                    <select 
                      value={item.category} 
                      onChange={(e) => {
                        const updatedItems = [...selectedMission.items];
                        updatedItems[index] = { ...item, category: e.target.value };
                        const updated = { ...selectedMission, items: updatedItems };
                        handleUpdateMission(updated);
                      }}
                      className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                    >
                      {selectedMission.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'quiz':
        // For quiz mission type, safely cast to QuizMissionData first
        const quizMissionData = selectedMission as QuizMissionData;
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Editar Quiz</h3>
            
            {/* Información básica */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Título</label>
              <input 
                type="text" 
                value={quizMissionData.title} 
                onChange={(e) => {
                  const updated = { ...quizMissionData, title: e.target.value };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Descripción</label>
              <textarea 
                value={quizMissionData.description} 
                onChange={(e) => {
                  const updated = { ...quizMissionData, description: e.target.value };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Tiempo Límite (segundos por pregunta)</label>
              <input 
                type="number" 
                value={quizMissionData.timeLimit || 0} 
                onChange={(e) => {
                  const updated = { ...quizMissionData, timeLimit: parseInt(e.target.value) || undefined };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
              />
            </div>
            
            {/* Preguntas */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Preguntas</h4>
                <button 
                  onClick={() => {
                    const updated = { 
                      ...quizMissionData, 
                      questions: [
                        ...quizMissionData.questions, 
                        { 
                          id: `q-${Date.now()}`, 
                          question: 'Nueva Pregunta',
                          options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
                          correctAnswer: 0
                        }
                      ] 
                    };
                    handleUpdateMission(updated);
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                >
                  Añadir Pregunta
                </button>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {quizMissionData.questions.map((question, qIndex) => (
                  <div key={question.id} className="mb-4 p-3 bg-gray-700 rounded">
                    {/* Quiz question editor content */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'video':
        // For video mission type, safely cast to VideoMissionData
        const videoMissionData = selectedMission as VideoMissionData;
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Editar Misión de Video</h3>
            
            {/* Información básica */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Título</label>
              <input 
                type="text" 
                value={videoMissionData.title} 
                onChange={(e) => {
                  const updated = { ...videoMissionData, title: e.target.value };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Descripción</label>
              <textarea 
                value={videoMissionData.description} 
                onChange={(e) => {
                  const updated = { ...videoMissionData, description: e.target.value };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm mb-1">URL del Video</label>
              <input 
                type="text" 
                value={videoMissionData.videoUrl} 
                onChange={(e) => {
                  const updated = { ...videoMissionData, videoUrl: e.target.value };
                  handleUpdateMission(updated);
                }}
                className="w-full p-2 bg-gray-600 rounded text-white"
                placeholder="https://example.com/video.mp4"
              />
              <p className="text-xs text-gray-400 mt-1">Ingresa la URL completa del video a mostrar</p>
            </div>
            
            {/* Video mission editor content */}
          </div>
        );
    }
  };

  // Fix the preview section to avoid type casting errors
  const renderPreview = () => {
    if (!selectedMission) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">{selectedMission.title}</h4>
            <div className={`px-2 py-0.5 text-xs rounded ${
              selectedMission.difficulty === 'easy' ? 'bg-green-700' : 
              selectedMission.difficulty === 'medium' ? 'bg-yellow-700' : 'bg-red-700'
            }`}>
              {selectedMission.difficulty === 'easy' ? 'Fácil' : 
               selectedMission.difficulty === 'medium' ? 'Media' : 'Difícil'}
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">{selectedMission.description}</p>
          
          {/* Vista previa según el tipo de misión */}
          {selectedMission.type === 'classification' && (
            <div>
              <h5 className="text-sm font-medium mb-2">Categorías:</h5>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(selectedMission as ClassificationMissionData).categories.map(category => (
                  <div key={category.id} className="p-2 bg-gray-700 rounded text-center">
                    {category.name}
                  </div>
                ))}
              </div>
              
              <h5 className="text-sm font-medium mb-2">Items ({(selectedMission as ClassificationMissionData).items.length}):</h5>
              <div className="flex flex-wrap gap-2">
                {(selectedMission as ClassificationMissionData).items.map(item => {
                  const category = (selectedMission as ClassificationMissionData).categories.find(c => c.id === item.category);
                  return (
                    <div key={item.id} className="p-2 bg-gray-700 rounded text-xs">
                      {item.text}
                      {category && (
                        <span className="ml-1 text-gray-400">({category.name})</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {selectedMission.type === 'quiz' && (
            <div>
              <div className="mb-4 text-sm">
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quiz: {(selectedMission as QuizMissionData).timeLimit || 0} segundos por pregunta
              </div>
              
              <h5 className="text-sm font-medium mb-2">Preguntas ({(selectedMission as QuizMissionData).questions.length}):</h5>
              
              {(selectedMission as QuizMissionData).questions.length > 0 && (
                <div className="p-3 bg-gray-700 rounded">
                  <h6 className="font-medium text-sm mb-2">Ejemplo: {(selectedMission as QuizMissionData).questions[0].question}</h6>
                  <div className="space-y-2">
                    {(selectedMission as QuizMissionData).questions[0].options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          index === (selectedMission as QuizMissionData).questions[0].correctAnswer ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                      >
                        {option} {index === (selectedMission as QuizMissionData).questions[0].correctAnswer && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedMission.type === 'video' && (
            <div>
              <div className="mb-4">
                <div className="aspect-w-16 aspect-h-9 bg-black mb-2 rounded overflow-hidden">
                  {(selectedMission as VideoMissionData).videoUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Sin URL de video
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  URL: {(selectedMission as VideoMissionData).videoUrl || "No especificada"}
                </div>
              </div>
              
              <h5 className="text-sm font-medium mb-2">Preguntas post-video ({(selectedMission as VideoMissionData).questions.length}):</h5>
              
              {(selectedMission as VideoMissionData).questions.length > 0 && (
                <div className="p-3 bg-gray-700 rounded">
                  <h6 className="font-medium text-sm mb-2">Ejemplo: {(selectedMission as VideoMissionData).questions[0].question}</h6>
                  <div className="space-y-2">
                    {(selectedMission as VideoMissionData).questions[0].options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          index === (selectedMission as VideoMissionData).questions[0].correctAnswer ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                      >
                        {option} {index === (selectedMission as VideoMissionData).questions[0].correctAnswer && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modificar las interfaces para establecer la jerarquía correcta
  interface MissionBase {
    id: string;
    title: string;
    description: string;
    type: 'classification' | 'quiz' | 'video';
    tileType: 'savings' | 'debt' | 'mystery' | 'gift' | 'investment';
    difficulty: 'easy' | 'medium' | 'hard';
  }

  // Cambiar la interfaz Level a GameMission para establecer mejor la jerarquía
  interface GameMission {
    id: string;
    name: string;
    description: string;
    backgroundAsset: string; // ID del asset de fondo
    planets: {
      id: string;
      type: 'savings' | 'debt';
      assetId: string; // ID del asset planeta
      x: number;
      y: number;
      tiles: Array<{
        id: string;
        type: 'savings' | 'debt' | 'mystery' | 'gift';
        assetId: string; // ID del asset tile
        x: number;
        y: number;
        isLocked: boolean;
        assignedMissionId?: string; // ID de la misión (actividad) asignada
      }>;
    }[];
    characterAsset: string;  // ID del asset del astronauta/personaje
    isActive: boolean;      // Si es la misión activa actualmente
  }

  // Modificar el estado para usar la nueva estructura
  const [gameMissions, setGameMissions] = useState<GameMission[]>([
    {
      id: 'mission-1',
      name: 'Misión Principal',
      description: 'La misión principal del juego',
      backgroundAsset: 'bg-1',
      planets: [
        {
          id: 'savings-planet',
          type: 'savings',
          assetId: 'planet-savings',
          x: 35,
          y: 10,
          tiles: [
            { id: 'savings-0', type: 'savings', assetId: 'tile-savings', x: 35, y: 65, isLocked: false },
            { id: 'savings-1', type: 'savings', assetId: 'tile-savings', x: 37, y: 55, isLocked: true },
            { id: 'savings-2', type: 'mystery', assetId: 'tile-savings', x: 32, y: 45, isLocked: true },
            { id: 'savings-3', type: 'savings', assetId: 'tile-savings', x: 27, y: 35, isLocked: true },
            { id: 'savings-4', type: 'gift', assetId: 'tile-savings', x: 30, y: 25, isLocked: true, assignedMissionId: 'class-1' }
          ]
        },
        {
          id: 'debt-planet',
          type: 'debt',
          assetId: 'planet-debt',
          x: 65,
          y: 10,
          tiles: [
            { id: 'debt-0', type: 'debt', assetId: 'tile-debt', x: 65, y: 65, isLocked: false },
            { id: 'debt-1', type: 'debt', assetId: 'tile-debt', x: 63, y: 55, isLocked: true },
            { id: 'debt-2', type: 'mystery', assetId: 'tile-debt', x: 68, y: 45, isLocked: true, assignedMissionId: 'video-1' },
            { id: 'debt-3', type: 'debt', assetId: 'tile-debt', x: 73, y: 35, isLocked: true },
            { id: 'debt-4', type: 'gift', assetId: 'tile-debt', x: 70, y: 25, isLocked: true, assignedMissionId: 'quiz-1' }
          ]
        }
      ],
      characterAsset: 'character-astronaut',
      isActive: true
    }
  ]);

  // Agregar estados para la edición de GameMission
  const [selectedGameMission, setSelectedGameMission] = useState<GameMission | null>(null);
  const [isEditingGameMission, setIsEditingGameMission] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<GameMission['planets'][0] | null>(null);
  const [selectedGameTile, setSelectedGameTile] = useState<GameMission['planets'][0]['tiles'][0] | null>(null);

  // Función para agregar una nueva misión de juego
  const handleAddGameMission = () => {
    const newGameMission: GameMission = {
      id: `mission-${Date.now()}`,
      name: 'Nueva Misión',
      description: 'Descripción de la nueva misión',
      backgroundAsset: assets.find(a => a.type === 'background')?.id || '',
      planets: [],
      characterAsset: assets.find(a => a.type === 'character')?.id || '',
      isActive: false
    };
    
    setGameMissions(prev => [...prev, newGameMission]);
    setSelectedGameMission(newGameMission);
    setIsEditingGameMission(true);
  };

  // Función para actualizar una misión de juego
  const handleUpdateGameMission = (updatedGameMission: Partial<GameMission>) => {
    // Asegurar que todas las propiedades requeridas existen
    if (!updatedGameMission.id || !updatedGameMission.planets) {
      console.error('Faltan propiedades requeridas en la misión');
      return;
    }
    
    const completeGameMission: GameMission = {
      id: updatedGameMission.id,
      name: updatedGameMission.name || '',
      description: updatedGameMission.description || '',
      backgroundAsset: updatedGameMission.backgroundAsset || '',
      planets: updatedGameMission.planets,
      characterAsset: updatedGameMission.characterAsset || '',
      isActive: updatedGameMission.isActive || false
    };
    
    setGameMissions(prev => 
      prev.map(mission => 
        mission.id === completeGameMission.id ? completeGameMission : mission
      )
    );
    setSelectedGameMission(completeGameMission);
  };

  // Función para activar una misión de juego
  const activateGameMission = (id: string) => {
    setGameMissions(prev => 
      prev.map(mission => ({
        ...mission,
        isActive: mission.id === id
      }))
    );
  };

  // Función para eliminar una misión de juego
  const handleDeleteGameMission = (id: string) => {
    setGameMissions(prev => prev.filter(mission => mission.id !== id));
    if (selectedGameMission?.id === id) {
      setSelectedGameMission(null);
      setIsEditingGameMission(false);
    }
  };

  // Función para asignar una misión específica a un tile
  const assignMissionToTile = (
    gameMissionId: string, 
    planetId: string, 
    tileId: string, 
    missionId: string
  ) => {
    setGameMissions(prev => 
      prev.map(mission => {
        if (mission.id !== gameMissionId) return mission;
        
        return {
          ...mission,
          planets: mission.planets.map(planet => {
            if (planet.id !== planetId) return planet;
            
            return {
              ...planet,
              tiles: planet.tiles.map(tile => {
                if (tile.id !== tileId) return tile;
                
                return {
                  ...tile,
                  assignedMissionId: missionId
                };
              })
            };
          })
        };
      })
    );
  };

  // Función para agregar un planeta a una misión
  const addPlanetToMission = (gameMissionId: string, type: 'savings' | 'debt') => {
    const planetAssetId = type === 'savings' ? 'planet-savings' : 'planet-debt';
    const tileAssetId = type === 'savings' ? 'tile-savings' : 'tile-debt';
    
    const newPlanet = {
      id: `${type}-planet-${Date.now()}`,
      type,
      assetId: planetAssetId,
      x: type === 'savings' ? 35 : 65,
      y: 10,
      tiles: [
        { 
          id: `${type}-0-${Date.now()}`, 
          type: type, 
          assetId: tileAssetId, 
          x: type === 'savings' ? 35 : 65, 
          y: 65, 
          isLocked: false 
        }
      ]
    };
    
    setGameMissions(prev => 
      prev.map(mission => {
        if (mission.id !== gameMissionId) return mission;
        
        return {
          ...mission,
          planets: [...mission.planets, newPlanet]
        };
      })
    );
  };

  // Función para agregar un tile a un planeta
  const addTileToMission = (gameMissionId: string, planetId: string, type: 'savings' | 'debt' | 'mystery' | 'gift') => {
    setGameMissions(prev => 
      prev.map(mission => {
        if (mission.id !== gameMissionId) return mission;
        
        return {
          ...mission,
          planets: mission.planets.map(planet => {
            if (planet.id !== planetId) return planet;
            
            const tileAssetId = planet.type === 'savings' ? 'tile-savings' : 'tile-debt';
            const lastTile = planet.tiles[planet.tiles.length - 1];
            const newY = lastTile ? lastTile.y - 10 : 65;
            
            return {
              ...planet,
              tiles: [
                ...planet.tiles, 
                { 
                  id: `${planet.type}-${planet.tiles.length}-${Date.now()}`, 
                  type, 
                  assetId: tileAssetId, 
                  x: planet.x, 
                  y: newY, 
                  isLocked: true 
                }
              ]
            };
          })
        };
      })
    );
  };

  // Estado adicional para el gestor de assets
  const [filterType, setFilterType] = useState<Asset['type'] | ''>('');

  // Añadir el contenido de la sección de gestión de assets
  const renderAssetsManager = () => {
    if (activeSection !== 'levels') return null;
    
    // Eliminar estas líneas ya que movimos el estado fuera de la función
    // const [filterType, setFilterType] = useState<Asset['type'] | ''>('');
    
    // Agrupar assets por tipo para mostrarlos organizados
    const assetsByType: Record<Asset['type'], Asset[]> = {
      'background': assets.filter(a => a.type === 'background'),
      'tile': assets.filter(a => a.type === 'tile'),
      'character': assets.filter(a => a.type === 'character'),
      'planet': assets.filter(a => a.type === 'planet'),
      'item': assets.filter(a => a.type === 'item'),
      'other': assets.filter(a => a.type === 'other'),
    };
    
    // Función para renderizar un grupo de assets
    const renderAssetGroup = (type: Asset['type'], assetsOfType: Asset[]) => {
      if (filterType && filterType !== type) return null;
      
      const typeLabels: Record<Asset['type'], string> = {
        'background': 'Fondos',
        'tile': 'Tiles',
        'character': 'Personajes',
        'planet': 'Planetas',
        'item': 'Items',
        'other': 'Otros'
      };
      
      return (
        <div key={type} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">{typeLabels[type]} ({assetsOfType.length})</h4>
            <button 
              onClick={() => {
                setNewAsset({
                  name: `Nuevo ${typeLabels[type].slice(0, -1)}`,
                  type: type
                });
                setIsEditingAsset(false);
                setSelectedAsset(null);
                
                // Hacer scroll al formulario de subida
                const uploadForm = document.getElementById('asset-upload-form');
                if (uploadForm) uploadForm.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded-sm text-xs"
            >
              + Añadir {typeLabels[type].slice(0, -1)}
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {assetsOfType.map(asset => (
              <div 
                key={asset.id}
                className={`p-2 bg-gray-600 rounded cursor-pointer ${
                  selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsEditingAsset(true);
                  setNewAsset({
                    name: asset.name,
                    type: asset.type
                  });
                }}
              >
                <div className="aspect-square w-full bg-gray-800 rounded overflow-hidden mb-1">
                  {asset.url ? (
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="text-sm truncate">{asset.name}</div>
              </div>
            ))}
            
            {assetsOfType.length === 0 && (
              <div className="col-span-2 sm:col-span-3 p-3 text-center text-gray-400 bg-gray-700 rounded">
                No hay {typeLabels[type].toLowerCase()} disponibles. Añade uno usando el botón de arriba.
              </div>
            )}
          </div>
        </div>
      );
    };
    
    // Función para duplicar un asset
    const duplicateAsset = (asset: Asset) => {
      const duplicatedAsset: Asset = {
        ...asset,
        id: `${asset.type}-${Date.now()}`,
        name: `${asset.name} (copia)`
      };
      
      setAssets(prev => [...prev, duplicatedAsset]);
    };
    
    // Función para crear assets en lote
    const createBatchAssets = (type: Asset['type'], count: number) => {
      const newAssets: Asset[] = [];
      
      for (let i = 0; i < count; i++) {
        newAssets.push({
          id: `${type}-${Date.now()}-${i}`,
          name: `Nuevo ${type} ${i + 1}`,
          type: type,
          url: ''
        });
      }
      
      setAssets(prev => [...prev, ...newAssets]);
      alert(`Se han creado ${count} assets de tipo ${type}`);
    };
    
    return (
      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Gestión de Assets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lista de Assets */}
          <div className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assets Disponibles</h3>
              <select 
                className="bg-gray-600 p-1 rounded text-sm"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as Asset['type'] | '');
                }}
              >
                <option value="">Todos los tipos</option>
                <option value="background">Fondos</option>
                <option value="tile">Tiles</option>
                <option value="character">Personajes</option>
                <option value="planet">Planetas</option>
                <option value="item">Items</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm">Total: {assets.length} assets</div>
                {assets.length > 0 && (
                  <button 
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres descargar un JSON con todos los assets?')) {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assets, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", "assets.json");
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      }
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                  >
                    Exportar JSON
                  </button>
                )}
              </div>
              
              {/* Botón para crear varios assets a la vez */}
              <div className="p-3 bg-gray-600 rounded mb-4">
                <h4 className="text-sm font-medium mb-2">Crear múltiples assets</h4>
                <div className="flex space-x-2 mb-2">
                  <select 
                    className="flex-1 p-1 bg-gray-700 rounded text-sm"
                    defaultValue="tile"
                    id="batch-asset-type"
                  >
                    <option value="background">Fondos</option>
                    <option value="tile">Tiles</option>
                    <option value="character">Personajes</option>
                    <option value="planet">Planetas</option>
                    <option value="item">Items</option>
                    <option value="other">Otros</option>
                  </select>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    defaultValue="3"
                    className="w-16 p-1 bg-gray-700 rounded text-sm"
                    id="batch-asset-count"
                  />
                  <button 
                    onClick={() => {
                      const typeSelect = document.getElementById('batch-asset-type') as HTMLSelectElement;
                      const countInput = document.getElementById('batch-asset-count') as HTMLInputElement;
                      
                      const type = typeSelect.value as Asset['type'];
                      const count = parseInt(countInput.value) || 1;
                      
                      if (count > 0 && count <= 10) {
                        createBatchAssets(type, count);
                      }
                    }}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded-sm text-xs"
                  >
                    Crear
                  </button>
                </div>
                <p className="text-xs text-gray-400">Crea hasta 10 assets vacíos del mismo tipo a la vez</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {Object.entries(assetsByType).map(([type, assetsOfType]) => 
                renderAssetGroup(type as Asset['type'], assetsOfType)
              )}
            </div>
            
            {assets.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No hay assets disponibles. Añade uno usando el formulario de la derecha.
              </div>
            )}
          </div>
          
          {/* Formulario para subir nuevos assets */}
          <div id="asset-upload-form" className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <h3 className="text-lg font-semibold mb-4">
              {isEditingAsset && selectedAsset ? 'Editar Asset' : 'Subir Nuevo Asset'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input 
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full p-2 bg-gray-600 rounded text-white"
                  placeholder="Nombre del asset"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <select 
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({...newAsset, type: e.target.value as Asset['type']})}
                  className="w-full p-2 bg-gray-600 rounded text-white"
                >
                  <option value="background">Fondo</option>
                  <option value="tile">Tile</option>
                  <option value="character">Personaje</option>
                  <option value="planet">Planeta</option>
                  <option value="item">Item</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Archivos de Imagen (puedes seleccionar varios)</label>
                <div className="relative">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      
                      // Si es solo un archivo y estamos editando
                      if (files.length === 1 && isEditingAsset && selectedAsset) {
                        const file = files[0];
                        const previewUrl = URL.createObjectURL(file);
                        
                        const updatedAsset: Asset = {
                          ...selectedAsset,
                          name: newAsset.name,
                          type: newAsset.type,
                          previewUrl,
                          file
                        };
                        
                        // Actualizar el asset
                        handleUpdateAsset(updatedAsset);
                        
                        // Simular actualización de URL
                        setTimeout(() => {
                          setAssets(prev => 
                            prev.map(asset => 
                              asset.id === selectedAsset.id 
                                ? { ...asset, url: previewUrl } 
                                : asset
                            )
                          );
                        }, 1000);
                      } 
                      // Si son múltiples archivos o estamos creando nuevo
                      else {
                        // Procesar cada archivo
                        Array.from(files).forEach((file, index) => {
                          // Si es el primer archivo y estamos editando, actualiza el asset actual
                          if (index === 0 && isEditingAsset && selectedAsset) {
                            const previewUrl = URL.createObjectURL(file);
                            
                            const updatedAsset: Asset = {
                              ...selectedAsset,
                              name: newAsset.name,
                              type: newAsset.type,
                              previewUrl,
                              file
                            };
                            
                            handleUpdateAsset(updatedAsset);
                            
                            setTimeout(() => {
                              setAssets(prev => 
                                prev.map(asset => 
                                  asset.id === selectedAsset.id 
                                    ? { ...asset, url: previewUrl } 
                                    : asset
                                )
                              );
                            }, 1000);
                          } 
                          // Para los demás archivos o si no estamos editando, crea nuevos assets
                          else {
                            const fileName = file.name.split('.')[0];
                            handleFileUpload(file, newAsset.type);
                          }
                        });
                        
                        alert(`Se han procesado ${files.length} archivos`);
                      }
                      
                      // Limpiar el input de archivo para permitir subir los mismos archivos de nuevo
                      e.target.value = '';
                    }}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Formatos soportados: JPG, PNG, GIF, SVG
                  </div>
                </div>
              </div>
              
              {/* Vista previa */}
              {(selectedAsset?.url || selectedAsset?.previewUrl) && (
                <div>
                  <label className="block text-sm mb-1">Vista Previa</label>
                  <div className="aspect-square w-full bg-gray-800 rounded overflow-hidden">
                    <img 
                      src={selectedAsset?.previewUrl || selectedAsset?.url} 
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {isEditingAsset && selectedAsset ? (
                  <>
                    <button 
                      onClick={() => {
                        if (selectedAsset) {
                          const updatedAsset: Asset = {
                            ...selectedAsset,
                            name: newAsset.name,
                            type: newAsset.type
                          };
                          handleUpdateAsset(updatedAsset);
                        }
                      }}
                      className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      Actualizar
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsEditingAsset(false);
                        setSelectedAsset(null);
                        setNewAsset({
                          name: '',
                          type: 'background'
                        });
                      }}
                      className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded"
                    >
                      Cancelar
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (selectedAsset) {
                          duplicateAsset(selectedAsset);
                        }
                      }}
                      className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 rounded"
                    >
                      Duplicar
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (selectedAsset) {
                          if (window.confirm(`¿Estás seguro de que quieres eliminar el asset "${selectedAsset.name}"?`)) {
                            handleDeleteAsset(selectedAsset.id);
                          }
                        }
                      }}
                      className="flex-1 p-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        // Crear un nuevo asset vacío (sin archivo)
                        const newEmptyAsset: Asset = {
                          id: `${newAsset.type}-${Date.now()}`,
                          name: newAsset.name || `Nuevo ${newAsset.type}`,
                          type: newAsset.type,
                          url: ''
                        };
                        
                        setAssets(prev => [...prev, newEmptyAsset]);
                        setSelectedAsset(newEmptyAsset);
                        setIsEditingAsset(true);
                      }}
                      className="flex-1 p-2 bg-green-600 hover:bg-green-700 rounded"
                    >
                      Crear sin archivo
                    </button>
                    
                    <button
                      onClick={() => {
                        // Limpiar el formulario
                        setNewAsset({
                          name: '',
                          type: 'background'
                        });
                      }}
                      className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded"
                    >
                      Limpiar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel de vista previa y uso */}
          <div className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <h3 className="text-lg font-semibold mb-4">Uso de Assets</h3>
            
            {selectedAsset ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Asset Seleccionado</h4>
                  <div className="aspect-square max-w-xs mx-auto bg-gray-800 rounded overflow-hidden mb-2">
                    {selectedAsset.url ? (
                      <img 
                        src={selectedAsset.url} 
                        alt={selectedAsset.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="font-medium">{selectedAsset.name}</div>
                    <div className="text-sm text-gray-400">ID: {selectedAsset.id}</div>
                    <div className="text-sm text-gray-400">Tipo: {
                      selectedAsset.type === 'background' ? 'Fondo' :
                      selectedAsset.type === 'tile' ? 'Tile' :
                      selectedAsset.type === 'character' ? 'Personaje' :
                      selectedAsset.type === 'planet' ? 'Planeta' :
                      selectedAsset.type === 'item' ? 'Item' : 'Otro'
                    }</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Usado en:</h4>
                  <div className="p-3 bg-gray-600 rounded">
                    {gameMissions.some(mission => 
                      mission.backgroundAsset === selectedAsset.id || 
                      mission.characterAsset === selectedAsset.id || 
                      mission.planets.some(planet => 
                        planet.assetId === selectedAsset.id || 
                        planet.tiles.some(tile => tile.assetId === selectedAsset.id)
                      )
                    ) ? (
                      <ul className="list-disc list-inside">
                        {gameMissions.map(mission => {
                          const usages = [];
                          if (mission.backgroundAsset === selectedAsset.id) {
                            usages.push(`Como fondo en misión "${mission.name}"`);
                          }
                          if (mission.characterAsset === selectedAsset.id) {
                            usages.push(`Como personaje en misión "${mission.name}"`);
                          }
                          
                          mission.planets.forEach(planet => {
                            if (planet.assetId === selectedAsset.id) {
                              usages.push(`Como planeta ${planet.type} en misión "${mission.name}"`);
                            }
                            
                            planet.tiles.forEach(tile => {
                              if (tile.assetId === selectedAsset.id) {
                                usages.push(`Como tile ${tile.type} en misión "${mission.name}"`);
                              }
                            });
                          });
                          
                          return usages.map((usage, index) => (
                            <li key={`${mission.id}-${index}`} className="text-sm mb-1">{usage}</li>
                          ));
                        })}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-400">
                        Este asset no está siendo usado actualmente en ninguna misión.
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">URL para desarrollo:</h4>
                  <div className="bg-gray-800 p-2 rounded text-sm font-mono overflow-x-auto">
                    {selectedAsset.url || "URL no disponible hasta subir el archivo"}
                  </div>
                  {selectedAsset.url && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAsset.url);
                        alert('URL copiada al portapapeles');
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                    >
                      Copiar URL
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Selecciona un asset para ver sus detalles y uso</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Estado adicional para el gestor de misiones
  const [selectedMissionType, setSelectedMissionType] = useState<'classification' | 'quiz' | 'video'>('classification');
  const [newMissionData, setNewMissionData] = useState({
    title: '',
    description: '',
    type: 'classification' as 'classification' | 'quiz' | 'video',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });

  // Función para renderizar el gestor de actividades
  const renderMissionsManager = () => {
    if (activeSection !== 'missions') return null;
    
    return (
      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Gestión de Actividades</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lista de actividades */}
          <div className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Actividades Disponibles</h3>
              <select 
                className="bg-gray-600 p-1 rounded text-sm"
                onChange={(e) => {
                  const type = e.target.value as 'classification' | 'quiz' | 'video' | '';
                  if (type) {
                    setSelectedMissionType(type);
                  }
                }}
                value={selectedMissionType}
              >
                <option value="classification">Clasificación</option>
                <option value="quiz">Quiz</option>
                <option value="video">Video</option>
              </select>
            </div>
            
            <div className="mb-4">
              <button 
                onClick={() => {
                  // Crear nueva misión del tipo seleccionado
                  setNewMissionData({
                    title: `Nueva actividad de ${
                      selectedMissionType === 'classification' ? 'clasificación' : 
                      selectedMissionType === 'quiz' ? 'preguntas' : 'video'
                    }`,
                    description: 'Descripción de la actividad',
                    type: selectedMissionType,
                    difficulty: 'easy'
                  });
                  
                  handleAddMission(
                    selectedMissionType, 
                    'savings' // Por defecto asociamos a ahorros, puede cambiarse después
                  );
                }}
                className="w-full p-2 bg-green-600 hover:bg-green-700 rounded"
              >
                + Crear Nueva Actividad de {
                  selectedMissionType === 'classification' ? 'Clasificación' : 
                  selectedMissionType === 'quiz' ? 'Preguntas' : 'Video'
                }
              </button>
            </div>
            
            {/* Lista de misiones filtradas por tipo */}
            <div className="space-y-2">
              {missions
                .filter(mission => mission.type === selectedMissionType)
                .map(mission => (
                <div 
                  key={mission.id}
                  className={`p-3 bg-gray-600 rounded cursor-pointer ${
                    selectedMission?.id === mission.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-500'
                  }`}
                  onClick={() => setSelectedMission(mission)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{mission.title}</h4>
                      <div className="text-xs text-gray-400 mt-1">
                        {mission.type === 'classification' ? 'Clasificación' : 
                         mission.type === 'quiz' ? 'Quiz' : 'Video'}
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 text-xs rounded ${
                      mission.difficulty === 'easy' ? 'bg-green-700' : 
                      mission.difficulty === 'medium' ? 'bg-yellow-700' : 'bg-red-700'
                    }`}>
                      {mission.difficulty === 'easy' ? 'Fácil' : 
                       mission.difficulty === 'medium' ? 'Media' : 'Difícil'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{mission.description}</p>
                </div>
              ))}
              
              {missions.filter(mission => mission.type === selectedMissionType).length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No hay actividades de este tipo. Crea una nueva usando el botón de arriba.
                </div>
              )}
            </div>
          </div>
          
          {/* Editor de actividad */}
          <div className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <h3 className="text-lg font-semibold mb-4">
              {selectedMission ? 'Editar Actividad' : 'Selecciona o Crea una Actividad'}
            </h3>
            
            {selectedMission ? (
              <div className="space-y-4">
                {/* Configuración común para todos los tipos de misiones */}
                <div>
                  <label className="block text-sm mb-1">Título</label>
                  <input 
                    type="text"
                    value={selectedMission.title}
                    onChange={(e) => {
                      const updated = { ...selectedMission, title: e.target.value };
                      handleUpdateMission(updated);
                    }}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Descripción</label>
                  <textarea 
                    value={selectedMission.description}
                    onChange={(e) => {
                      const updated = { ...selectedMission, description: e.target.value };
                      handleUpdateMission(updated);
                    }}
                    className="w-full p-2 bg-gray-600 rounded text-white h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Dificultad</label>
                  <select 
                    value={selectedMission.difficulty}
                    onChange={(e) => {
                      const updated = { 
                        ...selectedMission, 
                        difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
                      };
                      handleUpdateMission(updated);
                    }}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Media</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                
                {/* Configuración específica según el tipo de misión */}
                {selectedMission.type === 'classification' && (
                  <>
                    <div className="border-t border-gray-600 pt-4 mt-4">
                      <h4 className="font-medium mb-2">Configuración de Clasificación</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Cantidad de Categorías</label>
                        <div className="flex space-x-2">
                          <input 
                            type="number" 
                            min="2" 
                            max="4"
                            value={(selectedMission as ClassificationMission).categories.length}
                            onChange={(e) => {
                              const count = parseInt(e.target.value) || 2;
                              // Limitar entre 2 y 4 categorías
                              const newCount = Math.min(Math.max(count, 2), 4);
                              
                              const mission = selectedMission as ClassificationMission;
                              let categories = [...mission.categories];
                              
                              // Ajustar la cantidad de categorías
                              if (categories.length < newCount) {
                                // Añadir categorías si faltan
                                for (let i = categories.length; i < newCount; i++) {
                                  categories.push({
                                    id: `cat-${Date.now()}-${i}`,
                                    name: `Categoría ${i + 1}`,
                                    description: 'Descripción de la categoría'
                                  });
                                }
                              } else if (categories.length > newCount) {
                                // Eliminar categorías si sobran
                                categories = categories.slice(0, newCount);
                              }
                              
                              const updated = { ...mission, categories };
                              handleUpdateMission(updated);
                            }}
                            className="w-16 p-2 bg-gray-600 rounded text-white"
                          />
                          <div className="flex-1 flex items-center">
                            <span className="text-sm text-gray-400">Mínimo 2, máximo 4</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Categorías</label>
                        <div className="space-y-2">
                          {(selectedMission as ClassificationMission).categories.map((category, index) => (
                            <div key={category.id} className="p-2 bg-gray-600 rounded">
                              <div className="mb-2">
                                <label className="block text-xs mb-1">Nombre</label>
                                <input 
                                  type="text"
                                  value={category.name}
                                  onChange={(e) => {
                                    const mission = selectedMission as ClassificationMission;
                                    const categories = [...mission.categories];
                                    categories[index] = {
                                      ...categories[index],
                                      name: e.target.value
                                    };
                                    
                                    const updated = { ...mission, categories };
                                    handleUpdateMission(updated);
                                  }}
                                  className="w-full p-1 bg-gray-500 rounded text-white text-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Items para Clasificar ({(selectedMission as ClassificationMission).items.length})</label>
                        <div className="mb-2">
                          <button 
                            onClick={() => {
                              const mission = selectedMission as ClassificationMission;
                              const items = [...mission.items];
                              items.push({
                                id: `item-${Date.now()}`,
                                name: `Item ${items.length + 1}`,
                                categoryId: mission.categories[0]?.id || '',
                                image: ''
                              });
                              
                              const updated = { ...mission, items };
                              handleUpdateMission(updated);
                            }}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                          >
                            + Añadir Item
                          </button>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {(selectedMission as ClassificationMission).items.map((item, index) => (
                            <div key={item.id} className="p-2 bg-gray-600 rounded flex">
                              <div className="flex-1">
                                <div className="mb-2">
                                  <label className="block text-xs mb-1">Nombre</label>
                                  <input 
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                      const mission = selectedMission as ClassificationMission;
                                      const items = [...mission.items];
                                      items[index] = {
                                        ...items[index],
                                        name: e.target.value
                                      };
                                      
                                      const updated = { ...mission, items };
                                      handleUpdateMission(updated);
                                    }}
                                    className="w-full p-1 bg-gray-500 rounded text-white text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs mb-1">Categoría</label>
                                  <select
                                    value={item.categoryId}
                                    onChange={(e) => {
                                      const mission = selectedMission as ClassificationMission;
                                      const items = [...mission.items];
                                      items[index] = {
                                        ...items[index],
                                        categoryId: e.target.value
                                      };
                                      
                                      const updated = { ...mission, items };
                                      handleUpdateMission(updated);
                                    }}
                                    className="w-full p-1 bg-gray-500 rounded text-white text-sm"
                                  >
                                    {(selectedMission as ClassificationMission).categories.map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => {
                                  const mission = selectedMission as ClassificationMission;
                                  const items = mission.items.filter((_, i) => i !== index);
                                  
                                  const updated = { ...mission, items };
                                  handleUpdateMission(updated);
                                }}
                                className="ml-2 px-2 bg-red-600 hover:bg-red-700 rounded self-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedMission.type === 'quiz' && (
                  <>
                    <div className="border-t border-gray-600 pt-4 mt-4">
                      <h4 className="font-medium mb-2">Configuración de Quiz</h4>
                      
                      <div className="mb-4">
                        <label className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={safeGetQuizTimed(selectedMission)}
                            onChange={(e) => {
                              // @ts-ignore - Using as unknown as technique to cast between incompatible types
                              const mission = selectedMission as unknown as QuizMission;
                              const updated = { 
                                ...mission, 
                                timed: e.target.checked,
                                timePerQuestion: e.target.checked ? safeGetQuizTimePerQuestion(selectedMission) : 0
                              };
                              handleUpdateMission(updated);
                            }}
                            className="mr-2"
                          />
                          <span>Quiz cronometrado</span>
                        </label>
                      </div>
                      
                      {safeGetQuizTimed(selectedMission) && (
                        <div className="mb-4">
                          <label className="block text-sm mb-1">Segundos por pregunta</label>
                          <input 
                            type="number"
                            min="10"
                            max="120"
                            value={safeGetQuizTimePerQuestion(selectedMission)}
                            onChange={(e) => {
                              const mission = safeConvertToMissionForm<QuizMission>(selectedMission);
                              const updated = { 
                                ...mission, 
                                timePerQuestion: parseInt(e.target.value) || 30
                              };
                              handleUpdateMission(updated);
                            }}
                            className="w-20 p-2 bg-gray-600 rounded text-white"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm mb-1">Preguntas ({(selectedMission as QuizMission).questions.length})</label>
                        <div className="mb-2">
                          <button 
                            onClick={() => {
                              const mission = safeConvertToMissionForm<QuizMission>(selectedMission);
                              const questions = [...mission.questions];
                              questions.push({
                                id: `question-${Date.now()}`,
                                text: `Pregunta ${questions.length + 1}`,
                                options: [
                                  { id: `option-${Date.now()}-1`, text: 'Opción 1', isCorrect: true },
                                  { id: `option-${Date.now()}-2`, text: 'Opción 2', isCorrect: false },
                                  { id: `option-${Date.now()}-3`, text: 'Opción 3', isCorrect: false },
                                  { id: `option-${Date.now()}-4`, text: 'Opción 4', isCorrect: false }
                                ]
                              });
                              
                              const updated = { ...mission, questions };
                              handleUpdateMission(updated);
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                          >
                            + Añadir Pregunta
                          </button>
                        </div>
                        
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          {(selectedMission as QuizMission).questions.map((question, qIndex) => (
                            <div key={question.id} className="p-3 bg-gray-600 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-sm">Pregunta {qIndex + 1}</h5>
                                <button 
                                  onClick={() => {
                                    const mission = safeConvertToMissionForm<QuizMission>(selectedMission);
                                    const questions = mission.questions.filter((_, i) => i !== qIndex);
                                    
                                    const updated = { ...mission, questions };
                                    handleUpdateMission(updated);
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-full text-xs"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs mb-1">Texto de la pregunta</label>
                                <input 
                                  type="text"
                                  value={question.text}
                                  onChange={(e) => {
                                    const mission = safeConvertToMissionForm<QuizMission>(selectedMission);
                                    const questions = [...mission.questions];
                                    questions[qIndex] = {
                                      ...questions[qIndex],
                                      text: e.target.value
                                    };
                                    
                                    const updated = { ...mission, questions };
                                    handleUpdateMission(updated);
                                  }}
                                  className="w-full p-1 bg-gray-500 rounded text-white text-sm"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs mb-1">Opciones</label>
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <div key={option.id} className="flex items-center">
                                      <input 
                                        type="radio"
                                        checked={option.isCorrect}
                                        onChange={() => {
                                          const mission = safeConvertToMissionForm<QuizMission>(selectedMission);
                                          const questions = [...mission.questions];
                                          
                                          // Actualizar cuál es la opción correcta
                                          const newOptions = questions[qIndex].options.map((opt, i) => ({
                                            ...opt,
                                            isCorrect: i === oIndex
                                          }));
                                          
                                          questions[qIndex] = {
                                            ...questions[qIndex],
                                            options: newOptions
                                          };
                                          
                                          const updated = { ...mission, questions };
                                          handleUpdateMission(updated);
                                        }}
                                        className="mr-2"
                                      />
                                      <input 
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => {
                                          const mission = selectedMission as QuizMission;
                                          const questions = [...mission.questions];
                                          const options = [...questions[qIndex].options];
                                          
                                          options[oIndex] = {
                                            ...options[oIndex],
                                            text: e.target.value
                                          };
                                          
                                          questions[qIndex] = {
                                            ...questions[qIndex],
                                            options
                                          };
                                          
                                          const updated = { ...mission, questions };
                                          handleUpdateMission(updated);
                                        }}
                                        className="flex-1 p-1 bg-gray-500 rounded text-white text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedMission.type === 'video' && (
                  <>
                    <div className="border-t border-gray-600 pt-4 mt-4">
                      <h4 className="font-medium mb-2">Configuración de Video</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm mb-1">URL del Video</label>
                        <input 
                          type="text"
                          value={safeGetVideoUrl(selectedMission)}
                          onChange={(e) => {
                            const mission = selectedMission as VideoMission;
                            const updated = { 
                              ...mission, 
                              videoUrl: e.target.value
                            };
                            handleUpdateMission(updated);
                          }}
                          placeholder="URL de YouTube o Vimeo"
                          className="w-full p-2 bg-gray-600 rounded text-white"
                        />
                        <p className="text-xs text-gray-400 mt-1">Ejemplo: https://www.youtube.com/watch?v=XXXXXXXXXXX</p>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm mb-1">Duración (segundos)</label>
                        <input 
                          type="number"
                          min="1"
                          value={safeGetVideoDuration(selectedMission)}
                          onChange={(e) => {
                            const mission = selectedMission as VideoMission;
                            const updated = { 
                              ...mission, 
                              duration: parseInt(e.target.value) || 0
                            };
                            handleUpdateMission(updated);
                          }}
                          className="w-20 p-2 bg-gray-600 rounded text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Preguntas Post-Video ({(selectedMission as VideoMission).questions.length})</label>
                        <div className="mb-2">
                          <button 
                            onClick={() => {
                              const mission = selectedMission as VideoMission;
                              const questions = [...mission.questions];
                              questions.push({
                                id: `video-question-${Date.now()}`,
                                text: `Pregunta ${questions.length + 1}`,
                                options: [
                                  { id: `v-option-${Date.now()}-1`, text: 'Opción 1', isCorrect: true },
                                  { id: `v-option-${Date.now()}-2`, text: 'Opción 2', isCorrect: false },
                                  { id: `v-option-${Date.now()}-3`, text: 'Opción 3', isCorrect: false }
                                ]
                              });
                              
                              const updated = { ...mission, questions };
                              handleUpdateMission(updated);
                            }}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                          >
                            + Añadir Pregunta
                          </button>
                        </div>
                        
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          {(selectedMission as VideoMission).questions.map((question, qIndex) => (
                            <div key={question.id} className="p-3 bg-gray-600 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-sm">Pregunta {qIndex + 1}</h5>
                                <button 
                                  onClick={() => {
                                    const mission = selectedMission as VideoMission;
                                    const questions = mission.questions.filter((_, i) => i !== qIndex);
                                    
                                    const updated = { ...mission, questions };
                                    handleUpdateMission(updated);
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-full text-xs"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              
                              <div className="mb-3">
                                <label className="block text-xs mb-1">Texto de la pregunta</label>
                                <input 
                                  type="text"
                                  value={question.text}
                                  onChange={(e) => {
                                    const mission = selectedMission as VideoMission;
                                    const questions = [...mission.questions];
                                    questions[qIndex] = {
                                      ...questions[qIndex],
                                      text: e.target.value
                                    };
                                    
                                    const updated = { ...mission, questions };
                                    handleUpdateMission(updated);
                                  }}
                                  className="w-full p-1 bg-gray-500 rounded text-white text-sm"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs mb-1">Opciones</label>
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <div key={option.id} className="flex items-center">
                                      <input 
                                        type="radio"
                                        checked={option.isCorrect}
                                        onChange={() => {
                                          const mission = selectedMission as VideoMission;
                                          const questions = [...mission.questions];
                                          
                                          // Actualizar cuál es la opción correcta
                                          const newOptions = questions[qIndex].options.map((opt, i) => ({
                                            ...opt,
                                            isCorrect: i === oIndex
                                          }));
                                          
                                          questions[qIndex] = {
                                            ...questions[qIndex],
                                            options: newOptions
                                          };
                                          
                                          const updated = { ...mission, questions };
                                          handleUpdateMission(updated);
                                        }}
                                        className="mr-2"
                                      />
                                      <input 
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => {
                                          const mission = selectedMission as VideoMission;
                                          const questions = [...mission.questions];
                                          const options = [...questions[qIndex].options];
                                          
                                          options[oIndex] = {
                                            ...options[oIndex],
                                            text: e.target.value
                                          };
                                          
                                          questions[qIndex] = {
                                            ...questions[qIndex],
                                            options
                                          };
                                          
                                          const updated = { ...mission, questions };
                                          handleUpdateMission(updated);
                                        }}
                                        className="flex-1 p-1 bg-gray-500 rounded text-white text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="border-t border-gray-600 pt-4 mt-4 flex justify-between">
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Estás seguro de que quieres eliminar la misión "${selectedMission.title}"?`)) {
                        handleDeleteMission(selectedMission.id);
                        setSelectedMission(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Eliminar
                  </button>
                  
                  <button
                    onClick={() => {
                      // Exportar la configuración de la misión como JSON
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedMission, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `mission-${selectedMission.id}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Exportar JSON
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-center">Selecciona una misión para editarla o crea una nueva desde el panel izquierdo</p>
              </div>
            )}
          </div>
          
          {/* Vista previa y configuración avanzada */}
          <div className="bg-gray-700 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <h3 className="text-lg font-semibold mb-4">Vista Previa de Actividad</h3>
            
            {selectedMission ? (
              <div className="space-y-4">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{selectedMission.title}</h4>
                    <div className={`px-2 py-0.5 text-xs rounded ${
                      selectedMission.difficulty === 'easy' ? 'bg-green-700' : 
                      selectedMission.difficulty === 'medium' ? 'bg-yellow-700' : 'bg-red-700'
                    }`}>
                      {selectedMission.difficulty === 'easy' ? 'Fácil' : 
                       selectedMission.difficulty === 'medium' ? 'Media' : 'Difícil'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">{selectedMission.description}</p>
                  
                  {/* Vista previa según el tipo de misión */}
                  {selectedMission.type === 'classification' && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Categorías:</h5>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {(selectedMission as ClassificationMission).categories.map(category => (
                          <div key={category.id} className="p-2 bg-gray-700 rounded text-center">
                            {category.name}
                          </div>
                        ))}
                      </div>
                      
                      <h5 className="text-sm font-medium mb-2">Items ({(selectedMission as ClassificationMission).items.length}):</h5>
                      <div className="flex flex-wrap gap-2">
                        {(selectedMission as ClassificationMission).items.map(item => {
                          const category = (selectedMission as ClassificationMission).categories.find(c => c.id === item.categoryId);
                          return (
                            <div key={item.id} className="p-2 bg-gray-700 rounded text-xs">
                              {item.name}
                              {category && (
                                <span className="ml-1 text-gray-400">({category.name})</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {selectedMission.type === 'quiz' && (
                    <div>
                      {safeGetQuizTimed(selectedMission) && (
                        <div className="mb-4 text-sm">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Quiz cronometrado: {safeGetQuizTimePerQuestion(selectedMission)} segundos por pregunta
                        </div>
                      )}
                      
                      <h5 className="text-sm font-medium mb-2">Preguntas ({(selectedMission as QuizMission).questions.length}):</h5>
                      
                      {(selectedMission as QuizMission).questions.length > 0 && (
                        <div className="p-3 bg-gray-700 rounded">
                          <h6 className="font-medium text-sm mb-2">Ejemplo: {(selectedMission as QuizMission).questions[0].text}</h6>
                          <div className="space-y-2">
                            {(selectedMission as QuizMission).questions[0].options.map(option => (
                              <div
                                key={option.id}
                                className={`p-2 rounded text-sm ${
                                  option.isCorrect ? 'bg-green-600' : 'bg-gray-600'
                                }`}
                              >
                                {option.text} {option.isCorrect && '✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedMission.type === 'video' && (
                    <div>
                      <div className="mb-4">
                        <div className="aspect-w-16 aspect-h-9 bg-black mb-2 rounded overflow-hidden">
                          {(selectedMission as VideoMissionData).videoUrl ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              Sin URL de video
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          URL: {(selectedMission as VideoMissionData).videoUrl || "No especificada"}
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium mb-2">Preguntas post-video ({(selectedMission as VideoMission).questions.length}):</h5>
                      
                      {(selectedMission as VideoMission).questions.length > 0 && (
                        <div className="p-3 bg-gray-700 rounded">
                          <h6 className="font-medium text-sm mb-2">Ejemplo: {(selectedMission as VideoMission).questions[0].text}</h6>
                          <div className="space-y-2">
                            {(selectedMission as VideoMission).questions[0].options.map((option, index) => (
                              <div
                                key={option.id}
                                className={`p-2 rounded text-sm ${
                                  option.isCorrect ? 'bg-green-600' : 'bg-gray-600'
                                }`}
                              >
                                {option.text} {option.isCorrect && '✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 border-t border-gray-600 pt-4">
                  <h4 className="font-medium mb-3">Asignación de la Actividad</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Tipo de casilla recomendado</label>
                      <select 
                        className="w-full p-2 bg-gray-600 rounded text-white"
                        value={selectedMission.tileType || 'savings'}
                        onChange={(e) => {
                          const updated = { 
                            ...selectedMission, 
                            tileType: e.target.value as 'savings' | 'debt' | 'mystery' | 'gift' | 'investment'
                          };
                          handleUpdateMission(updated);
                        }}
                      >
                        <option value="savings">Ahorro</option>
                        <option value="debt">Deuda</option>
                        <option value="mystery">Misterio</option>
                        <option value="gift">Regalo</option>
                        <option value="investment">Inversión</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Tipo de casilla recomendado para esta actividad</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Asignada a casillas</label>
                      <div className="p-3 bg-gray-600 rounded">
                        {gameMissions.some(mission => 
                          mission.planets.some(planet => 
                            planet.tiles.some(tile => tile.assignedMissionId === selectedMission.id)
                          )
                        ) ? (
                          <ul className="list-disc list-inside">
                            {gameMissions.map(mission => {
                              const assignedTiles: { planetId: string, tileId: string, tileName: string }[] = [];
                              
                              mission.planets.forEach(planet => {
                                planet.tiles.forEach(tile => {
                                  if (tile.assignedMissionId === selectedMission.id) {
                                    assignedTiles.push({
                                      planetId: planet.id,
                                      tileId: tile.id,
                                      tileName: `Tile ${tile.type} en planeta ${planet.type} de misión "${mission.name}"`
                                    });
                                  }
                                });
                              });
                              
                              return assignedTiles.map(({ tileId, tileName }) => (
                                <li key={tileId} className="text-sm mb-1">{tileName}</li>
                              ));
                            })}
                          </ul>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Esta actividad no está asignada a ninguna casilla.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p>Selecciona una actividad para ver su vista previa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración YuhuHero</h1>
        
        <div className="mb-6 p-3 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold mb-2">Estructura Jerárquica</h2>
          <div className="flex items-center justify-center">
            <div className="bg-blue-600 px-3 py-1 rounded">Misión</div>
            <div className="mx-2">→</div>
            <div className="bg-green-600 px-3 py-1 rounded">Planetas</div>
            <div className="mx-2">→</div>
            <div className="bg-yellow-600 px-3 py-1 rounded">Tiles</div>
            <div className="mx-2">→</div>
            <div className="bg-purple-600 px-3 py-1 rounded">Actividades</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Panel de Misiones */}
          <div className="bg-gray-800 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Misiones</h2>
              <button 
                onClick={handleAddGameMission}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
              >
                Nueva Misión
              </button>
            </div>
            
            <div className="space-y-3">
              {gameMissions.map(mission => (
                <div 
                  key={mission.id}
                  className={`p-3 rounded cursor-pointer ${
                    selectedGameMission?.id === mission.id ? 'bg-blue-800' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedGameMission(mission);
                    setSelectedPlanet(null);
                    setSelectedGameTile(null);
                    setIsEditingGameMission(true);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{mission.name}</div>
                      <div className="text-sm text-gray-300">
                        {mission.planets.length} planetas, 
                        {mission.planets.reduce((sum, planet) => sum + planet.tiles.length, 0)} tiles
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {mission.isActive ? (
                        <span className="px-2 py-0.5 bg-green-600 rounded-sm text-xs">Activa</span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            activateGameMission(mission.id);
                          }}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                        >
                          Activar
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGameMission(mission.id);
                        }}
                        className="px-2 py-0.5 bg-red-600 hover:bg-red-700 rounded-sm text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {gameMissions.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No hay misiones creadas. Crea tu primera misión haciendo clic en el botón "Nueva Misión".
                </div>
              )}
            </div>
          </div>
          
          {/* Panel de Planetas y Configuración de Misión */}
          <div className="bg-gray-800 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {isEditingGameMission && selectedGameMission ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Misión: {selectedGameMission.name}</h2>
                  <button 
                    onClick={() => {
                      setIsEditingGameMission(false);
                      setSelectedGameMission(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Nombre de la Misión</label>
                    <input 
                      type="text"
                      value={selectedGameMission.name}
                      onChange={(e) => {
                        const updated = { ...selectedGameMission, name: e.target.value };
                        handleUpdateGameMission(updated);
                      }}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Descripción</label>
                    <textarea 
                      value={selectedGameMission.description}
                      onChange={(e) => {
                        const updated = { ...selectedGameMission, description: e.target.value };
                        handleUpdateGameMission(updated);
                      }}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Fondo</label>
                    <select 
                      value={selectedGameMission.backgroundAsset}
                      onChange={(e) => {
                        const updated = { ...selectedGameMission, backgroundAsset: e.target.value };
                        handleUpdateGameMission(updated);
                      }}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    >
                      <option value="">Seleccionar fondo</option>
                      {assets.filter(a => a.type === 'background').map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Personaje</label>
                    <select 
                      value={selectedGameMission.characterAsset}
                      onChange={(e) => {
                        const updated = { ...selectedGameMission, characterAsset: e.target.value };
                        handleUpdateGameMission(updated);
                      }}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    >
                      <option value="">Seleccionar personaje</option>
                      {assets.filter(a => a.type === 'character').map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Planetas</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => addPlanetToMission(selectedGameMission.id, 'savings')}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded-sm text-xs"
                      >
                        + Ahorro
                      </button>
                      <button 
                        onClick={() => addPlanetToMission(selectedGameMission.id, 'debt')}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded-sm text-xs"
                      >
                        + Deuda
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedGameMission.planets.map(planet => (
                      <div 
                        key={planet.id}
                        className={`p-3 rounded cursor-pointer ${
                          selectedPlanet?.id === planet.id ? 'bg-green-800' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => {
                          setSelectedPlanet(planet);
                          setSelectedGameTile(null);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              Planeta {planet.type === 'savings' ? 'Ahorro' : 'Deuda'}
                            </div>
                            <div className="text-sm text-gray-300">
                              {planet.tiles.length} tiles
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-300">
                              X: {planet.x}, Y: {planet.y}
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedMission = { ...selectedGameMission };
                                updatedMission.planets = updatedMission.planets.filter(p => p.id !== planet.id);
                                handleUpdateGameMission(updatedMission);
                                if (selectedPlanet?.id === planet.id) {
                                  setSelectedPlanet(null);
                                }
                              }}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded-sm text-xs"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {selectedGameMission.planets.length === 0 && (
                      <div className="p-4 text-center text-gray-400">
                        No hay planetas en esta misión. Añade un planeta de Ahorro o Deuda.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-center">Selecciona una misión para ver sus detalles y planetas</p>
              </div>
            )}
          </div>
          
          {/* Panel de Tiles y Actividades */}
          <div className="bg-gray-800 p-4 rounded overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {selectedPlanet ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    Planeta {selectedPlanet.type === 'savings' ? 'Ahorro' : 'Deuda'}
                  </h2>
                  <button 
                    onClick={() => {
                      setSelectedPlanet(null);
                      setSelectedGameTile(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Posición X (%)</label>
                      <input 
                        type="number" 
                        value={selectedPlanet.x} 
                        onChange={(e) => {
                          if (selectedGameMission && selectedPlanet) {
                            const updated = { ...selectedGameMission };
                            if (updated.planets) {
                              const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                              if (planetIndex >= 0) {
                                updated.planets[planetIndex].x = parseInt(e.target.value) || 0;
                                handleUpdateGameMission(updated);
                              }
                            }
                          }
                        }}
                        className="w-full p-2 bg-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Posición Y (%)</label>
                      <input 
                        type="number" 
                        value={selectedPlanet.y} 
                        onChange={(e) => {
                          if (selectedGameMission && selectedPlanet) {
                            const updated = { ...selectedGameMission };
                            if (updated.planets) {
                              const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                              if (planetIndex >= 0) {
                                updated.planets[planetIndex].y = parseInt(e.target.value) || 0;
                                handleUpdateGameMission(updated);
                              }
                            }
                          }
                        }}
                        className="w-full p-2 bg-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Asset del Planeta</label>
                    <select 
                      value={selectedPlanet.assetId} 
                      onChange={(e) => {
                        if (selectedGameMission && selectedPlanet) {
                          const updated = { ...selectedGameMission };
                          if (updated.planets) {
                            const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                            if (planetIndex >= 0) {
                              updated.planets[planetIndex].assetId = e.target.value;
                              handleUpdateGameMission(updated);
                            }
                          }
                        }
                      }}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    >
                      <option value="">Seleccionar asset</option>
                      {assets.filter(a => a.type === 'planet').map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Tiles</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          if (selectedGameMission && selectedPlanet) {
                            addTileToMission(
                              selectedGameMission.id, 
                              selectedPlanet.id, 
                              selectedPlanet.type === 'savings' ? 'savings' : 'debt'
                            );
                          }
                        }}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs"
                      >
                        + Normal
                      </button>
                      <button 
                        onClick={() => {
                          if (selectedGameMission && selectedPlanet) {
                            addTileToMission(
                              selectedGameMission.id, 
                              selectedPlanet.id, 
                              'mystery'
                            );
                          }
                        }}
                        className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-sm text-xs"
                      >
                        + Misterio
                      </button>
                      <button 
                        onClick={() => {
                          if (selectedGameMission && selectedPlanet) {
                            addTileToMission(
                              selectedGameMission.id, 
                              selectedPlanet.id, 
                              'gift'
                            );
                          }
                        }}
                        className="px-2 py-1 bg-pink-600 hover:bg-pink-700 rounded-sm text-xs"
                      >
                        + Regalo
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedPlanet.tiles.map(tile => (
                      <div 
                        key={tile.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedGameTile?.id === tile.id ? 'bg-yellow-800' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedGameTile(tile)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${
                              tile.type === 'savings' ? 'bg-green-500' : 
                              tile.type === 'debt' ? 'bg-purple-500' : 
                              tile.type === 'mystery' ? 'bg-yellow-500' : 
                              'bg-pink-500'
                            }`}></div>
                            <div>
                              <div className="font-medium">
                                Tile: {
                                  tile.type === 'savings' ? 'Ahorro' : 
                                  tile.type === 'debt' ? 'Deuda' : 
                                  tile.type === 'mystery' ? 'Misterio' : 
                                  'Regalo'
                                }
                              </div>
                              {tile.assignedMissionId && (
                                <div className="text-xs text-green-400">Con actividad asignada</div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-300">
                            X: {tile.x}, Y: {tile.y}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {selectedPlanet.tiles.length === 0 && (
                      <div className="p-4 text-center text-gray-400">
                        No hay tiles en este planeta. Añade un tile usando los botones de arriba.
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedGameTile && (
                  <div className="mt-6 p-3 bg-gray-700 rounded">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Editar Tile</h4>
                      <button 
                        onClick={() => setSelectedGameTile(null)}
                        className="p-1 rounded-full hover:bg-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">Posición X (%)</label>
                          <input 
                            type="number" 
                            value={selectedGameTile.x} 
                            onChange={(e) => {
                              if (selectedGameMission && selectedPlanet && selectedGameTile) {
                                const updated = { ...selectedGameMission };
                                if (updated.planets) {
                                  const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                                  if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                    const tileIndex = updated.planets[planetIndex].tiles.findIndex(t => t.id === selectedGameTile.id);
                                    if (tileIndex >= 0) {
                                      updated.planets[planetIndex].tiles[tileIndex].x = parseInt(e.target.value) || 0;
                                      handleUpdateGameMission(updated);
                                    }
                                  }
                                }
                              }
                            }}
                            className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Posición Y (%)</label>
                          <input 
                            type="number" 
                            value={selectedGameTile.y} 
                            onChange={(e) => {
                              if (selectedGameMission && selectedPlanet && selectedGameTile) {
                                const updated = { ...selectedGameMission };
                                if (updated.planets) {
                                  const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                                  if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                    const tileIndex = updated.planets[planetIndex].tiles.findIndex(t => t.id === selectedGameTile.id);
                                    if (tileIndex >= 0) {
                                      updated.planets[planetIndex].tiles[tileIndex].y = parseInt(e.target.value) || 0;
                                      handleUpdateGameMission(updated);
                                    }
                                  }
                                }
                              }
                            }}
                            className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1">Tipo de Tile</label>
                        <select 
                          value={selectedGameTile.type} 
                          onChange={(e) => {
                            if (selectedGameMission && selectedPlanet && selectedGameTile) {
                              const updated = { ...selectedGameMission };
                              if (updated.planets) {
                                const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                                if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                  const tileIndex = updated.planets[planetIndex].tiles.findIndex(t => t.id === selectedGameTile.id);
                                  if (tileIndex >= 0) {
                                    updated.planets[planetIndex].tiles[tileIndex].type = e.target.value as any;
                                    handleUpdateGameMission(updated);
                                  }
                                }
                              }
                            }
                          }}
                          className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                        >
                          <option value={selectedPlanet.type}>{selectedPlanet.type === 'savings' ? 'Ahorro' : 'Deuda'}</option>
                          <option value="mystery">Misterio</option>
                          <option value="gift">Regalo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-xs">
                          <input 
                            type="checkbox" 
                            checked={selectedGameTile.isLocked} 
                            onChange={(e) => {
                              if (selectedGameMission && selectedPlanet && selectedGameTile) {
                                const updated = { ...selectedGameMission };
                                if (updated.planets) {
                                  const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                                  if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                    const tileIndex = updated.planets[planetIndex].tiles.findIndex(t => t.id === selectedGameTile.id);
                                    if (tileIndex >= 0) {
                                      updated.planets[planetIndex].tiles[tileIndex].isLocked = e.target.checked;
                                      handleUpdateGameMission(updated);
                                    }
                                  }
                                }
                              }
                            }}
                            className="mr-2"
                          />
                          <span>Bloqueado</span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1">Asignar Actividad</label>
                        <select 
                          value={selectedGameTile.assignedMissionId || ''} 
                          onChange={(e) => {
                            if (selectedGameMission && selectedPlanet && selectedGameTile) {
                              const updated = { ...selectedGameMission };
                              if (updated.planets) {
                                const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                                if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                  const tileIndex = updated.planets[planetIndex].tiles.findIndex(t => t.id === selectedGameTile.id);
                                  if (tileIndex >= 0) {
                                    updated.planets[planetIndex].tiles[tileIndex].assignedMissionId = e.target.value || undefined;
                                    handleUpdateGameMission(updated);
                                  }
                                }
                              }
                            }
                          }}
                          className="w-full p-1 bg-gray-600 rounded text-white text-sm"
                        >
                          <option value="">Sin actividad</option>
                          {missions.map(mission => (
                            <option key={mission.id} value={mission.id}>
                              {mission.title} ({mission.type === 'classification' ? 'Clasif.' : 
                                            mission.type === 'quiz' ? 'Quiz' : 'Video'})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (selectedGameMission && selectedPlanet && selectedGameTile) {
                            const updated = { ...selectedGameMission };
                            if (updated.planets) {
                              const planetIndex = updated.planets.findIndex(p => p.id === selectedPlanet.id);
                              if (planetIndex >= 0 && updated.planets[planetIndex].tiles) {
                                updated.planets[planetIndex].tiles = updated.planets[planetIndex].tiles.filter(
                                  t => t.id !== selectedGameTile.id
                                );
                                handleUpdateGameMission(updated);
                                setSelectedGameTile(null);
                              }
                            }
                          }
                        }}
                        className="w-full p-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Eliminar Tile
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-center">Selecciona un planeta para gestionar sus tiles</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Vista previa de la misión */}
        {selectedGameMission && (
          <div className="mt-6 bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-semibold mb-3">Vista Previa de la Misión</h3>
            
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded overflow-hidden">
              <div className="relative w-full h-full">
                {/* Fondo */}
                {selectedGameMission.backgroundAsset && (
                  <div className="absolute inset-0">
                    <img 
                      src={assets.find(a => a.id === selectedGameMission.backgroundAsset)?.url || ''} 
                      alt="Fondo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Planetas */}
                {selectedGameMission.planets.map(planet => {
                  const planetAsset = assets.find(a => a.id === planet.assetId);
                  
                  return (
                    <div key={planet.id}>
                      {/* Planeta */}
                      <div 
                        className={`absolute ${selectedPlanet?.id === planet.id ? 'ring-2 ring-white' : ''}`}
                        style={{
                          left: `${planet.x}%`,
                          top: `${planet.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '80px',
                          height: '80px'
                        }}
                      >
                        {planetAsset ? (
                          <img 
                            src={planetAsset.url} 
                            alt={planet.type}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className={`w-full h-full rounded-full ${planet.type === 'savings' ? 'bg-green-500' : 'bg-purple-500'}`}>
                            <div className="flex items-center justify-center h-full text-white font-bold">
                              {planet.type === 'savings' ? 'Ahorro' : 'Deudas'}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Tiles del planeta */}
                      {planet.tiles.map(tile => {
                        const tileAsset = assets.find(a => a.id === tile.assetId);
                        
                        return (
                          <div 
                            key={tile.id}
                            className={`absolute transition-all duration-300 transform hover:scale-110 ${selectedGameTile?.id === tile.id ? 'ring-2 ring-yellow-400 scale-110' : ''}`}
                            style={{
                              left: `${tile.x}%`,
                              top: `${tile.y}%`,
                              transform: 'translate(-50%, -50%)',
                              width: '40px',
                              height: '40px'
                            }}
                          >
                            {tileAsset ? (
                              <img 
                                src={tileAsset.url} 
                                alt={tile.type}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className={`w-full h-full rounded-full ${
                                tile.type === 'savings' ? 'bg-green-400' : 
                                tile.type === 'debt' ? 'bg-purple-400' : 
                                tile.type === 'mystery' ? 'bg-yellow-400' : 'bg-pink-400'
                              }`}>
                                {tile.assignedMissionId && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Líneas de camino */}
                      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                        {planet.tiles.length > 0 && (
                          <path 
                            d={`M ${planet.tiles[0].x}% ${planet.tiles[0].y}% ${planet.tiles.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')} L ${planet.x}% ${planet.y}%`} 
                            stroke={planet.type === 'savings' ? '#4ADE80' : '#8B5CF6'} 
                            strokeWidth="3" 
                            strokeDasharray="5,5" 
                            fill="none" 
                          />
                        )}
                      </svg>
                    </div>
                  );
                })}
                
                {/* Personaje */}
                {selectedGameMission.characterAsset && (
                  <div 
                    className="absolute"
                    style={{
                      left: '50%',
                      bottom: '10%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <img 
                      src={assets.find(a => a.id === selectedGameMission.characterAsset)?.url || ''} 
                      alt="Personaje"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  const missionConfig = JSON.stringify(selectedGameMission, null, 2);
                  copyToClipboard(missionConfig);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Copiar Configuración JSON
              </button>
            </div>
          </div>
        )}
        
        {/* Panel de Gestión de Actividades */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              if (activeSection !== 'missions') {
                setActiveSection('missions');
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
          >
            Gestionar Actividades
          </button>
          
          <button
            onClick={() => {
              if (activeSection !== 'levels') {
                setActiveSection('levels');
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Gestionar Assets
          </button>
        </div>

        {/* Renderizar el gestor de assets cuando se selecciona esa sección */}
        {renderAssetsManager()}
        
        {/* Renderizar el gestor de actividades cuando se selecciona esa sección */}
        {renderMissionsManager()}
      </div>
    </div>
  );
};

export default AdminPanel; 