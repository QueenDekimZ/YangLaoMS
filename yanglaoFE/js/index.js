const app = new Vue({
    el: '#app',
    data() {
        //校验编号是否存在
        const rulesONo = (rule, value, callback) => {
            //编辑模式下不需要校验oNo是否重复
            if (this.isEdit) {
                callback();
            }
            //使用Axios进行校验
            axios.post(
                this.baseURL + 'ono/check/',
                {
                    oNo: value,
                }
            )
                .then((res) => {
                    //请求成功
                    if (res.data.code == 1) {
                        if (res.data.exists) {
                            callback(new Error("编号已存在！"));
                        } else {
                            callback();
                        }
                    } else {
                        //请求失败
                        callback(new Error("校验编号后端出现异常！"));
                    }
                })
                .catch((err) => {
                    //请求失败控制台打印
                    console.log(err);
                })
        }

        return {
            msg: "Hello,Vue!",
            baseURL: "http://127.0.0.1:8000/",
            pageOlds: [], //分页后当前页的老人信息
            inputStr: "",//输入的查询条件
            Olds: [], //通过异步请求将数据放入容器

            //====分页相关====
            total: 0, //数据总行数
            currentpage: 1, //当前所在的页
            pagesize: 10, //每页显示多少行

            //====弹出框表单====
            // imageUrl:'',//老人头像图片路径
            dialogVisible: false,//默认不显示弹出框
            oldsForm: {
                oNo: '',
                oName: '',
                oGender: '',
                oIdentity: '',
                oBirthday: '',
                oMobile: '',
                oFamilyMobile: '',
                oAddress: '',
                oHealth: '',
                oSocial: '',
                oImage: '',
                oImageUrl: '',
            },
            dialogTitle: "", //弹出框的标题
            isView: false, //标识是否是查看
            isEdit: false, //表示是否是修改
            rules: {
                oNo: [
                    { required: true, message: '编号不能为空', trigger: 'blur' },
                    { pattern: /^[6][6]\d{3}$/, message: '编号必须是66开头的5位数字', trigger: 'blur' },  //blur即在失去焦点的时候触发
                    { validator: rulesONo, trigger: 'blur' }, //编号是否存在校验
                ],
                oName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须是2-5个汉字', trigger: 'blur' },
                ],
                oGender: [
                    { required: true, message: '性别不能为空', trigger: 'change' },
                ],
                oBirthday: [
                    { required: true, message: '出生日期不能为空', trigger: 'change' },
                ],
                oIdentity: [
                    { required: true, message: '身份证号不能为空', trigger: 'blur' },
                    { pattern: /^\d{18}$/, message: '身份证号必须符合规范', trigger: 'blur' },
                ],
                oMobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    { pattern: /^[1][345789]\d{9}$/, message: '手机号码必须符合规范', trigger: 'blur' },
                ],
                oFamilyMobile: [
                    { required: true, message: '家属手机号码不能为空', trigger: 'blur' },
                    { pattern: /^[1][345789]\d{9}$/, message: '家属手机号码必须符合规范', trigger: 'blur' },
                ],
                oAddress: [
                    { required: true, message: '家庭住址不能为空', trigger: 'blur' },
                ],
                oHealth: [
                    { required: true, message: '身体健康状况不能为空', trigger: 'blur' },
                ],
                oSocial: [
                    { required: true, message: '社会活动情况不能为空', trigger: 'blur' },
                ],
                selectOlds: [], //选择复选框时保存选择记录
            }
        }
    },
    mounted() {
        // 生命周期 自动加载数据
        this.getOlds();
    },
    methods: {
        //获取所有老人信息
        getOlds: function () {
            //记录this的地址
            let that = this;
            //使用Axios实现Ajax请求 异步请求后this变为undefined
            axios
                .get(that.baseURL + "olds/")
                .then(function (res) {
                    //请求成功后执行的函数
                    //console.log(res)
                    if (res.data.code == 1) {
                        //把数据给olds
                        that.Olds = res.data.data;
                        //获取返回记录的总行数
                        that.total = res.data.data.length;
                        //获取当前页的数据
                        that.getPageOlds();
                        //成功提示
                        that.$message({
                            message: '数据加载成功!',
                            type: 'success'
                        });
                    } else {
                        //失败提示
                        that.$message.error('数据加载失败!' + res.data.msg);
                    }
                })
                .catch(function (err) {
                    //请求失败后执行的函数
                    console.log(err)
                })
        },
        //获取当前页的老人数据
        getPageOlds() {
            //清空pageOlds中的数据
            this.pageOlds = [];
            //获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //遍历数据添加到pageOlds中
                this.pageOlds.push(this.Olds[i]);
                //判断是否达到一页的要求
                if (this.pageOlds.length == this.pagesize) break;

            }
        },
        //实现老人信息查询
        queryOlds() {
            //使用Ajax请求--POST-传递inputStr
            let that = this;
            //开始Ajax请求
            axios
                .post(
                    that.baseURL + "olds/query/",
                    {
                        inputstr: that.inputStr
                    }
                )
                .then(function (res) {
                    if (res.data.code == 1) {
                        //把数据给olds
                        that.Olds = res.data.data;
                        //获取返回记录的总行数
                        that.total = res.data.data.length;
                        //获取当前页的数据
                        that.getPageOlds();
                        //成功提示
                        that.$message({
                            message: '数据查询成功!',
                            type: 'success'
                        })
                    } else {
                        that.$message.error('数据查询失败!' + res.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    that.$message.error("获取后端查询结果失败！");
                })
        },
        //添加老人信息时打开表单
        addOlds() {
            this.dialogTitle = "添加老人信息";
            this.dialogVisible = true;
            // console.log("aaa")
        },
        //查看老人信息的明细展示
        viewOlds(row) {
            this.dialogTitle = "查看老人信息";
            this.dialogVisible = true;
            this.isView = true;
            //==浅拷贝
            // this.oldsForm = row;
            //==深拷贝方法01
            // this.oldsForm.oNo = row.oNo;
            // this.oldsForm.oName = row.oName;
            // this.oldsForm.oGender = row.oGender;
            // this.oldsForm.oIdentity = row.oIdentity;
            // this.oldsForm.oBirthday = row.oBirthday;
            // this.oldsForm.oMobile = row.oMobile;
            // this.oldsForm.oFamilyMobile = row.oFamilyMobile;
            // this.oldsForm.oAddress = row.oAddress;
            // this.oldsForm.oHealth = row.oHealth;
            // this.oldsForm.oSocial = row.oSocial;
            //==深拷贝方法02
            this.oldsForm = JSON.parse(JSON.stringify(row));
            // 获取照片
            this.oldsForm.oImage = this.getImageByONo(row.oNo);
            //获取照片URL
            this.oldsForm.oImageUrl = this.baseURL + 'media/' + this.oldsForm.oImage;
        },
        //修改老人信息的明细展示
        updateOlds(row) {
            this.dialogTitle = "修改老人信息";
            this.isEdit = true;
            this.dialogVisible = true;
            this.oldsForm = JSON.parse(JSON.stringify(row));
            this.oldsForm.oImage = this.getImageByONo(row.oNo);
            //获取照片URL
            this.oldsForm.oImageUrl = this.baseURL + 'media/' + this.oldsForm.oImage;
        },
        //提交老人信息表单（添加、修改）
        submitOldsForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //校验成功后，执行添加或修i改
                    if (this.isEdit) {
                        //修改
                        this.submitUpdateOlds();
                    } else {
                        //添加
                        this.submitAddOlds();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //添加到数据库的函数
        submitAddOlds() {
            //定义that
            let that = this;
            // 执行Axios请求
            axios
                .post(that.baseURL + 'olds/add/', that.oldsForm)
                .then(res => {
                    //执行成功
                    if (res.data.code == 1) {
                        //获取所有老人信息
                        that.Olds = res.data.data;
                        //获取返回记录的总行数
                        that.total = res.data.data.length;
                        //获取当前页的数据
                        that.getPageOlds();
                        //成功提示
                        that.$message({
                            message: '数据添加成功!',
                            type: 'success'
                        });
                        //关闭窗体
                        that.closeDialogForm('oldsForm');
                    } else {
                        //失败提示
                        that.$message.error('数据添加失败!' + res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("数据添加到数据库失败！");
                })

        },
        //修改更新数据库的函数
        submitUpdateOlds() {
            //定义that
            let that = this;
            console.log(that.oldsForm);
            // 执行Axios请求
            axios
                .post(that.baseURL + 'olds/update/', that.oldsForm)
                .then(res => {
                    //执行成功
                    if (res.data.code == 1) {
                        //获取所有老人信息
                        that.Olds = res.data.data;
                        //获取返回记录的总行数
                        that.total = res.data.data.length;
                        //获取当前页的数据
                        that.getPageOlds();
                        //成功提示
                        that.$message({
                            message: '数据修改成功!',
                            type: 'success'
                        });
                        //关闭窗体
                        that.closeDialogForm('oldsForm');
                    } else {
                        //失败提示
                        that.$message.error('数据修改失败!' + res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("数据更新到数据库失败！");
                })

        },
        //删除数据库一条老人信息记录
        deleteOlds(row) {
            //等待确认
            this.$confirm('是否确认删除老人信息【编号：' + row.oNo + '\t姓名：' + row.oName + '】？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认删除响应事件
                let that = this;
                //调用后端删除接口
                axios
                    .post(that.baseURL + 'olds/delete/', { oNo: row.oNo })
                    .then(res => {
                        //执行成功
                        if (res.data.code == 1) {
                            //获取所有老人信息
                            that.Olds = res.data.data;
                            //获取返回记录的总行数
                            that.total = res.data.data.length;
                            //获取当前页的数据
                            that.getPageOlds();
                            //成功提示
                            that.$message({
                                message: '数据删除成功!',
                                type: 'success'
                            });
                            //关闭窗体
                            that.closeDialogForm('oldsForm');
                        } else {
                            //失败提示
                            that.$message.error('数据删除失败!' + res.data.msg);
                        }
                    })
                // .catch(err => {
                //     //执行失败
                //     console.log(err);
                //     that.$message.error("数据删除更新到数据库失败！");
                // })
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //关闭弹出框的表单
        closeDialogForm(formName) {
            //重置 表单的校验
            this.$refs[formName].resetFields();

            this.oldsForm.oNo = "";
            this.oldsForm.oName = "";
            this.oldsForm.oGender = "";
            this.oldsForm.oIdentity = "";
            this.oldsForm.oBirthday = "";
            this.oldsForm.oMobile = "";
            this.oldsForm.oFamilyMobile = "";
            this.oldsForm.oAddress = "";
            this.oldsForm.oHealth = "";
            this.oldsForm.oSocial = "";
            this.oldsForm.oImage = "";
            this.oldsForm.oImageUrl = "";
            this.dialogVisible = false;
            this.isEdit = false;
            this.isView = false;
        },
        //根据分页修改每页显示的行数
        handleSizeChange(size) {
            //修改当前每页数据行数
            this.pagesize = size;
            //数据重新分页
            this.getPageOlds();
        },
        //调整当前的页码
        handleCurrentChange(pageNumber) {
            //修改当前的页码
            this.currentpage = pageNumber;
            //数据重新分页
            this.getPageOlds();
        },

        // 选择复选框时的操作
        handleSelectionChange(data) {
            this.selectOlds = data;
            console.log(data);
        },
        // 批量删除数据库中选中的老人信息记录
        deleteOldsAll() {
            //等待确认
            this.$confirm('是否确认批量删除' + this.selectOlds.length + '条老人信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认批量删除响应事件
                let that = this;
                //调用后端批量删除接口
                axios
                    .post(that.baseURL + 'oldsall/delete/', { old: that.selectOlds })
                    .then(res => {
                        //执行成功
                        if (res.data.code == 1) {
                            //获取所有老人信息
                            that.Olds = res.data.data;
                            //获取返回记录的总行数
                            that.total = res.data.data.length;
                            //获取当前页的数据
                            that.getPageOlds();
                            //成功提示
                            that.$message({
                                message: '数据批量删除成功!',
                                type: 'success'
                            });
                            //关闭窗体
                            that.closeDialogForm('oldsForm');
                        } else {
                            //失败提示
                            that.$message.error('数据批量删除失败!' + res.data.msg);
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 选择老人头像后点击确定后触发的事件
        uploadPicturePost(file) {
            //定义that
            let that = this;
            // 具体数据用json，文件用FormData格式传输，定义一个FormData类
            let fileReq = new FormData();
            //传进照片
            fileReq.append('avatar', file.file);
            // 使用Axios发起Ajax请求，FormData格式的Axios不同
            axios({
                method: 'post',
                url: that.baseURL + 'upload/',
                data: fileReq,
            }).then(res => {
                //执行成功
                if (res.data.code == 1) {
                    //把照片给image
                    that.oldsForm.oImage = res.data.name;
                    //拼接imageUrl
                    that.oldsForm.oImageUrl = that.baseURL + 'media/' + res.data.name;
                } else {
                    //失败提示
                    that.$message.error('上传头像失败！' + res.data.msg);
                }
            }).catch(err => {
                console.log(err);
                that.$message.error("上传头像出现异常！");
            })
        },

        //根据oNo获取image
        getImageByONo(oNo) {
            //遍历
            for (oneOld of this.Olds) {
                if (oneOld.oNo == oNo) {
                    return oneOld.oImage;
                }
            }
        },
        // 导入老人信息Excel
        uploadExcelPost(file) {
            let that = this;
            let fileReq = new FormData();
            fileReq.append('excel', file.file);
            // 使用Axios发起Ajax请求，FormData格式的Axios不同
            axios({
                method: 'post',
                url: that.baseURL + 'excel/import/',
                data: fileReq,
            }).then(res => {
                //执行成功
                if (res.data.code == 1) {
                    that.olds = res.data.data;
                    that.total = res.data.data.length;
                    //分页
                    that.getPageOlds();
                    //弹出框显示结果
                    this.$alert('本次导入完成！成功：' + res.data.success + '失败：' + res.data.error, '导入结果', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                                type: 'info',
                                message: `action: ${action}`
                            });
                        }
                    });
                    //打印失败明细
                    console.log("本次导入失败的数量为：" + res.data.error + "，具体的编号：");
                    console.log(res.data.errors);
                    that.oldsForm.oImageUrl = that.baseURL + 'media/' + res.data.name;
                } else {
                    //失败提示
                    that.$message.error('导入Excel老人信息失败！' + res.data.msg);
                }
            }).catch(err => {
                console.log(err);
                that.$message.error("导入Excel老人信息出现异常！");
            })
        },
        //到处老人信息Excel
        exportToExcel() {
            let that = this;
            axios.get(that.baseURL + 'excel/export/')
                .then(res => {
                    if (res.data.code == 1) {
                        //拼接Excel完整url
                        let url = that.baseURL + 'media/' + res.data.name;
                        // window.open(res.data.url);
                        //下载
                        window.open(url);
                    }
                    else {
                        that.$message.error("导出Excel表失败！");
                    }
                }).catch(err => {
                    console.log(err);
                    that.$message.error("导出Excel出现异常！" + str(err));
                })
        },
    },
})