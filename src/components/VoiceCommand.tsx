import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";

const VoiceCommand = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textCommand, setTextCommand] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<any>(null);

  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any>([]);
  const streamRef = useRef<any>(null);
  const textareaRef = useRef(null);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  // Iniciar grabación (cuando presiona el botón)
  const startRecording = async () => {
    try {
      // Resetear estado
      setResult("");
      audioChunksRef.current = [];
      setAudioBlob(null);

      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Crear MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus", // Formato compatible
      });

      mediaRecorderRef.current = mediaRecorder;

      // Guardar chunks de audio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Cuando termina la grabación
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);

        // Enviar automáticamente al backend
        sendAudioToBackend(audioBlob);

        // Detener stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track: any) => track.stop());
          streamRef.current = null;
        }
      };

      // Iniciar grabación
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      setResult(
        "Error: No se pudo acceder al micrófono. Verifica los permisos."
      );
    }
  };

  // Detener grabación (cuando suelta el botón)
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Enviar audio al backend
  const sendAudioToBackend = async (audioBlob: any) => {
    setIsProcessing(true);
    setResult("Procesando audio...");

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append("audio", audioBlob, "command.webm");
      formData.append("language", "es-ES");

      // Enviar al backend
      const response = await fetch("http://localhost:8000/api/voice-command", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(
          data.result || data.transcription || "Audio procesado correctamente"
        );

        // Si el backend devolvió la transcripción, mostrarla en el textarea
        if (data.transcription) {
          setTextCommand(data.transcription);
        }
      } else {
        const errorData = await response.json();
        setResult(
          `Error: ${errorData.detail || "No se pudo procesar el audio"}`
        );
      }
    } catch (error) {
      console.error("Error al enviar audio:", error);
      setResult("Error: No se pudo conectar con el servidor");
    } finally {
      setIsProcessing(false);
    }
  };

  // Procesar comando de texto
  const processTextCommand = async (command: any) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setResult("Procesando comando...");

    try {
      const response = await fetch("http://localhost:8000/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: command.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result || "Comando procesado correctamente");
      } else {
        const errorData = await response.json();
        setResult(
          `Error: ${errorData.detail || "No se pudo procesar el comando"}`
        );
      }
    } catch (error) {
      console.error("Error processing command:", error);
      setResult("Error: No se pudo conectar con el servidor");
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    processTextCommand(textCommand);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processTextCommand(textCommand);
    }
  };

  // Handlers para mantener presionado
  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  const handleTouchStart = (e: any) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e: any) => {
    e.preventDefault();
    stopRecording();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-dark-700 p-8">
        {/* Voice Button */}
        <div className="flex justify-center mb-8 sm:hidden">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            //onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            disabled={isProcessing}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 border-2 select-none ${
              isRecording
                ? "bg-neon-red-500 border-neon-red-400 shadow-glow-red animate-pulse-neon"
                : "bg-neon-blue-500 hover:bg-neon-blue-400 border-neon-blue-400 shadow-glow-blue hover:shadow-glow-blue hover:scale-105"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isRecording ? (
              <MicOff className="h-12 w-12 text-white drop-shadow-lg" />
            ) : (
              <Mic className="h-12 w-12 text-white drop-shadow-lg" />
            )}

            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-neon-red-300 animate-ping"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-neon-red-400 font-medium animate-pulse">
                    Grabando...
                  </span>
                </div>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-dark-300 mb-2 font-medium sm:hidden">
          {isRecording
            ? "🎤 Grabando... Suelta para enviar"
            : isProcessing
              ? "⏳ Procesando..."
              : "🎙️ Mantén presionado para grabar"}
        </p>

        <p className="text-center text-xs text-gray-500 dark:text-dark-400 mb-6 sm:hidden">
          O escribe tu comando abajo
        </p>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="grid sm:grid-cols-3 grid-cols-1 sm:gap-4 sm:mb-4">
              <div className="col-span-1 mb-4 sm:mb-0">
                <label className="text-center text-gray-500 dark:text-dark-400">
                  Orden
                </label>
                <input type="number" className="w-full p-4 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400" />
              </div>
              <div className="col-span-2 mb-4 sm:mb-0">
                <label className="text-center text-gray-500 dark:text-dark-400">
                  Item
                </label>
                <input className="w-full p-4 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400" />
              </div>
            </div>
            {/*<textarea
              ref={textareaRef}
              value={textCommand}
              onChange={(e) => setTextCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu comando aquí... ej: 'Agregar 5 baterías al taller de Medellín'"
              className="w-full p-4 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neon-blue-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-dark-400"
              rows={3}
              disabled={isProcessing || isRecording}
            />*/}
            <button
              type="submit"
              disabled={!textCommand.trim() || isProcessing || isRecording}
              className="bottom-3 right-3 p-2 bg-neon-blue-500 hover:bg-neon-blue-400 text-white rounded-lg hover:shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-neon-blue-400 w-full"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <p className="flex items-center justify-center w-full">
                  <Send className="h-5 w-5" /> Enviar
                </p>
              )}
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-lg border transition-all duration-300 ${
              result.includes("Error") || result.includes("error")
                ? "bg-neon-red-500/10 border-neon-red-400/30 text-neon-red-400 shadow-glow-red/20"
                : isProcessing
                  ? "bg-neon-blue-500/10 border-neon-blue-400/30 text-neon-blue-400 shadow-glow-blue/20"
                  : "bg-neon-green-500/10 border-neon-green-400/30 text-neon-green-400 shadow-glow-green/20"
            }`}
          >
            <div className="flex items-center">
              {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              <p className="font-medium">{result}</p>
            </div>
          </div>
        )}

        {/* Audio Preview (opcional)
        {audioBlob && !isProcessing && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-dark-400 mb-2">Audio grabado:</p>
            <audio 
              controls 
              src={URL.createObjectURL(audioBlob)}
              className="w-full h-8"
            />
          </div>
        )}*/}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-3">
          <button
            onClick={() => setTextCommand("Consultar stock de baterías")}
            disabled={isRecording || isProcessing}
            className="p-3 text-sm bg-gray-100 dark:bg-dark-700 hover:bg-neon-purple-500/10 dark:hover:bg-neon-purple-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-purple-400 hover:border-neon-purple-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-purple/20 disabled:opacity-50"
          >
            📦 Ver Stock
          </button>
          <button
            onClick={() =>
              setTextCommand("Agregar 1 rueda al taller principal")
            }
            disabled={isRecording || isProcessing}
            className="p-3 text-sm bg-gray-100 dark:bg-dark-700 hover:bg-neon-green-500/10 dark:hover:bg-neon-green-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-green-400 hover:border-neon-green-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-green/20 disabled:opacity-50"
          >
            ➕ Agregar Item
          </button>
          <button
            onClick={() => setTextCommand("Mover 2 controladores a técnico")}
            disabled={isRecording || isProcessing}
            className="p-3 text-sm bg-gray-100 dark:bg-dark-700 hover:bg-neon-yellow-500/10 dark:hover:bg-neon-yellow-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-yellow-400 hover:border-neon-yellow-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-yellow/20 disabled:opacity-50"
          >
            🔄 Mover Items
          </button>
          <button
            onClick={() => setTextCommand("Notificar cliente en espera")}
            disabled={isRecording || isProcessing}
            className="p-3 text-sm bg-gray-100 dark:bg-dark-700 hover:bg-neon-pink-500/10 dark:hover:bg-neon-pink-500/20 text-gray-700 dark:text-dark-300 hover:text-neon-pink-400 hover:border-neon-pink-400/30 rounded-lg transition-all duration-300 border border-transparent hover:shadow-glow-pink/20 disabled:opacity-50"
          >
            🔔 Notificar
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-dark-700/50 rounded-lg border border-blue-200 dark:border-dark-600">
          <p className="text-xs text-gray-600 dark:text-dark-400 text-center">
            💡 <strong>Tip:</strong> Mantén presionado el botón del micrófono
            mientras hablas. El audio se enviará automáticamente cuando lo
            sueltes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommand;
