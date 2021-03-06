J(function($,p,pub){
    pub.id="auth";
    pub.isOk = false;
    var key = "wgtree.github.user";

    p.adminUserIds = ['1908773','4724784','85879'];
    p.userId = 0;
    //判断是否是管理员
    pub.checkIdAdmin = function(){
        var admin = $.inArray(p.userId, p.adminUserIds),
            isAdmin = false;
        if(admin !== -1) isAdmin =  true;
        return isAdmin;
    };

    p.user={
        _init:function(){
            //debugger;
            J.util.$win.bind(pub.EVT.error,function(e,d){
                p.user.showError(d);
                window.localStorage.removeItem(key);
            }).bind(pub.EVT.done,function(e,u){
                pub.isOk = true;
                localStorage[key]=u.id;
            });

            var uid = localStorage[key];
            if(uid){
                J.util.$win.trigger(pub.EVT.done,[{id:uid}]);
                p.userId = uid;
                return;
            }

            uid=window.prompt('Input your Github Username:');
            uid = $.trim(uid);
            p.userId = uid;
            if(!uid){
                J.util.$win.trigger(pub.EVT.error,['Web need your Github Username!']);
                return;
            }
            var user = new Gh3.User(uid);

            user.fetch(function (err, resUser){

                if(err) {
                    J.util.$win.trigger(pub.EVT.error,[err]);
                    return;
                }
                if(resUser.company&&resUser.company.indexOf('oxox.io')>-1){
                    J.util.$win.trigger(pub.EVT.done,[resUser]);
                    return;
                };
                J.util.$win.trigger(pub.EVT.error,['403 Not Authenticated for '+uid]);

            });


        },
        showError:function(txt){
            txt = txt ||'403 Not Authenticated!';
            $('.panel_main').html('<div class="alert alert-danger">'+txt+'</div>');
        }
    };
    pub.EVT={
        'error':'onAuthError',
        'done':'onAuthDone'
    };
});