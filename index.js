const model = require("./model");

let start = 2;
let end = 10;
let basicPath = "http://www.rosi77.com/x/rosi/list_1_";
let type = '.html';

let main = async url => {
    let list = [],
        index = 0;

    const data = await model.getPage(url);

    list = model.getUrl(data);
    // console.log(list);
    downLoadImages(list, index);//下载
};

const downLoadImages = async (list, index) => {
    // 目标列表判空
    if (index == list.length) {
        start++;
        if (start < end) {
            console.log('第' + start + '页');
            main(basicPath + start + type);//进行下一页图片组的爬取。
        }
        console.log("本页结束");
        return false;
    }

    if (model.getTitle(list[index])) {
        let item = await model.getPage(list[index].url),//获取图片所在网页的url
            imageNum = model.getImagesNum(item.res,list[index].name);//获取这组图片的数量
        await model.downloadImage(item, imageNum);//下载
        index++;
        downLoadImages(list, index);//循环完成下载下一组
    }
    else {
        index++;
        downLoadImages(list, index);//下载下一组
    }

};

main(basicPath + start + type);
