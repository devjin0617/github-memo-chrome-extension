var script   = document.createElement("script");
script.type  = "text/javascript";
script.src   = "https://www.gstatic.com/firebasejs/3.2.1/firebase.js";
document.body.appendChild(script);

var jinOpt = {
    form : {
        input : '<input type="text" class="form-control" placeholder="write input to project memo" style="width:655px;">',
        button : '<button class="btn btn-default" style="width:74px;">save</button>'
    },
    firebase : {
        config : {
            apiKey: "AIzaSyAD8HsgJcEut_ASE6hFC0vP-a4k8K6xMnI",
            authDomain: "github-memo.firebaseapp.com",
            databaseURL: "https://github-memo.firebaseio.com",
            storageBucket: ""
        },
        load : function() {
            if(!window.firebase) {
                setTimeout(jinOpt.firebase.load, 200);
            } else {
                console.log('next');
                console.log(window['firebase']);
                next();
            }
        }
    }
};

var next = function() {
    firebase.initializeApp(jinOpt.firebase.config);
    var database = firebase.database();

    $('.repo-list-item').append(jinOpt.form.input + jinOpt.form.button);
};

jinOpt.firebase.load();

