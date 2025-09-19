declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  }
  
  export {};

// global.d.ts
export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onaudioend?: (this: SpeechRecognition, ev: Event) => any;
    onaudiostart?: (this: SpeechRecognition, ev: Event) => any;
    onend?: (this: SpeechRecognition, ev: Event) => any;
    onerror?: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
    onnomatch?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    onresult?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    onsoundend?: (this: SpeechRecognition, ev: Event) => any;
    onsoundstart?: (this: SpeechRecognition, ev: Event) => any;
    onspeechend?: (this: SpeechRecognition, ev: Event) => any;
    onspeechstart?: (this: SpeechRecognition, ev: Event) => any;
    onstart?: (this: SpeechRecognition, ev: Event) => any;
  }
  
  interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
  }
  
  declare var SpeechRecognition: SpeechRecognitionStatic;
  declare var webkitSpeechRecognition: SpeechRecognitionStatic;
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  