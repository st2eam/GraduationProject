import ReactDOM from 'react-dom/client'
import '@/styles/normalize.scss' // 初始化normalize
import App from './App'
import { Toast } from 'antd-mobile'

Toast.config({
  duration: 1000
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
