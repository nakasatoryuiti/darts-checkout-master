// vite.config.ts (修正案)
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// loadEnvの呼び出しは残しつつ、baseを明示的に設定
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      // 🚨 baseを直書きすることで、確実にパスを設定 🚨
      base: '/darts-checkout-master/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // ... その他の設定は省略
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});