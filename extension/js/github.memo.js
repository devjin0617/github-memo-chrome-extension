//var script   = document.createElement("script");
//script.type  = "text/javascript";
//script.src   = "https://www.gstatic.com/firebasejs/3.2.1/firebase.js";
//document.body.appendChild(script);

var jinUtils = {
    form : {
        input : '<input type="text" class="form-control" placeholder="write input to project memo" value="{value}" style="width:655px;">',
        button : '<button class="btn btn-default" style="width:74px;">save</button>'
    },
    firebase : {
        config : {
            apiKey: "{input your apikey of firebase}",
            authDomain: "github-memo.firebaseapp.com",
            databaseURL: "https://github-memo.firebaseio.com",
            storageBucket: ""
        },
        setMemo : function(key, memo) {

            database.ref('/' + sUserId + '/' + key).set(memo);
        },
        getMemoList : function(cb) {

            jinUtils.progress.show();

            database.ref('/' + sUserId).on('value', function(data) {

                jinUtils.progress.hide();

                jinUtils.data.list = data.val();

                if(cb) {
                    cb();
                }
            });
        },
        getMemo : function(key, cb) {
            database.ref('/' + sUserId + '/' + key).once('value').then(function(data) {
                jinUtils.data.list[key] = data.val();

                if(cb) {
                    cb();
                }
            });
        }
    },
    data : {
        list : {}
    },
    progress : {
        init : function() {
            var form = '<div id="github-memo-progress" style="margin:10px; position: fixed; left:0; top:0;">github memo loading...</div>';
            $('body').append(form);
            $('#github-memo-progress').hide();
        },
        show : function() {
            $('#github-memo-progress').show();
        },
        hide : function() {
            $('#github-memo-progress').hide();
        }
    }
};
jinUtils.progress.init();
jinUtils.progress.show();

firebase.initializeApp(jinUtils.firebase.config);
var database = firebase.database();

var userId = $('.css-truncate-target').text();
var sUserId = MD5($('.css-truncate-target').text());

database.ref('/' + sUserId + '/id').set(userId);

(
        function( $ ){

            var strLocation = window.location.href;
            var strHash = window.location.hash;
            var strPrevLocation = "";
            var strPrevHash = "";

            var intIntervalTime = 100;

            var fnCleanHash = function( strHash ){
                return(
                    strHash.substring( 1, strHash.length )
                    );
            }

            var fnCheckLocation = function(){

                if (strLocation != window.location.href){

                    strPrevLocation = strLocation;
                    strPrevHash = strHash;
                    strLocation = window.location.href;
                    strHash = window.location.hash;
                    
                    init();

                    $( window.location ).trigger(
                        "change",
                        {
                            currentHref: strLocation,
                            currentHash: fnCleanHash( strHash ),
                            previousHref: strPrevLocation,
                            previousHash: fnCleanHash( strPrevHash )
                        }
                        );
                }
            }
            // Set an interval to check the location changes.
            setInterval( fnCheckLocation, intIntervalTime );
        }
    )( jQuery );

var init = function() {
    
    jinUtils.firebase.getMemoList(function() {

    $('.repo-list-item').each(function(index) {

        var hash = MD5($(this).find('form').eq(0).attr('action'));

        var form = '<div id="{id}" class="github-memo-wrap">' + jinUtils.form.input + jinUtils.form.button + '</div>';

        $(this).find('.github-memo-wrap').empty();
        $(this).append(form.replace('{id}', hash).replace('{value}', jinUtils.data.list[hash] || ''));
    });

    $('.github-memo-wrap button').unbind();
    $('.github-memo-wrap button').click(function(e) {

        var $root = $(this).closest('.github-memo-wrap');
        var hashKey = $root.attr('id');
        var value = $root.find('input').eq(0).val();
        jinUtils.firebase.setMemo(hashKey, value);
    });

});
init();
    
};



