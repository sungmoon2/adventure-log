import { useState } from 'react';

interface QuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: QuickSaveData) => void;
}

interface QuickSaveData {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  status: 'draft' | 'complete';
}

export function QuickSaveModal({ isOpen, onClose, onSave }: QuickSaveModalProps) {
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState<Partial<QuickSaveData>>({});

  if (!isOpen) return null;

  const validateURL = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const extractMetadata = async (urlString: string) => {
    setIsExtracting(true);
    setError('');

    try {
      // Simulate metadata extraction
      // In real implementation, call backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMetadata({
        title: 'Extracted Title',
        description: 'Extracted Description',
        thumbnail: 'https://example.com/thumb.jpg',
      });
    } catch (err) {
      // If extraction fails, save with URL only
      setMetadata({});
    } finally {
      setIsExtracting(false);
    }
  };

  const handleURLChange = (value: string) => {
    setUrl(value);
    setError('');

    if (value && validateURL(value)) {
      extractMetadata(value);
    }
  };

  const handleSave = () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    if (!validateURL(url)) {
      setError('Invalid URL format');
      return;
    }

    const saveData: QuickSaveData = {
      url,
      ...metadata,
      status: 'draft',
    };

    onSave?.(saveData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Quick Save</h2>

        <div className="mb-4">
          <label htmlFor="url-input" className="block text-sm font-medium mb-2">
            URL
          </label>
          <input
            id="url-input"
            type="text"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => handleURLChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {isExtracting && (
          <div className="mb-4 text-sm text-gray-600">
            Extracting metadata...
          </div>
        )}

        {metadata.title && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="font-medium">{metadata.title}</h3>
            {metadata.description && (
              <p className="text-sm text-gray-600 mt-1">{metadata.description}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isExtracting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
