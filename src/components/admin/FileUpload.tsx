import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImageIcon, Loader } from 'lucide-react';
import { adminUploadImage } from '../../lib/api.ts';
import { useToast } from '../../lib/toast.tsx';

interface FileUploadProps {
  value: string;
  onUpload: (url: string) => void;
  showInput?: boolean;
}

export default function FileUpload({ value, onUpload, showInput }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminUploadImage(file);
      onUpload(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao enviar imagem');
    }
    setUploading(false);
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className={showInput ? 'space-y-2' : ''}>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : value
              ? 'border-slate-200 bg-slate-50/50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader className="w-8 h-8 text-slate-400 animate-spin" />
        ) : value ? (
          <img src={value} alt="" className="max-w-full max-h-32 object-contain rounded-lg" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
        )}
        <div className="mt-3 text-center">
          <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'A enviar...' : isDragActive ? 'Largue a imagem aqui' : value ? 'Clique ou arraste para trocar' : 'Clique ou arraste a imagem'}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WebP, GIF · Máx. 5MB</p>
        </div>
      </div>
      {showInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onUpload(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
