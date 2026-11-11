import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Info, ChefHat, Sparkles, Utensils } from 'lucide-react';

// FASE 0: CATALOG DE RECEPTES I INGREDIENTS
const RECEPTES = [
  {
    id: 'sandvitx',
    nom: 'Sandvitx de Formatge i Pernill',
    icona: '🥪',
    ingredientsCorrectes: ['pa_motlle', 'formatge', 'pernill'],
    passosLlogica: ['obre', 'formatge', 'pernill', 'tanca', 'serveix']
  },
  {
    id: 'tortilla',
    nom: 'Tortilla Francesa',
    icona: '🍳',
    ingredientsCorrectes: ['ous', 'oli', 'sal'],
    passosLlogica: ['casca', 'batre', 'afig_sal', 'aboca', 'cuina', 'serveix']
  },
  {
    id: 'bocadell',
    nom: 'Bocadell de Sobrassada i Formatge',
    icona: '🥖',
    ingredientsCorrectes: ['pa_barra', 'sobrassada', 'formatge'],
    passosLlogica: ['talla_pa', 'unta', 'formatge', 'tanca', 'serveix']
  },
  {
    id: 'amanida',
    nom: 'Amanida Fresca',
    icona: '🥗',
    ingredientsCorrectes: ['enciam', 'tomaca', 'oli', 'sal', 'vinagre'],
    passosLlogica: ['talla_enciam', 'talla_tomaca', 'afig_oli', 'afig_sal', 'afig_vinagre', 'remena', 'serveix']
  }
];

const TOTS_INGREDIENTS = [
  { id: 'pa_motlle', nom: 'Pa de motlle' },
  { id: 'pa_barra', nom: 'Pa de barra' },
  { id: 'formatge', nom: 'Formatge' },
  { id: 'pernill', nom: 'Pernill dolç' },
  { id: 'sobrassada', nom: 'Sobrassada' },
  { id: 'ous', nom: 'Ous' },
  { id: 'oli', nom: 'Oli d\'oliva' },
  { id: 'sal', nom: 'Sal' },
  { id: 'vinagre', nom: 'Vinagre' },
  { id: 'enciam', nom: 'Enciam' },
  { id: 'tomaca', nom: 'Tomaca' },
  { id: 'xocolata', nom: 'Xocolata (Tractor)' },
  { id: 'mantega', nom: 'Mantega' }
];

const VERBS_VALIDIS = {
  imperatiu: ['agafa', 'agafeu', 'col·loca', 'col·loqueu', 'doblega', 'doblegueu', 'obre', 'obriu', 'posa', 'poseu', 'tanca', 'tanqueu', 'talla', 'talleu', 'casca', 'casqueu', 'bat', 'bateu', 'batre', 'aboca', 'aboqueu', 'unta', 'unteu', 'afig', 'afigeu', 'remena', 'remeneu', 'serveix', 'serviu', 'cuina', 'cuineu'],
  perifrasi: ['cal', "s'ha de", 'heu de']
};

