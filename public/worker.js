import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';

let asr, loaded;

self.onmessage = async ({ data: { audio, model, language } }) => {
  try {
    if (!asr || loaded !== model) {
      const gpu = !!(await navigator.gpu?.requestAdapter());
      asr = await pipeline('automatic-speech-recognition', model, {
        device: gpu ? 'webgpu' : 'wasm',
        dtype: gpu ? { encoder_model: 'fp32', decoder_model_merged: 'q4' } : 'q8',
        progress_callback: p => p.status === 'progress' && self.postMessage({ type: 'download', file: p.file, progress: p.progress }),
      });
      loaded = model;
    }
    self.postMessage({ type: 'transcribing' });
    const out = await asr(audio, {
      return_timestamps: true, chunk_length_s: 30, stride_length_s: 5,
      ...(language ? { language, task: 'transcribe' } : {}),
    });
    self.postMessage({ type: 'done', chunks: out.chunks });
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message || String(e) });
  }
};
