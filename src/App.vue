<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { dispatch } from '@store';
import { life } from '@remake';
import ThemeCheck from './components/ThemeCheck.vue';


dispatch('loadSource/setSourcePath', {
    ageJson: '/data/age.json',
    eventJson: '/data/events.json',
    talentJson: '/data/talents.json',
}).then(res => {
  life.initial(res);
});

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <div class="main-container">
    <RouterView>
      <template #default="{ Component }">
        <Transition>
          <component :is="Component"></component>
        </Transition>
      </template>
    </RouterView>
  </div>
  <ThemeCheck></ThemeCheck>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  margin: 0 auto;
  position: relative;
  @include styles('background-color', 'body');
  @include styles('color', 'body');
  display: flex;
  justify-content: center;
  .main-container{
    height: 100%;
    overflow: hidden;
  }
}

@font-face {
    font-family: 'iconfont';
    src: url('./assets/font/iconfont.woff2') format('woff2'),
            url('./assets/font/iconfont.woff') format('woff'),
            url('./assets/font/iconfont.ttf') format('truetype');
}
.iconfont{
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html, body{
  margin: 0;
  padding: 0;
  height: 100vh;
}
.button{
  border: 1px solid;
  padding: .5em 1.5em;
  font-size: 18px;
  display: inline-block;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  color: #fff;
  @include styles('color', 'button');
  @include styles('background-color', 'button');
  @include styles('border-color', 'button');
  margin-right: 20px;
  &:last-child{
      margin-right: unset;
  }
  &:hover{
    @include styles('color', 'button-hover');
    @include styles('background-color', 'button-hover');
    transition: all .4s ease;
  }
}
.title{
  font-size: 40px;
  font-weight: 700;
}
.sub-title{
  font-size: 22px;
}
.main-content{
  height: 100%;
  box-sizing: border-box;
  padding: 50px 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Extra small devices (phones, 600px and down) */
@media screen and (max-width: 600px) {
    .main-container{
      width: 100%;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media screen and (min-width: 600px) and (max-width: 1200px) {
    .main-container{
      width: 80%;
    }
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media screen and (min-width: 1200px) {
    .main-container{
      width: 1000px;
    }
}
</style>
