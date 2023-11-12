// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "isisbn": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "label": "是否通过isbn方式"
  },
  "images": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "file"
      }
    ],
    "label": "图片"
  },
  "author": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "作者"
  },
  "bookDesc": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "内容介绍"
  },
  "bookName": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "书名"
  },
  "clcCode": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "类型编码"
  },
  "clcName": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "类型名称"
  },
  "isbn": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "ISBN"
  },
  "pictures": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "string"
      }
    ],
    "label": "图片"
  },
  "press": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "出版社"
  },
  "pressDate": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "出版时间"
  },
  "pressPlace": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "出版地址"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
