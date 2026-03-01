/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 90.0, "minX": 0.0, "maxY": 5403.0, "series": [{"data": [[0.0, 90.0], [0.1, 91.0], [0.2, 92.0], [0.3, 92.0], [0.4, 94.0], [0.5, 96.0], [0.6, 98.0], [0.7, 99.0], [0.8, 101.0], [0.9, 102.0], [1.0, 104.0], [1.1, 106.0], [1.2, 108.0], [1.3, 111.0], [1.4, 121.0], [1.5, 164.0], [1.6, 185.0], [1.7, 190.0], [1.8, 191.0], [1.9, 193.0], [2.0, 195.0], [2.1, 196.0], [2.2, 198.0], [2.3, 199.0], [2.4, 200.0], [2.5, 201.0], [2.6, 202.0], [2.7, 203.0], [2.8, 205.0], [2.9, 206.0], [3.0, 208.0], [3.1, 210.0], [3.2, 222.0], [3.3, 279.0], [3.4, 289.0], [3.5, 292.0], [3.6, 294.0], [3.7, 295.0], [3.8, 296.0], [3.9, 297.0], [4.0, 298.0], [4.1, 299.0], [4.2, 301.0], [4.3, 302.0], [4.4, 303.0], [4.5, 304.0], [4.6, 305.0], [4.7, 307.0], [4.8, 311.0], [4.9, 324.0], [5.0, 378.0], [5.1, 389.0], [5.2, 393.0], [5.3, 395.0], [5.4, 396.0], [5.5, 397.0], [5.6, 398.0], [5.7, 399.0], [5.8, 401.0], [5.9, 402.0], [6.0, 403.0], [6.1, 404.0], [6.2, 405.0], [6.3, 406.0], [6.4, 410.0], [6.5, 418.0], [6.6, 470.0], [6.7, 490.0], [6.8, 492.0], [6.9, 494.0], [7.0, 495.0], [7.1, 496.0], [7.2, 497.0], [7.3, 498.0], [7.4, 499.0], [7.5, 499.0], [7.6, 500.0], [7.7, 500.0], [7.8, 501.0], [7.9, 502.0], [8.0, 503.0], [8.1, 504.0], [8.2, 505.0], [8.3, 506.0], [8.4, 507.0], [8.5, 508.0], [8.6, 510.0], [8.7, 514.0], [8.8, 543.0], [8.9, 575.0], [9.0, 579.0], [9.1, 585.0], [9.2, 589.0], [9.3, 591.0], [9.4, 592.0], [9.5, 593.0], [9.6, 594.0], [9.7, 594.0], [9.8, 595.0], [9.9, 596.0], [10.0, 596.0], [10.1, 596.0], [10.2, 597.0], [10.3, 597.0], [10.4, 598.0], [10.5, 598.0], [10.6, 598.0], [10.7, 599.0], [10.8, 599.0], [10.9, 599.0], [11.0, 599.0], [11.1, 599.0], [11.2, 600.0], [11.3, 600.0], [11.4, 600.0], [11.5, 600.0], [11.6, 601.0], [11.7, 601.0], [11.8, 601.0], [11.9, 601.0], [12.0, 601.0], [12.1, 601.0], [12.2, 602.0], [12.3, 602.0], [12.4, 602.0], [12.5, 602.0], [12.6, 603.0], [12.7, 603.0], [12.8, 603.0], [12.9, 603.0], [13.0, 603.0], [13.1, 604.0], [13.2, 604.0], [13.3, 604.0], [13.4, 604.0], [13.5, 604.0], [13.6, 605.0], [13.7, 605.0], [13.8, 605.0], [13.9, 605.0], [14.0, 606.0], [14.1, 606.0], [14.2, 606.0], [14.3, 606.0], [14.4, 606.0], [14.5, 607.0], [14.6, 607.0], [14.7, 607.0], [14.8, 608.0], [14.9, 608.0], [15.0, 608.0], [15.1, 608.0], [15.2, 609.0], [15.3, 609.0], [15.4, 610.0], [15.5, 610.0], [15.6, 611.0], [15.7, 611.0], [15.8, 612.0], [15.9, 614.0], [16.0, 617.0], [16.1, 623.0], [16.2, 628.0], [16.3, 639.0], [16.4, 667.0], [16.5, 672.0], [16.6, 676.0], [16.7, 679.0], [16.8, 682.0], [16.9, 685.0], [17.0, 688.0], [17.1, 688.0], [17.2, 689.0], [17.3, 690.0], [17.4, 690.0], [17.5, 691.0], [17.6, 691.0], [17.7, 692.0], [17.8, 692.0], [17.9, 692.0], [18.0, 692.0], [18.1, 693.0], [18.2, 693.0], [18.3, 693.0], [18.4, 693.0], [18.5, 693.0], [18.6, 694.0], [18.7, 694.0], [18.8, 694.0], [18.9, 694.0], [19.0, 694.0], [19.1, 695.0], [19.2, 695.0], [19.3, 695.0], [19.4, 695.0], [19.5, 695.0], [19.6, 695.0], [19.7, 695.0], [19.8, 696.0], [19.9, 696.0], [20.0, 696.0], [20.1, 696.0], [20.2, 696.0], [20.3, 696.0], [20.4, 696.0], [20.5, 697.0], [20.6, 697.0], [20.7, 697.0], [20.8, 697.0], [20.9, 697.0], [21.0, 697.0], [21.1, 697.0], [21.2, 697.0], [21.3, 698.0], [21.4, 698.0], [21.5, 698.0], [21.6, 698.0], [21.7, 698.0], [21.8, 698.0], [21.9, 698.0], [22.0, 698.0], [22.1, 698.0], [22.2, 699.0], [22.3, 699.0], [22.4, 699.0], [22.5, 699.0], [22.6, 699.0], [22.7, 699.0], [22.8, 699.0], [22.9, 699.0], [23.0, 700.0], [23.1, 700.0], [23.2, 700.0], [23.3, 700.0], [23.4, 700.0], [23.5, 700.0], [23.6, 700.0], [23.7, 700.0], [23.8, 700.0], [23.9, 701.0], [24.0, 701.0], [24.1, 701.0], [24.2, 701.0], [24.3, 701.0], [24.4, 701.0], [24.5, 701.0], [24.6, 701.0], [24.7, 701.0], [24.8, 701.0], [24.9, 702.0], [25.0, 702.0], [25.1, 702.0], [25.2, 702.0], [25.3, 702.0], [25.4, 702.0], [25.5, 702.0], [25.6, 702.0], [25.7, 703.0], [25.8, 703.0], [25.9, 703.0], [26.0, 703.0], [26.1, 703.0], [26.2, 703.0], [26.3, 703.0], [26.4, 703.0], [26.5, 704.0], [26.6, 704.0], [26.7, 704.0], [26.8, 704.0], [26.9, 704.0], [27.0, 704.0], [27.1, 705.0], [27.2, 705.0], [27.3, 705.0], [27.4, 705.0], [27.5, 705.0], [27.6, 706.0], [27.7, 706.0], [27.8, 706.0], [27.9, 706.0], [28.0, 707.0], [28.1, 707.0], [28.2, 707.0], [28.3, 708.0], [28.4, 708.0], [28.5, 709.0], [28.6, 709.0], [28.7, 710.0], [28.8, 711.0], [28.9, 712.0], [29.0, 714.0], [29.1, 717.0], [29.2, 720.0], [29.3, 724.0], [29.4, 727.0], [29.5, 734.0], [29.6, 770.0], [29.7, 775.0], [29.8, 781.0], [29.9, 786.0], [30.0, 788.0], [30.1, 789.0], [30.2, 789.0], [30.3, 790.0], [30.4, 791.0], [30.5, 791.0], [30.6, 792.0], [30.7, 792.0], [30.8, 792.0], [30.9, 793.0], [31.0, 793.0], [31.1, 793.0], [31.2, 794.0], [31.3, 794.0], [31.4, 794.0], [31.5, 795.0], [31.6, 795.0], [31.7, 795.0], [31.8, 796.0], [31.9, 796.0], [32.0, 796.0], [32.1, 796.0], [32.2, 797.0], [32.3, 797.0], [32.4, 797.0], [32.5, 797.0], [32.6, 798.0], [32.7, 798.0], [32.8, 798.0], [32.9, 798.0], [33.0, 799.0], [33.1, 799.0], [33.2, 800.0], [33.3, 800.0], [33.4, 800.0], [33.5, 800.0], [33.6, 801.0], [33.7, 801.0], [33.8, 802.0], [33.9, 802.0], [34.0, 802.0], [34.1, 803.0], [34.2, 803.0], [34.3, 804.0], [34.4, 805.0], [34.5, 805.0], [34.6, 806.0], [34.7, 807.0], [34.8, 808.0], [34.9, 809.0], [35.0, 810.0], [35.1, 813.0], [35.2, 818.0], [35.3, 824.0], [35.4, 851.0], [35.5, 878.0], [35.6, 887.0], [35.7, 889.0], [35.8, 891.0], [35.9, 893.0], [36.0, 894.0], [36.1, 894.0], [36.2, 895.0], [36.3, 896.0], [36.4, 897.0], [36.5, 897.0], [36.6, 898.0], [36.7, 899.0], [36.8, 900.0], [36.9, 901.0], [37.0, 901.0], [37.1, 903.0], [37.2, 904.0], [37.3, 905.0], [37.4, 906.0], [37.5, 909.0], [37.6, 913.0], [37.7, 923.0], [37.8, 950.0], [37.9, 981.0], [38.0, 989.0], [38.1, 992.0], [38.2, 993.0], [38.3, 995.0], [38.4, 997.0], [38.5, 998.0], [38.6, 999.0], [38.7, 1000.0], [38.8, 1001.0], [38.9, 1002.0], [39.0, 1004.0], [39.1, 1005.0], [39.2, 1007.0], [39.3, 1009.0], [39.4, 1017.0], [39.5, 1043.0], [39.6, 1083.0], [39.7, 1089.0], [39.8, 1092.0], [39.9, 1094.0], [40.0, 1096.0], [40.1, 1097.0], [40.2, 1098.0], [40.3, 1099.0], [40.4, 1100.0], [40.5, 1101.0], [40.6, 1102.0], [40.7, 1104.0], [40.8, 1106.0], [40.9, 1108.0], [41.0, 1116.0], [41.1, 1148.0], [41.2, 1185.0], [41.3, 1191.0], [41.4, 1194.0], [41.5, 1195.0], [41.6, 1197.0], [41.7, 1199.0], [41.8, 1200.0], [41.9, 1202.0], [42.0, 1203.0], [42.1, 1204.0], [42.2, 1205.0], [42.3, 1206.0], [42.4, 1207.0], [42.5, 1208.0], [42.6, 1209.0], [42.7, 1215.0], [42.8, 1232.0], [42.9, 1269.0], [43.0, 1279.0], [43.1, 1287.0], [43.2, 1291.0], [43.3, 1292.0], [43.4, 1293.0], [43.5, 1294.0], [43.6, 1295.0], [43.7, 1295.0], [43.8, 1296.0], [43.9, 1296.0], [44.0, 1297.0], [44.1, 1297.0], [44.2, 1298.0], [44.3, 1298.0], [44.4, 1298.0], [44.5, 1298.0], [44.6, 1299.0], [44.7, 1299.0], [44.8, 1299.0], [44.9, 1300.0], [45.0, 1300.0], [45.1, 1300.0], [45.2, 1300.0], [45.3, 1301.0], [45.4, 1301.0], [45.5, 1301.0], [45.6, 1301.0], [45.7, 1302.0], [45.8, 1302.0], [45.9, 1302.0], [46.0, 1302.0], [46.1, 1303.0], [46.2, 1303.0], [46.3, 1303.0], [46.4, 1303.0], [46.5, 1304.0], [46.6, 1304.0], [46.7, 1304.0], [46.8, 1305.0], [46.9, 1305.0], [47.0, 1305.0], [47.1, 1305.0], [47.2, 1306.0], [47.3, 1306.0], [47.4, 1306.0], [47.5, 1307.0], [47.6, 1307.0], [47.7, 1307.0], [47.8, 1308.0], [47.9, 1308.0], [48.0, 1308.0], [48.1, 1309.0], [48.2, 1310.0], [48.3, 1311.0], [48.4, 1312.0], [48.5, 1315.0], [48.6, 1324.0], [48.7, 1330.0], [48.8, 1337.0], [48.9, 1367.0], [49.0, 1371.0], [49.1, 1377.0], [49.2, 1383.0], [49.3, 1387.0], [49.4, 1389.0], [49.5, 1390.0], [49.6, 1391.0], [49.7, 1391.0], [49.8, 1392.0], [49.9, 1392.0], [50.0, 1393.0], [50.1, 1393.0], [50.2, 1393.0], [50.3, 1394.0], [50.4, 1394.0], [50.5, 1394.0], [50.6, 1394.0], [50.7, 1395.0], [50.8, 1395.0], [50.9, 1395.0], [51.0, 1395.0], [51.1, 1395.0], [51.2, 1396.0], [51.3, 1396.0], [51.4, 1396.0], [51.5, 1396.0], [51.6, 1396.0], [51.7, 1397.0], [51.8, 1397.0], [51.9, 1397.0], [52.0, 1397.0], [52.1, 1397.0], [52.2, 1397.0], [52.3, 1398.0], [52.4, 1398.0], [52.5, 1398.0], [52.6, 1398.0], [52.7, 1398.0], [52.8, 1398.0], [52.9, 1399.0], [53.0, 1399.0], [53.1, 1399.0], [53.2, 1399.0], [53.3, 1399.0], [53.4, 1399.0], [53.5, 1400.0], [53.6, 1400.0], [53.7, 1400.0], [53.8, 1400.0], [53.9, 1400.0], [54.0, 1400.0], [54.1, 1401.0], [54.2, 1401.0], [54.3, 1401.0], [54.4, 1401.0], [54.5, 1401.0], [54.6, 1401.0], [54.7, 1402.0], [54.8, 1402.0], [54.9, 1402.0], [55.0, 1402.0], [55.1, 1402.0], [55.2, 1402.0], [55.3, 1403.0], [55.4, 1403.0], [55.5, 1403.0], [55.6, 1403.0], [55.7, 1403.0], [55.8, 1404.0], [55.9, 1404.0], [56.0, 1404.0], [56.1, 1404.0], [56.2, 1404.0], [56.3, 1405.0], [56.4, 1405.0], [56.5, 1405.0], [56.6, 1405.0], [56.7, 1406.0], [56.8, 1406.0], [56.9, 1406.0], [57.0, 1407.0], [57.1, 1407.0], [57.2, 1408.0], [57.3, 1408.0], [57.4, 1409.0], [57.5, 1409.0], [57.6, 1410.0], [57.7, 1411.0], [57.8, 1413.0], [57.9, 1415.0], [58.0, 1424.0], [58.1, 1428.0], [58.2, 1436.0], [58.3, 1466.0], [58.4, 1472.0], [58.5, 1484.0], [58.6, 1488.0], [58.7, 1489.0], [58.8, 1490.0], [58.9, 1490.0], [59.0, 1491.0], [59.1, 1491.0], [59.2, 1492.0], [59.3, 1492.0], [59.4, 1493.0], [59.5, 1493.0], [59.6, 1494.0], [59.7, 1494.0], [59.8, 1494.0], [59.9, 1495.0], [60.0, 1495.0], [60.1, 1495.0], [60.2, 1496.0], [60.3, 1496.0], [60.4, 1496.0], [60.5, 1497.0], [60.6, 1497.0], [60.7, 1497.0], [60.8, 1497.0], [60.9, 1498.0], [61.0, 1498.0], [61.1, 1498.0], [61.2, 1498.0], [61.3, 1499.0], [61.4, 1499.0], [61.5, 1499.0], [61.6, 1499.0], [61.7, 1500.0], [61.8, 1500.0], [61.9, 1500.0], [62.0, 1500.0], [62.1, 1501.0], [62.2, 1501.0], [62.3, 1501.0], [62.4, 1501.0], [62.5, 1502.0], [62.6, 1502.0], [62.7, 1502.0], [62.8, 1503.0], [62.9, 1503.0], [63.0, 1504.0], [63.1, 1504.0], [63.2, 1505.0], [63.3, 1505.0], [63.4, 1506.0], [63.5, 1506.0], [63.6, 1507.0], [63.7, 1509.0], [63.8, 1510.0], [63.9, 1513.0], [64.0, 1519.0], [64.1, 1532.0], [64.2, 1567.0], [64.3, 1580.0], [64.4, 1586.0], [64.5, 1589.0], [64.6, 1591.0], [64.7, 1592.0], [64.8, 1593.0], [64.9, 1594.0], [65.0, 1594.0], [65.1, 1595.0], [65.2, 1596.0], [65.3, 1597.0], [65.4, 1597.0], [65.5, 1598.0], [65.6, 1599.0], [65.7, 1599.0], [65.8, 1600.0], [65.9, 1601.0], [66.0, 1602.0], [66.1, 1602.0], [66.2, 1603.0], [66.3, 1605.0], [66.4, 1606.0], [66.5, 1608.0], [66.6, 1611.0], [66.7, 1621.0], [66.8, 1649.0], [66.9, 1681.0], [67.0, 1691.0], [67.1, 1692.0], [67.2, 1694.0], [67.3, 1696.0], [67.4, 1697.0], [67.5, 1699.0], [67.6, 1700.0], [67.7, 1701.0], [67.8, 1702.0], [67.9, 1703.0], [68.0, 1705.0], [68.1, 1707.0], [68.2, 1712.0], [68.3, 1751.0], [68.4, 1787.0], [68.5, 1793.0], [68.6, 1795.0], [68.7, 1797.0], [68.8, 1799.0], [68.9, 1801.0], [69.0, 1802.0], [69.1, 1803.0], [69.2, 1805.0], [69.3, 1809.0], [69.4, 1818.0], [69.5, 1880.0], [69.6, 1892.0], [69.7, 1895.0], [69.8, 1898.0], [69.9, 1900.0], [70.0, 1901.0], [70.1, 1904.0], [70.2, 1907.0], [70.3, 1918.0], [70.4, 1971.0], [70.5, 1989.0], [70.6, 1993.0], [70.7, 1997.0], [70.8, 2000.0], [70.9, 2003.0], [71.0, 2008.0], [71.1, 2035.0], [71.2, 2092.0], [71.3, 2097.0], [71.4, 2100.0], [71.5, 2105.0], [71.6, 2126.0], [71.7, 2184.0], [71.8, 2194.0], [71.9, 2199.0], [72.0, 2202.0], [72.1, 2214.0], [72.2, 2290.0], [72.3, 2295.0], [72.4, 2302.0], [72.5, 2382.0], [72.6, 2401.0], [72.7, 2490.0], [72.8, 2500.0], [72.9, 2507.0], [73.0, 2568.0], [73.1, 2588.0], [73.2, 2595.0], [73.3, 2598.0], [73.4, 2599.0], [73.5, 2600.0], [73.6, 2601.0], [73.7, 2602.0], [73.8, 2604.0], [73.9, 2604.0], [74.0, 2605.0], [74.1, 2607.0], [74.2, 2609.0], [74.3, 2613.0], [74.4, 2654.0], [74.5, 2683.0], [74.6, 2689.0], [74.7, 2691.0], [74.8, 2692.0], [74.9, 2694.0], [75.0, 2694.0], [75.1, 2695.0], [75.2, 2696.0], [75.3, 2697.0], [75.4, 2697.0], [75.5, 2698.0], [75.6, 2698.0], [75.7, 2699.0], [75.8, 2699.0], [75.9, 2700.0], [76.0, 2700.0], [76.1, 2701.0], [76.2, 2701.0], [76.3, 2701.0], [76.4, 2702.0], [76.5, 2702.0], [76.6, 2703.0], [76.7, 2703.0], [76.8, 2704.0], [76.9, 2704.0], [77.0, 2705.0], [77.1, 2705.0], [77.2, 2706.0], [77.3, 2707.0], [77.4, 2708.0], [77.5, 2709.0], [77.6, 2710.0], [77.7, 2712.0], [77.8, 2723.0], [77.9, 2749.0], [78.0, 2781.0], [78.1, 2788.0], [78.2, 2790.0], [78.3, 2791.0], [78.4, 2792.0], [78.5, 2793.0], [78.6, 2794.0], [78.7, 2794.0], [78.8, 2795.0], [78.9, 2796.0], [79.0, 2796.0], [79.1, 2796.0], [79.2, 2797.0], [79.3, 2797.0], [79.4, 2798.0], [79.5, 2798.0], [79.6, 2798.0], [79.7, 2799.0], [79.8, 2799.0], [79.9, 2799.0], [80.0, 2800.0], [80.1, 2800.0], [80.2, 2800.0], [80.3, 2801.0], [80.4, 2801.0], [80.5, 2801.0], [80.6, 2802.0], [80.7, 2802.0], [80.8, 2802.0], [80.9, 2803.0], [81.0, 2803.0], [81.1, 2803.0], [81.2, 2804.0], [81.3, 2804.0], [81.4, 2805.0], [81.5, 2805.0], [81.6, 2806.0], [81.7, 2806.0], [81.8, 2807.0], [81.9, 2807.0], [82.0, 2808.0], [82.1, 2809.0], [82.2, 2810.0], [82.3, 2812.0], [82.4, 2820.0], [82.5, 2833.0], [82.6, 2863.0], [82.7, 2878.0], [82.8, 2886.0], [82.9, 2889.0], [83.0, 2890.0], [83.1, 2892.0], [83.2, 2893.0], [83.3, 2893.0], [83.4, 2894.0], [83.5, 2895.0], [83.6, 2895.0], [83.7, 2896.0], [83.8, 2896.0], [83.9, 2896.0], [84.0, 2897.0], [84.1, 2897.0], [84.2, 2898.0], [84.3, 2898.0], [84.4, 2898.0], [84.5, 2899.0], [84.6, 2899.0], [84.7, 2900.0], [84.8, 2900.0], [84.9, 2900.0], [85.0, 2901.0], [85.1, 2901.0], [85.2, 2901.0], [85.3, 2902.0], [85.4, 2902.0], [85.5, 2903.0], [85.6, 2903.0], [85.7, 2903.0], [85.8, 2904.0], [85.9, 2905.0], [86.0, 2905.0], [86.1, 2906.0], [86.2, 2907.0], [86.3, 2907.0], [86.4, 2908.0], [86.5, 2910.0], [86.6, 2912.0], [86.7, 2917.0], [86.8, 2925.0], [86.9, 2933.0], [87.0, 2969.0], [87.1, 2983.0], [87.2, 2988.0], [87.3, 2990.0], [87.4, 2991.0], [87.5, 2992.0], [87.6, 2992.0], [87.7, 2993.0], [87.8, 2994.0], [87.9, 2995.0], [88.0, 2995.0], [88.1, 2996.0], [88.2, 2996.0], [88.3, 2997.0], [88.4, 2997.0], [88.5, 2998.0], [88.6, 2998.0], [88.7, 2999.0], [88.8, 2999.0], [88.9, 3000.0], [89.0, 3000.0], [89.1, 3000.0], [89.2, 3001.0], [89.3, 3002.0], [89.4, 3002.0], [89.5, 3002.0], [89.6, 3003.0], [89.7, 3003.0], [89.8, 3004.0], [89.9, 3005.0], [90.0, 3005.0], [90.1, 3007.0], [90.2, 3007.0], [90.3, 3009.0], [90.4, 3011.0], [90.5, 3022.0], [90.6, 3058.0], [90.7, 3080.0], [90.8, 3089.0], [90.9, 3091.0], [91.0, 3093.0], [91.1, 3094.0], [91.2, 3095.0], [91.3, 3096.0], [91.4, 3096.0], [91.5, 3097.0], [91.6, 3098.0], [91.7, 3098.0], [91.8, 3099.0], [91.9, 3100.0], [92.0, 3100.0], [92.1, 3101.0], [92.2, 3102.0], [92.3, 3103.0], [92.4, 3103.0], [92.5, 3104.0], [92.6, 3105.0], [92.7, 3106.0], [92.8, 3108.0], [92.9, 3109.0], [93.0, 3113.0], [93.1, 3134.0], [93.2, 3174.0], [93.3, 3189.0], [93.4, 3191.0], [93.5, 3193.0], [93.6, 3194.0], [93.7, 3195.0], [93.8, 3196.0], [93.9, 3197.0], [94.0, 3198.0], [94.1, 3199.0], [94.2, 3200.0], [94.3, 3200.0], [94.4, 3201.0], [94.5, 3202.0], [94.6, 3203.0], [94.7, 3205.0], [94.8, 3206.0], [94.9, 3209.0], [95.0, 3215.0], [95.1, 3255.0], [95.2, 3287.0], [95.3, 3293.0], [95.4, 3295.0], [95.5, 3297.0], [95.6, 3298.0], [95.7, 3300.0], [95.8, 3302.0], [95.9, 3304.0], [96.0, 3307.0], [96.1, 3336.0], [96.2, 3387.0], [96.3, 3394.0], [96.4, 3397.0], [96.5, 3400.0], [96.6, 3402.0], [96.7, 3403.0], [96.8, 3405.0], [96.9, 3409.0], [97.0, 3429.0], [97.1, 3490.0], [97.2, 3494.0], [97.3, 3496.0], [97.4, 3499.0], [97.5, 3502.0], [97.6, 3505.0], [97.7, 3510.0], [97.8, 3590.0], [97.9, 3595.0], [98.0, 3598.0], [98.1, 3600.0], [98.2, 3606.0], [98.3, 3663.0], [98.4, 3693.0], [98.5, 3696.0], [98.6, 3702.0], [98.7, 3735.0], [98.8, 3794.0], [98.9, 3802.0], [99.0, 3837.0], [99.1, 3901.0], [99.2, 3927.0], [99.3, 4000.0], [99.4, 4098.0], [99.5, 4185.0], [99.6, 4294.0], [99.7, 4475.0], [99.8, 4817.0], [99.9, 5099.0]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 3.0, "minX": 0.0, "maxY": 3580.0, "series": [{"data": [[0.0, 212.0], [600.0, 3580.0], [700.0, 3095.0], [800.0, 1083.0], [900.0, 568.0], [1000.0, 518.0], [1100.0, 420.0], [1200.0, 944.0], [1300.0, 2587.0], [1400.0, 2493.0], [1500.0, 1233.0], [1600.0, 560.0], [1700.0, 376.0], [1800.0, 327.0], [1900.0, 271.0], [2000.0, 174.0], [2100.0, 172.0], [2200.0, 132.0], [2300.0, 63.0], [2400.0, 63.0], [2500.0, 205.0], [2600.0, 720.0], [2700.0, 1246.0], [2800.0, 1414.0], [2900.0, 1289.0], [3000.0, 907.0], [3100.0, 694.0], [3200.0, 454.0], [3300.0, 244.0], [3400.0, 279.0], [3500.0, 201.0], [3600.0, 151.0], [3700.0, 93.0], [3800.0, 64.0], [3900.0, 62.0], [4000.0, 35.0], [4100.0, 33.0], [4200.0, 34.0], [4300.0, 18.0], [4400.0, 6.0], [4500.0, 6.0], [4600.0, 13.0], [4700.0, 6.0], [4800.0, 7.0], [4900.0, 17.0], [5000.0, 9.0], [5100.0, 16.0], [5200.0, 6.0], [5300.0, 5.0], [5400.0, 3.0], [100.0, 501.0], [200.0, 530.0], [300.0, 484.0], [400.0, 556.0], [500.0, 1089.0]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 5400.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 10.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 16443.0, "series": [{"data": [[0.0, 2332.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 16443.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 11483.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 10.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 12.258103241296508, "minX": 1.7723961E12, "maxY": 100.0, "series": [{"data": [[1.7723964E12, 23.00225606316978], [1.77239658E12, 50.0], [1.77239646E12, 49.699952221691355], [1.77239664E12, 50.0], [1.77239652E12, 50.0], [1.7723967E12, 45.76573426573426]], "isOverall": false, "label": "Nivel 2 - 50 Usuarios", "isController": false}, {"data": [[1.77239688E12, 100.0], [1.77239676E12, 99.08059701492529], [1.77239694E12, 100.0], [1.77239682E12, 100.0], [1.772397E12, 84.77570093457943], [1.7723967E12, 43.849767981438454]], "isOverall": false, "label": "Nivel 3 - 100 Usuarios", "isController": false}, {"data": [[1.7723964E12, 23.72888888888889], [1.7723961E12, 12.258103241296508], [1.77239628E12, 25.0], [1.77239616E12, 24.91196498054471], [1.77239634E12, 25.0], [1.77239622E12, 25.0]], "isOverall": false, "label": "Nivel 1 - 25 Usuarios", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.772397E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 102.05128205128207, "minX": 1.0, "maxY": 3630.222222222222, "series": [{"data": [[2.0, 128.4186046511628], [3.0, 124.92913385826769], [4.0, 146.5206611570248], [5.0, 238.53146853146862], [6.0, 205.42281879194627], [7.0, 257.3125], [8.0, 239.56028368794335], [9.0, 323.1933333333335], [10.0, 309.67132867132875], [11.0, 329.758865248227], [12.0, 354.5424836601307], [13.0, 430.91780821917814], [14.0, 394.3790849673202], [15.0, 475.74834437086076], [16.0, 445.37681159420305], [17.0, 602.5144927536229], [18.0, 521.523489932886], [19.0, 573.8466666666667], [20.0, 542.3227848101264], [21.0, 582.5838926174497], [22.0, 641.451612903226], [23.0, 729.8257575757577], [24.0, 776.7777777777776], [25.0, 734.369186395866], [26.0, 772.8309859154926], [27.0, 772.2686567164177], [28.0, 829.5555555555554], [29.0, 838.5970149253734], [30.0, 855.5774647887325], [31.0, 776.3134328358207], [32.0, 1170.1521739130435], [33.0, 1156.732142857143], [34.0, 980.926470588235], [35.0, 899.6718750000001], [36.0, 1182.4838709677415], [37.0, 1049.0555555555557], [38.0, 1040.9076923076923], [39.0, 1111.1884057971008], [40.0, 1071.5373134328358], [41.0, 1109.784615384615], [42.0, 1215.8823529411764], [43.0, 1125.0151515151515], [44.0, 1270.0000000000002], [45.0, 1325.267857142857], [46.0, 1589.0204081632655], [47.0, 1659.7627118644068], [48.0, 1405.4477611940301], [49.0, 1336.6811594202902], [50.0, 1477.7206259933916], [51.0, 1370.4814814814813], [52.0, 1340.1052631578943], [53.0, 1548.695652173913], [54.0, 1517.84], [55.0, 1423.4999999999998], [56.0, 1773.75], [57.0, 1682.8260869565217], [58.0, 1901.230769230769], [59.0, 1705.4285714285713], [60.0, 1721.6842105263158], [61.0, 1801.8666666666668], [62.0, 2230.0555555555557], [63.0, 2114.5263157894738], [64.0, 2248.0416666666665], [65.0, 2037.2380952380954], [66.0, 1892.7391304347825], [67.0, 1831.4400000000003], [68.0, 1746.5263157894735], [69.0, 1882.3076923076924], [70.0, 1883.1818181818176], [71.0, 1889.8095238095236], [72.0, 2003.1999999999998], [73.0, 1927.1000000000001], [74.0, 2077.5263157894738], [75.0, 2102.633333333333], [76.0, 2010.6666666666665], [77.0, 2110.636363636364], [78.0, 1966.7368421052633], [79.0, 2230.7619047619046], [80.0, 2286.25], [81.0, 2264.0000000000005], [82.0, 2381.846153846153], [83.0, 2185.0454545454545], [84.0, 2199.9565217391305], [85.0, 2246.1176470588234], [86.0, 2499.8750000000005], [87.0, 2522.9285714285716], [88.0, 2784.3571428571427], [89.0, 2998.4615384615386], [90.0, 3263.0], [91.0, 3372.833333333333], [92.0, 3509.941176470588], [93.0, 3630.222222222222], [94.0, 3298.64], [95.0, 3066.863636363636], [96.0, 2887.4736842105267], [97.0, 2763.9599999999987], [98.0, 2668.0434782608695], [99.0, 2793.095238095238], [100.0, 3027.1758407859825], [1.0, 102.05128205128207]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}, {"data": [[52.45926390907869, 1569.833355358791]], "isOverall": false, "label": "GET /catalog/hotels-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 920.2, "minX": 1.7723961E12, "maxY": 82429.31666666667, "series": [{"data": [[1.77239688E12, 78175.91666666667], [1.77239658E12, 80145.08333333333], [1.77239628E12, 80617.68333333333], [1.77239694E12, 79239.26666666666], [1.77239616E12, 80972.13333333333], [1.77239682E12, 77506.4], [1.77239652E12, 79436.18333333333], [1.77239622E12, 80223.85], [1.7723964E12, 78687.9], [1.7723961E12, 65612.63333333333], [1.77239676E12, 79160.5], [1.77239646E12, 82429.31666666667], [1.77239664E12, 77939.61666666667], [1.77239634E12, 80105.7], [1.772397E12, 12286.216666666667], [1.7723967E12, 79160.5]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.77239688E12, 5690.333333333333], [1.77239658E12, 5833.666666666667], [1.77239628E12, 5868.066666666667], [1.77239694E12, 5767.733333333334], [1.77239616E12, 5893.866666666667], [1.77239682E12, 5641.6], [1.77239652E12, 5782.066666666667], [1.77239622E12, 5839.4], [1.7723964E12, 5727.6], [1.7723961E12, 4775.866666666667], [1.77239676E12, 5762.0], [1.77239646E12, 5999.933333333333], [1.77239664E12, 5673.133333333333], [1.77239634E12, 5830.8], [1.772397E12, 920.2], [1.7723967E12, 5762.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.772397E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 359.2671068427365, "minX": 1.7723961E12, "maxY": 3727.6697819314627, "series": [{"data": [[1.77239688E12, 3030.0564231738035], [1.77239658E12, 1472.016707616707], [1.77239628E12, 732.4518808011709], [1.77239694E12, 2983.6694831013942], [1.77239616E12, 724.4017509727615], [1.77239682E12, 3033.9771341463406], [1.77239652E12, 1486.3624194348051], [1.77239622E12, 736.0211094747173], [1.7723964E12, 666.451951951951], [1.7723961E12, 359.2671068427365], [1.77239676E12, 2936.3507462686566], [1.77239646E12, 1418.709030100334], [1.77239664E12, 1516.806467913088], [1.77239634E12, 738.5422812192725], [1.772397E12, 3727.6697819314627], [1.7723967E12, 1265.3995024875603]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.772397E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 359.23649459784, "minX": 1.7723961E12, "maxY": 3727.6697819314627, "series": [{"data": [[1.77239688E12, 3030.048866498741], [1.77239658E12, 1472.0054054054056], [1.77239628E12, 732.4425989252579], [1.77239694E12, 2983.664015904573], [1.77239616E12, 724.3861867704286], [1.77239682E12, 3033.967479674794], [1.77239652E12, 1486.3559742191364], [1.77239622E12, 736.0103092783497], [1.7723964E12, 666.4389389389394], [1.7723961E12, 359.23649459784], [1.77239676E12, 2936.3442786069677], [1.77239646E12, 1418.698518872432], [1.77239664E12, 1516.7988883274388], [1.77239634E12, 738.5319567354968], [1.772397E12, 3727.6697819314627], [1.7723967E12, 1265.3865671641777]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.772397E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.970054000981836, "minX": 1.7723961E12, "maxY": 4.2433943089430874, "series": [{"data": [[1.77239688E12, 4.009571788413098], [1.77239658E12, 2.027518427518429], [1.77239628E12, 0.9882755251587697], [1.77239694E12, 3.9726640159045705], [1.77239616E12, 1.0126459143968851], [1.77239682E12, 4.2433943089430874], [1.77239652E12, 2.0133862171541894], [1.77239622E12, 0.970054000981836], [1.7723964E12, 1.9624624624624596], [1.7723961E12, 1.1818727490996406], [1.77239676E12, 3.936815920398009], [1.77239646E12, 1.8996655518394656], [1.77239664E12, 2.132390096008082], [1.77239634E12, 1.0260570304818086], [1.772397E12, 4.208722741433018], [1.7723967E12, 3.603482587064678]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.772397E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 90.0, "minX": 1.7723961E12, "maxY": 5403.0, "series": [{"data": [[1.77239688E12, 4593.0], [1.77239658E12, 2396.0], [1.77239628E12, 1873.0], [1.77239694E12, 4007.0], [1.77239616E12, 1597.0], [1.77239682E12, 4386.0], [1.77239652E12, 2413.0], [1.77239622E12, 1401.0], [1.7723964E12, 1795.0], [1.7723961E12, 1401.0], [1.77239676E12, 3791.0], [1.77239646E12, 2194.0], [1.77239664E12, 2585.0], [1.77239634E12, 1420.0], [1.772397E12, 5403.0], [1.7723967E12, 2617.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.77239688E12, 2508.0], [1.77239658E12, 1101.0], [1.77239628E12, 499.0], [1.77239694E12, 2402.0], [1.77239616E12, 445.0], [1.77239682E12, 2464.0], [1.77239652E12, 1027.0], [1.77239622E12, 486.0], [1.7723964E12, 90.0], [1.7723961E12, 90.0], [1.77239676E12, 2208.0], [1.77239646E12, 1097.0], [1.77239664E12, 1087.0], [1.77239634E12, 401.0], [1.772397E12, 2525.0], [1.7723967E12, 91.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.77239688E12, 3502.0], [1.77239658E12, 1700.4], [1.77239628E12, 887.4000000000001], [1.77239694E12, 3397.0], [1.77239616E12, 899.0], [1.77239682E12, 3505.0], [1.77239652E12, 1701.0], [1.77239622E12, 900.0], [1.7723964E12, 1102.0], [1.7723961E12, 598.0], [1.77239676E12, 3402.0], [1.77239646E12, 1601.0], [1.77239664E12, 1806.0], [1.77239634E12, 899.0], [1.772397E12, 4996.6], [1.7723967E12, 2104.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.77239688E12, 4298.0], [1.77239658E12, 2152.3199999999983], [1.77239628E12, 1510.6399999999999], [1.77239694E12, 3803.87], [1.77239616E12, 1191.43], [1.77239682E12, 4097.3099999999995], [1.77239652E12, 2219.46], [1.77239622E12, 1200.0], [1.7723964E12, 1464.09], [1.7723961E12, 803.0], [1.77239676E12, 3692.7799999999997], [1.77239646E12, 2001.06], [1.77239664E12, 2295.0], [1.77239634E12, 1273.9000000000042], [1.772397E12, 5207.64], [1.7723967E12, 2354.89]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.77239688E12, 2910.0], [1.77239658E12, 1405.0], [1.77239628E12, 700.0], [1.77239694E12, 2910.0], [1.77239616E12, 699.0], [1.77239682E12, 2930.0], [1.77239652E12, 1408.0], [1.77239622E12, 701.0], [1.7723964E12, 694.0], [1.7723961E12, 314.5], [1.77239676E12, 2897.0], [1.77239646E12, 1397.0], [1.77239664E12, 1492.0], [1.77239634E12, 702.0], [1.772397E12, 3304.0], [1.7723967E12, 1304.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.77239688E12, 3795.7], [1.77239658E12, 1903.1999999999998], [1.77239628E12, 994.5999999999999], [1.77239694E12, 3503.35], [1.77239616E12, 1000.0], [1.77239682E12, 3800.0], [1.77239652E12, 1893.1], [1.77239622E12, 1004.0999999999999], [1.7723964E12, 1196.05], [1.7723961E12, 626.2999999999997], [1.77239676E12, 3502.0], [1.77239646E12, 1797.0], [1.77239664E12, 1996.0], [1.77239634E12, 1001.0], [1.772397E12, 5107.0], [1.7723967E12, 2205.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.772397E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 92.0, "minX": 6.0, "maxY": 5347.0, "series": [{"data": [[33.0, 1394.0], [32.0, 1498.0], [34.0, 1309.0], [35.0, 1494.0], [37.0, 1297.0], [36.0, 1292.0], [38.0, 1303.0], [39.0, 1294.0], [40.0, 702.0], [41.0, 1293.0], [42.0, 1300.0], [43.0, 2698.0], [6.0, 92.5], [9.0, 4156.0], [10.0, 92.0], [13.0, 92.0], [14.0, 908.5], [15.0, 2999.0], [17.0, 1712.0], [18.0, 1425.0], [19.0, 1022.0], [20.0, 1580.0], [21.0, 1992.5], [22.0, 1758.0], [23.0, 2110.0], [24.0, 1398.5], [25.0, 1547.0], [26.0, 1698.5], [27.0, 1506.0], [28.0, 1399.0], [29.0, 2800.0], [30.0, 1399.5], [31.0, 1698.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[29.0, 5347.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 43.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 92.0, "minX": 6.0, "maxY": 5347.0, "series": [{"data": [[33.0, 1394.0], [32.0, 1498.0], [34.0, 1309.0], [35.0, 1494.0], [37.0, 1297.0], [36.0, 1292.0], [38.0, 1303.0], [39.0, 1294.0], [40.0, 702.0], [41.0, 1293.0], [42.0, 1300.0], [43.0, 2698.0], [6.0, 92.5], [9.0, 4156.0], [10.0, 92.0], [13.0, 92.0], [14.0, 908.5], [15.0, 2999.0], [17.0, 1712.0], [18.0, 1425.0], [19.0, 1022.0], [20.0, 1580.0], [21.0, 1992.5], [22.0, 1758.0], [23.0, 2110.0], [24.0, 1398.5], [25.0, 1547.0], [26.0, 1698.5], [27.0, 1506.0], [28.0, 1399.0], [29.0, 2800.0], [30.0, 1399.5], [31.0, 1698.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[29.0, 5347.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 43.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 3.683333333333333, "minX": 1.7723961E12, "maxY": 34.983333333333334, "series": [{"data": [[1.77239688E12, 33.083333333333336], [1.77239658E12, 33.916666666666664], [1.77239628E12, 34.11666666666667], [1.77239694E12, 33.53333333333333], [1.77239616E12, 34.31666666666667], [1.77239682E12, 32.8], [1.77239652E12, 33.61666666666667], [1.77239622E12, 33.95], [1.7723964E12, 33.61666666666667], [1.7723961E12, 28.133333333333333], [1.77239676E12, 33.75], [1.77239646E12, 34.983333333333334], [1.77239664E12, 32.983333333333334], [1.77239634E12, 33.9], [1.772397E12, 3.683333333333333], [1.7723967E12, 34.083333333333336]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.772397E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.16666666666666666, "minX": 1.7723961E12, "maxY": 34.88333333333333, "series": [{"data": [[1.77239688E12, 33.083333333333336], [1.77239658E12, 33.916666666666664], [1.77239628E12, 34.11666666666667], [1.77239694E12, 33.53333333333333], [1.77239616E12, 34.266666666666666], [1.77239682E12, 32.8], [1.77239652E12, 33.61666666666667], [1.77239622E12, 33.95], [1.7723964E12, 33.3], [1.7723961E12, 27.766666666666666], [1.77239676E12, 33.5], [1.77239646E12, 34.88333333333333], [1.77239664E12, 32.983333333333334], [1.77239634E12, 33.9], [1.772397E12, 5.183333333333334], [1.7723967E12, 33.5]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.772397E12, 0.16666666666666666]], "isOverall": false, "label": "503", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.772397E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.16666666666666666, "minX": 1.7723961E12, "maxY": 34.88333333333333, "series": [{"data": [[1.77239688E12, 33.083333333333336], [1.77239658E12, 33.916666666666664], [1.77239628E12, 34.11666666666667], [1.77239694E12, 33.53333333333333], [1.77239616E12, 34.266666666666666], [1.77239682E12, 32.8], [1.77239652E12, 33.61666666666667], [1.77239622E12, 33.95], [1.7723964E12, 33.3], [1.7723961E12, 27.766666666666666], [1.77239676E12, 33.5], [1.77239646E12, 34.88333333333333], [1.77239664E12, 32.983333333333334], [1.77239634E12, 33.9], [1.772397E12, 5.183333333333334], [1.7723967E12, 33.5]], "isOverall": false, "label": "GET /catalog/hotels-success", "isController": false}, {"data": [[1.772397E12, 0.16666666666666666]], "isOverall": false, "label": "GET /catalog/hotels-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.772397E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.16666666666666666, "minX": 1.7723961E12, "maxY": 34.88333333333333, "series": [{"data": [[1.77239688E12, 33.083333333333336], [1.77239658E12, 33.916666666666664], [1.77239628E12, 34.11666666666667], [1.77239694E12, 33.53333333333333], [1.77239616E12, 34.266666666666666], [1.77239682E12, 32.8], [1.77239652E12, 33.61666666666667], [1.77239622E12, 33.95], [1.7723964E12, 33.3], [1.7723961E12, 27.766666666666666], [1.77239676E12, 33.5], [1.77239646E12, 34.88333333333333], [1.77239664E12, 32.983333333333334], [1.77239634E12, 33.9], [1.772397E12, 5.183333333333334], [1.7723967E12, 33.5]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.772397E12, 0.16666666666666666]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.772397E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

