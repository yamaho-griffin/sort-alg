const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const sortMethodArray = ['バブルソート','選択法','挿入法','マージソート','クイックソート'];

app.get('/', (req, res) => 
{
    res.locals.selectedNum = 0;
    res.render('index.ejs',{results:[], sortMethodArray: sortMethodArray});
});

app.get('/index', (req, res) => 
{
    
    res.render('index.ejs',{results:[], sortMethodArray: sortMethodArray});
});

app.post('/index', (req,res) =>
{
    const sortselect = req.body.sortselect;
    let numArray = [];

    /*TODO: ループで効率的にとりたいけどやり方がわからない
    const numLength = req.body.numLength;
    for(let i = 0; i < numLength; i++)
    {
        numArray.push(req.body.req.body.num+i);
    }
    */
    numArray.push(req.body.num1);
    numArray.push(req.body.num2);
    numArray.push(req.body.num3);
    numArray.push(req.body.num4);
    numArray.push(req.body.num5);

    //Number型への変換s
    let numberArray = [];
    numArray.forEach(numStr => {
        numberArray.push(Number(numStr));
    });

    //console.log(sortselect);
    //console.log(sortMethodArray);

    let resultsArray = [];
    switch (sortselect)
    {
        case sortMethodArray[0]:
            //Bubble sort

            numberArray = bubbleSort(numberArray);
            //console.log("after:" + numberArray);

            res.locals.selectedNum = 0;
            resultsArray = numberArray;
            break;
        case sortMethodArray[1]:
            //Select sort

            numberArray = selectSort(numberArray);
            
            res.locals.selectedNum = 1;
            resultsArray = numberArray;
            break;
        case sortMethodArray[2]:
            //Insertion sort

            numberArray = insertionSort(numberArray);

            res.locals.selectedNum = 2;
            resultsArray = numberArray;
            break;
        case sortMethodArray[3]:
            //Marge sort

            const sorted = numberArray.map(value => [value]);
            numberArray = mergeWrapper(sorted);

            res.locals.selectedNum = 3;
            resultsArray = numberArray;
            break;
        case sortMethodArray[4]:
            //Quick sort

            //resultsArray = classifyArray(,0,numArray.length - 1);

            resultsArray = sort(numberArray);
            res.locals.selectedNum = 4;
            break;
        default:
            res.locals.selectedNum = 0;
            resultsArray = ['エラーが発生しました。'];
            break;
    }
    res.render('index.ejs',{results: resultsArray, sortMethodArray: sortMethodArray});

    
});



const bubbleSort = ((numberArray) =>
{
    for(let laps = 0; laps < numberArray.length; laps++)
    {
        //console.log("lap:" + (laps + 1));
        //console.log("loopStart:" + (numberArray.length - 1) + "-" + ">" + laps);
        for(let i = numberArray.length - 1; i > laps; i--)
        {    
            //console.log("type:" + typeof(numberArray[i]));
            if(numberArray[i] < numberArray[i - 1])
            {
                //console.log("i:" + i + "," + numberArray[i] + "<" + numberArray[i - 1]);
                let tmp = numberArray[i];
                numberArray[i] = numberArray[i - 1];
                numberArray[i - 1] = tmp;
            }
        }
    }
    return numberArray;
});

const selectSort = ((numArray) =>
{
    for (let i = 0; i < numArray.length; i++) 
    {
        //最小値とその最小値の要素番号用
        let min = numArray[i];
        let mENum = i;

        //配列の中の最小値探索
        for (let j = i + 1; j < numArray.length; j++) 
        {
          if (min > numArray[j]) 
          {
            min = numArray[j];
            mENum = j;
          }
        }

        //最小値を左寄せ
        let tmp = numArray[i];
        numArray[i] = numArray[mENum];
        numArray[mENum] = tmp;

    }
    return numArray;
});

const insertionSort = ((numArray) =>
{
    for (let lap = 1; lap < numArray.length; lap++) 
    {
        //挿入する値
        let tmp = numArray[lap];
        for (let j = lap - 1; j >= 0; j--) 
        {
            if (tmp > numArray[j]) 
            {
                //挿入する値を適切な位置に挿入
                numArray[j + 1] = tmp;
                break;
            } 
            else 
            {
                //挿入する値よりも大きいソート済みの値を1つ右にずらす
                numArray[j + 1] = numArray[j];
            }
        }
        
    }

    return numArray;
});

