import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus'
// uni.prototype.$request = request;
console.log(uni.prototype);
export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus)
	return {
		app,
	};
}
