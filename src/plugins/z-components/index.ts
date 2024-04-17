import ZTable from "@/components/z-table.vue";
import FixI18n from "@/components/fix-i18n.vue";
import ZEmpty from "@/components/z-empty.vue";
import ZPagination from "@/components/z-pagination.vue";
import ZLoading from "@/components/z-loading.vue";
import ZCard from "@/components/desktop/z-card.vue";
import VueRippler from "@/library/vue-rippler";
import ZRecaptcha from "@/components/z-recaptcha.vue";
import Vue from "vue";

Vue.use(VueRippler);
Vue.component("fix-i18n", FixI18n);
Vue.component("z-empty", ZEmpty);
Vue.component("z-loading", ZLoading);
Vue.component("z-table", ZTable);
Vue.component("z-pagination", ZPagination);
Vue.component("z-card", ZCard);
Vue.component("z-recaptcha", ZRecaptcha);