//自分で途中まで考えたもの（マージソート）
/*
const margeSort = ((numberArray) =>
{
    let lapCounter = 1;
    let startNumber = 0;
    for(let maxEvalue = 2 ; maxEvalue <= numberArray.length ; maxEvalue * 2)
    {
        
        for(let eachElement = startNumber ; eachElement < startNumber + maxEvalue ; eachElement++)
        {
            if(numberArray[eachElement] > numberArray[eachElement + 1])
            {
                let tmp = numberArray[eachElement];
                numberArray[eachElement] = numberArray[eachElement + 1];
                numberArray[eachElement + 1] = tmp;
            }
        }
        startNumber += maxEvalue;
        lapCounter++;
    }
    return numberArray;
});
*/

//マージする際に２つの配列を同時に比較(解答例を確認しました。)
const merge = ((array1,array2) =>
{
    //スプレッド演算子バージョン
    //const queue1 = [...array1];
    //const queue2 = [...array2];
    const queue1 = array1;
    const queue2 = array2;

    const merged = [];

    // デキュー（先頭要素を切り出し）
    const dequeue = (queue) => queue.splice(0, 1)[0];

    // どちらかが空になるまで繰り返し(lengthが0以下になるまで)
    do {
        if (queue1[0] < queue2[0]) {
            merged.push(dequeue(queue1));
        } else {
            merged.push(dequeue(queue2));
        }
    } while(queue1.length && queue2.length);

    // 残ったデータを後ろにくっつける
    merged.push(...queue1, ...queue2);

    return merged;
});

const mergeWrapper = function(arr) 
{
    const merged = [];
    //2つの配列を処理していく(i + 2)
    for (let i = 0; i < arr.length; i = i + 2) 
    {

        if (i + 1 < arr.length) 
        {
            //2つの配列をマージしたものをマージ済み配列に追加
            merged.push(merge(arr[i], arr[i + 1]));
        } else 
        {
            //末尾に到達したらマージ済み配列に配列を追加
            merged.push(arr[i]);
        }
    }

    if (merged.length === 1) 
    {
        // すべてマージしたら1次元配列で返す
        return merged[0];
    } else 
    {
        // 2要素以上ある場合はマージを続ける
        return mergeWrapper(merged);
    }
}

//途中まで自分で考えたもの（クイックソート）
/*
const quickSort = ((numberArray) =>
{
    let startElement = [[0],[0]];
    let maxElement = numberArray.length - 1;
    let lapCount = 0;
    while(true)
    {

        let reference = (numberArray[startElement] + numberArray[maxElement]) / 2;
        let numberArray = classifyArray(reference,numberArray,startElement,maxElement);
        

        lapCount ++;
    }
    return numberArray;
});
const classifyArray = ((array,startId,endId) =>
{
    let leftArray = [];
    let rightArray = [];
    let reference = (array[startId] + array[endId]) / 2;

    for(let i = startId ; i <= endId ;i++)
    {
        console.log("i:" + i + "reference:" + reference + ">" + array[i]);
        if(reference >= array[i])
        {
            leftArray.push(array[i]);
        }
        else
        {
            rightArray.push(array[i]);
        }
    }

    array = leftArray.concat(rightArray);
    console.log(array);

    if(leftArray.length > 0)
    {
        //classifyArray(array,0,leftArray.length - 1);
    }
    if(rightArray.length > 0)
    {
        //classifyArray(array,leftArray.length,rightArray.length - 1);
    }

    array = leftArray.concat(rightArray);
    console.log(array);

    return array;
});
*/

//解答例(クイックソート)
const sort = function (arr) {
    // 先頭の値を基準値とする
    const base = arr[0];
    //基準値よりも小さい値/大きい値を格納する配列。
    const smaller = [];
    const bigger = [];

    // 基準値より小さい値と大きい値でグルーピング
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < base) {
            smaller.push(arr[i]);
        } else {
            bigger.push(arr[i]);
        }
    }

    //変換後の配列
    const sorted = [];

    // 小さい順に値をいれていく
    if (smaller.length) {
        // 基準より小さい値のグループがあれば、その中でさらにソート
        //("smaller"配列をソートした物の要素を全て"sorted"配列に挿入している。)
        sorted.push(...sort(smaller));
    }

    //小さい値を入れ終わったら、基準値を挿入する
    sorted.push(base);

    if (bigger.length) {
        // 基準より大きい値のグループがあれば、その中でさらにソート
        sorted.push(...sort(bigger));
    }

    return sorted;
}


app.listen(3000);