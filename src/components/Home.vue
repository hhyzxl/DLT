<template>
    <div style="margin:10px;">
        <el-form ref="form" :model="form" label-width="150px" size="mini">
            <el-form-item label="大底数据">
                <el-input type="textarea" :rows="2" v-model="form.baseNum"></el-input>
            </el-form-item>

            <el-form-item label="基础分布排序">
                <el-input type="textarea" :rows="5" v-model="form.lines1"></el-input>
            </el-form-item>
            <el-form-item label="参考分布排序1">
                <el-input type="textarea" :rows="5" v-model="form.lines2"></el-input>
            </el-form-item>
            <el-form-item label="参考分布排序2">
                <el-input type="textarea" :rows="5" v-model="form.lines3"></el-input>
            </el-form-item>

            <el-form-item size="mini">
                <el-button type="primary" @click="onSubmit">Create</el-button>
            </el-form-item>
        </el-form>


        
        <el-table :data="bigFushi" style="width: 100%" size="mini" border>
            <el-table-column label="号码">
                <template slot-scope="scope">
                    {{scope.row.join(',')}}
                </template>
            </el-table-column>
            <el-table-column label="号码个数">
                <template slot-scope="scope">
                    {{scope.row.length}}
                </template>
            </el-table-column>
        </el-table>


    
    </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'

