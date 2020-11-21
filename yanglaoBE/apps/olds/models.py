from django.db import models

# Create your models here.
# Olds: 编号，姓名，性别，出生日期，手机号码，家属号码，家庭住址。照片


class Olds(models.Model):
    gender_choices = (('男','男'),('女','女'))
    oNo = models.IntegerField(db_column="ONo",primary_key=True,null=False)
    # 老人编号，不允许空，主键

    oIdentity = models.CharField(db_column="oIdentity",max_length=18,null=False)
    # 老人身份证号码，最长8个字符，不允许为空

    oName = models.CharField(db_column="OName",max_length=10,null=False)
    # 老人姓名，最长10个字符，不允许为空

    oGender = models.CharField(db_column="oGender",max_length=10,choices=gender_choices)
    # 老人性别，选项选择

    oBirthday = models.DateField(db_column="oBirthday",null=False)
    # 老人出生日期，不允许为空

    oMobile = models.CharField(db_column="oMobile",max_length=11)
    # 老人手机号码

    oFamilyMobile = models.CharField(db_column="oFamilyMobile",max_length=11)
    # 老人家属手机号码

    oAddress = models.CharField(db_column="oAddress",max_length=200)
    # 老人家庭住址

    oImage = models.CharField(db_column="oImage",max_length=200,null=False)
    # 老人照片

    oHealth = models.CharField(db_column="oHealth",max_length=200)
    # 老人身体健康情况

    oSocial = models.CharField(db_column="oSocial",max_length=200)
    # 老人社会活动情况

    # 默认生成的表名为App_class, 使用class Meta来自定义
    class Meta:
        managed = True
        db_table = "Olds"

    # __str__方法
    def __str__(self):
        return "编号：%s\t姓名：%s\t性别：%s" % (self.oNo, self.oName, self.oGender)