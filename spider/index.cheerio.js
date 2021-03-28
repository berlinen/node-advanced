const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const url = "https://www.bigbigwork.com/tupian/shu49_1.html";

axios.get(url)
  .then(resp => {
    const data = resp.data;
    const $ = cheerio.load(data);

    const $imgs = $('#items img');
    $imgs.map((index, img) => {
      // 获取src属性
      const src = $(img).attr('src');
      const url = src.split('?')[0];
      const id = url.split('/').pop();
      // 鉴权
      return axios.get(src, {
        headers: {
          referer: "https://www.bigbigwork.com/tupian/shu49_1.html"
        },
        responseType: 'arraybuffer'
      }).then(resp => {
        const buffer = Buffer.from(resp.data, 'buffer');
        fs.writeFileSync(path.resolve(__dirname, `./images/${id}`), buffer);
      });
    });
  })