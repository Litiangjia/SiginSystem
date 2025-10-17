.<template>
  <div id="sign-views-two">
      <canvas class="mycanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";
  import {T} from "@/assets/threeTs/threeTs";

  onMounted(() => {
    const t = new T(".mycanvas");
    const { scene, camera, renderer } = t;  //引入了场景，相机，渲染器


    //渲染器渲染,并设置渲染大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

  //  console.log(scene, camera, renderer);
  });

//  new T(".mycanvas");
</script>

<style scoped>
/* Add your styles here */
</style>
