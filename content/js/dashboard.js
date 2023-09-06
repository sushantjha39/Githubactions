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
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 88.23529411764706, "KoPercent": 11.764705882352942};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8235294117647058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Creates/updates family history record"], "isController": false}, {"data": [1.0, 500, 1500, "Returns list of patients upcoming appointments"], "isController": false}, {"data": [1.0, 500, 1500, "Creates progress note for an appointment"], "isController": false}, {"data": [1.0, 500, 1500, "Get all Patient details"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates medication history record"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates risk factor record"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates prior dx record"], "isController": false}, {"data": [1.0, 500, 1500, "Returns list of patients upcoming appointments-0"], "isController": false}, {"data": [0.5, 500, 1500, "Health Facility Admin Login"], "isController": false}, {"data": [0.5, 500, 1500, "Calculates guidances for an appointment"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates test record"], "isController": false}, {"data": [0.0, 500, 1500, "Get Patient details"], "isController": false}, {"data": [0.0, 500, 1500, "Creates new appointment for patient for given date and time"], "isController": false}, {"data": [1.0, 500, 1500, "Pharmacist Login"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates tobacco cessation record"], "isController": false}, {"data": [1.0, 500, 1500, "Creates/updates allergy record"], "isController": false}, {"data": [1.0, 500, 1500, "Add/Updates diagnosis"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17, 2, 11.764705882352942, 315.17647058823536, 3, 707, 282.0, 570.1999999999998, 707.0, 707.0, 3.1651461552783466, 4.340621218115807, 2.230402567026624], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Creates/updates family history record", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 2.753113468634686, 2.872030673431734], "isController": false}, {"data": ["Returns list of patients upcoming appointments", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 9.33837890625, 1.7730712890625], "isController": false}, {"data": ["Creates progress note for an appointment", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.693479241877256, 2.3515060920577615], "isController": false}, {"data": ["Get all Patient details", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 15.4266357421875, 1.74560546875], "isController": false}, {"data": ["Creates/updates medication history record", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.693479241877256, 4.0543208483754505], "isController": false}, {"data": ["Creates/updates risk factor record", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 2.683790467625899, 5.845323741007194], "isController": false}, {"data": ["Creates/updates prior dx record", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 2.7229698905109485, 3.628250456204379], "isController": false}, {"data": ["Returns list of patients upcoming appointments-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 699.5442708333334, 0.0], "isController": false}, {"data": ["Health Facility Admin Login", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 2.437953058698727, 0.3812323196605375], "isController": false}, {"data": ["Calculates guidances for an appointment", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 1.3919659514925373, 1.207949510261194], "isController": false}, {"data": ["Creates/updates test record", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 2.7130681818181817, 4.016335227272727], "isController": false}, {"data": ["Get Patient details", 1, 1, 100.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 4.766255040322581, 1.8239667338709677], "isController": false}, {"data": ["Creates new appointment for patient for given date and time", 1, 1, 100.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 3.100251498287671, 2.250775898972603], "isController": false}, {"data": ["Pharmacist Login", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 4.581532579787234, 0.7064494680851063], "isController": false}, {"data": ["Creates/updates tobacco cessation record", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 2.645722517730497, 2.9089095744680855], "isController": false}, {"data": ["Creates/updates allergy record", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 2.732944139194139, 2.4467719780219777], "isController": false}, {"data": ["Add/Updates diagnosis", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 2.599629790940767, 2.381859756097561], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["409", 1, 50.0, 5.882352941176471], "isController": false}, {"data": ["The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, 50.0, 5.882352941176471], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17, 2, "409", 1, "The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Patient details", 1, 1, "The result was the wrong size: It was 1,513 bytes, but should have been equal to 1,764 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Creates new appointment for patient for given date and time", 1, 1, "409", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
