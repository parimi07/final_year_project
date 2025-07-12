import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.stl')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">STL File Upload</h3>
      </div>
      
      {selectedFile ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400" />
              <div>
                <div className="text-white font-medium">{selectedFile.name}</div>
                <div className="text-gray-400 text-sm">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>
          
          <label className="block">
            <span className="sr-only">Choose different file</span>
            <input
              type="file"
              accept=".stl"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer text-center">
              Choose Different File
            </div>
          </label>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-2">
            Drag and drop your STL file here, or click to select
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Supports .stl files only
          </p>
          
          <label className="inline-block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept=".stl"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors cursor-pointer">
              Select File
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUpload;