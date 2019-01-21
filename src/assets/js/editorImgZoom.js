export default {
  imgClientWidth: '',
  imgClientHeight: '',
  imgUrl: '',
  zoom() {
    document.querySelector('#wangeditor-layer>img').setAttribute('src', this.imgUrl);
    const _h = document.documentElement.clientHeight;
    const _w = document.documentElement.clientWidth;
    const h = this.imgClientHeight;
    const w = this.imgClientWidth;
    const img = document.querySelector('#wangeditor-layer>img');
    if ((_h / _w) <= (h / w)) {
      // 高100%
      img.style.marginLeft = '0';
      document.querySelector('#wangeditor-layer>img').style.height = '100%';
      document.querySelector('#wangeditor-layer>img').style.marginTop = '0';
      document.querySelector('#wangeditor-layer>img').style.width = 100 * w * _h / h / _w + '%';
      document.querySelector('#wangeditor-layer>img').style.marginLeft = (100 - 100 * w * _h / h / _w) / 2 + '%';
    } else {
      // 宽100%
      img.style.marginTop = '0';
      document.querySelector('#wangeditor-layer>img').style.width = '100%';
      document.querySelector('#wangeditor-layer>img').style.marginLeft = '0';
      document.querySelector('#wangeditor-layer>img').style.height = 100 * h * _w / w / _h + '%';
      // document.querySelector('#wangeditor-layer>img').style.marginTop = (100 - 100 * h * _w / w / _h) / 2 + '%';// 当以百分数进行计算的时候会有bug,不知道为什么,后续研究;
      document.querySelector('#wangeditor-layer>img').style.marginTop = _h * (1 - 1 * h * _w / w / _h) / 2 + 'px';
    }
    document.querySelector('#wangeditor-layer').style.display = 'block';
    this.close();
  },
  clickEvent() {
    const imgList = document.querySelectorAll('.textareaContent img');
    const self = this;
    for (let i = 0; i < imgList.length; i += 1) {
      imgList[i].onclick = function img() {
        self.imgClientHeight = this.clientHeight;
        self.imgClientWidth = this.clientWidth;
        self.imgUrl = this.getAttribute('src');
        self.zoom();
      };
    }
  },
  close() {
    document.querySelector('#wangeditor-layer .close').onclick = function click() {
      document.querySelector('#wangeditor-layer').style.display = 'none';
    };
  },
};
