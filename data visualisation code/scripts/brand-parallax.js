$(document).ready(function(){

    $(window).scroll(function(){

        var scrollxy = $(this).scrollTop();

        $(".predictions").css({
            'transform' : 'translate(0px, -'+ scrollxy/3 +'%)'
        });

        $(".cloud").css({
            'transform' : 'translate(0px, -'+ scrollxy/3 +'%)'
        });

        $(".germs").css({
            'transform' : 'translate(0px, -'+ scrollxy/3 +'%)'
        });

        $(".history").css({
            'transform' : 'translate(0px, -'+ scrollxy/2 +'%)'
        });

        $(".heartbeat").css({
            'transform' : 'translate(0px, -'+ scrollxy/2 +'%)'
        });

        $(".location").css({
          'transform' : 'translate(0px, -'+ scrollxy/4 +'%)'
        });

        $(".site-title").css({
          'transform' : 'translate(0px, -'+ scrollxy/2 +'%)'
        });

        if (scrollxy > $(".title-header").offset().top - 200) {
          $(".title-header").addClass("is-showing-title");
        }


        if (scrollxy > $(".title-header").offset().top - 100) {
          $(".disease-one").each(function(i){

            setTimeout(function(){
              $(".disease-one").eq(i).addClass("is-showing-disease");
            },150 * (i+1));

          });

        }

    });

});
