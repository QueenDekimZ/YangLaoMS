const login = new Vue({
    el: "#login",
    data() {
        return {
            baseURL: "http://127.0.0.1:8000/",
            adminForm:{
            username: "",
            password: "",
            },
            logining: false,
            rules2: {
                username: [{required: true, message: '请输入账户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            checked: false
        }
    },
    methods: {
        onLogin() {
            // this.$router.go({path:'./index.html'});
            let that = this;
            console.log(that.adminForm.username);
            console.log(that.adminForm.password);

            axios.post(that.baseURL + 'logins/',{
                username: that.adminForm.username,
                password: that.adminForm.password,
            }).then(res=>{
                console.log(res);
                if(res.data.code == 1){
                     this.logining = true;
                    window.open("./index.html", '_self');
                }else{
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err=>{
                console.log(err);
            })

        },
    }
})