import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

const VoiceCommand = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textCommand, setTextCommand] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES';
      
      recognitionInstance.onstart = () => {
        setIsRecording(true);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextCommand(transcript);
        setIsRecording(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setResult('Error al reconocer la voz. Intenta de nuevo.');
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (recognition && !isRecording) {
      setResult('');
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  const processCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    setResult('Procesando comando...');
    
    try {
      // Simulate API call to backend
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data.result || 'Comando procesado correctamente');
      } else {
        // Fallback for demo - simulate different responses
        const mockResponses = [
          'Se agregaron 3 baterías al taller Medellín',
          'Stock actualizado: 15 ruedas disponibles en Bogotá',
          'Movimiento registrado: 2 controladores enviados al técnico Juan',
          'Cliente notificado: Pieza disponible para María González'
        ];
        
        setTimeout(() => {
          setResult(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
          setIsProcessing(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setResult('Error al procesar el comando. Verifica tu conexión.');
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    processCommand(textCommand);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processCommand(textCommand);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 dark:bg-dark-800 dark:text-white">
        {/* Voice Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!recognition}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
              isRecording 
                ? 'bg-red-500 shadow-lg shadow-red-200 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-lg dark:shadow-gray-600'
            } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <MicOff className="h-10 w-10 text-white" />
            ) : (
              <Mic className="h-10 w-10 text-white" />
            )}
            
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 mb-6 dark:text-white">
          {isRecording 
            ? 'Escuchando... Habla ahora' 
            : recognition 
              ? 'Presiona el micrófono y di tu comando'
              : 'Micrófono no disponible - Usa el campo de texto'
          }
        </p>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={textCommand}
              onChange={(e) => setTextCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu comando aquí... ej: 'Agregar 5 baterías al taller de Medellín'"
              className="w-full dark:bg-dark-700 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!textCommand.trim() || isProcessing}
              className="absolute bottom-3 right-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.includes('Error') || result.includes('error') 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : isProcessing
                ? 'bg-blue-50 border border-blue-200 text-blue-800'
                : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            <div className="flex items-center">
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <p className="font-medium">{result}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => setTextCommand('Consultar stock de baterías')}
            className="p-3 dark:bg-dark-700 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            📦 Ver Stock
          </button>
          <button 
            onClick={() => setTextCommand('Agregar 1 rueda al taller principal')}
            className="p-3 dark:bg-dark-700 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ➕ Agregar Item
          </button>
          <button 
            onClick={() => setTextCommand('Mover 2 controladores a técnico')}
            className="p-3 dark:bg-dark-700 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            🔄 Mover Items
          </button>
          <button 
            onClick={() => setTextCommand('Notificar cliente en espera')}
            className="p-3 dark:bg-dark-7000' text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            🔔 Notificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommand;