

// Extender Window (importante hacerlo DESPUÉS de declarar SpeechRecognition)
declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        abort(): void;
        onstart?: (this: SpeechRecognition, ev: Event) => any;
        onresult?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
        onerror?: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
        onend?: (this: SpeechRecognition, ev: Event) => any;
    }

    // Constructor
    interface SpeechRecognitionStatic {
        new(): SpeechRecognition;
    }

    // Variables globales
    declare var SpeechRecognition: SpeechRecognitionStatic;
    declare var webkitSpeechRecognition: SpeechRecognitionStatic;

    // Eventos
    interface SpeechRecognitionEvent extends Event {
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
        message: string;
    }

    interface ItemInventory {
        id: number;
        category: string;
        location: string;
        name: string;
        quantity: number;
        minStock: number;
    }
}

// Esto obliga a TS a cargar el archivo como módulo
export { };


