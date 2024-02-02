import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/animations/scale.css";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/animations/scale-extreme.css";

export default defineNuxtPlugin({
  name: "tippy",
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.vueApp.use(
      VueTippy,
      // optional
      {
        directive: "tippy",
        component: "tippy",
        componentSingleton: "tippy-singleton",
        defaultProps: {
          placement: "auto-end",
          allowHTML: true,
        },
      },
    );
  },
});
