import React, { useCallback } from 'react';
import { Presentation } from '@neetos/pixie-pptx';

function Canvas() {
  const pptx = new Presentation();

  const onPptxDataReady = useCallback((err) => {
    if (err) {
      console.error(err);

      return;
    }

    const masterSlide = pptx.getSlideMaster('slideMaster1');
    const slide = pptx.getSlide('slide1');
    const slidePics = slide.getPictures();
    const [pic] = slidePics;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      console.log('img', img);
      document.body.prepend(img);
    };

    if (pic) {
      reader.readAsDataURL(new Blob([pic.getDataUrl()]));
    }
  }, [pptx]);

  const onSelectedFileChanged = useCallback(({
    target: {
      files = [],
    },
  }) => {
    if (!window) {
      return;
    }

    const [file] = files;
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      pptx.load(e.target.result, onPptxDataReady);
    };

    fileReader.readAsArrayBuffer(file);
  }, [pptx]);

  return (
    <div>
      <input type="file" onChange={onSelectedFileChanged} />
    </div>
  );
}

export default Canvas;