export default {
    name: 'Home',

    data() {
        return {
            form: {
                baseNum: '1,4,5,6,7,8,9,10,12,13,14,15,16,17,19,20,21,23,24,27,28,29,31,33,34,35',
                lines1: '10,15,19,27,33,35,8,6,22,29,3,24,18,12,17,31,30,26,16,32,23,14,21,11,25,7,34,5,20,28,4,9,1,2,13',
                lines2: '17,2,16,24,6,20,7,13,18,5,23,8,3,4,12,19,10,35,28,15,14,27,30,11,25,32,26,34,22,21,29,31,1,9,33',
                lines3: '9,17,8,11,7,10,4,25,28,3,24,29,26,19,20,27,5,22,21,13,24,6,18,12,1,30,15,31,32,23,14,33,16,35,2'
            },
            baseNumArr: [],
            lines1: [],
            cols1:[],
            lines2: [],
            cols2:[],
            lines3: [],
            cols3:[],
            fushi:[],
            bigFushi:[],
            filterNum: [],
        };
    },
    mounted() {
        
    },

    methods: {
        
        matrixReverse(array) {
            let result = []
            for(let i=0;i<array[0].length;i++){
                let row = []
                for(let j=0;j<array.length;j++){
                    row.push(array[j][i])
                }
                result.push(row)
            }
            return result;
        },

        choose(arr, k) {
            let result = [];
            function combine(tempArr, start) {
                if (tempArr.length === k) {
                    result.push([...tempArr]);
                    return;
                }
                for (let i = start; i < arr.length; i++) {
                    tempArr.push(arr[i]);
                    combine(tempArr, i + 1);
                    tempArr.pop();
                }
            }
            combine([], 0);
            return result;
        },

        // 将一维数组转成二维
        construct2DArray(original, m, n) {
            const len = original.length;
            if (len !== m * n) {
                return [];
            }
            const res = new Array(m);
            for (let i = 0; i < m; i++) {
                res[i] = original.slice(i * n, (i + 1) * n);
            }
            return res;
        },
        
        
        onSubmit() {
            // 获取大底数据
            let baseNum = this.form.baseNum;
            this.baseNumArr = baseNum.split(',').filter(item => item !== "");

            // 获取基础分布矩阵,并记录行和列到this.line1和this.cols1中
            this.lines1 = [];
            let lines1Arr = this.form.lines1.trim('').split(',');
            let lines1 = this.construct2DArray(lines1Arr, 5, 7);


            for (let i = 0; i < lines1.length; i++) {
                this.lines1.push(lines1[i].filter(item => item !== ""));
            }

            let matrix1 = [].concat(this.lines1);
            this.cols1 = this.matrixReverse(matrix1);

            // 获取参考分布矩阵1,并记录行和列到this.line2和this.cols2中
            this.lines2 = [];
            let lines2Arr = this.form.lines2.trim('').split(',');
            let lines2 = this.construct2DArray(lines2Arr, 5, 7);


            for (let i = 0; i < lines2.length; i++) {
                this.lines2.push(lines2[i].filter(item => item !== ""));
            }

            let matrix2 = [].concat(this.lines2);
            this.cols2 = this.matrixReverse(matrix2);

            // 获取参考分布矩阵1,并记录行和列到this.line2和this.cols2中
            this.lines3 = [];
            let lines3Arr = this.form.lines3.trim('').split(',');
            let lines3 = this.construct2DArray(lines3Arr, 5, 7);


            for (let i = 0; i < lines3.length; i++) {
                this.lines3.push(lines3[i].filter(item => item !== ""));
            }

            let matrix3 = [].concat(this.lines3);
            this.cols3 = this.matrixReverse(matrix3);


            let afterDeleteLinesArr = [];
            let combinationLines = this.choose([1, 2, 3, 4, 5], 2);
            for (let i = 0; i < combinationLines.length; i++) {
                let tmpResult = baseNum.split(',');
                let d_line1 = combinationLines[i][0] - 1;
                let d_line2 = combinationLines[i][1] - 1;
                let deleteNum1 = this.lines1[d_line1];
                let deleteNum2 = this.lines1[d_line2];
                let deleteNum = deleteNum1.concat(deleteNum2);
                for (let j = 0; j < deleteNum.length; j++) {
                    let num = deleteNum[j];
                    let index = tmpResult.indexOf(num);
                    if(index != -1) {
                        tmpResult.splice(tmpResult.indexOf(num), 1);
                    }
                }
                afterDeleteLinesArr.push(tmpResult);
            }

            console.log(afterDeleteLinesArr);


            let afterDeleteColsArr1 = [];
            for (let m = 0; m < afterDeleteLinesArr.length; m++) {
                let combinationCols = [1, 2, 3, 4, 5, 6, 7];
                for (let n = 0; n < combinationCols.length; n++) {
                    let tmpNumArr = [].concat(afterDeleteLinesArr[m]);
                    let currentCol = combinationCols[n];
                    let deleteNum1 = this.cols1[currentCol - 1];
                    let deleteNum2 = this.cols2[currentCol - 1];
                    let deleteNum3 = this.cols3[currentCol - 1];

                    let deleteNum = deleteNum1.concat(deleteNum2, deleteNum3);
                    for (let j = 0; j < deleteNum.length; j++) {
                        let num = deleteNum[j];
                        let index = tmpNumArr.indexOf(num);
                        if(index != -1) {
                            tmpNumArr.splice(tmpNumArr.indexOf(num), 1);
                        }
                    }
                    if(tmpNumArr.length > 4) {
                        afterDeleteColsArr1.push(tmpNumArr);
                    }
                }
            }

            console.log(afterDeleteColsArr1);

            // 排序一下再复制给bigFushi
            this.bigFushi = _.sortBy(afterDeleteColsArr1, [function(o) { return o.length; }]);;

            
            let indexes = [1, 2, 3, 4, 5];

            // 再干掉this.line2中的某一行
            let afterDeleteColsArr2 = [];
            for (let m = 0; m < afterDeleteColsArr1.length; m++) {
                
                for (let n = 0; n < indexes.length; n++) {
                    let tmpNumArr = [].concat(afterDeleteColsArr1[m]);
                    let currentLine = indexes[n];
                    let deleteNum1 = this.lines2[currentLine - 1];

                    let deleteNum = [].concat(deleteNum1);
                    for (let j = 0; j < deleteNum.length; j++) {
                        let num = deleteNum[j];
                        let index = tmpNumArr.indexOf(num);
                        if(index != -1) {
                            tmpNumArr.splice(tmpNumArr.indexOf(num), 1);
                        }
                    }
                    if(tmpNumArr.length > 4) {
                        afterDeleteColsArr2.push(tmpNumArr);
                    }
                }
            }
            
            // 再干掉this.line3中的某一行
            let afterDeleteColsArr3 = [];
            for (let m = 0; m < afterDeleteColsArr2.length; m++) {
                
                for (let n = 0; n < indexes.length; n++) {
                    let tmpNumArr = [].concat(afterDeleteColsArr2[m]);
                    let currentLine = indexes[n];
                    let deleteNum1 = this.lines3[currentLine - 1];

                    let deleteNum = [].concat(deleteNum1);
                    for (let j = 0; j < deleteNum.length; j++) {
                        let num = deleteNum[j];
                        let index = tmpNumArr.indexOf(num);
                        if(index != -1) {
                            tmpNumArr.splice(tmpNumArr.indexOf(num), 1);
                        }
                    }
                    if(tmpNumArr.length > 4) {
                        afterDeleteColsArr3.push(tmpNumArr);
                    }
                }
            }

            this.fushi = _.uniq(afterDeleteColsArr3);
            
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