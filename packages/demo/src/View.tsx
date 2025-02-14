import { useEffect, useRef, useState } from 'preact/hooks';
import { becomeWaifu } from 'become-waifu';
import { useAtom } from 'jotai';
import { droppedFilesAtom } from './state';

export function View() {
  const outputRef = useRef<HTMLVideoElement>(null);
  const [color, setColor] = useState('gray');
  const [droppedFiles] = useAtom(droppedFilesAtom);

  useEffect(() => {
    (async () => {
      if (outputRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const waifu = await becomeWaifu({
          modelSource:
            droppedFiles ??
            // 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json',
            '/live2d/hiyori/hiyori_pro_t10.model3.json',
          videoMediaTrack: stream.getVideoTracks()[0],
          onFaceStatusUpdated(faceStatus) {
            if (faceStatus === 'health') {
              setColor('green');
            } else if (faceStatus === 'lose') {
              setColor('yellow');
            } else {
              setColor('gray');
            }
          },
          showStats: true,
        });

        outputRef.current.srcObject = new MediaStream([
          waifu.getOutputVideoTrack(),
        ]);
        outputRef.current.autoplay = true;
      }
    })();
  }, []);

  return (
    <>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid grey',
        }}
      />
      <video ref={outputRef} />
    </>
  );
}
