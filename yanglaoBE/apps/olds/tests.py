from django.test import TestCase
import openpyxl

# Create your tests here.
def read_excel_dict(path:str):
    """读取Excel数据，存储为字典----[{},{},{}]"""
    # 实例化一个workbook
    workbook = openpyxl.load_workbook(path)
    # 实例化一个sheet

    sheet = workbook['old']
    # 定义一个变量存储最终的数据--[]
    olds = []
    # 准备key
    keys = ['oNo','oIdentity','oName','oGender',
            'oBirthday','oMobile','oFamilyMobile',
            'oAddress','oImage','oHealth','oSocial']
    # 遍历
    for row in sheet.rows:
        # 定义一个临时的字典
        temp_dict = {}
        # 组合值和key
        for index,cell in enumerate(row):
            # 组合
            temp_dict[keys[index]] = str(cell.value)
        # 附加到list中
        olds.append(temp_dict)
    return olds

if __name__ == '__main__':
    path = "D://olds01.xlsx"
    olds = read_excel_dict(path)
    print(olds)