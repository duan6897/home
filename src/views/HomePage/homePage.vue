<template>
  <div id="homePage">
    <div class="leftBox"
         :style="isCollapse?'width:80px':'width:210px'">
      <div class="topLogo">
        <!-- <img src="@/static/images/test.jpg"> -->
      </div>
      <el-menu :default-active="$route.path"
               class="el-menu-vertical-demo"
               :collapse="isCollapse"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               @select="handleSelect">
        <el-menu-item index="/import">
          <i class="el-icon-menu"></i>
          <span slot="title">材料导入</span>
        </el-menu-item>
        <el-menu-item index="/contrast">
          <i class="el-icon-s-order"></i>
          <span slot="title">材料对比</span>
        </el-menu-item>
        <el-menu-item index="/material">
          <i class="el-icon-help"></i>
          <span slot="title">材料详情</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rightBox"
         :style="isCollapse?'width:calc(100% - 80px)':'width:calc(100% - 210px)'">
      <el-row class="rightTop">
        <el-button type="text"
                   class="activeButton"
                   :icon="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
                   @click="isCollapse=!isCollapse"></el-button>
        <!-- <el-button @click="login">登录</el-button> -->
      </el-row>
      <el-row class="mainBox">
        <router-view></router-view>
      </el-row>
    </div>
  </div>
</template>

<script>
import httprequest from '@/assets/api/request'

export default {
  name: 'homePage',
  data () {
    return {
      isCollapse: true
    }
  },
  beforeCreate () {
  },
  created () {
    this.login(this.getTokenId('token'))
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
      this.$router.push({ path: key })
    },
    login (token) {
      // let token = "18379f87a73f4b2187a24e5ec051e62ccb88f291-174e-413d-b397-706e871168a9_bd50d3e48325431c894f986aa34640ce"
      // login
      httprequest.post(`/login?token=${token}`,
        {}, res => {
          if (!res.data.ok) {
            this.$message.error(res.data.message)

          }
        })
    },
    getTokenId (name) {
      let url = window.location.href;  //当前页面的地址
      let reg = /([^?&=]+)=([^?&=]+)/g
      let obj = {}
      // let str = url
      url.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
      })
      for (var keyName in obj) {
        if (keyName == name) {
          return obj[keyName];
          // break;
        }
      }

    }
  }
}
</script>

<style lang="scss" scoped>
#homePage /deep/ .el-menu {
  border-right: none;
}
#homePage {
  width: 100vw;
  height: 100vh;
  .leftBox {
    float: left;
    height: 100vh;
    background-color: #545c64;
    .topLogo {
      width: 100%;
      height: 40px;
      img {
        width: 50%;
      }
    }
  }
  .rightBox {
    float: left;
    height: 100vh;
    .rightTop {
      width: 100%;
      height: 40px;
      box-shadow: 2px 2px 2px #f5f5f5;
      .activeButton {
        color: #303303;
        font-size: 20px;
        line-height: 0px;
      }
    }
    .mainBox {
      width: 100%;
      height: calc(100% - 46px);
      margin-top: 6px;
      background: #f5f5f5;
    }
  }
}
</style>>
