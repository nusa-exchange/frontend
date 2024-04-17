import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export class ConfirmationMixin extends Vue {
  loading_resend = false;
  confirmation_code = "";
  cooldown = 0;
  cooldown_interval: NodeJS.Timeout;

  start_cooldown() {
    this["sended"] = false;
    this.cooldown = 60;

    this.cooldown_interval = setInterval(() => {
      this.cooldown--;
    }, 1000);
  }

  @Watch("cooldown")
  onCoolDownChanged(cooldown: number) {
    if (cooldown <= 0) {
      this["sended"] = false;
      clearInterval(this.cooldown_interval);
      this.cooldown = 0;
    }
  }
}
