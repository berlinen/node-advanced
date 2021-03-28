const axios = require("axios");
const path = require('path');
const fs = require('fs');

function getStat (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if(err) resolve(false);
      else resolve(stats);
    })
  })
}

axios.get('https://unsplash.com/napi/search/photos?query=food&xp=&per_page=20&page=1')
  .then(res => {
    const data = res.data;
    const results = data.results;

    results.forEach(result => {
      const url = result.links.download;
      const id = result.id;
      // 获取的是二进制图片
      axios.get(url, {
        responseType: 'arraybuffer'
      })
      .then(async res => {
        const buffer = Buffer.from(res.data, 'binary');
        const isExitImagesFlodder = await getStat(path.resolve(__dirname, './images'));
        if(!isExitImagesFlodder) {
          fs.mkdirSync(path.resolve(__dirname, 'images'))
        }
        fs.writeFileSync(path.resolve(__dirname, `./images/${id}`), buffer);
      })
    })
  })