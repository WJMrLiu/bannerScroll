;(function(){
    var scrollContent = document.querySelector('.scrollContent');
    var ul = scrollContent.querySelector('ul');
    var lis = ul.querySelectorAll('li');
    var ol = scrollContent.querySelector('ol');

    //屏幕的宽度
    var screenWidth = document.documentElement.offsetWidth;
    var timer = null;
    ul.style.height = lis[0].offsetHeight + 'px';

    //动态计算小圆点的个数 
    for (let i = 0; i < lis.length; i++) {
        var li = document.createElement('li')
        if (i == 0) {
            li.classList.add('active')
        }
        ol.appendChild(li);
    };
  
    //让图片各自放到指定的位置
        var center = 0;
        var right = 1;
        var left = lis.length-1;

        lis[center].style.transform = 'translateX(0)';
        lis[right].style.transform = 'translateX('+ screenWidth +'px)';
        lis[left].style.transform = 'translateX(+'-screenWidth+'px)';

    timer = setInterval(showNext,1500);

        function showNext(){

            //轮转下标
            left = center;
            center = right;
            right++;

            //极值判断
            if (right>lis.length-1) {
                right = 0;
            };
            // 添加过渡 过渡时间小于定时器时间
            lis[left].style.transition = 'transform .5s';
            lis[center].style.transition = 'transform .5s';
            //右边这个图片永远是替补的那一张,所以不需要添加过渡
            lis[right].style.transition = 'none';

            // 归位
            // left = lis.length - 1    left = 0
            // center = 0          		center = 1
            // right = 1 				right = 2
            lis[left].style.transform = 'translateX(' + -screenWidth + 'px)';
            lis[center].style.transform = 'translateX(0px)';
            lis[right].style.transform = 'translateX(' + screenWidth + 'px)';
        //让小圆点同步
            setPoints();
        }

    function showPrev() {
        // 轮转下标
        right = center;
        center = left;
        left--;

        //极值判断
        if (left < 0) {
            left = lis.length - 1;
        }

        // 添加过渡 过渡时间小于定时器时间
        //左边这个图片永远是替补的那一张,所以不需要添加过渡
        lis[left].style.transition = 'none';
        lis[center].style.transition = 'transform .5s';
        lis[right].style.transition = 'transform .5s';

        // 归位
        // left = lis.length - 1    left = 0
        // center = 0          		center = 1
        // right = 1 				right = 2
        lis[left].style.transform = 'translateX(' + -screenWidth + 'px)';
        lis[center].style.transform = 'translateX(0px)';
        lis[right].style.transform = 'translateX(' + screenWidth + 'px)';
        // 设置小圆点
        setPoints();
    }
         var points = ol.querySelectorAll('li');
    function setPoints(){
            for (let i = 0; i < points.length; i++) {
              points[i].classList.remove('active');
          }
          points[center].classList.add('active')
        };

    // 记录最开始的手指落点
    var startX = 0;
    var startTime = null;
    // 通过touch去滑动轮播图
    scrollContent.addEventListener('touchstart', function (e) {
        // 清除定时器
        clearInterval(timer);
        // 获取手指落点
        startX = e.changedTouches[0].clientX;
        // 获取滑动开始的时间
        startTime = new Date();
    })
    scrollContent.addEventListener('touchmove', function (e) {
        // 获取滑动的距离
        // dx自带正负，所以在使用的时候可以不管是左滑还是又滑，直接 +dx
        var dx = e.changedTouches[0].clientX - startX;

        // 在move事件 不需要过渡
        lis[left].style.transition = 'none';
        lis[center].style.transition = 'none';
        lis[right].style.transition = 'none';
        //　归位
        lis[left].style.transform = 'translateX(' + (-screenWidth + dx) + 'px)';
        lis[center].style.transform = 'translateX(' + dx + 'px)';
        lis[right].style.transform = 'translateX(' + (screenWidth + dx) + 'px)';
    })
    scrollContent.addEventListener('touchend', function (e) {
        //　判断是否滑动成功，如果滑动成功则根据方向选择看到上一张还是下一张
        //　如果滑动失败，则反弹回去

        // 滑动成功的依据：滑动的距离大于屏幕的1/3 或者 滑动的时间 < 300毫秒  并且 滑动的距离大于30
        var dx = e.changedTouches[0].clientX - startX;
        // 获得时间差
        var dTime = new Date() - startTime;

        if (Math.abs(dx) > screenWidth / 3 || (Math.abs(dx) > 30 && dTime < 300)) {
            // 滑动成功
            // 在这里面需要根据滑动的方向确定是看到上一张还是下一张
            // 如果dx>0,则是看到上一张，反之则看到下一张
            if (dx > 0) {
                // 上一张
                showPrev();
            } else {
                // 下一张
                showNext();
            }
        } else {
            // 滑动失败
            // 添加过渡
            lis[left].style.transition = 'transform .5s';
            lis[center].style.transition = 'transform .5s';
            lis[right].style.transition = 'transform .5s';
            // 归位
            lis[left].style.transform = 'translateX(' + -screenWidth + 'px)';
            lis[center].style.transform = 'translateX(0px)';
            lis[right].style.transform = 'translateX(' + screenWidth + 'px)';
        }

        // 当一切结束，重新启动定时器
        clearInterval(timer);
        timer = setInterval(showNext, 1500);
    })

})()