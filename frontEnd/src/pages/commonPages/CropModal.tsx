import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../common/GetCroppedImg';

type CropModalProps = {
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  onClose: () => void;
};

const CropModal = ({ imageSrc, onCropComplete, onClose }: CropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Store the cropped area when it changes
  const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Generate cropped image only when "Save" is clicked
  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error('Cropping failed', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="relative h-64 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={handleCropComplete}
            classes={{ containerClassName: 'rounded-lg' }}
          />
        </div>
        
        {/* ... (keep existing controls for zoom/rotation) */}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave} // Updated to use handleSave
            className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700"
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;