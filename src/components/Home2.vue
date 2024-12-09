<template>
<div style="margin:10px;">
    <div style="marginTop:100px">
        <input @change="handleChage" type="file" id="image-input" accept="image/*">
        <br />
        <button @click="processImage">提取文字</button>
        <div id="show-picture"></div>
    </div>
    <div>
        <p style="color:red">提取到的内容：</p>
        <span id="result"></span>
    </div>
</div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'Home',

    data() {
        return {
            form: {
                baseNum: '',
                options1: '',
                options2: ''
            },
        };
    },
    mounted() {

    },

    methods: {
        handleChage() {

            document.getElementById("result").innerText = ""
            let getUserPhoto = document.getElementById("image-input");

            //创建一个FileReader对象，用于读取图像文件
            let reader = new FileReader();

            //读取第一个文件，并转为base64格式
            reader.readAsDataURL(getUserPhoto.files[0]);

            //只显示第一个图片
            reader.onload = function () {
                let image = document.createElement("img");
                image.width = "400";

                //设置图片
                image.src = reader.result;
                let showPicture = document.getElementById("show-picture");
                while (showPicture.firstChild) {
                    showPicture.removeChild(showPicture.firstChild);
                }
                showPicture.appendChild(image)
            };
        },

        processImage() {
            let worker;
            let input = document.getElementById('image-input');
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = async function (e) {
                    await Tesseract.recognize(e.target.result, 'chi_sim').then(result => {
                        // 提取出的文字，给元素赋值
                        let extractedText = result.data.text;
                        document.getElementById('result').innerText = extractedText;
                    }).catch(error => {
                        console.error('Error:', error);
                        this.$message.error('识别失败');
                    }).finally(() => {
                        
                    })

                    //创建一个Worker线程，参数为需要识别的语言， chi_sim代表简体中文
                   /*
                   worker = await Tesseract.createWorker('eng')
                    worker.recognize(e.target.result)
                        .then(result => {

                            // 提取出的文字，给元素赋值
                            let extractedText = result.data.text;
                            document.getElementById('result').innerText = extractedText;

                        })
                        .catch(error => {
                            console.error('Error:', error);
                        }).finally(() => {
                            if (worker)

                                // 清除当前Worker线程
                                worker.terminate();

                        })
                        */
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
    },

    beforeDestroy() {

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>

<style>
#iframe-tabs .el-tabs__header.is-top {
    display: none !important;
}

iframe {
    width: 100%;
    height: auto;
    min-height: 900px;
    border: none !important;
}
</style>
