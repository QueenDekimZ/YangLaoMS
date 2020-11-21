"""yanglao URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from olds import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path(r'^$', views.login),
    path('admin/', admin.site.urls),
    path('logins/',views.login),
    path('olds/', views.get_olds), # 获取所有老人信息的接口
    path('olds/query/', views.query_olds),  # 查询老人信息的接口
    path('ono/check/', views.is_exists_oNo), # 校验编号是否存在的接口
    path('olds/add/', views.add_olds), # 添加老人信息的接口
    path('olds/update/',views.update_olds), # 修改老人信息的接口
    path('olds/delete/', views.delete_olds),  # 删除老人信息的接口
    path('oldsall/delete/', views.delete_olds_all),  # 批量删除老人信息的接口
    path('upload/',views.upload), # 上传老人头像的接口
    path('excel/import/',views.import_olds_excel), # 导入老人信息Excel表的接口
    path('excel/export/',views.export_olds_excel), #  导出老人信息到Excel文件的接口
]

# 允许所有的media文件被访问
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)