// function sleep(ms: number) {

//     return new Promise((resolve) => setTimeout(resolve, ms));

// }

// // 模拟两个不同时长的并发请求

// useEffect(() => {

//     const loadData = async () => {

//         // 第一个请求，耗时2秒

//         setLoading(true);

//         await sleep(2000);

//         setLoading(false);

//         console.log('loading 关闭');

//     };

//

//     loadData();

// }, [setLoading]);

//

// // 延迟开始的请求

// useEffect(() => {

//     const loadMoreData = async () => {

//         await sleep(2500);

//         setLoading(true);

//         await sleep(5000);

//         setLoading(false);

//         console.log('loading 关闭');

//     };

//

//     loadMoreData();

// }, [setLoading]);
