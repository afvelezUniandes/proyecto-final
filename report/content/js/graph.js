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
        data: {"result": {"minY": 81.0, "minX": 0.0, "maxY": 2031.0, "series": [{"data": [[0.0, 81.0], [0.1, 82.0], [0.2, 83.0], [0.3, 83.0], [0.4, 83.0], [0.5, 83.0], [0.6, 83.0], [0.7, 83.0], [0.8, 83.0], [0.9, 83.0], [1.0, 83.0], [1.1, 84.0], [1.2, 84.0], [1.3, 84.0], [1.4, 84.0], [1.5, 84.0], [1.6, 84.0], [1.7, 84.0], [1.8, 84.0], [1.9, 84.0], [2.0, 84.0], [2.1, 84.0], [2.2, 84.0], [2.3, 84.0], [2.4, 84.0], [2.5, 84.0], [2.6, 84.0], [2.7, 84.0], [2.8, 84.0], [2.9, 84.0], [3.0, 85.0], [3.1, 85.0], [3.2, 85.0], [3.3, 85.0], [3.4, 85.0], [3.5, 85.0], [3.6, 85.0], [3.7, 85.0], [3.8, 85.0], [3.9, 85.0], [4.0, 85.0], [4.1, 85.0], [4.2, 85.0], [4.3, 85.0], [4.4, 85.0], [4.5, 85.0], [4.6, 85.0], [4.7, 85.0], [4.8, 85.0], [4.9, 86.0], [5.0, 86.0], [5.1, 86.0], [5.2, 86.0], [5.3, 86.0], [5.4, 86.0], [5.5, 86.0], [5.6, 86.0], [5.7, 86.0], [5.8, 86.0], [5.9, 86.0], [6.0, 86.0], [6.1, 86.0], [6.2, 86.0], [6.3, 86.0], [6.4, 86.0], [6.5, 87.0], [6.6, 87.0], [6.7, 87.0], [6.8, 87.0], [6.9, 87.0], [7.0, 87.0], [7.1, 87.0], [7.2, 87.0], [7.3, 87.0], [7.4, 87.0], [7.5, 87.0], [7.6, 87.0], [7.7, 87.0], [7.8, 88.0], [7.9, 88.0], [8.0, 88.0], [8.1, 88.0], [8.2, 88.0], [8.3, 88.0], [8.4, 88.0], [8.5, 88.0], [8.6, 88.0], [8.7, 88.0], [8.8, 88.0], [8.9, 88.0], [9.0, 88.0], [9.1, 89.0], [9.2, 89.0], [9.3, 89.0], [9.4, 89.0], [9.5, 89.0], [9.6, 89.0], [9.7, 89.0], [9.8, 89.0], [9.9, 89.0], [10.0, 89.0], [10.1, 89.0], [10.2, 90.0], [10.3, 90.0], [10.4, 90.0], [10.5, 90.0], [10.6, 90.0], [10.7, 90.0], [10.8, 90.0], [10.9, 90.0], [11.0, 91.0], [11.1, 91.0], [11.2, 91.0], [11.3, 91.0], [11.4, 91.0], [11.5, 91.0], [11.6, 91.0], [11.7, 92.0], [11.8, 92.0], [11.9, 92.0], [12.0, 92.0], [12.1, 93.0], [12.2, 93.0], [12.3, 93.0], [12.4, 93.0], [12.5, 94.0], [12.6, 94.0], [12.7, 94.0], [12.8, 94.0], [12.9, 95.0], [13.0, 95.0], [13.1, 95.0], [13.2, 96.0], [13.3, 96.0], [13.4, 96.0], [13.5, 97.0], [13.6, 97.0], [13.7, 97.0], [13.8, 98.0], [13.9, 98.0], [14.0, 98.0], [14.1, 99.0], [14.2, 99.0], [14.3, 99.0], [14.4, 100.0], [14.5, 100.0], [14.6, 100.0], [14.7, 100.0], [14.8, 101.0], [14.9, 101.0], [15.0, 101.0], [15.1, 102.0], [15.2, 102.0], [15.3, 102.0], [15.4, 102.0], [15.5, 103.0], [15.6, 103.0], [15.7, 103.0], [15.8, 104.0], [15.9, 104.0], [16.0, 104.0], [16.1, 105.0], [16.2, 105.0], [16.3, 105.0], [16.4, 106.0], [16.5, 106.0], [16.6, 106.0], [16.7, 107.0], [16.8, 107.0], [16.9, 107.0], [17.0, 108.0], [17.1, 108.0], [17.2, 109.0], [17.3, 109.0], [17.4, 109.0], [17.5, 110.0], [17.6, 110.0], [17.7, 111.0], [17.8, 111.0], [17.9, 111.0], [18.0, 112.0], [18.1, 112.0], [18.2, 112.0], [18.3, 113.0], [18.4, 113.0], [18.5, 114.0], [18.6, 114.0], [18.7, 114.0], [18.8, 115.0], [18.9, 115.0], [19.0, 116.0], [19.1, 116.0], [19.2, 116.0], [19.3, 117.0], [19.4, 117.0], [19.5, 118.0], [19.6, 118.0], [19.7, 118.0], [19.8, 119.0], [19.9, 119.0], [20.0, 120.0], [20.1, 120.0], [20.2, 120.0], [20.3, 121.0], [20.4, 121.0], [20.5, 122.0], [20.6, 122.0], [20.7, 123.0], [20.8, 123.0], [20.9, 124.0], [21.0, 124.0], [21.1, 125.0], [21.2, 125.0], [21.3, 126.0], [21.4, 126.0], [21.5, 127.0], [21.6, 127.0], [21.7, 128.0], [21.8, 129.0], [21.9, 129.0], [22.0, 130.0], [22.1, 131.0], [22.2, 131.0], [22.3, 132.0], [22.4, 133.0], [22.5, 134.0], [22.6, 135.0], [22.7, 136.0], [22.8, 137.0], [22.9, 138.0], [23.0, 139.0], [23.1, 140.0], [23.2, 141.0], [23.3, 142.0], [23.4, 143.0], [23.5, 144.0], [23.6, 145.0], [23.7, 147.0], [23.8, 148.0], [23.9, 149.0], [24.0, 150.0], [24.1, 151.0], [24.2, 152.0], [24.3, 154.0], [24.4, 155.0], [24.5, 157.0], [24.6, 158.0], [24.7, 159.0], [24.8, 161.0], [24.9, 162.0], [25.0, 163.0], [25.1, 164.0], [25.2, 165.0], [25.3, 166.0], [25.4, 167.0], [25.5, 168.0], [25.6, 169.0], [25.7, 170.0], [25.8, 171.0], [25.9, 172.0], [26.0, 173.0], [26.1, 174.0], [26.2, 174.0], [26.3, 175.0], [26.4, 176.0], [26.5, 176.0], [26.6, 177.0], [26.7, 178.0], [26.8, 179.0], [26.9, 179.0], [27.0, 180.0], [27.1, 181.0], [27.2, 181.0], [27.3, 182.0], [27.4, 182.0], [27.5, 183.0], [27.6, 183.0], [27.7, 184.0], [27.8, 185.0], [27.9, 185.0], [28.0, 186.0], [28.1, 186.0], [28.2, 187.0], [28.3, 188.0], [28.4, 188.0], [28.5, 189.0], [28.6, 189.0], [28.7, 190.0], [28.8, 190.0], [28.9, 191.0], [29.0, 192.0], [29.1, 192.0], [29.2, 192.0], [29.3, 193.0], [29.4, 193.0], [29.5, 194.0], [29.6, 194.0], [29.7, 195.0], [29.8, 195.0], [29.9, 196.0], [30.0, 196.0], [30.1, 197.0], [30.2, 197.0], [30.3, 198.0], [30.4, 198.0], [30.5, 198.0], [30.6, 199.0], [30.7, 199.0], [30.8, 200.0], [30.9, 200.0], [31.0, 201.0], [31.1, 201.0], [31.2, 201.0], [31.3, 202.0], [31.4, 202.0], [31.5, 203.0], [31.6, 203.0], [31.7, 204.0], [31.8, 204.0], [31.9, 205.0], [32.0, 205.0], [32.1, 205.0], [32.2, 206.0], [32.3, 206.0], [32.4, 207.0], [32.5, 207.0], [32.6, 207.0], [32.7, 208.0], [32.8, 208.0], [32.9, 209.0], [33.0, 209.0], [33.1, 209.0], [33.2, 210.0], [33.3, 210.0], [33.4, 210.0], [33.5, 211.0], [33.6, 211.0], [33.7, 211.0], [33.8, 211.0], [33.9, 212.0], [34.0, 212.0], [34.1, 212.0], [34.2, 213.0], [34.3, 213.0], [34.4, 213.0], [34.5, 214.0], [34.6, 214.0], [34.7, 214.0], [34.8, 214.0], [34.9, 215.0], [35.0, 215.0], [35.1, 215.0], [35.2, 215.0], [35.3, 216.0], [35.4, 216.0], [35.5, 216.0], [35.6, 216.0], [35.7, 217.0], [35.8, 217.0], [35.9, 217.0], [36.0, 217.0], [36.1, 217.0], [36.2, 218.0], [36.3, 218.0], [36.4, 218.0], [36.5, 218.0], [36.6, 219.0], [36.7, 219.0], [36.8, 219.0], [36.9, 219.0], [37.0, 219.0], [37.1, 220.0], [37.2, 220.0], [37.3, 220.0], [37.4, 220.0], [37.5, 221.0], [37.6, 221.0], [37.7, 221.0], [37.8, 221.0], [37.9, 222.0], [38.0, 222.0], [38.1, 222.0], [38.2, 223.0], [38.3, 223.0], [38.4, 223.0], [38.5, 224.0], [38.6, 224.0], [38.7, 224.0], [38.8, 225.0], [38.9, 225.0], [39.0, 226.0], [39.1, 226.0], [39.2, 227.0], [39.3, 227.0], [39.4, 228.0], [39.5, 229.0], [39.6, 230.0], [39.7, 231.0], [39.8, 232.0], [39.9, 234.0], [40.0, 236.0], [40.1, 238.0], [40.2, 240.0], [40.3, 242.0], [40.4, 245.0], [40.5, 247.0], [40.6, 249.0], [40.7, 251.0], [40.8, 253.0], [40.9, 256.0], [41.0, 257.0], [41.1, 259.0], [41.2, 261.0], [41.3, 263.0], [41.4, 264.0], [41.5, 266.0], [41.6, 267.0], [41.7, 268.0], [41.8, 270.0], [41.9, 271.0], [42.0, 272.0], [42.1, 273.0], [42.2, 274.0], [42.3, 275.0], [42.4, 276.0], [42.5, 276.0], [42.6, 277.0], [42.7, 277.0], [42.8, 278.0], [42.9, 278.0], [43.0, 279.0], [43.1, 279.0], [43.2, 280.0], [43.3, 280.0], [43.4, 280.0], [43.5, 281.0], [43.6, 281.0], [43.7, 281.0], [43.8, 281.0], [43.9, 282.0], [44.0, 282.0], [44.1, 282.0], [44.2, 283.0], [44.3, 283.0], [44.4, 283.0], [44.5, 283.0], [44.6, 284.0], [44.7, 284.0], [44.8, 284.0], [44.9, 284.0], [45.0, 284.0], [45.1, 285.0], [45.2, 285.0], [45.3, 285.0], [45.4, 285.0], [45.5, 285.0], [45.6, 286.0], [45.7, 286.0], [45.8, 286.0], [45.9, 286.0], [46.0, 286.0], [46.1, 287.0], [46.2, 287.0], [46.3, 287.0], [46.4, 287.0], [46.5, 287.0], [46.6, 287.0], [46.7, 288.0], [46.8, 288.0], [46.9, 288.0], [47.0, 288.0], [47.1, 288.0], [47.2, 288.0], [47.3, 288.0], [47.4, 289.0], [47.5, 289.0], [47.6, 289.0], [47.7, 289.0], [47.8, 289.0], [47.9, 289.0], [48.0, 290.0], [48.1, 290.0], [48.2, 290.0], [48.3, 290.0], [48.4, 290.0], [48.5, 290.0], [48.6, 290.0], [48.7, 291.0], [48.8, 291.0], [48.9, 291.0], [49.0, 291.0], [49.1, 291.0], [49.2, 291.0], [49.3, 292.0], [49.4, 292.0], [49.5, 292.0], [49.6, 292.0], [49.7, 292.0], [49.8, 292.0], [49.9, 293.0], [50.0, 293.0], [50.1, 293.0], [50.2, 293.0], [50.3, 293.0], [50.4, 294.0], [50.5, 294.0], [50.6, 294.0], [50.7, 294.0], [50.8, 294.0], [50.9, 294.0], [51.0, 295.0], [51.1, 295.0], [51.2, 295.0], [51.3, 295.0], [51.4, 295.0], [51.5, 295.0], [51.6, 296.0], [51.7, 296.0], [51.8, 296.0], [51.9, 296.0], [52.0, 296.0], [52.1, 297.0], [52.2, 297.0], [52.3, 297.0], [52.4, 297.0], [52.5, 297.0], [52.6, 298.0], [52.7, 298.0], [52.8, 298.0], [52.9, 298.0], [53.0, 299.0], [53.1, 299.0], [53.2, 299.0], [53.3, 299.0], [53.4, 299.0], [53.5, 300.0], [53.6, 300.0], [53.7, 300.0], [53.8, 301.0], [53.9, 301.0], [54.0, 301.0], [54.1, 301.0], [54.2, 302.0], [54.3, 302.0], [54.4, 302.0], [54.5, 303.0], [54.6, 303.0], [54.7, 303.0], [54.8, 303.0], [54.9, 304.0], [55.0, 304.0], [55.1, 304.0], [55.2, 305.0], [55.3, 305.0], [55.4, 306.0], [55.5, 306.0], [55.6, 306.0], [55.7, 307.0], [55.8, 307.0], [55.9, 308.0], [56.0, 308.0], [56.1, 308.0], [56.2, 309.0], [56.3, 309.0], [56.4, 310.0], [56.5, 310.0], [56.6, 311.0], [56.7, 311.0], [56.8, 312.0], [56.9, 312.0], [57.0, 313.0], [57.1, 313.0], [57.2, 314.0], [57.3, 314.0], [57.4, 315.0], [57.5, 315.0], [57.6, 316.0], [57.7, 317.0], [57.8, 317.0], [57.9, 318.0], [58.0, 319.0], [58.1, 319.0], [58.2, 320.0], [58.3, 320.0], [58.4, 321.0], [58.5, 322.0], [58.6, 323.0], [58.7, 323.0], [58.8, 324.0], [58.9, 325.0], [59.0, 326.0], [59.1, 327.0], [59.2, 328.0], [59.3, 329.0], [59.4, 330.0], [59.5, 331.0], [59.6, 332.0], [59.7, 333.0], [59.8, 335.0], [59.9, 336.0], [60.0, 338.0], [60.1, 339.0], [60.2, 340.0], [60.3, 342.0], [60.4, 343.0], [60.5, 345.0], [60.6, 346.0], [60.7, 348.0], [60.8, 349.0], [60.9, 351.0], [61.0, 353.0], [61.1, 354.0], [61.2, 356.0], [61.3, 357.0], [61.4, 359.0], [61.5, 360.0], [61.6, 362.0], [61.7, 363.0], [61.8, 365.0], [61.9, 366.0], [62.0, 368.0], [62.1, 369.0], [62.2, 370.0], [62.3, 371.0], [62.4, 372.0], [62.5, 373.0], [62.6, 374.0], [62.7, 375.0], [62.8, 376.0], [62.9, 376.0], [63.0, 377.0], [63.1, 378.0], [63.2, 379.0], [63.3, 379.0], [63.4, 380.0], [63.5, 381.0], [63.6, 381.0], [63.7, 382.0], [63.8, 383.0], [63.9, 383.0], [64.0, 384.0], [64.1, 384.0], [64.2, 385.0], [64.3, 385.0], [64.4, 386.0], [64.5, 386.0], [64.6, 387.0], [64.7, 387.0], [64.8, 388.0], [64.9, 389.0], [65.0, 389.0], [65.1, 390.0], [65.2, 390.0], [65.3, 391.0], [65.4, 391.0], [65.5, 392.0], [65.6, 392.0], [65.7, 393.0], [65.8, 393.0], [65.9, 394.0], [66.0, 394.0], [66.1, 395.0], [66.2, 395.0], [66.3, 395.0], [66.4, 396.0], [66.5, 396.0], [66.6, 397.0], [66.7, 397.0], [66.8, 398.0], [66.9, 398.0], [67.0, 399.0], [67.1, 399.0], [67.2, 400.0], [67.3, 400.0], [67.4, 400.0], [67.5, 401.0], [67.6, 401.0], [67.7, 402.0], [67.8, 402.0], [67.9, 403.0], [68.0, 403.0], [68.1, 404.0], [68.2, 404.0], [68.3, 404.0], [68.4, 405.0], [68.5, 405.0], [68.6, 406.0], [68.7, 406.0], [68.8, 407.0], [68.9, 408.0], [69.0, 408.0], [69.1, 409.0], [69.2, 409.0], [69.3, 410.0], [69.4, 410.0], [69.5, 411.0], [69.6, 412.0], [69.7, 412.0], [69.8, 413.0], [69.9, 414.0], [70.0, 414.0], [70.1, 415.0], [70.2, 416.0], [70.3, 417.0], [70.4, 417.0], [70.5, 418.0], [70.6, 419.0], [70.7, 419.0], [70.8, 420.0], [70.9, 421.0], [71.0, 422.0], [71.1, 423.0], [71.2, 424.0], [71.3, 425.0], [71.4, 426.0], [71.5, 427.0], [71.6, 428.0], [71.7, 430.0], [71.8, 431.0], [71.9, 433.0], [72.0, 435.0], [72.1, 438.0], [72.2, 441.0], [72.3, 444.0], [72.4, 449.0], [72.5, 453.0], [72.6, 457.0], [72.7, 460.0], [72.8, 462.0], [72.9, 465.0], [73.0, 468.0], [73.1, 470.0], [73.2, 472.0], [73.3, 474.0], [73.4, 476.0], [73.5, 478.0], [73.6, 479.0], [73.7, 481.0], [73.8, 482.0], [73.9, 483.0], [74.0, 484.0], [74.1, 485.0], [74.2, 486.0], [74.3, 488.0], [74.4, 489.0], [74.5, 490.0], [74.6, 491.0], [74.7, 492.0], [74.8, 493.0], [74.9, 494.0], [75.0, 495.0], [75.1, 496.0], [75.2, 496.0], [75.3, 497.0], [75.4, 498.0], [75.5, 498.0], [75.6, 499.0], [75.7, 499.0], [75.8, 500.0], [75.9, 500.0], [76.0, 501.0], [76.1, 501.0], [76.2, 502.0], [76.3, 502.0], [76.4, 503.0], [76.5, 503.0], [76.6, 503.0], [76.7, 504.0], [76.8, 504.0], [76.9, 504.0], [77.0, 505.0], [77.1, 505.0], [77.2, 505.0], [77.3, 506.0], [77.4, 506.0], [77.5, 507.0], [77.6, 507.0], [77.7, 507.0], [77.8, 508.0], [77.9, 508.0], [78.0, 508.0], [78.1, 509.0], [78.2, 509.0], [78.3, 509.0], [78.4, 510.0], [78.5, 510.0], [78.6, 510.0], [78.7, 511.0], [78.8, 511.0], [78.9, 511.0], [79.0, 512.0], [79.1, 512.0], [79.2, 512.0], [79.3, 513.0], [79.4, 513.0], [79.5, 513.0], [79.6, 514.0], [79.7, 514.0], [79.8, 515.0], [79.9, 515.0], [80.0, 516.0], [80.1, 516.0], [80.2, 517.0], [80.3, 517.0], [80.4, 518.0], [80.5, 519.0], [80.6, 519.0], [80.7, 520.0], [80.8, 520.0], [80.9, 521.0], [81.0, 522.0], [81.1, 523.0], [81.2, 524.0], [81.3, 525.0], [81.4, 526.0], [81.5, 528.0], [81.6, 529.0], [81.7, 530.0], [81.8, 532.0], [81.9, 534.0], [82.0, 536.0], [82.1, 538.0], [82.2, 540.0], [82.3, 542.0], [82.4, 544.0], [82.5, 547.0], [82.6, 550.0], [82.7, 553.0], [82.8, 556.0], [82.9, 559.0], [83.0, 563.0], [83.1, 566.0], [83.2, 568.0], [83.3, 570.0], [83.4, 572.0], [83.5, 573.0], [83.6, 574.0], [83.7, 575.0], [83.8, 575.0], [83.9, 576.0], [84.0, 577.0], [84.1, 577.0], [84.2, 578.0], [84.3, 579.0], [84.4, 579.0], [84.5, 580.0], [84.6, 580.0], [84.7, 581.0], [84.8, 581.0], [84.9, 582.0], [85.0, 582.0], [85.1, 583.0], [85.2, 583.0], [85.3, 584.0], [85.4, 584.0], [85.5, 585.0], [85.6, 585.0], [85.7, 586.0], [85.8, 586.0], [85.9, 587.0], [86.0, 587.0], [86.1, 588.0], [86.2, 589.0], [86.3, 589.0], [86.4, 590.0], [86.5, 590.0], [86.6, 591.0], [86.7, 592.0], [86.8, 592.0], [86.9, 593.0], [87.0, 594.0], [87.1, 595.0], [87.2, 595.0], [87.3, 596.0], [87.4, 597.0], [87.5, 597.0], [87.6, 598.0], [87.7, 599.0], [87.8, 600.0], [87.9, 601.0], [88.0, 602.0], [88.1, 603.0], [88.2, 604.0], [88.3, 605.0], [88.4, 606.0], [88.5, 607.0], [88.6, 609.0], [88.7, 610.0], [88.8, 611.0], [88.9, 613.0], [89.0, 614.0], [89.1, 616.0], [89.2, 618.0], [89.3, 619.0], [89.4, 621.0], [89.5, 623.0], [89.6, 625.0], [89.7, 627.0], [89.8, 629.0], [89.9, 630.0], [90.0, 632.0], [90.1, 634.0], [90.2, 637.0], [90.3, 639.0], [90.4, 642.0], [90.5, 645.0], [90.6, 650.0], [90.7, 654.0], [90.8, 659.0], [90.9, 663.0], [91.0, 668.0], [91.1, 672.0], [91.2, 675.0], [91.3, 678.0], [91.4, 681.0], [91.5, 683.0], [91.6, 686.0], [91.7, 688.0], [91.8, 690.0], [91.9, 691.0], [92.0, 693.0], [92.1, 695.0], [92.2, 697.0], [92.3, 698.0], [92.4, 700.0], [92.5, 701.0], [92.6, 703.0], [92.7, 704.0], [92.8, 706.0], [92.9, 707.0], [93.0, 709.0], [93.1, 710.0], [93.2, 712.0], [93.3, 714.0], [93.4, 715.0], [93.5, 717.0], [93.6, 719.0], [93.7, 721.0], [93.8, 723.0], [93.9, 725.0], [94.0, 728.0], [94.1, 730.0], [94.2, 734.0], [94.3, 738.0], [94.4, 743.0], [94.5, 750.0], [94.6, 759.0], [94.7, 769.0], [94.8, 774.0], [94.9, 779.0], [95.0, 782.0], [95.1, 785.0], [95.2, 788.0], [95.3, 791.0], [95.4, 793.0], [95.5, 796.0], [95.6, 798.0], [95.7, 800.0], [95.8, 802.0], [95.9, 804.0], [96.0, 806.0], [96.1, 808.0], [96.2, 809.0], [96.3, 811.0], [96.4, 813.0], [96.5, 815.0], [96.6, 817.0], [96.7, 820.0], [96.8, 824.0], [96.9, 827.0], [97.0, 831.0], [97.1, 836.0], [97.2, 841.0], [97.3, 848.0], [97.4, 856.0], [97.5, 862.0], [97.6, 867.0], [97.7, 871.0], [97.8, 874.0], [97.9, 877.0], [98.0, 880.0], [98.1, 882.0], [98.2, 885.0], [98.3, 889.0], [98.4, 892.0], [98.5, 896.0], [98.6, 899.0], [98.7, 903.0], [98.8, 907.0], [98.9, 911.0], [99.0, 916.0], [99.1, 925.0], [99.2, 941.0], [99.3, 971.0], [99.4, 993.0], [99.5, 1013.0], [99.6, 1044.0], [99.7, 1112.0], [99.8, 1200.0], [99.9, 1450.0]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 31710.0, "series": [{"data": [[0.0, 20158.0], [600.0, 6470.0], [700.0, 4577.0], [200.0, 31710.0], [800.0, 4124.0], [900.0, 1158.0], [1000.0, 344.0], [1100.0, 165.0], [300.0, 19314.0], [1200.0, 65.0], [1300.0, 42.0], [1400.0, 66.0], [1500.0, 36.0], [100.0, 22892.0], [400.0, 11903.0], [1600.0, 14.0], [1700.0, 14.0], [1800.0, 41.0], [1900.0, 2.0], [500.0, 16899.0], [2000.0, 1.0]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 2000.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 108.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 106259.0, "series": [{"data": [[0.0, 106259.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 33628.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 108.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 13.739710278224903, "minX": 1.77290808E12, "maxY": 100.0, "series": [{"data": [[1.7729085E12, 50.0], [1.77290868E12, 48.50807453416152], [1.77290838E12, 25.252200042927594], [1.77290856E12, 50.0], [1.77290844E12, 49.88358535252318], [1.77290862E12, 50.0]], "isOverall": false, "label": "Nivel 2 - 50 Usuarios", "isController": false}, {"data": [[1.7729088E12, 100.0], [1.77290898E12, 95.94458229942103], [1.77290868E12, 50.74199441220724], [1.77290886E12, 100.0], [1.77290874E12, 99.71385194631631], [1.77290892E12, 100.0]], "isOverall": false, "label": "Nivel 3 - 100 Usuarios", "isController": false}, {"data": [[1.77290832E12, 25.0], [1.7729082E12, 25.0], [1.77290838E12, 24.25069637883009], [1.77290808E12, 13.739710278224903], [1.77290826E12, 25.0], [1.77290814E12, 24.969544061993144]], "isOverall": false, "label": "Nivel 1 - 25 Usuarios", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77290898E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 88.61052631578949, "minX": 1.0, "maxY": 544.1874999999999, "series": [{"data": [[2.0, 88.61052631578949], [3.0, 108.41666666666663], [4.0, 101.42328042328043], [5.0, 93.36016949152547], [6.0, 95.35357142857147], [7.0, 89.06508875739647], [8.0, 101.20058139534883], [9.0, 99.05940594059402], [10.0, 105.96560196560196], [11.0, 112.03170731707318], [12.0, 117.8554778554778], [13.0, 132.9863945578231], [14.0, 138.38073394495407], [15.0, 154.89473684210523], [16.0, 169.43811881188103], [17.0, 158.0403587443946], [18.0, 170.3904555314534], [19.0, 173.43776824034342], [20.0, 182.61353711790386], [21.0, 214.96933962264163], [22.0, 206.32891832229572], [23.0, 217.6286353467562], [24.0, 245.03398058252412], [25.0, 275.55248070064437], [26.0, 208.95614035087732], [27.0, 226.93577981651384], [28.0, 228.7567567567569], [29.0, 236.8407079646018], [30.0, 257.625], [31.0, 320.26595744680856], [32.0, 272.435185185185], [33.0, 261.9871244635192], [34.0, 279.7105263157895], [35.0, 283.5855855855857], [36.0, 281.1336206896553], [37.0, 293.45021645021615], [38.0, 302.36444444444453], [39.0, 311.1652173913044], [40.0, 320.42424242424204], [41.0, 374.0410256410257], [42.0, 351.04629629629625], [43.0, 342.3640350877191], [44.0, 353.6460176991151], [45.0, 363.72489082969406], [46.0, 361.2331838565019], [47.0, 382.50228310502297], [48.0, 412.8980582524272], [49.0, 441.5821596244133], [50.0, 362.0738922155696], [51.0, 272.90909090909105], [52.0, 279.6697247706421], [53.0, 301.5652173913042], [54.0, 287.455357142857], [55.0, 307.11711711711723], [56.0, 289.13559322033893], [57.0, 316.2678571428571], [58.0, 314.5765765765767], [59.0, 321.9565217391304], [60.0, 331.4464285714287], [61.0, 320.33944954128447], [62.0, 336.06837606837615], [63.0, 325.2719298245614], [64.0, 343.233644859813], [65.0, 431.0416666666665], [66.0, 389.559633027523], [67.0, 360.9009009009008], [68.0, 364.57894736842115], [69.0, 371.8879310344829], [70.0, 362.9051724137931], [71.0, 366.675925925926], [72.0, 388.57627118644075], [73.0, 397.2016806722689], [74.0, 390.74561403508784], [75.0, 396.1009174311928], [76.0, 391.83193277310914], [77.0, 409.84070796460185], [78.0, 410.08181818181805], [79.0, 410.12499999999994], [80.0, 424.09090909090895], [81.0, 470.3804347826088], [82.0, 480.858407079646], [83.0, 468.9047619047618], [84.0, 464.2149532710281], [85.0, 469.94827586206895], [86.0, 451.0973451327434], [87.0, 432.24369747899163], [88.0, 450.4608695652173], [89.0, 365.8113207547168], [90.0, 324.478527607362], [91.0, 331.4678362573102], [92.0, 341.2236842105263], [93.0, 361.21764705882333], [94.0, 431.9795918367345], [95.0, 544.1874999999999], [96.0, 514.3063063063063], [97.0, 504.248275862069], [98.0, 365.4823529411764], [99.0, 365.52727272727293], [100.0, 371.3073417877917], [1.0, 114.7906976744186]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}, {"data": [[67.60895746276522, 338.47531697561067]], "isOverall": false, "label": "GET /catalog/hotels-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 3365.05, "minX": 1.77290808E12, "maxY": 648525.35, "series": [{"data": [[1.7729088E12, 624895.35], [1.7729085E12, 218341.2], [1.7729082E12, 212000.48333333334], [1.77290886E12, 642578.4666666667], [1.77290856E12, 431050.5833333333], [1.77290826E12, 216647.71666666667], [1.77290892E12, 632653.8666666667], [1.77290862E12, 427506.0833333333], [1.77290832E12, 209834.4], [1.77290898E12, 47614.45], [1.77290868E12, 398204.88333333336], [1.77290838E12, 197625.56666666668], [1.77290808E12, 171278.11666666667], [1.77290874E12, 648525.35], [1.77290844E12, 216175.11666666667], [1.77290814E12, 218538.11666666667]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7729088E12, 44163.15], [1.7729085E12, 15430.8], [1.7729082E12, 14982.683333333332], [1.77290886E12, 45412.86666666667], [1.77290856E12, 30463.583333333332], [1.77290826E12, 15311.116666666667], [1.77290892E12, 44711.46666666667], [1.77290862E12, 30213.083333333332], [1.77290832E12, 14829.6], [1.77290898E12, 3365.05], [1.77290868E12, 28142.283333333333], [1.77290838E12, 13966.766666666666], [1.77290808E12, 12104.716666666667], [1.77290874E12, 45833.15], [1.77290844E12, 15277.716666666667], [1.77290814E12, 15444.716666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77290898E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 151.82570705909427, "minX": 1.77290808E12, "maxY": 544.5263253780281, "series": [{"data": [[1.7729088E12, 377.73725341904645], [1.7729085E12, 541.9411976911955], [1.7729082E12, 278.3680104031195], [1.77290886E12, 367.9996322628088], [1.77290856E12, 274.0117862037458], [1.77290826E12, 272.67260498091156], [1.77290892E12, 372.3994023904394], [1.77290862E12, 276.1628742514966], [1.77290832E12, 281.5101351351339], [1.77290898E12, 512.8511166253103], [1.77290868E12, 272.70972208485745], [1.77290838E12, 279.63810282981314], [1.77290808E12, 151.82570705909427], [1.77290874E12, 363.0379546972753], [1.77290844E12, 544.5263253780281], [1.77290814E12, 269.8102360785732]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77290898E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 151.80593239825254, "minX": 1.77290808E12, "maxY": 544.5152122426658, "series": [{"data": [[1.7729088E12, 377.73277872313463], [1.7729085E12, 541.9287518037506], [1.7729082E12, 278.35890767230313], [1.77290886E12, 367.993687178227], [1.77290856E12, 274.00100502512487], [1.77290826E12, 272.66460643519395], [1.77290892E12, 372.39149651394337], [1.77290862E12, 276.15624136342785], [1.77290832E12, 281.50187687687713], [1.77290898E12, 512.8428453267167], [1.77290868E12, 272.7023044209272], [1.77290838E12, 279.62973296133913], [1.77290808E12, 151.80593239825254], [1.77290874E12, 363.0315175806136], [1.77290844E12, 544.5152122426658], [1.77290814E12, 269.8017660839797]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77290898E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.3606212882594783, "minX": 1.77290808E12, "maxY": 0.7630303629710207, "series": [{"data": [[1.7729088E12, 0.5708073359803347], [1.7729085E12, 0.7555916305916323], [1.7729082E12, 0.3787850640906563], [1.77290886E12, 0.49154204461877987], [1.77290856E12, 0.3606212882594783], [1.77290826E12, 0.3764770041810578], [1.77290892E12, 0.494210657370519], [1.77290862E12, 0.3740211883924461], [1.77290832E12, 0.3796921921921921], [1.77290898E12, 0.5947063688999163], [1.77290868E12, 0.7630303629710207], [1.77290838E12, 0.7610601833399764], [1.77290808E12, 0.42860427684525265], [1.77290874E12, 0.4870346754114276], [1.77290844E12, 0.717799234833302], [1.77290814E12, 0.37159848621373226]], "isOverall": false, "label": "GET /catalog/hotels", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77290898E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 81.0, "minX": 1.77290808E12, "maxY": 2031.0, "series": [{"data": [[1.7729088E12, 2031.0], [1.7729085E12, 1125.0], [1.7729082E12, 975.0], [1.77290886E12, 1209.0], [1.77290856E12, 760.0], [1.77290826E12, 567.0], [1.77290892E12, 1496.0], [1.77290862E12, 824.0], [1.77290832E12, 935.0], [1.77290898E12, 1910.0], [1.77290868E12, 890.0], [1.77290838E12, 787.0], [1.77290808E12, 472.0], [1.77290874E12, 1308.0], [1.77290844E12, 982.0], [1.77290814E12, 814.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7729088E12, 81.0], [1.7729085E12, 93.0], [1.7729082E12, 126.0], [1.77290886E12, 81.0], [1.77290856E12, 82.0], [1.77290826E12, 176.0], [1.77290892E12, 81.0], [1.77290862E12, 82.0], [1.77290832E12, 132.0], [1.77290898E12, 82.0], [1.77290868E12, 82.0], [1.77290838E12, 83.0], [1.77290808E12, 82.0], [1.77290874E12, 81.0], [1.77290844E12, 356.0], [1.77290814E12, 100.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7729088E12, 876.0], [1.7729085E12, 600.0], [1.7729082E12, 312.0], [1.77290886E12, 698.0], [1.77290856E12, 433.0], [1.77290826E12, 304.0], [1.77290892E12, 730.0], [1.77290862E12, 473.0], [1.77290832E12, 307.0], [1.77290898E12, 1338.0], [1.77290868E12, 490.0], [1.77290838E12, 478.0], [1.77290808E12, 214.0], [1.77290874E12, 592.0], [1.77290844E12, 593.0], [1.77290814E12, 302.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7729088E12, 1090.0], [1.7729085E12, 890.0], [1.7729082E12, 652.9599999999991], [1.77290886E12, 873.8299999999999], [1.77290856E12, 575.539999999999], [1.77290826E12, 426.0], [1.77290892E12, 930.0], [1.77290862E12, 607.4400000000005], [1.77290832E12, 500.71000000000004], [1.77290898E12, 1856.0], [1.77290868E12, 779.8799999999992], [1.77290838E12, 613.0], [1.77290808E12, 313.0], [1.77290874E12, 766.0], [1.77290844E12, 805.0], [1.77290814E12, 486.5]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7729088E12, 180.0], [1.7729085E12, 518.0], [1.7729082E12, 285.0], [1.77290886E12, 309.0], [1.77290856E12, 296.0], [1.77290826E12, 286.0], [1.77290892E12, 306.0], [1.77290862E12, 284.0], [1.77290832E12, 289.0], [1.77290898E12, 113.0], [1.77290868E12, 239.0], [1.77290838E12, 291.0], [1.77290808E12, 123.0], [1.77290874E12, 390.0], [1.77290844E12, 516.0], [1.77290814E12, 284.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7729088E12, 900.0], [1.7729085E12, 683.0], [1.7729082E12, 377.8000000000002], [1.77290886E12, 756.1499999999996], [1.77290856E12, 475.0], [1.77290826E12, 348.89999999999964], [1.77290892E12, 824.0], [1.77290862E12, 495.0], [1.77290832E12, 365.0], [1.77290898E12, 1674.0], [1.77290868E12, 693.0], [1.77290838E12, 494.0], [1.77290808E12, 277.0], [1.77290874E12, 619.0], [1.77290844E12, 608.0], [1.77290814E12, 344.5]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77290898E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 84.0, "minX": 11.0, "maxY": 1007.0, "series": [{"data": [[11.0, 85.0], [12.0, 84.0], [20.0, 85.0], [21.0, 85.0], [23.0, 85.0], [27.0, 85.0], [28.0, 89.0], [29.0, 787.0], [31.0, 1007.0], [33.0, 584.0], [35.0, 88.0], [34.0, 88.5], [38.0, 87.0], [41.0, 276.5], [44.0, 88.0], [46.0, 89.0], [49.0, 404.0], [53.0, 88.0], [52.0, 534.0], [56.0, 87.0], [58.0, 381.5], [59.0, 122.5], [60.0, 294.5], [63.0, 229.5], [62.0, 592.5], [67.0, 85.0], [66.0, 295.0], [65.0, 430.0], [64.0, 405.0], [71.0, 337.0], [68.0, 367.5], [69.0, 363.0], [70.0, 373.5], [79.0, 185.0], [78.0, 296.0], [76.0, 87.0], [77.0, 691.0], [83.0, 188.0], [81.0, 448.5], [82.0, 287.5], [85.0, 292.0], [87.0, 289.0], [86.0, 301.0], [84.0, 301.0], [90.0, 301.0], [91.0, 300.0], [89.0, 296.0], [88.0, 472.0], [94.0, 288.0], [93.0, 298.0], [95.0, 294.0], [92.0, 291.0], [96.0, 286.0], [97.0, 282.0], [98.0, 274.0], [99.0, 282.0], [101.0, 111.0], [100.0, 216.5], [102.0, 223.5], [119.0, 298.0], [118.0, 87.0], [116.0, 883.5], [120.0, 456.5], [125.0, 639.0], [126.0, 97.5], [128.0, 199.5], [132.0, 143.0], [136.0, 361.5], [143.0, 101.5], [141.0, 87.0], [150.0, 180.5], [148.0, 576.0], [153.0, 409.0], [154.0, 319.0], [152.0, 456.0], [159.0, 318.0], [155.0, 322.0], [156.0, 89.5], [158.0, 915.5], [162.0, 178.5], [161.0, 282.0], [165.0, 360.0], [167.0, 408.0], [170.0, 145.5], [174.0, 371.0], [175.0, 324.0], [172.0, 315.0], [173.0, 296.0], [169.0, 581.0], [176.0, 288.5], [177.0, 294.0], [183.0, 226.0], [182.0, 285.5], [181.0, 289.0], [180.0, 278.0], [178.0, 120.0], [179.0, 213.0], [189.0, 296.0], [186.0, 219.0], [185.0, 190.0], [187.0, 318.0], [184.0, 299.0], [191.0, 267.0], [190.0, 301.0], [188.0, 276.0], [192.0, 311.0], [194.0, 387.5], [193.0, 279.5], [195.0, 314.0], [207.0, 543.0], [214.0, 98.0], [217.0, 382.0], [227.0, 158.0], [231.0, 407.0], [230.0, 365.5], [236.0, 528.0], [232.0, 227.5], [237.0, 329.0], [238.0, 393.0], [234.0, 296.5], [247.0, 350.0], [246.0, 393.5], [245.0, 359.0], [243.0, 266.0], [242.0, 237.0], [253.0, 261.5], [255.0, 341.0], [248.0, 388.0], [250.0, 212.0], [270.0, 322.0], [260.0, 279.5], [271.0, 269.0], [256.0, 425.0], [258.0, 318.5], [259.0, 102.0], [263.0, 248.0], [262.0, 334.0], [261.0, 302.0], [264.0, 295.0], [265.0, 227.0], [267.0, 295.0], [269.0, 228.0], [268.0, 278.5], [286.0, 353.5], [281.0, 321.0], [275.0, 300.5], [279.0, 305.0], [272.0, 220.0], [274.0, 186.5], [273.0, 330.0], [278.0, 215.0], [277.0, 285.0], [276.0, 347.0], [282.0, 288.5], [285.0, 328.0], [280.0, 337.0], [287.0, 319.0], [283.0, 332.0], [284.0, 195.0], [290.0, 351.0], [293.0, 345.0], [288.0, 301.0], [291.0, 340.5], [289.0, 419.0], [295.0, 331.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 295.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 84.0, "minX": 11.0, "maxY": 1007.0, "series": [{"data": [[11.0, 85.0], [12.0, 84.0], [20.0, 84.5], [21.0, 85.0], [23.0, 84.0], [27.0, 85.0], [28.0, 89.0], [29.0, 787.0], [31.0, 1007.0], [33.0, 584.0], [35.0, 88.0], [34.0, 88.5], [38.0, 87.0], [41.0, 276.5], [44.0, 88.0], [46.0, 89.0], [49.0, 404.0], [53.0, 88.0], [52.0, 534.0], [56.0, 87.0], [58.0, 381.5], [59.0, 122.5], [60.0, 294.5], [63.0, 229.5], [62.0, 592.5], [67.0, 85.0], [66.0, 295.0], [65.0, 430.0], [64.0, 405.0], [71.0, 337.0], [68.0, 367.5], [69.0, 363.0], [70.0, 373.5], [79.0, 185.0], [78.0, 296.0], [76.0, 87.0], [77.0, 691.0], [83.0, 188.0], [81.0, 448.5], [82.0, 287.5], [85.0, 292.0], [87.0, 289.0], [86.0, 301.0], [84.0, 301.0], [90.0, 301.0], [91.0, 300.0], [89.0, 296.0], [88.0, 472.0], [94.0, 288.0], [93.0, 298.0], [95.0, 294.0], [92.0, 291.0], [96.0, 286.0], [97.0, 282.0], [98.0, 274.0], [99.0, 282.0], [101.0, 111.0], [100.0, 216.5], [102.0, 223.5], [119.0, 298.0], [118.0, 87.0], [116.0, 883.5], [120.0, 456.5], [125.0, 639.0], [126.0, 97.5], [128.0, 199.5], [132.0, 143.0], [136.0, 361.5], [143.0, 101.5], [141.0, 87.0], [150.0, 180.5], [148.0, 576.0], [153.0, 409.0], [154.0, 319.0], [152.0, 456.0], [159.0, 318.0], [155.0, 322.0], [156.0, 89.5], [158.0, 915.5], [162.0, 178.5], [161.0, 282.0], [165.0, 360.0], [167.0, 408.0], [170.0, 145.5], [174.0, 371.0], [175.0, 324.0], [172.0, 315.0], [173.0, 296.0], [169.0, 581.0], [176.0, 288.5], [177.0, 294.0], [183.0, 226.0], [182.0, 285.0], [181.0, 289.0], [180.0, 278.0], [178.0, 120.0], [179.0, 213.0], [189.0, 296.0], [186.0, 219.0], [185.0, 190.0], [187.0, 318.0], [184.0, 299.0], [191.0, 267.0], [190.0, 301.0], [188.0, 276.0], [192.0, 311.0], [194.0, 387.5], [193.0, 279.5], [195.0, 314.0], [207.0, 543.0], [214.0, 98.0], [217.0, 382.0], [227.0, 158.0], [231.0, 407.0], [230.0, 365.5], [236.0, 528.0], [232.0, 227.5], [237.0, 329.0], [238.0, 393.0], [234.0, 296.5], [247.0, 350.0], [246.0, 393.5], [245.0, 359.0], [243.0, 266.0], [242.0, 237.0], [253.0, 261.5], [255.0, 341.0], [248.0, 388.0], [250.0, 212.0], [270.0, 322.0], [260.0, 279.5], [271.0, 269.0], [256.0, 425.0], [258.0, 318.5], [259.0, 102.0], [263.0, 248.0], [262.0, 334.0], [261.0, 302.0], [264.0, 295.0], [265.0, 227.0], [267.0, 295.0], [269.0, 228.0], [268.0, 278.5], [286.0, 353.5], [281.0, 321.0], [275.0, 300.5], [279.0, 305.0], [272.0, 220.0], [274.0, 186.5], [273.0, 330.0], [278.0, 215.0], [277.0, 285.0], [276.0, 347.0], [282.0, 288.5], [285.0, 328.0], [280.0, 337.0], [287.0, 319.0], [283.0, 332.0], [284.0, 195.0], [290.0, 351.0], [293.0, 345.0], [288.0, 301.0], [291.0, 340.5], [289.0, 419.0], [295.0, 331.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 295.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 18.483333333333334, "minX": 1.77290808E12, "maxY": 274.5833333333333, "series": [{"data": [[1.7729088E12, 264.45], [1.7729085E12, 92.4], [1.7729082E12, 89.71666666666667], [1.77290886E12, 271.93333333333334], [1.77290856E12, 182.41666666666666], [1.77290826E12, 91.68333333333334], [1.77290892E12, 267.73333333333335], [1.77290862E12, 180.91666666666666], [1.77290832E12, 88.8], [1.77290898E12, 18.483333333333334], [1.77290868E12, 169.21666666666667], [1.77290838E12, 83.98333333333333], [1.77290808E12, 72.88333333333334], [1.77290874E12, 274.5833333333333], [1.77290844E12, 91.55], [1.77290814E12, 92.5]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77290898E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 20.15, "minX": 1.77290808E12, "maxY": 274.45, "series": [{"data": [[1.7729088E12, 264.45], [1.7729085E12, 92.4], [1.7729082E12, 89.71666666666667], [1.77290886E12, 271.93333333333334], [1.77290856E12, 182.41666666666666], [1.77290826E12, 91.68333333333334], [1.77290892E12, 267.73333333333335], [1.77290862E12, 180.91666666666666], [1.77290832E12, 88.8], [1.77290898E12, 20.15], [1.77290868E12, 168.51666666666668], [1.77290838E12, 83.63333333333334], [1.77290808E12, 72.48333333333333], [1.77290874E12, 274.45], [1.77290844E12, 91.48333333333333], [1.77290814E12, 92.48333333333333]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77290898E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 20.15, "minX": 1.77290808E12, "maxY": 274.45, "series": [{"data": [[1.7729088E12, 264.45], [1.7729085E12, 92.4], [1.7729082E12, 89.71666666666667], [1.77290886E12, 271.93333333333334], [1.77290856E12, 182.41666666666666], [1.77290826E12, 91.68333333333334], [1.77290892E12, 267.73333333333335], [1.77290862E12, 180.91666666666666], [1.77290832E12, 88.8], [1.77290898E12, 20.15], [1.77290868E12, 168.51666666666668], [1.77290838E12, 83.63333333333334], [1.77290808E12, 72.48333333333333], [1.77290874E12, 274.45], [1.77290844E12, 91.48333333333333], [1.77290814E12, 92.48333333333333]], "isOverall": false, "label": "GET /catalog/hotels-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77290898E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 20.15, "minX": 1.77290808E12, "maxY": 274.45, "series": [{"data": [[1.7729088E12, 264.45], [1.7729085E12, 92.4], [1.7729082E12, 89.71666666666667], [1.77290886E12, 271.93333333333334], [1.77290856E12, 182.41666666666666], [1.77290826E12, 91.68333333333334], [1.77290892E12, 267.73333333333335], [1.77290862E12, 180.91666666666666], [1.77290832E12, 88.8], [1.77290898E12, 20.15], [1.77290868E12, 168.51666666666668], [1.77290838E12, 83.63333333333334], [1.77290808E12, 72.48333333333333], [1.77290874E12, 274.45], [1.77290844E12, 91.48333333333333], [1.77290814E12, 92.48333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77290898E12, "title": "Total Transactions Per Second"}},
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

