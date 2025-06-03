<template>
  <div class="root-container">
    <!-- 地图容器 -->
    <div id="map" ref="mapContainer" class="map-container" @click="openPopup"
      :style="{ backgroundColor: store.mapStatus.backgroundColor }">
      <!-- 弹窗 -->
      <CustomPopup v-model="showPopup" ref="popupRef" :x="popupOffsetX + 10" :y="popupOffsetY - 165">
        <!-- :lat="popupLat" :lon="popupLon"
      :sic="popupSic" :date="popupDate" :region="popupRegion" -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-[#000]">图层信息</span>
          <close-small @click="closePopup" theme="filled" size="16" fill="#0891B2" class="hover:bg-gray-300" />
        </div>
        <div class="">

        </div>
      </CustomPopup>
      <!-- 加载动画 -->
      <div v-if="isLoading" class="map-loader">
        <div class="loading-spinner">
          <span class="loading-icon">❄</span>
          <span class="loading-text">加载中</span>
        </div>
      </div>
      <!-- Map Controls Overlay -->
      <div class="map-controls-container">
        <!-- 图层控制按钮 -->
        <div class="tooltip-container" @click="showLayersControl = !showLayersControl">
          <p class="tooltip">图层</p>
          <button class="map-control-btn">
            <Layers theme="outline" size="16" fill="#4B5563" />
          </button>
        </div>
        <!-- 图层控制界面 -->
        <Transition name="fade">
          <div v-show="showLayersControl" class="layersControlContainer">
            <div class="px-3 py-2">
              <h3 class="tracking-wider text-gray-800">图层</h3>
            </div>
            <div v-for="(layer, key) in store.layerStatus" :key="key" class="h-8 px-3 py-1">
              <div class="flex items-center justify-between">
                <label class="flex items-center cursor-pointer select-none">
                  <div @click="toggleLayer(key)"
                    class="layer-checkbox w-4 h-4 border border-gray-400 rounded mr-2 flex items-center justify-center"
                    :class="{ 'bg-blue-500': layer.visible }">
                    <i v-if="layer.visible" class="text-white text-xs">✓</i>
                  </div>
                  <span class="text-sm text-gray-700 w-[4rem]">{{ layer.name }}</span>
                  <!-- 透明度调整 -->
                  <WaterLevel class="ml-1" theme="filled" size="16" fill="#9CA3AF" />
                  <el-slider :model-value="layerOpacity(key)"
                    @update:model-value="(val) => handleLayerOpacityChange(val, key)" :min='0' :max='1' :step='0.01'
                    :disabled="key === 'baseLayer' || store.layerStatus[key].visible === false" class="w-20 h-2 ml-3" />
                </label>
                <Info theme="outline" size="16" fill="#9CA3AF" />
              </div>
            </div>
          </div>
        </Transition>
        <!-- 添加遮罩层 -->
        <Transition name="fade">
          <div v-if="showLayersControl" class="fixed inset-0 z-40 bg-transparent" @click="showLayersControl = false">
          </div>
        </Transition>
        <!-- 全屏按钮 -->
        <div class="tooltip-container" @click="handleFullscreen">
          <p class="tooltip">全屏</p>
          <button class="map-control-btn">
            <FullScreen theme="outline" size="16" fill="#4B5563" />
          </button>
        </div>
      </div>
      <!-- 时间滑块 -->
      <div class="time-slider-container">
        <div class="flex justify-between text-sm text-gray-600 mb-0 px-2">
          <span>{{ formatDate(minDate) }}</span>
          <span>{{ formatDate(maxDate) }}</span>
        </div>
        <el-slider v-model="dateValue" :min="minDate" :max="maxDate" :format-tooltip="formatDateTooltip"
          @change="handleDateChange" class="w-full h-6 px-2" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { appStore } from '~/store/index.js';
import 'ol/ol.css';
import { fromUrl } from 'geotiff';
import { ElDatePicker, ElDialog, ElMessage, ElIcon } from 'element-plus';
import { Layers, FullScreen, Info, WaterLevel, CloseSmall } from '@icon-park/vue-next'
import { Loading } from '@element-plus/icons-vue';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import { GeoTIFF } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { fromEPSGCode } from 'ol/proj/proj4';
import { fromLonLat, toLonLat, toStringHDMS } from 'ol/proj';

import { setupMapClickHandler, formatDate } from '~/composables/map';
import CustomPopup from '~/components/CustomPopup.vue';
import { toast, showPopupWindow } from "~/composables/util";

const store = appStore();
const mapContainer = ref(null);
const map = ref(null);
const sicLayer = ref(null);
// const lastValidDate = ref(selectedDate.value); // 最后有效日期记录

const showLayersControl = ref(false); // 图层控制按钮

let isUpdating = false; // 防止重复请求
const isLoading = ref(false); // 加载动画

const minDate = new Date(2023, 0, 1).getTime(); // 最小日期
const maxDate = new Date(2025, 3, 30).getTime(); // 最大日期

// 当前日期值（时间戳）
const dateValue = ref(store.currentDate);

// 格式化滑块提示
const formatDateTooltip = (value) => {
  return formatDate(value);
};

const popupRef = ref(null); // 定义 ref 用于访问子组件实例
const showPopup = ref(false);
const popupOffsetX = ref(0);  // 弹窗水平偏移量 left
const popupOffsetY = ref(0);  // 弹窗垂直偏移量 top
const popupLat = ref('0');  // 弹窗纬度
const popupLon = ref('0');  // 弹窗经度
const popupSic = ref('0%'); // 弹窗海冰浓度
const popupDate = ref('2025-01-01'); // 弹窗日期
const popupRegion = ref('Antarctic'); // 弹窗区域

const openPopup = async (event) => {
  console.log(event);
  let pixel = null;
  let lat = null;
  let lon = null;
  map.value.on('click', async function () {
    const coordinate = evt.coordinate;
    pixel = map.getPixelFromCoordinate(coordinate);
    const lonLat = toLonLat(coordinate, map.getView().getProjection());

    // 格式化经纬度
    const hdms = toStringHDMS(lonLat);
    lat = hdms.slice(0, 13);
    lon = hdms.slice(14, 27);
  });
  const {sic, date, region } = await setupMapClickHandler(map.value, sicLayer.value, pixel, store);

  console.log(currentPixelInfo); // 打印点击位置的信息，用于调试
  popupOffsetX.value = event.clientX; // 记录点击位置的 x 坐标
  popupOffsetY.value = event.clientY; // 记录点击位置的 y 坐标
  popupLat.value = lat; // 记录点击位置的纬度
  popupLon.value = lon; // 记录点击位置的经度
  popupSic.value = sic; // 记录点击位置的海冰浓度
  popupDate.value = date; // 记录点击位置的日期
  popupRegion.value = region; // 记录点击位置的区域

  popupRef.value.openModal(event);
};

const closePopup = () => {
  popupRef.value.closeModal();
};

const toggleLayer = (key) => {
  store.setLayerVisible(key);
  // 根据key设置对应图层的可见性
  switch (key) {
    case 'baseLayer':
      toast('错误', '底图不可隐藏！', 'error');
      break;
    case 'sicLayer':
      if (sicLayer.value) {
        sicLayer.value.setVisible(store.layerStatus.sicLayer.visible);
      }
      break;
  }
}

const handleFullscreen = () => {
  const mapElement = mapContainer.value; // 获取地图容器元素
  if (!document.fullscreenElement) {
    // 进入全屏
    mapElement.requestFullscreen().catch(err => {
      toast('错误', `全屏失败: ${err.message}`, 'error');
    });
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// console.log(store.layerStatus['sicLayer'].layerOpacity);
const layerOpacity = computed(() => (key) => {
  if (key === 'baseLayer') return 1; // 底图不透明
  return Number(store.layerStatus[key].layerOpacity);
});

const handleLayerOpacityChange = (value, key) => {
  // console.log(value); // 检查传入的参数是否正确
  store.setLayerOpacity(key, value);
  switch (key) {
    case 'baseLayer':
      toast('错误', '底图不可设置透明度！', 'error');
      break;
    case 'sicLayer':
      if (sicLayer.value) {
        sicLayer.value.setOpacity(store.layerStatus.sicLayer.layerOpacity); // 更新图层透明度
      }
      break;
  }
}

const handleDateChange = (value) => {
  // 确保在更新日期时不重复请求
  if (isUpdating) return;
  isUpdating = true; // 设置标志为正在更新
  // 更新当前日期
  store.currentDate = value;
  dateValue.value = value; // 更新 Vue 响应式数据
  isUpdating = false; // 重置标志
  updateSeaIceConLayer(value); // 更新图层
}

proj4.defs(
  'EPSG:3976',
  '+proj=stere +lat_0=-90 +lat_ts=-70 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);

const extent = [
  -7000000, -7000000,  // 左下角坐标
  7000000, 7000000     // 右上角坐标
];

const baseLayer = new TileLayer({
  source: new XYZ({
    url: '/world_xyz_110m/{z}/{x}/{y}.png',
  }),
  zIndex: 0
})

// 监听南北极状态变化
watch(
  () => store.mapStatus.activeRegion,
  async (newRegion) => {
    if (newRegion === 'Arctic') {
      const bgColor = '#232227';
      store.setMapBackgroundColor(bgColor);

      const projection = 'EPSG:3413';
      // 更新地图投影
      map.value.setView(new View({
        projection,
        center: [0, 0],
        zoom: map.value.getView().getZoom(),
        extent: extent,
        constrainOnlyCenter: false,
        smoothExtentConstraint: true
      }));
      // 重新加载当前日期的数据
      updateSeaIceConLayer(store.currentDate);
    }
    else {
      const bgColor = '#3f3f41';
      store.setMapBackgroundColor(bgColor);

      const projection = 'EPSG:3976';
      // 更新地图投影
      map.value.setView(new View({
        projection,
        center: [0, 0],
        zoom: map.value.getView().getZoom(),
        extent: extent,
        constrainOnlyCenter: false,
        smoothExtentConstraint: true
      }));
      // 重新加载当前日期的数据
      updateSeaIceConLayer(store.currentDate);
    }
  }
)

const updateSeaIceConLayer = async (date) => {
  try {
    isLoading.value = true; // 显示加载动画
    // 先移除所有点击事件
    map.value.removeEventListener('click');
    // 移除旧的SST图层
    map.value.getLayers().forEach(layer => {
      if (layer.get('type') === 'sic') {
        map.value.removeLayer(layer);
      }
    });
    date = formatDate(date);
    let url = '';
    if (store.mapStatus.activeRegion === 'Arctic') {
      url = `https://ocean.cn-sy1.rains3.com/north-sic/${date}.tif`;
    } else {
      url = `https://ocean.cn-sy1.rains3.com/south-sic/${date}.tif`;
    }

    // 加载新数据
    const response = await fetch(url);
    if (!response.ok) throw new Error('数据加载失败');
    const blob = await response.blob();
    // 创建新图层
    const source = new GeoTIFF({
      sources: [{ blob, bands: [1] }],
      convertToRGB: false,
      normalize: false,
    });
    sicLayer.value = new WebGLTileLayer({
      source,
      style: {
        color: [
          'case',
          ['==', ['band', 1], 120], [63, 63, 65, 1],  // 120：陆地
          ['==', ['band', 1], 110], [233, 203, 0, 1], // 110：缺失值
          ['>', ['band', 1], 95], [210, 214, 217, 1],
          ['>', ['band', 1], 90], [193, 207, 216, 1],
          ['>', ['band', 1], 85], [178, 201, 217, 1],
          ['>', ['band', 1], 80], [161, 193, 216, 1],
          ['>', ['band', 1], 75], [143, 187, 214, 1],
          ['>', ['band', 1], 70], [123, 181, 215, 1],
          ['>', ['band', 1], 65], [107, 173, 215, 1],
          ['>', ['band', 1], 60], [89, 167, 213, 1],
          ['>', ['band', 1], 55], [73, 160, 214, 1],
          ['>', ['band', 1], 50], [59, 153, 214, 1],
          ['>', ['band', 1], 45], [42, 146, 214, 1],
          ['>', ['band', 1], 40], [143, 187, 214, 1],
          ['>', ['band', 1], 35], [30, 139, 214, 1],
          ['>', ['band', 1], 30], [21, 126, 211, 1],
          ['>', ['band', 1], 25], [20, 119, 207, 1],
          ['>', ['band', 1], 20], [20, 112, 200, 1],
          ['>', ['band', 1], 15], [16, 104, 193, 1],
          ['>', ['band', 1], 10], [8, 51, 96, 1],
          ['>', ['band', 1], 5], [8, 51, 96, 1],
          ['>', ['band', 1], 0], [8, 51, 96, 1],
          [35, 34, 39, 1] // 0：开放水域
        ]
      },
      zIndex: 1, // 确保在底图之上
    });
    // 添加标识便于后续移除
    sicLayer.value.set('type', 'sic');
    // 添加新图层
    if (!store.layerStatus.sicLayer.visible) {
      sicLayer.value.setVisible(false);
    }
    await map.value.addLayer(sicLayer.value);
    // await setupMapClickHandler(map.value, sicLayer.value, store);
  } catch (error) {
    // toast('错误', error.message, 'error');
  } finally {
    isLoading.value = false; // 结束加载动画
  }
}

onMounted(async () => {
  // 添加全屏状态变化监听
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    // 全屏时隐藏控制元素
    document.querySelector('.map-controls-container').style.display = isFullscreen ? 'none' : 'flex';
    document.querySelector('.z-1000').style.display = isFullscreen ? 'none' : 'block';
  });

  // 创建地图
  map.value = new Map({
    target: mapContainer.value,
    layers: [
      baseLayer,
    ],
    view: new View({
      projection: 'EPSG:3976',
      center: [0, 0], // 初始中心
      zoom: 0,
      extent: extent, // 设置 extent
      constrainOnlyCenter: false,
      smoothExtentConstraint: true, // 平滑约束
    }),
    controls: [], // 禁用默认控件
  });

  // 初始化加载默认日期的SST
  await updateSeaIceConLayer(store.currentDate);
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.setTarget(null); // 移除地图
  }
});

</script>

<style scoped>
.root-container {
  height: 100%;
  width: 100%;
}

.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.map-container:-webkit-full-screen {
  width: 100% !important;
  height: 100% !important;
}

.map-container:-moz-full-screen {
  width: 100% !important;
  height: 100% !important;
}

.map-container:-ms-fullscreen {
  width: 100% !important;
  height: 100% !important;
}

.map-container:fullscreen {
  width: 100% !important;
  height: 100% !important;
}

.layerPopup {
  @apply z-9999 absolute bg-white w-40 h-40 p-2 rounded-lg top-[50%] left-[25%] text-dark-50 border-1 border-gray-300 shadow-md;
}

.map-loader {
  @apply z-9999 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center;
  background-color: rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.loading-icon {
  @apply text-6xl;
  animation: spin 3s linear infinite;
}

/* 雪花旋转动画 逆时针 */
@keyframes spin {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.loading-text {
  @apply text-sm mt-2;
}

.map-controls-container {
  @apply z-1000 absolute right-3 flex mt-2 space-x-2;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.map-control-btn {
  @apply w-6 h-6 bg-white rounded-sm;
  cursor: pointer;
}

.tooltip {
  @apply absolute top-5 left-[50%] w-10 rounded-sm text-center text-white bg-[#0891B2] invisible opacity-0 select-none;
  transform: translateX(-50%);
  transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tooltip::before {
  @apply absolute bottom-[100%] left-[50%];
  content: "";
  border-width: 0.25rem;
  border-style: solid;
  border-color: transparent transparent #0891B2 transparent;
  transform: translateX(-50%);
}

.tooltip-container:hover .tooltip {
  @apply visible top-[120%] visible opacity-100 bg-[#0891B2];
  transform: translate(-50%);
}

.layersControlContainer {
  @apply absolute top-full right-8 mt-2 w-64 h-64 bg-white rounded-lg shadow-lg z-50;
}

.time-slider-container {
  @apply z-1000 absolute bottom-4 left-[26%] w-1/2 h-16 bg-white/90 rounded-lg shadow-md p-2;
}

/* 添加淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
