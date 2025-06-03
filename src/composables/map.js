import { ref, computed } from 'vue';
import { toStringHDMS } from 'ol/coordinate.js';
import { toLonLat } from 'ol/proj.js';

export async function setupMapClickHandler(map, sicLayer, pixel, store) {

    const currentDate = store.currentDate; // 获取当前日期
    const currentRegion = store.mapStatus.activeRegion; // 获取当前区域

    // 获取海冰浓度值
    const sicData = await sicLayer.getData(pixel);
    let iceCon = '0';
    // 处理数据
    if (sicData === null) {
        iceCon = '无数据';
    } else if (sicData[0] === 110) {
        iceCon = '数据缺失或未计算';
    } else if (sicData[0] === 120) {
        iceCon = '陆地';
    } else if (sicData[0] === 0) {
        iceCon = '开放水域';
    } else {
        iceCon = `${sicData[0]}%`;
    }
    return {
        sic: iceCon,
        date: formatDate(currentDate), // 格式化日期
        region: currentRegion, // 当前区域
    }


}

// 格式化日期
export const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    // 如果传入的是无效日期，返回当前日期
    if (isNaN(date.getTime())) {
        return formatDate(new Date());
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以要加1

    // 获取当月实际天数
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    // 确保日期不超过当月最大值
    const day = Math.min(date.getDate(), getDaysInMonth(year, month));
    // 格式化输出
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};
