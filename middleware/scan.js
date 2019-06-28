import { generate } from "qrcode-terminal";
import FileBox from "file-box";
// 二维码生成
const onScan = (qrcode, status) => {
    // 不在终端生成二维码
    // Qrterminal.generate(qrcode);
    // const qrImgUrl = [
    //     "https://api.qrserver.com/v1/create-qr-code/?data=",
    //     encodeURIComponent(qrcode)
    // ].join("");
    console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
};

export default onScan;
