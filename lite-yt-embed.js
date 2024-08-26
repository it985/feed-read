/**
 * A lightweight YouTube embed that initializes and paints quickly.
 * Based on various inspirations including:
 * - https://storage.googleapis.com/amp-vs-non-amp/youtube-lazy.html
 * - https://autoplay-youtube-player.glitch.me/
 * - https://github.com/ampproject/amphtml/blob/master/extensions/amp-youtube
 * - https://github.com/Daugilas/lazyYT
 * - https://github.com/vb/lazyframe
 */
class LiteYTEmbed extends HTMLElement {
  connectedCallback() {
    this.videoId = this.getAttribute("videoid") || this.extractVideoId();
    this.playLabel = this.getPlayLabel();

    if (!this.style.backgroundImage) {
      this.posterUrl = `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
      LiteYTEmbed.addPrefetch("preload", this.posterUrl, "image");
      this.style.backgroundImage = `url("${this.posterUrl}")`;
    }

    if (!this.querySelector(".lty-playbtn")) {
      this.createPlayButton();
    }

    this.addEventListener("pointerover", LiteYTEmbed.warmConnections, { once: true });
    this.addEventListener("click", () => this.addIframe());
  }

  extractVideoId() {
    const watchUrl = this.getAttribute("watchUrl");
    return watchUrl ? watchUrl.split("watch?v=")[1] : "";
  }

  getPlayLabel() {
    const playBtnEl = this.querySelector(".lty-playbtn");
    return (playBtnEl && playBtnEl.textContent.trim()) || this.getAttribute("playlabel") || "Play";
  }

  createPlayButton() {
    const playBtnEl = document.createElement("button");
    playBtnEl.type = "button";
    playBtnEl.classList.add("lty-playbtn");

    const playBtnLabelEl = document.createElement("span");
    playBtnLabelEl.className = "lyt-visually-hidden";
    playBtnLabelEl.textContent = this.playLabel;
    playBtnEl.append(playBtnLabelEl);

    this.append(playBtnEl);
  }

  static addPrefetch(kind, url, as) {
    const linkEl = document.createElement("link");
    linkEl.rel = kind;
    linkEl.href = url;
    if (as) linkEl.as = as;
    document.head.append(linkEl);
  }

  static warmConnections() {
    if (LiteYTEmbed.preconnected) return;

    LiteYTEmbed.addPrefetch("preconnect", "https://www.youtube-nocookie.com");
    LiteYTEmbed.addPrefetch("preconnect", "https://www.google.com");
    LiteYTEmbed.addPrefetch("preconnect", "https://googleads.g.doubleclick.net");
    LiteYTEmbed.addPrefetch("preconnect", "https://static.doubleclick.net");

    LiteYTEmbed.preconnected = true;
  }

  addIframe() {
    const params = new URLSearchParams(this.getAttribute("params") || []);
    params.append("autoplay", "1");

    const iframeEl = document.createElement("iframe");
    iframeEl.width = 560;
    iframeEl.height = 315;
    iframeEl.title = this.playLabel;
    iframeEl.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframeEl.allowFullscreen = true;
    iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${params.toString()}`;
    
    this.append(iframeEl);
    this.classList.add("lyt-activated");
    iframeEl.focus();
  }
}

customElements.define("lite-youtube", LiteYTEmbed);