export default function RobotCuiner() {
  const [fase, setFase] = useState('menu'); // 'menu' | 'ingredients' | 'cuina'
  const [receptaSeleccionada, setReceptaSeleccionada] = useState(null);
  const [ingredientsTriats, setIngredientsTriats] = useState([]);
  const [errorIngredients, setErrorIngredients] = useState('');
  
  // Estat del progrés de la cuina
  const [pasActual, setPasActual] = useState(0);
  const [textComanda, setTextComanda] = useState('');
  const [missatgeRobot, setMissatgeRobot] = useState('');
  const [tipusAlert, setTipusAlert] = useState('info');
  const [historial, setHistorial] = useState([]);

  // Seleccionar Recepta (Fase 0)
  const seleccionarRecepta = (rec) => {
    setReceptaSeleccionada(rec);
    setFase('ingredients');
    setMissatgeRobot(`Has triat: ${rec.nom}. Ara tria els ingredients necessaris!`);
    setTipusAlert('info');
  };

  // Seleccionar Ingredients (Fase 1)
  const toggleIngredient = (id) => {
    if (ingredientsTriats.includes(id)) {
      setIngredientsTriats(ingredientsTriats.filter(item => item !== id));
    } else {
      setIngredientsTriats([...ingredientsTriats, id]);
    }
  };

  const validarIngredients = () => {
    const correctes = receptaSeleccionada.ingredientsCorrectes;
    const teTotsElsNecessaris = correctes.every(ing => ingredientsTriats.includes(ing));
    const teSobraInnecessaris = ingredientsTriats.some(ing => !correctes.includes(ing));

    if (teTotsElsNecessaris && !teSobraInnecessaris) {
      setErrorIngredients('');
      setFase('cuina');
      setMissatgeRobot(`Molt bé! Ingredients preparats per a fer: ${receptaSeleccionada.nom}. Dona'm la primera ordre!`);
      setTipusAlert('success');
    } else if (!teTotsElsNecessaris) {
      setErrorIngredients('Et falten ingredients bàsics per a aquesta recepta!');
    } else {
      setErrorIngredients('Has seleccionat ingredients que no corresponen a aquesta recepta!');
    }
  };

  // Processar Ordre Gramatical (Fase 2)
  const processarOrdre = (e) => {
    e.preventDefault();
    const text = textComanda.trim().toLowerCase();
    if (!text) return;

    // 1. Detecció d'infinitiu directe (Error gramatical)
    const paraules = text.split(' ');
    const primeraParaula = paraules[0];
    const verbsInfinitiu = ['agafar', 'col·locar', 'doblegar', 'obrir', 'posar', 'tancar', 'tallar', 'cascar', 'batre', 'abocar', 'untar', 'afegir', 'remenar', 'servir', 'cuinar'];

    if (verbsInfinitiu.includes(primeraParaula)) {
      setTipusAlert('error');
      setMissatgeRobot(`❌ ERROR DE SINTAXI: Has usat l'infinitiu "${primeraParaula}". En un text instructiu cal usar l'Imperatiu (ex: "Posa") o una Perífrasi (ex: "Cal posar").`);
      return;
    }

    // 2. Detecció d'estructures correctes
    const esImperatiu = VERBS_VALIDIS.imperatiu.some(v => text.startsWith(v));
    const esPerifrasi = VERBS_VALIDIS.perifrasi.some(p => text.startsWith(p));

    if (!esImperatiu && !esPerifrasi) {
      setTipusAlert('error');
      setMissatgeRobot('❌ ESTRUCTURA NO RECONEGUDA: Comença la frase amb un verb d\'acció adequat (ex: "Obre...", "Posa...", "Cal afegir...").');
      return;
    }

    // 3. Validació de la lògica de la recepta pas a pas
    const nomPas = receptaSeleccionada.passosLlogica[pasActual];
    let exit = false;
    let resposta = '';

    // Coincidència segons la paraula clau de la comanda
    if (text.includes(nomPas) || (nomPas === 'formatge' && text.includes('formatge')) || (nomPas === 'tanca' && text.includes('tanc')) || (nomPas === 'serveix' && text.includes('serv'))) {
      exit = true;
      resposta = `✅ Pas ${pasActual + 1} completat amb èxit!`;
      if (pasActual + 1 === receptaSeleccionada.passosLlogica.length) {
        resposta = `🎉 RECEPTA COMPLETADA! Has elaborat ${receptaSeleccionada.nom} perfectament!`;
      }
      setPasActual(pasActual + 1);
    } else {
      resposta = `❌ ACCIÓ INCORRECTA: Aquesta no és l'acció que toca ara. Revisa la seqüència lògica del procediment!`;
    }

    setTipusAlert(exit ? 'success' : 'error');
    setMissatgeRobot(resposta);
    setHistorial([...historial, { ordre: textComanda, resultat: resposta, correcte: exit }]);
    setTextComanda('');
  };

  const reiniciar = () => {
    setFase('menu');
    setReceptaSeleccionada(null);
    setIngredientsTriats([]);
    setPasActual(0);
    setHistorial([]);
    setMissatgeRobot('');
    setTipusAlert('info');
    setErrorIngredients('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      <header className="flex justify-between items-center bg-indigo-700 text-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-3">
          <ChefHat className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">El Robot Cuiner: Les Receptes Pas a Pas</h1>
            <p className="text-xs text-indigo-200">Pràctica de Textos Instructius i Normatius</p>
          </div>
        </div>
        <button onClick={reiniciar} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-xs px-3 py-2 rounded-lg transition">
          <RotateCcw className="w-4 h-4" /> Tornar al Menú
        </button>
      </header>

      {/* FASE 0: SELECCIÓ DE RECEPTA */}
      {fase === 'menu' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-indigo-600" /> Tria la recepta que vols preparar:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECEPTES.map(rec => (
              <button
                key={rec.id}
                onClick={() => seleccionarRecepta(rec)}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition text-left flex items-center gap-4 group"
              >
                <span className="text-4xl">{rec.icona}</span>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">{rec.nom}</h3>
                  <p className="text-xs text-slate-500">Comença l'activitat amb aquesta recepta</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FASE 1: SELECCIÓ D'INGREDIENTS */}
      {fase === 'ingredients' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" /> Text Normatiu: Ingredients per a {receptaSeleccionada.nom}
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Selecciona de la llista <strong>únicament</strong> els ingredients que es necessiten per a preparar aquesta recepta:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {TOTS_INGREDIENTS.map(item => {
              const selected = ingredientsTriats.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleIngredient(item.id)}
                  className={`p-3 rounded-xl border text-left flex justify-between items-center transition ${
                    selected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">{item.nom}</span>
                  {selected && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>

          {errorIngredients && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              {errorIngredients}
            </div>
          )}

          <button
            onClick={validarIngredients}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 text-sm"
          >
            <Sparkles className="w-5 h-5" /> Confirmar Ingredients i Començar
          </button>
        </div>
      )}

      {/* FASE 2: TEXT INSTRUCTIU */}
      {fase === 'cuina' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border shadow-sm ${
              tipusAlert === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
              tipusAlert === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
              'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-bold text-sm mb-1">Recepta: {receptaSeleccionada.nom}</h3>
                  <p className="text-sm leading-relaxed">{missatgeRobot}</p>
                </div>
              </div>
            </div>

            <form onSubmit={processarOrdre} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-2">
              <input
                type="text"
                value={textComanda}
                onChange={(e) => setTextComanda(e.target.value)}
                placeholder="Escriu l'ordre (ex: Obre..., Posa..., Cal afegir...)..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                <Play className="w-4 h-4" /> Enviar
              </button>
            </form>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 mb-2">💡 Guia gramatical per a l'alumnat:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong className="text-emerald-700">Imperatiu:</strong> Obre, Posa, Talla, Casca, Bat, Unta, Afig, Serveix.</li>
                <li><strong className="text-emerald-700">Perífrasis:</strong> Cal obrir, S'ha de posar, Heu de batre.</li>
                <li><strong className="text-red-600">Evita l'infinitiu:</strong> <s>Obrir</s>, <s>Posar</s>, <s>Tallar</s>.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Historial d'ordres executades</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {historial.map((h, i) => (
                  <div key={i} className={`p-2 rounded-lg text-xs ${h.correcte ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
                    <strong>&gt; {h.ordre}</strong>
                    <p className="mt-1">{h.resultat}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-center text-xs text-slate-400">
              Progrés de la recepta: {pasActual} / {receptaSeleccionada.passosLlogica.length} passos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
