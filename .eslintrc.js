module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',//解析器，这里我们使用babel-eslint
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  "rules": {
    "no-debugger": 0,                         //debugger 调试代码未删除
    "no-undef": 0,                            //变量未定义
    "no-unused-vars": 0,                      //变量定义后未使用
    "generator-star-spacing": 0,
    "no-tabs": 0,
    "new-cap": 0, // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    "prefer-const": 0,//首选const
    "lines-between-class-members": 0,
    "no-trailing-spaces": 0 //一行结束后面不要有空格
  }
};