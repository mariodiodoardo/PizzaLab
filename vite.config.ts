import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['favicon.svg'],manifest:{name:'PizzaLab - Pizza Dough Calculator',short_name:'PizzaLab',description:'Your personal pizza dough calculator',theme_color:'#171c18',background_color:'#f8f7f2',display:'standalone',start_url:'/',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,png,ico}']}})]});
