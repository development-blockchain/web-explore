# HECO

Web Socket

```js
import React, {useMemo, useRef} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';

const messageHistory = useRef([]);
  const {sendMessage, lastMessage, readyState} = useWebSocket('ws://114.67.104.19:12011/blockBrowser/index/ws');

  messageHistory.current = useMemo(() => messageHistory.current.concat(lastMessage), [lastMessage]);
  console.log('readyState', readyState)
  try {
  console.log(JSON.parse(lastMessage.data))
    
  } catch (error) {
    
  }
```

# 开发环境准备

## 第一步：安装 nodejs > 12

```
https://nodejs.org/en/download/
```

## 第二步：安装yarn

```
npm i yarn -g
```

## 第三步：初始化项目目录

```
yarn
```

## 第四步：开始开发

```
yarn start
```

## 第五步：打包

```
yarn build
```

## 第六步：部署到服务器

把 `build` 目录copy到服务器 `nginx` 服务根目录，例如： `/var/www`


