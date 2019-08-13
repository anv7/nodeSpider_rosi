const rp = require("request-promise"), //进入request-promise模块
    fs = require("fs"), //进入fs模块
    cheerio = require("cheerio"), //进入cheerio模块
    depositPath = "/Volumes/5D_MARK_III/nodePa/"; //存放照片的地址
let downloadPath; //下载图片的文件夹地址

module.exports = {
    // 异步方法下，请求拿到的url，并返回了请求结果
    async getPage(url) {
    const data = {
        url,
        res: await rp({
                          url: url
                      })
    };
    return data;
},

//  将请求到的pages通过cheerio解析，转化成可操作的jQuery节点。
getUrl(data) {
    let list = [];
    const $ = cheerio.load(data.res); //将html转换为可操作的节点

    $(".b_ul li a img").each(async (i, e) => {
        // console.log(e.parent.attribs.href)
        let obj = {
            name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字
            url:'http://www.rosi2019.com' + e.parent.attribs.href //图片网页的url
        };

    list.push(obj); //输出目录页查询出来的所有链接地址
});

    return list;
},

//  判断并创建储存爬取到内容的文件夹
getTitle(obj) {
    // 文件夹路径预设
    downloadPath = depositPath + obj.name;
    if (!fs.existsSync(downloadPath)) {//查看是否存在这个文件夹
        fs.mkdirSync(downloadPath);//不存在就建文件夹
        console.log(`${obj.name}  Rosi文件夹创建成功`);
        return true;
    } else {
        console.log(`${obj.name}  Rosi文件夹已经存在`);
        return false;
    }
},


getImagesNum(res, name) {
    if (res) {
        let $ = cheerio.load(res);
        let len = $(".c_ss_img")
            .find("img").length;
        console.log('此期照片总数为:' + len + '张');
        if (len == 0) {
            fs.rmdirSync(`${depositPath}${name}`);//删除无法下载的文件夹
            return 0;
        }
        // let pageIndex = $(".c_ss_img")
        //     .find("img").data; ？？
        return len;//返回图片总数
    }
},
//下载相册照片
async downloadImage(data, len) {
    if (data.res) {
        var $ = cheerio.load(data.res);
        for( let j = 0;j<len;j++){
            // console.log($(".c_ss_img > img")[j].attribs.src);
            if ($(".c_ss_img > img")) {
                let imgSrc = $(".c_ss_img > img")[j].attribs.src;//图片地址
                // let headers = {
                //     Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                //     "Accept-Encoding": "gzip, deflate",
                //     "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                //     "Cache-Control": "no-cache",
                //     Host: "i.meizitu.net",
                //     Pragma: "no-cache",
                //     "Proxy-Connection": "keep-alive",
                //     Referer: data.url,
                //     "Upgrade-Insecure-Requests": 1,
                //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
                // };//反防盗链
                await rp({
                    url: imgSrc,
                    resolveWithFullResponse: true,
                    // headers
                }).pipe(fs.createWriteStream(`${downloadPath}/${j}.jpg`));//下载
                console.log(`${downloadPath}/${j}.jpg 下载成功`);
            } else {
                console.log(`${downloadPath}/${j}.jpg 下载失败`);
            }

        }
    }
}
};

