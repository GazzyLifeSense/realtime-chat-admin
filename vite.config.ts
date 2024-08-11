import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd());
	return {
		base: "./",
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			}
		},
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: 8082,
			open: true,
			cors: true,
			
			// 跨域代理配置
			proxy: {
				"/api" : {
					target: "https://0.0.0.0:3000",   //需要跨域的目标url ,我这里是自己本地起的一个服务端口
					changeOrigin: true,           // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
					secure:false,
					rewrite: (path) => path.replace(/^\/api/, ""),
				}
			}
		},
		plugins: [
			vue()
		]
	}
});
