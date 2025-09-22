import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: any) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: any) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  }, []);

  const processFiles = (newFiles: any) => {
    const validFiles = newFiles.filter((file: any) => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      return validTypes.includes(file.type);
    });

    const processedFiles = validFiles.map((file: any) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...processedFiles]);
    
    // Simulate upload process
    processedFiles.forEach((fileObj: any) => {
      simulateUpload(fileObj);
    });
  };

  const simulateUpload = (fileObj: any) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileObj.id) {
          const newProgress = Math.min(f.progress + Math.random() * 30, 100);
          const newStatus = newProgress >= 100 ? 'completed' : 'uploading';
          return { ...f, progress: newProgress, status: newStatus };
        }
        return f;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, progress: 100, status: 'completed' } : f
      ));
    }, 3000);
  };

  const removeFile = (fileId: any) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: any) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Arrastra archivos aquí</p>
        <p className="text-gray-600 mb-4">o haz clic para seleccionar</p>
        <p className="text-sm text-gray-500">Soporta: PDF, Excel (.xlsx, .xls)</p>
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.xlsx,.xls"
          multiple
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar Archivos
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileObj: FileObject) => (
            <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center flex-1">
                <File className={`h-8 w-8 mr-3 ${
                  fileObj.status === 'completed' ? 'text-green-600' : 
                  fileObj.status === 'error' ? 'text-red-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{fileObj.name}</span>
                    <span className="text-xs text-gray-500">{formatFileSize(fileObj.size)}</span>
                  </div>
                  {fileObj.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileObj.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{Math.round(fileObj.progress)}%</span>
                    </div>
                  )}
                  {fileObj.status === 'completed' && (
                    <div className="flex items-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">Completado</span>
                    </div>
                  )}
                  {fileObj.status === 'error' && (
                    <div className="flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-xs text-red-600">Error al subir</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeFile(fileObj.id)}
                className="ml-3 p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;