## 1.1 sm-crypto\src\sm2\utils.js 修改
6cb32c22d5a7e313fe108568242e26caeb081f3c67e67eb40da1f6bbe2221027 key 
"applestrees123@163.com"

管理员账户：admin@xchain.com

密码：12345678

导入私钥： 0b747673b3879014365fd48c584b9d175a252bdfbbc7d1cbb3b885e9ba2c6e7d
```
/**
 * 转成16进制串 
 */
function arrayToHex(arr) {
  return arr.reduce((output, elem) =>
      (output + ('0' + elem.toString(16)).slice(-2)),
      '')
}
```